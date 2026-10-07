# Cliniq — Conceptual Data Model & Entity Specifications

This document defines the database schemas, field specifications, relationships, and privacy classifications for all entities in the Cliniq ecosystem.

---

## Entity Summary Matrix

| Entity | Purpose | Privacy Level | Primary Key | Key Relationships |
|---|---|---|---|---|
| **User** | Authentication & identity anchor | High (PII) | `id` | 1:1 with `PatientProfile` or Clinic User |
| **PatientProfile** | Patient preferences and insurance | High (PII) | `userId` | N:M with `Provider` (saved), N:M with `Clinic` (saved) |
| **Clinic** | Healthcare facility physical entity | Public/Business | `id` | 1:N with `Provider`, 1:N with `ClinicInsurance` |
| **Provider** | Licensed healthcare professional | Public/Professional | `id` | N:1 with `Clinic`, 1:N with `AppointmentRequest` |
| **InsurancePlan** | Dental/Health insurance plan catalog | Public | `id` | N:M with `Clinic` via `ClinicInsurance` |
| **ClinicInsurance** | Plan acceptance audit & status | Public | `clinicId` + `insurancePlanId` | Junction between `Clinic` and `InsurancePlan` |
| **Service** | Clinical procedure definitions | Public | `id` | N:M with `Provider` |
| **AppointmentRequest**| Appointment request lifecycle | High (Health/PII)| `id` | N:1 Patient, N:1 Clinic, N:1 Provider |
| **Review** | Tri-part post-visit feedback | Public (Moderated)| `id` | N:1 Patient, N:1 Provider, N:1 Clinic |

---

## Detailed Entity Specifications

### 1. `User`
- **Purpose**: System identity representation for patients, clinic managers, and platform administrators.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `name`: `VARCHAR(120)` — User full name
  - `email`: `VARCHAR(160)` — Unique email address
  - `phone`: `VARCHAR(20)` — Primary mobile / WhatsApp phone
  - `role`: `ENUM('PATIENT', 'CLINIC', 'ADMIN')`
  - `location`: `VARCHAR(120)` — General city/state of residence
  - `createdAt`: `TIMESTAMP WITH TIME ZONE`
  - `updatedAt`: `TIMESTAMP WITH TIME ZONE`
- **Privacy Level**: **High (PII)**. Requires column-level encryption at rest in production.

---

### 2. `PatientProfile`
- **Purpose**: Extends `User` with health plan preferences, saved items, and operational shortcuts.
- **Fields**:
  - `userId`: `UUID` (Foreign Key referencing `User.id`)
  - `insuranceProvider`: `VARCHAR(80)` — e.g. "SulAmérica", "Bradesco"
  - `insurancePlanId`: `VARCHAR(40)` — Foreign key referencing `InsurancePlan.id`
  - `insuranceCardNumber`: `VARCHAR(60)` — Optional card number (demonstrative in MVP)
  - `preferences`: `JSONB` — `{ preferredTimeSlot: string, preferredDistanceKm: number }`
  - `savedProviders`: `UUID[]` — Array of favorited Provider IDs
  - `savedClinics`: `UUID[]` — Array of favorited Clinic IDs
- **Privacy Level**: **High (Sensitive/PII)**. Never exposed to unauthorized third parties.

---

### 3. `Clinic`
- **Purpose**: Represents physical clinics and dental practice establishments.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `name`: `VARCHAR(160)` — Official trade name
  - `description`: `TEXT` — Establishment overview
  - `address`: `VARCHAR(255)` — Physical street, number, suite
  - `neighborhood`: `VARCHAR(80)` — Neighborhood (e.g. Pinheiros, Jardins)
  - `city`: `VARCHAR(80)` — City
  - `state`: `VARCHAR(2)` — 2-letter state code (e.g. SP)
  - `phone`: `VARCHAR(20)` — Verified reception landline
  - `whatsapp`: `VARCHAR(20)` — Verified reception WhatsApp
  - `website`: `VARCHAR(255)` — Optional website URL
  - `status`: `ENUM('ACTIVE', 'PENDING_VERIFICATION', 'REPORTED')`
  - `verificationStatus`: `ENUM('VERIFIED', 'PENDING', 'UNVERIFIED', 'REPORTED')`
  - `operatingHours`: `VARCHAR(160)` — Standard weekly schedule
  - `createdAt`: `TIMESTAMP WITH TIME ZONE`
  - `updatedAt`: `TIMESTAMP WITH TIME ZONE`
