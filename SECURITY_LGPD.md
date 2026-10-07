# Cliniq — Política de Segurança da Informação e Conformidade LGPD

Este documento formaliza as diretrizes de governança, proteção de dados e conformidade com a **Lei Geral de Proteção de Dados Pessoais do Brasil (Lei nº 13.709/2018 - LGPD)** implementadas na arquitetura da **Cliniq**.

---

## 1. Princípios Fundamentais Adotados

A arquitetura da Cliniq foi projetada sob o princípio de **Privacy by Design e Privacy by Default**:

1. **Minimização de Dados (Art. 6º, III)**: A plataforma coleta estritamente os campos indispensáveis para conectar o paciente à clínica (nome, telefone para contato e plano odontológico). É expressamente vedado o armazenamento de histórico médico detalhado, prontuários, exames radiológicos ou diagnósticos clínicos durante a jornada de descoberta.
2. **Finalidade e Necessidade (Art. 6º, I e II)**: Os dados do paciente são utilizados exclusivamente para operacionalizar o pedido de consulta e notificar o titular sobre o status do agendamento.
3. **Transparência e Livre Acesso (Art. 6º, IV e VI)**: O usuário tem visibilidade clara de onde seus dados estão armazenados e dispõe de ferramentas nativas na interface para consultar ou apagar seus registros com 1 clique.

---

## 2. Matriz de Classificação de Dados

| Categoria | Campos | Enquadramento Legal | Medida de Segurança |
|---|---|---|---|
| **Dados Públicos / Negociais** | Nome fantasia da clínica, endereço comercial, telefone de recepção, CRO, convênios aceitos. | Dado público profissional | Armazenamento aberto com versionamento de auditoria. |
| **Dados Pessoais (PII)** | Nome do paciente, número de telefone / WhatsApp, bairro/cidade de residência. | Art. 7º, V (Execução de procedimentos preliminares a contrato a pedido do titular) | Criptografia em trânsito (TLS 1.3) e em repouso (AES-256). |
| **Dados Relacionados a Atendimento** | Categoria de necessidade (ex.: Limpeza, Avaliação), operadora do plano, data e horário de preferência. | Art. 11, II, "f" (Tutela da saúde por serviços de saúde) | Acesso estrito por controle de papéis (RBAC); sem histórico de patologias prévias. |

---

## 3. Direitos do Titular (Artigo 18 da LGPD)

A Cliniq garante o exercício integral dos direitos estabelecidos no Art. 18 da legislação:

- **Confirmação de Existência e Acesso aos Dados**: Visualizável na "Minha Conta" / Painel do Paciente.
- **Correção de Dados Incompletos ou Inexatos**: Edição imediata das preferências de plano e telefone de contato.
- **Eliminação dos Dados Pessoais**:
  - Disponível nativamente no modal de Privacidade & LGPD (`LGPDModal.tsx`).
  - Limpeza imediata de identificadores, solicitações recentes e registros locais.
- **Portabilidade de Dados**: Exportação estruturada de agendamentos em formato padrão (JSON).

---

## 4. Diretrizes Clínicas e Vedação de Diagnóstico

Como premissa ética e regulatória:
- A Cliniq **não** emite diagnósticos médicos ou odontológicos;
- A Cliniq **não** prescreve medicamentos ou terapêuticas;
- Em caso de sintomas graves ou dores agudas relatadas no assistente inteligente, a plataforma exibe imediatamente o aviso obrigatório de urgência, instruindo o usuário a buscar atendimento presencial de emergência em consultório ou pronto-atendimento habilitado.

---

## 5. Medidas Técnicas de Segurança em Produção

1. **Protocolo HTTPS Estrito**: Toda comunicação cliente-servidor utiliza TLS 1.3 com HSTS ativo.
2. **Segregação de Ambientes**: Separação completa entre credenciais de homologação e produção. Nenhuma chave privada é mantida no código-fonte do cliente.
3. **Controle de Acesso Baseado em Papéis (RBAC)**:
   - `PATIENT`: Acessa unicamente suas próprias solicitações e dados de perfil;
   - `CLINIC`: Acessa unicamente as solicitações direcionadas à sua unidade específica;
   - `ADMIN`: Acessa métricas agregadas e fila de auditoria de credenciamentos (*Cliniq Verified*).
4. **Logs de Auditoria de Acesso**: Registro imutável de quem visualizou ou alterou o status de uma solicitação de atendimento.
