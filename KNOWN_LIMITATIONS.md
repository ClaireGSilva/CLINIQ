# Cliniq — Limitações Conhecidas e Escopo do Produto

Para assegurar total transparência com o comprador no Codester e integridade comercial, este documento detalha com rigor o que está implementado, o que é demonstrativo/simulado e os limites do escopo atual.

---

## 1. O que está Implementado e Funcional (Ready Out-of-the-Box)

- **Fluxo Completo de Descoberta**: Wizard de busca em 3 passos com filtros por necessidade/especialidade, plano de saúde e localização.
- **Resultados com Mobilidade Multi-Modal**: Cards de profissionais com cálculo dinâmico de distâncias e tempos de caminhada, carro, acessibilidade pedonal, trânsito estimado e metrô mais próximo.
- **Deep Links Reais do Google Maps**: Navegação direta de trajeto no Google Maps oficial a partir da origem do paciente até a clínica.
- **Mecanismo de Agendamento Demonstrativo**: Modal de agendamento com seleção de data, período, sintomas e dados de contato.
- **Persistência de Sessão Local (LocalStorage)**: Solicitações de agendamento criadas, favoritos e avaliações enviadas são preservadas no navegador.
- **Painel do Paciente**: Visualização de agendamentos solicitados com status canônicos, cancelamento, favoritos e dados do plano.
- **Portal da Clínica**: Painel para recepção visualizar solicitações recebidas, aprovar consulta ou sugerir horário alternativo.
- **Painel de Governança e Auditoria**: Monitoramento do funil *Successful Match*, aprovação/rejeição do selo *Cliniq Verified* e moderação de inconsistências reportadas.
- **Assistente IA de Linguagem Natural**: Pipeline com Google Gemini que extrai intenção do paciente respeitando guardrails rígidos de segurança.
- **Conformidade LGPD**: Modal de privacidade, política transparente e botão de purga/exclusão de dados locais.
- **Design System Responsivo**: UI moderna construída com Tailwind CSS v4, suporte móvel completo e tipografia Plus Jakarta Sans.

---

## 2. O que é Demonstrativo / Simulado (Mock Scope)

| Recurso | Estado no Pacote | Como Funciona no MVP | Como Migrar para Produção |
|---|---|---|---|
| **Base de Profissionais e Clínicas** | Fictícia / Ilustrativa | Dados em `src/data/demoData/index.ts` criados para demonstrar São Paulo. | Conectar ao banco PostgreSQL usando `DATA_MODEL.md` e `providerService.ts`. |
| **Credenciamento de Planos (ANS)** | Simulado / Auditado | Badges de verificação e datas de auditoria são simuladas para demonstrar o selo. | Integrar com sistema de validação de elegibilidade TISS das operadoras. |
| **Cálculo de Distância** | Heurístico Local | Haversine calibrado com topologia de São Paulo (zero custo de API externa). | Adicionar `VITE_GOOGLE_MAPS_API_KEY` para ativar a Google Distance Matrix API. |
| **Notificações via WhatsApp** | Simulação na Interface | Avisos em tela de confirmação e disparo de mensagens simuladas. | Configurar Meta WhatsApp Business Cloud API conforme o guia `INTEGRATIONS.md`. |
| **Autenticação de Usuários** | Simulada por Sessão | Alternância rápida de perfil (Paciente / Clínica / Admin) na interface para testes. | Conectar Firebase Auth, Supabase Auth, Clerk ou NextAuth. |
| **Armazenamento de Dados** | LocalStorage | Dados persistem no navegador da máquina que está executando o teste. | Conectar a banco de dados relacional em nuvem (Cloud SQL, Supabase, Neon). |

---

## 3. Limitações Regulatórias e de Saúde

1. **Não é Dispositivo Médico nem Sistema de Diagnóstico**:
   A Cliniq é estritamente uma plataforma de tecnologia para descoberta, busca e solicitação de agendamento. O sistema **não** fornece diagnósticos médicos, prescrições de remédios ou aconselhamento clínico. Guardrails explícitos foram programados no `aiAssistantService.ts` para recusar tentativas de diagnóstico.

2. **Não é Prontuário Eletrônico do Paciente (PEP)**:
   A plataforma não armazena histórico clínico, anamnese, exames de imagem ou prontuário médico. Toda a integração com prontuários deve ocorrer via API externa dos sistemas PEP credenciados (como Feegow ou Clinicorp), conforme detalhado em `INTEGRATIONS.md`.

3. **Conformidade LGPD / HIPAA em Produção**:
   Embora o código implemente os princípios de minimização de dados, termos de consentimento e ferramentas de esquecimento do titular, a adequação jurídica final em ambiente de produção dependerá da infraestrutura de hospedagem e dos processos operacionais do comprador.
