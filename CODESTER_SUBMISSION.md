# Cliniq — Ficha de Submissão e Publicação Comercial (Codester)

Este documento reúne todas as informações prontas para o formulário de cadastro, precificação, tags, descrição de venda e checklist de entrega no **Codester**.

---

## 1. Informações Básicas do Item (Listing Details)

| Campo | Valor Recomendado |
|---|---|
| **Item Title** | Cliniq — Healthcare & Dental Provider Discovery and Appointment Platform |
| **Category** | Complete Applications / React / JavaScript / Healthcare Scripts |
| **Price Suggestion (Regular License)** | $39 – $59 (Uso em 1 projeto final / cliente) |
| **Price Suggestion (Extended License)** | $149 – $199 (Uso em múltiplos clientes / SaaS / Revenda) |
| **Frameworks / Libraries** | React 19, TypeScript 5.7, Tailwind CSS 4, Vite 6, Lucide React |
| **Browser Compatibility** | Chrome, Edge, Safari, Firefox, Opera (Evergreen Web) |
| **Mobile Responsive** | Sim (Design Mobile-First com Breakpoints Tailwind) |
| **Software Version** | 1.0.0 (Release Candidate Exit-Ready) |
| **Files Included** | TypeScript Source Code, Assets, Markdown Documentation, Configs |

---

## 2. Tags para Busca e Indexação (Keywords)

```text
healthcare, doctor discovery, dentist finder, medical directory, appointment booking, health insurance filter, dental clinic, odontologia, plano de saude, react typescript, tailwind css, mobility service, google maps, vite, medical appointment, clinic listing, brazil healthcare, clean architecture, zero paid api demo
```

---

## 3. Descrição Comercial Formatada (Sales Page Copy)

```markdown
### Transform your healthcare discovery vision into reality with Cliniq!

**Cliniq** is an ultra-clean, production-ready frontend source code package for healthcare and dental provider discovery, insurance-plan matching, and appointment requests. Built with modern React 19, strict TypeScript, and Tailwind CSS, it offers a polished user experience with zero external paid API dependencies required for local demonstration.

Whether you're launching a regional healthcare directory, a specialized dental clinic marketplace, or a private clinic group portal, Cliniq gives you the foundational architecture, modular data layer, and commercial documentation you need to hit the ground running.

---

### 🌟 Key Highlights

- **Insurance-First Matching**: Filter providers by exact dental/health insurance plans (e.g., Amil Dental, Bradesco Dental, OdontoPrev, MetLife, SulAmérica, Porto Seguro).
- **Multi-Modal Mobility Engine**: Native `MobilityService` calculating walking times, driving traffic delays, and nearest metro/CPTM transit stations with Google Maps deep-links.
- **Provider & Clinic Saved List**: Localized bookmarking and comparison system with persistent storage.
- **Guided Appointment Funnel**: Pre-filled modal capturing operational contact info, chosen plan, and preferred dates with simulated WhatsApp/SMS dispatch.
- **Strict Architecture**: TypeScript strictly typed, functional components, zero-lint warnings, and 100% Vite build clearance.
- **Zero-Cost Out of the Box**: Operates immediately in Demo Mode using realistic simulated data. Optional Google Maps API integration ready for production.

---

### 📦 What is Included in the Download?

1. **Complete Clean Source Code**: 100% unminified React 19 + TypeScript codebase.
2. **Modular Demo Data**: 16+ accredited dental clinics & specialists across São Paulo with rich metadata (ratings, addresses, accepted plans, metro proximity).
3. **Multi-File Architecture Documentation**:
   - `README.md`: Master project guide & architecture overview.
   - `INSTALLATION.md`: Step-by-step setup for npm/yarn/pnpm/bun and one-click Vercel/Netlify deploy.
   - `CUSTOMIZATION.md`: Visual re-branding, custom specialties, plans, and backend migration guides.
   - `ARCHITECTURE.md`: Data flows, services, and state breakdown.
   - `INTEGRATIONS.md`: Google Maps, Supabase, Firebase, Node.js, and WhatsApp API integration guides.
   - `MOBILITY_AUDIT.md`: Complete audit of distance, duration, and transit calculations.
   - `SECURITY_LGPD.md`: Privacy principles and local storage data minimization.
   - `KNOWN_LIMITATIONS.md`: Honest scope specification distinguishing demo MVP from enterprise backends.
   - `ROADMAP.md`: Strategic evolution phases for scaling into a full SaaS platform.
   - `LICENSE.md`: Commercial licensing terms for buyers.

---

### 🛠️ Tech Stack & Requirements

- **Runtime**: Node.js 18.x, 20.x, or 22.x
- **Core**: React 19.0.0, TypeScript 5.7.2, Vite 6.2.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Browser**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
```

---

## 4. Diferenciais Competitivos no Marketplace (Why Buy Cliniq?)

1. **Sem "API Lock-in"**: Não exige chave de API paga do Google Maps para abrir o projeto. O cliente pode demonstrar e testar imediatamente após rodar `npm run dev`.
2. **Honestidade Técnica**: Documentação clara e transparente sobre o que é cálculo de distância local, o que é dados de demonstração e como plugar backend real.
3. **Código Limpo**: Sem códigos de depuração, sem `console.log` dispersos, sem `TODO` abandonados, sem referências a `localhost` fixas.
4. **Pronto para Re-branding**: Tokens de cores e tipografia isolados em `src/components/ui/tokens.ts` e classes Tailwind utilitárias.
5. **Privacidade (LGPD-Ready)**: Formulário de agendamento em conformidade com minimização de dados e aviso claro aos pacientes.

---

## 5. Instruções para Empacotamento do Arquivo .ZIP de Entrega

Para gerar o arquivo `.zip` final para upload no Codester:

```bash
# 1. Certifique-se de limpar pastas temporárias de build e dependências pesadas
rm -rf node_modules dist .cache

# 2. Compactar o pacote raiz (mantendo documentação, src, configs e .env.example)
zip -r cliniq-source-code-v1.0.0.zip . -x "node_modules/*" "dist/*" ".git/*" ".DS_Store"
```

O comprador receberá um arquivo leve (~1MB compactado) que executa com apenas:
```bash
npm install
npm run dev
```