- **Privacy Level**: **Public Business Data**.

---

### 4. `Provider` (Professional)
- **Purpose**: Certified healthcare practitioners associated with clinics.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `clinicId`: `UUID` (Foreign Key referencing `Clinic.id`)
  - `name`: `VARCHAR(120)` — Practitioner name (e.g. "Dra. Mariana Alves")
  - `cro`: `VARCHAR(30)` — Regional dental council registration (e.g. "CRO-SP 118.492")
  - `specialty`: `VARCHAR(80)` — Primary specialty
  - `secondarySpecialties`: `TEXT[]` — Array of secondary areas of focus
  - `bio`: `TEXT` — Academic background and clinical approach
  - `rating`: `DECIMAL(2,1)` — Current aggregate rating (1.0 to 5.0)
  - `reviewCount`: `INTEGER` — Total verified reviews count
  - `status`: `ENUM('ACTIVE', 'PENDING')`
- **Privacy Level**: **Public Professional Record**.

---

### 5. `InsurancePlan` & `ClinicInsurance`
- **Purpose**: Catalogs health and dental plan operators and maps their verified acceptance per clinic.
- **Fields (`InsurancePlan`)**:
  - `id`: `VARCHAR(40)` (Primary Key, e.g. "sulamerica", "bradesco")
  - `providerName`: `VARCHAR(80)` — Operator name
  - `planName`: `VARCHAR(120)` — Commercial plan category
  - `status`: `ENUM('ACTIVE', 'INACTIVE')`
- **Fields (`ClinicInsurance`)**:
  - `clinicId`: `UUID` (Foreign Key)
  - `insurancePlanId`: `VARCHAR(40)` (Foreign Key)
  - `verificationStatus`: `ENUM('VERIFIED', 'PENDING', 'UNVERIFIED', 'REPORTED')`
  - `verifiedAt`: `DATE` — Timestamp of last direct reception audit
  - `verificationSource`: `VARCHAR(60)` — e.g. "DIRECT_RECEPTION_AUDIT"
  - `copayRule`: `TEXT` — Specific copayment or authorization requirements
- **Privacy Level**: **Public Verification Data**.

---

### 6. `AppointmentRequest`
- **Purpose**: Represents the full lifecycle of a patient appointment request.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `patientId`: `UUID` (Foreign Key referencing `User.id`)
  - `clinicId`: `UUID` (Foreign Key referencing `Clinic.id`)
  - `providerId`: `UUID` (Foreign Key referencing `Provider.id`)
  - `serviceId`: `VARCHAR(40)` — Procedure requested
  - `insurancePlanId`: `VARCHAR(40)` — Insurance plan specified by patient
  - `preferredDate`: `DATE` — Target consultation date
  - `preferredTime`: `TIME` — Target slot (e.g. "14:30")
  - `status`: `ENUM('REQUESTED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'RESCHEDULE_REQUESTED', 'CANCELLED', 'COMPLETED')`
  - `patientNotes`: `TEXT` — Brief reason for visit (max 300 chars, no clinical history)
  - `clinicMessage`: `TEXT` — Response notes from reception
  - `suggestedAlternativeSlot`: `JSONB` — `{ date: string, time: string }`
  - `createdAt`: `TIMESTAMP WITH TIME ZONE`
  - `updatedAt`: `TIMESTAMP WITH TIME ZONE`
- **Privacy Level**: **High (Sensitive Patient/Health Data)**.

---

### 7. `Review`
- **Purpose**: Post-consultation verified feedback segregated across 3 pillars.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `patientId`: `UUID` (Foreign Key)
  - `providerId`: `UUID` (Foreign Key)
  - `clinicId`: `UUID` (Foreign Key)
  - `professionalRating`: `INTEGER` (1-5) — Practitioner bedside manner and clarity
  - `clinicRating`: `INTEGER` (1-5) — Reception and facility cleanliness
  - `insuranceExperience`: `ENUM('positive', 'negative')`
  - `insuranceNegativeReason`: `ENUM('clinica_nao_atendia', 'procedimento_nao_coberto', 'informacao_incorreta', 'outro')`
  - `comment`: `TEXT` — Freeform text sanitized against vulgarity or sensitive clinical data
  - `moderationStatus`: `ENUM('PENDING', 'APPROVED', 'REJECTED')`
  - `createdAt`: `TIMESTAMP WITH TIME ZONE`
- **Privacy Level**: **Public Post-Moderation**. Author identity can be pseudonymized (e.g. "Juliana S.").
