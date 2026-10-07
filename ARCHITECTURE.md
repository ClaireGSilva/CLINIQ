# Cliniq — System Architecture & Technical Specifications

This document details the architectural blueprints of **Cliniq**, designed to enable seamless transition from **Functional MVP** to **Transferable Commercial Asset**.

---

## 1. High-Level System Architecture Diagram

```text
[ PATIENT / CLINIC / ADMIN CLIENTS ]
                 │
                 ▼
┌───────────────────────────────────────────────────────────┐
│               CLINIQ WEB CLIENT (REACT 19 / TS)           │
│                                                           │
│  ┌─────────────────┐ ┌────────────────┐ ┌──────────────┐  │
│  │ UI Primitives   │ │ Design Tokens  │ │ State / Flow │  │
│  │ (Buttons/Cards) │ │ (#FAF9F5/Teal) │ │ Navigation   │  │
│  └────────┬────────┘ └───────┬────────┘ └───────┬──────┘  │
└───────────┼──────────────────┼──────────────────┼─────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌───────────────────────────────────────────────────────────┐
│              SERVICE & BUSINESS LOGIC LAYER               │
│                                                           │
│  ┌───────────────────────┐   ┌─────────────────────────┐  │
│  │ AppointmentService    │   │ ProviderService         │  │
│  │ (Lifecycle & Status)  │   │ (Search, Filter, Saved) │  │
│  └───────────────────────┘   └─────────────────────────┘  │
│  ┌───────────────────────┐   ┌─────────────────────────┐  │
│  │ AIAssistantService    │   │ AdminService            │  │
│  │ (Intent Extraction)   │   │ (Verified Audit & Funnel)│ │
│  └───────────────────────┘   └─────────────────────────┘  │
└───────────────────────────┬───────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌───────────────────────────┐ ┌─────────────────────────────┐
│ PERSISTENCE ABSTRACTION   │ │ THIRD-PARTY INTEGRATIONS    │
│                           │ │                             │
│ • LocalStorage (MVP Fall) │ │ • Direct WhatsApp Gateway   │
│ • PostgreSQL / CloudSQL   │ │ • Google Maps Platform (P7) │
│   (Target Schema in       │ │ • Gemini AI via Google GenAI│
│    DATA_MODEL.md)         │ │ • Telephony / SMS Providers │
└───────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Architectural Layers

### A. Presentation Layer (`src/components/`)
- **React 19 + TypeScript + Vite**: Single-page application with modular, functional components.
- **Design System (`src/components/ui/`)**: Reusable UI components (`Button`, `Card`, `StatusBadge`, `EmptyState`, `LoadingSkeleton`, `Rating`, `Badge`) driven by centralized design tokens in `src/components/ui/tokens.ts`.
- **Zero-Pill Metadata Discipline**: Metadata (ratings, kilometers, specialties, timestamps) is rendered cleanly using typography and subtle separators (`·`), avoiding heavy pill containers.
- **Fluid Compositor Animations**: Uses hardware-accelerated transforms (`translateY`) and `opacity` with cubic-bezier settling curves (`cubic-bezier(0.16, 1, 0.3, 1)`) and `@media (prefers-reduced-motion)` compliance.

### B. Service Layer (`src/services/`)
Decouples UI views from data storage, ensuring backend endpoints can be plugged in without refactoring UI code:
- **`AppointmentService`**: Controls canonical appointment transitions:
  `REQUESTED` $\rightarrow$ `PENDING_CONFIRMATION` $\rightarrow$ `CONFIRMED` $\rightarrow$ `RESCHEDULE_REQUESTED` $\rightarrow$ `CANCELLED` $\rightarrow$ `COMPLETED`.
- **`ProviderService`**: Manages querying, multi-criteria filtering, provider profiles, and favorites (both Saved Providers and Saved Clinics).
- **`MobilityService` / `DistanceService`**: Calculates dynamic walking, driving, and transit travel distances and durations between the patient's searched location and clinic coordinates using Haversine with urban street topology adjustments, metro/CPTM proximity detection, and Google Maps integration (see `MOBILITY_AUDIT.md`).
- **`AIAssistantService`**: Natural language intent parser with strict safety constraints: converts patient language to structured search parameters while explicitly prohibiting diagnostic or prescriptive statements.
- **`AdminService`**: Monitors network health, the *Successful Match* conversion funnel, and manages reported data discrepancies.

### C. Data & Model Layer (`src/types/` and `src/data/demoData/`)
- Canonical domain entities (`User`, `PatientProfile`, `Clinic`, `Provider`, `InsurancePlan`, `ClinicInsurance`, `Service`, `AppointmentRequest`, `Review`).
- `demoData/`: Strictly segregated mock data layer with explicit disclaimers preventing any confusion with production databases.

---

## 3. Core Product Flows

### 1. Patient Discovery Flow
$$\text{Need} \longrightarrow \text{Dental Plan} \longrightarrow \text{Location} \longrightarrow \text{Results} \longrightarrow \text{Profile} \longrightarrow \text{Slot} \longrightarrow \text{Request}$$

1. Patient inputs need (via quick buttons or free text interpreted by `AIAssistantService`).
2. Patient selects health plan and simulated location (São Paulo neighborhoods).
3. Search engine filters verified providers and returns distance, audit status (*Cliniq Verified*), and next slot.
4. Patient requests slot; status enters `Aguardando confirmação` (`PENDING_CONFIRMATION`).

### 2. Clinic Management Flow
1. Clinic receives notification of incoming patient request with need, plan, and preferred time.
2. Clinic actions:
   - **Confirm** $\rightarrow$ Status changes to `CONFIRMED`.
   - **Suggest New Time** $\rightarrow$ Status changes to `RESCHEDULE_REQUESTED`.
   - **Decline** $\rightarrow$ Status changes to `CANCELLED`.
   - **Mark as Completed** $\rightarrow$ Status changes to `COMPLETED`.

### 3. Governance & Quality Audit Flow (*Cliniq Verified*)
- Verifications monitor:
  - Plan acceptance (direct audit with clinic reception)
  - Landline telephone verification
  - WhatsApp responsiveness
  - Profile recency timestamp
- Users can flag outdated information via "Reportar dado desatualizado", routing to `AdminService` for review and resolution.

---

## 4. Security & Privacy Architecture
- **Data Minimization (LGPD Art. 6º, III)**: Collects only operational fields required for the appointment request (name, phone/WhatsApp, plan ID).
- **No Client Secrets**: No third-party API private keys are bundled or exposed on client-side assets.
- **Strict Role Boundaries**: Three planned user roles (`PATIENT`, `CLINIC`, `ADMIN`) isolated in type definitions and service methods.

---

## 5. Commercial Architecture Documentation Map
- `INSTALLATION.md`: Environment setup, local running, build and multi-platform deployment.
- `CUSTOMIZATION.md`: White-label branding, catalog expansion, and database connection.
- `DATA_MODEL.md`: Conceptual PostgreSQL schema, relationships, and data dictionary.
- `INTEGRATIONS.md`: WhatsApp Business Cloud API, Google Maps, EHR/PEP, and ANS standards.
- `MOBILITY_AUDIT.md`: Urban mobility data integrity, heuristics, and provider abstraction.
- `KNOWN_LIMITATIONS.md`: Scope boundaries, simulated features, and production readiness.
- `ROADMAP.md`: Six-phase strategic roadmap for commercial scaling.
- `COMMERCIAL.md`: Value proposition, business model, monetization streams, and M&A thesis.
- `LICENSE.md`: Commercial source-code license terms for marketplace buyers.
