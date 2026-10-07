# Cliniq — Roteiro de Evolução do Produto (Product Roadmap)

Este roteiro oferece uma visão estratégica e técnica para guiar o comprador nos passos seguintes para transformar este código-fonte comercial em uma operação em escala.

---

## Fase 1: Customização e Posicionamento Inicial (Semanas 1-2)
- [x] Arquitetura de interface modular e responsiva com Tailwind CSS v4;
- [x] Design tokens centralizados e estética clínica mineral (sem clichês hospitalares);
- [x] Motor de mobilidade urbana multi-modal (a pé, carro, metrô) com fallback heurístico;
- [x] Deep links oficiais para o Google Maps;
- [ ] Customização de marca, logotipo e paleta de cores para sua identidade própria (`CUSTOMIZATION.md`);
- [ ] Cadastro do catálogo regional de profissionais e clínicas da sua cidade de lançamento (`src/data/demoData/index.ts`).

---

## Fase 2: Backend Relacional e Autenticação em Nuvem (Semanas 3-4)
- [x] Modelo de dados relacional canônico e diagramas DDL documentados (`DATA_MODEL.md`);
- [x] Contratos e interfaces TypeScript estritas para todos os domínios (`src/types/`);
- [ ] Provisionamento de banco de dados PostgreSQL (Cloud SQL, Supabase, Neon ou AWS RDS);
- [ ] Criação de API REST ou rotas tRPC para substituir a camada de `LocalStorage` em `src/services/`;
- [ ] Integração de autenticação de usuários (Supabase Auth, Firebase Auth, Clerk ou JWT próprio) para pacientes e clínicas.

---

## Fase 3: Mobilidade em Tempo Real e Geolocalização Precisa (Semanas 5-6)
- [x] Abstração de provedor de mobilidade (`MobilityProvider` e `MobilityService`);
- [x] Cálculo local com calibração topológica de São Paulo (zero custo de API);
- [ ] Ativação da chave Google Maps Platform (`VITE_GOOGLE_MAPS_API_KEY`) para cálculo com trânsito em tempo real;
- [ ] Integração com geolocalização do navegador (`navigator.geolocation`) com fallback elegante caso o paciente não conceda permissão de GPS.

---

## Fase 4: Mensageria e Notificações Instantâneas (Semanas 7-8)
- [x] Especificação de templates HSM do WhatsApp e webhooks documentados (`INTEGRATIONS.md`);
- [ ] Conexão com Meta WhatsApp Business Cloud API (ou Z-API / Evolution API);
- [ ] Envio automático de confirmação para o paciente e alerta para a recepção da clínica a cada nova solicitação;
- [ ] Resposta interativa da recepção via botão no WhatsApp (Confirmar / Reagendar) atualizando o status do agendamento em tempo real.

---

## Fase 5: Integração com Prontuários (PEP) e Agendas Médicas (Semanas 9-10)
- [ ] Conexão com sistemas de gestão odontológica e médica (Clinicorp, Feegow, Dental Office);
- [ ] Sincronização bidirecional de horários disponíveis na agenda do profissional;
- [ ] Validação de elegibilidade cadastral com operadoras de planos de saúde (padrão TISS / ANS).

---

## Fase 6: Monetização e Pagamentos Recorrentes (Semanas 11-12)
- [ ] Integração com gateway de pagamentos (Stripe, Asaas, Pagar.me ou Pix automático);
- [ ] Cobrança de mensalidade SaaS para clínicas no Plano Pro (R$ 149 - R$ 299/mês);
- [ ] Painel financeiro com emissão automática de notas fiscais e controle de assinaturas.
