# Cliniq — Healthcare & Dental Provider Discovery and Appointment Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.3-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Codester%20Commercial-green.svg)](./LICENSE.md)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](#)

> **Status do Produto**: Commercial Release Candidate (Exit-Ready)  
> **Categoria Codester**: Full Applications / React & TypeScript Source Code  
> **Vertical**: Saúde Suplementar / Clínicas e Consultórios Odontológicos  
> **Proposta de Valor**: Encontre prestadores de saúde que atendam às necessidades, plano de saúde, localização e preferências de horário do paciente.

---

## 1. Visão Geral do Produto

**Cliniq** é uma plataforma moderna e completa de **descoberta de profissionais de saúde, verificação de compatibilidade de planos de saúde e solicitação ágil de agendamentos**.

Projetada especificamente para resolver o maior atrito da saúde suplementar: listas desatualizadas de operadoras, incerteza sobre credenciamento, telefones mudados e perda de tempo na recepção de consultórios.

### O que você recebe neste pacote comercial:
1. **Frontend Completo e Polido (React 19 + TypeScript + Vite)**: Interface responsiva (mobile-first e desktop), tipografia editorial Plus Jakarta Sans, tokens centralizados e paleta mineral acolhedora.
2. **Motor de Descoberta em 3 Passos**: Wizard intuitivo com busca por necessidade clínica, plano de saúde conveniado e raio de localização.
3. **Módulo de Mobilidade Urbana Multi-Modal**:
   - Cálculo dinâmico de distâncias e tempos de **caminhada** e **carro**;
   - Indicador de **trânsito modelado** e **acessibilidade pedonal**;
   - Estação de **metrô/trem mais próxima** levantada por consultório;
   - **Deep link oficial para o Google Maps** para navegação direta;
   - Abstração completa entre **Modo Demonstração (custo zero)** e **Modo Produção (Google Maps API)**.
4. **Assistente de Busca com IA em Linguagem Natural**: Pipeline com Google Gemini estruturando a intenção do paciente, com guardrails rígidos de segurança médica (proibição de diagnósticos e prescrições).
5. **Gestão Transacional de Agendamentos**: Fluxo completo de solicitação, seleção de período, motivos e confirmação.
6. **Múltiplos Portais de Usuário**:
   - **Painel do Paciente**: Histórico de consultas, gestão de plano e favoritos;
   - **Portal da Recepção/Clínica**: Fila de solicitações recebidas, confirmação ou sugestão de horários alternativos;
   - **Painel de Governança e Auditoria**: Monitoramento do funil *Successful Match*, moderação de dados e concessão do selo *Cliniq Verified*.
7. **Privacidade e Conformidade LGPD**: Modal transparente de política de privacidade e ferramenta de purga/esquecimento de dados locais.
8. **Documentação Técnica e Comercial Exaustiva**: 10 manuais prontos para auditoria de compradores e investidores.

---

## 2. Mapa Completo de Documentação

| Documento | Conteúdo | Público-Alvo |
|---|---|---|
| 📖 [**INSTALLATION.md**](./INSTALLATION.md) | Passo a passo de instalação, comandos npm, requisitos e deploy (Vercel, Netlify, Nginx, Docker). | Desenvolvedores / DevOps |
| 🎨 [**CUSTOMIZATION.md**](./CUSTOMIZATION.md) | Guia prático de personalização: marca, cores, novos planos, novas cidades e conexão de banco de dados. | Desenvolvedores / Compradores |
| 🏗️ [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Especificação arquitetural de sistemas, camadas, fluxo de dados e diagramas. | Arquitetos de Software |
| 🗄️ [**DATA_MODEL.md**](./DATA_MODEL.md) | Esquema relacional canônico de banco de dados (PostgreSQL/Cloud SQL DDL) e matriz de privacidade. | Engenheiros de Dados / Backend |
| 🔌 [**INTEGRATIONS.md**](./INTEGRATIONS.md) | Guia de conexão com WhatsApp Business Cloud API, Google Maps, PEPs (Feegow/Clinicorp) e ANS/TISS. | Integradores |
| 🚶 [**MOBILITY_AUDIT.md**](./MOBILITY_AUDIT.md) | Relatório técnico de auditoria de mobilidade urbana, integridade de dados e proteção anti-stale. | Auditores Técnicos |
| ⚠️ [**KNOWN_LIMITATIONS.md**](./KNOWN_LIMITATIONS.md) | Transparência comercial: distinção estrita entre recursos funcionais, simulados e escopo do MVP. | Compradores / Due Diligence |
| 🗺️ [**ROADMAP.md**](./ROADMAP.md) | Roteiro estruturado em 6 fases para transformar este MVP em uma operação comercial escalável. | Product Managers / Founders |
| 💼 [**COMMERCIAL.md**](./COMMERCIAL.md) | Tese de mercado, monetização (SaaS B2B, Success Fee), funil *Successful Match* e estratégia de M&A. | Investidores / Empreendedores |
| ⚖️ [**LICENSE.md**](./LICENSE.md) | Termos de licença comercial do código-fonte (padrão de marketplaces como Codester). | Jurídico / Compradores |

---

## 3. Início Rápido (Quick Start)

### 1. Pré-Requisitos
- Node.js 18.18+ ou 20+
- npm, yarn, pnpm ou bun

### 2. Instalação e Execução em 3 Comandos
```bash
# 1. Instalar módulos
npm install

# 2. Configurar variáveis de ambiente (zero custos necessários)
cp .env.example .env

# 3. Iniciar servidor local
npm run dev
```

Abra seu navegador em `http://localhost:3000`.

### 3. Validação de Build
```bash
npm run lint    # Verificação rigorosa TypeScript (Zero erros)
npm run build   # Compilação de produção com tree-shaking
```

---

## 4. Estrutura do Código-Fonte

```text
cliniq/
├── INSTALLATION.md          # Guia de instalação e deploy
├── CUSTOMIZATION.md         # Guia de personalização de marca e dados
├── ARCHITECTURE.md          # Especificação técnica do sistema
├── DATA_MODEL.md            # Esquema relacional de banco de dados
├── INTEGRATIONS.md          # Protocolos de integração com parceiros
├── MOBILITY_AUDIT.md        # Auditoria técnica da camada de mobilidade
├── KNOWN_LIMITATIONS.md     # Transparência sobre dados demo e escopo
├── ROADMAP.md               # Roteiro de expansão comercial e técnica
├── COMMERCIAL.md            # Tese de negócios e modelo de monetização
├── LICENSE.md               # Contrato de licença comercial
├── .env.example             # Variáveis de ambiente comentadas
├── package.json             # Metadados e dependências do projeto
├── vite.config.ts           # Configuração do Vite e Tailwind v4
├── src/
│   ├── App.tsx              # Roteador central e estado de sessão
│   ├── components/          # Componentes visuais e fluxos da aplicação
│   │   ├── Header.tsx       # Navegação superior com alternador de perfis
│   │   ├── SearchWizard.tsx # Fluxo de busca guiado
│   │   ├── ResultsView.tsx  # Listagem com filtros e ordenação multi-modal
│   │   ├── ProfessionalResultCard.tsx # Card de prestador com mobilidade
│   │   ├── ProfileView.tsx  # Perfil do profissional e consultório
│   │   ├── BookingModal.tsx # Modal transacional de agendamento
│   │   ├── PatientDashboardView.tsx # Área do paciente
│   │   ├── ClinicPortalView.tsx     # Área da recepção da clínica
│   │   ├── AdminPortalView.tsx      # Governança e auditoria de rede
│   │   ├── CliniqAssistantModal.tsx # Assistente de busca com IA
│   │   ├── LGPDModal.tsx    # Conformidade e controle de dados
│   │   └── ui/              # Design tokens e componentes reutilizáveis
│   ├── data/
│   │   └── demoData/        # Catálogo ilustrativo delimitado e seguro
│   ├── services/            # Camada desacoplada de lógica de negócios
│   │   ├── providerService.ts    # Motor de busca e favoritos
│   │   ├── appointmentService.ts # Ciclo de vida dos agendamentos
│   │   ├── mobilityService.ts    # Camada unificada de mobilidade urbana
│   │   ├── distanceService.ts    # Wrapper legado para compatibilidade
│   │   ├── aiAssistantService.ts # Integração com Gemini AI
│   │   └── adminService.ts       # Auditoria do selo Cliniq Verified
│   └── types/               # Contratos e tipos estritos TypeScript
```

---

## 5. Garantia de Operação Local a Custo Zero

Este pacote foi cuidadosamente construído para que o comprador possa **testar 100% da experiência de usuário imediatamente após o download**, sem a necessidade de cadastrar cartões de crédito em serviços de mapas ou nuvem:

- **Mobilidade Offline**: O sistema utiliza um algoritmo heurístico calibrado para a malha urbana da capital paulista que calcula distâncias pedonais e automotivas, tempos médios, densidade de trânsito e estações de trem/metrô sem consumir cotas pagas.
- **Deep Links Oficiais**: Links de rotas direcionam diretamente para a URL pública do Google Maps, fornecendo navegação GPS precisa sem custos de API.
- **Pronto para Chaves de Produção**: Para desenvolvedores que desejam utilizar a API oficial do Google Maps em produção, basta preencher `VITE_GOOGLE_MAPS_API_KEY` no `.env`. O código já possui a camada adaptadora pronta.

---

## 6. Prontidão para Saída Comercial (Codester Exit-Ready)

| Requisito Comercial | Status | Evidência Técnica |
|---|---|---|
| **Zero Erros de Compilação** | ✅ Concluído | `tsc --noEmit` e `vite build` executam com 100% de sucesso. |
| **Segregação de Dados Demo** | ✅ Concluído | Todos os dados fictícios estão identificados com disclaimers explícitos. |
| **Zero Hardcoding de Segredos** | ✅ Concluído | Nenhuma credencial privada ou chave sensível no repositório. |
| **Arquitetura Desacoplada** | ✅ Concluído | UI desacoplada por camada de serviços em `src/services/`. |
| **Transferibilidade para Comprador** | ✅ Concluído | Documentação completa com guias de instalação, customização e evolução. |
| **Transparência Regulatória** | ✅ Concluído | Avisos claros de não-diagnóstico médico e conformidade LGPD. |
