# Cliniq — Guia de Integrações Externas e APIs Técnicas

Este documento detalha o mapa de conectores, protocolos e contratos de integração desenhados para a evolução da **Cliniq** em ambiente de produção com parceiros estratégicos.

---

## 1. Visão Geral das Integrações

```text
                               ┌────────────────────────────────────────┐
                               │       CLINIQ SERVICE LAYER (NODE/TS)   │
                               └──────────────────┬─────────────────────┘
                                                  │
                 ┌────────────────────────────────┼─────────────────────────────────┐
                 │                                │                                 │
                 ▼                                ▼                                 ▼
      ┌─────────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
      │  WHATSAPP BUSINESS  │          │     GOOGLE MAPS      │          │     SISTEMAS PEP     │
      │      CLOUD API      │          │       PLATFORM       │          │   (CLINICORP/FEEGOW) │
      │  (Notificações/HSM) │          │ (Geocoding/Distance) │          │ (Sincronia de Agenda)│
      └─────────────────────┘          └──────────────────────┘          └──────────────────────┘
                 │                                                                  │
                 ▼                                                                  ▼
      ┌─────────────────────┐                                            ┌──────────────────────┐
      │  TELEFONIA / VOZ IA │                                            │   ANS / PADRÃO TISS  │
      │  (Auditoria Ativa)  │                                            │ (Validação de Cartão)│
      └─────────────────────┘                                            └──────────────────────┘
```

---

## 2. Meta WhatsApp Business Cloud API

A mensageria via WhatsApp é o canal prioritário de comunicação entre a Cliniq, a recepção da clínica e o paciente.

### A. Fluxo de Webhook
1. O backend da Cliniq expõe um endpoint HTTPS `/api/webhooks/whatsapp` validado com `hub.verify_token`.
2. Quando a clínica responde a uma notificação de agendamento (ex.: enviando `1` para Confirmar ou `2` para Sugerir novo horário), o webhook aciona a transição de estado no `AppointmentService`.

### B. Templates de Mensagens Pré-Aprovadas (HSM - Highly Structured Messages)

#### Template 1: Notificação de Nova Solicitação para a Recepção da Clínica
- **Nome do Template**: `cliniq_nova_solicitacao_recepcao`
- **Categoria**: `UTILITY`
- **Idioma**: `pt_BR`
- **Corpo da Mensagem**:
  ```text
  Olá, {{1}}! Uma nova solicitação de agendamento via Cliniq chegou:
  👤 Paciente: {{2}}
  📋 Plano: {{3}}
  🦷 Procedimento: {{4}}
  🗓️ Horário pretendido: {{5}} às {{6}}

  Responda:
  [1] Confirmar horário
  [2] Sugerir horário alternativo
  [3] Não temos vaga no plano
  ```

#### Template 2: Confirmação de Agendamento para o Paciente
- **Nome do Template**: `cliniq_agendamento_confirmado_paciente`
- **Categoria**: `UTILITY`
- **Idioma**: `pt_BR`
- **Corpo da Mensagem**:
  ```text
  Olá, {{1}}! Sua consulta com {{2}} em {{3}} foi confirmada com sucesso!
  🗓️ Data: {{4}}
  ⏰ Horário: {{5}}
  📍 Endereço: {{6}}

  Lembre-se de levar sua carteirinha do plano {{7}} e documento oficial com foto.
  Dúvidas ou cancelamento? Acesse: {{8}}
  ```

---

## 3. Google Maps Platform

Utilizado para cálculo geoespacial de proximidade e precisão de endereçamento em grandes centros urbanos.

- **Places API (Autocomplete & Details)**:
  - Componente de busca por CEP ou bairro em cidades brasileiras;
  - Restrição de país (`components=country:br`);
  - Obtenção de coordenadas geográficas (`lat`, `lng`) normalizadas.
- **Distance Matrix API**:
  - Cálculo de tempo estimado de deslocamento em tempo real (carro ou transporte público) para enriquecer o card de resultados além da distância euclidiana simples.

---

## 4. Integração com Softwares de Gestão Odontológica (PMS / PEP)

Mais de 70% das clínicas de médio e grande porte utilizam sistemas especializados de gestão clínica e prontuário eletrônico. A Cliniq prevê conectores bidirecionais via webhooks:

### Sistemas Mapeados:
- **Clinicorp** (API REST aberta)
- **Simples Dental**
- **Feegow Clinic** (Totvs)
- **Dental Cloud**

### Contrato de Sincronização de Agenda (`POST /api/integrations/pms/slots`):
```json
{
  "clinicId": "clinic-pinheiros-01",
  "providerCro": "CRO-SP 118.492",
  "planId": "sulamerica",
  "slots": [
    {
      "date": "2026-10-06",
      "startTime": "09:00",
      "endTime": "09:45",
      "serviceCategory": "consulta_geral"
    }
  ]
}
```

---

## 5. Agência Nacional de Saúde Suplementar (ANS) & Padrão TISS

O **Padrão TISS (Troca de Informações na Saúde Suplementar)** é a norma regulatória oficial brasileira para interoperabilidade entre operadoras de planos de saúde e prestadores de serviços.

### Elegibilidade do Beneficiário em Tempo Real
- A integração com gateways de validação TISS (ex.: TISS-XML via SOAP/REST) permite verificar a validade do cartão do paciente e carência no ato da solicitação de agendamento:
  - Verificação de elegibilidade (`tissVerificaElegibilidade`);
  - Retorno de status da carteirinha (ativa, suspensa, cancelada);
  - Eliminação de glosas e frustração para a recepção da clínica e para o paciente.

---

## 6. Telefonia Automatizada e Auditoria Ativa de Dados

Para alimentar a credibilidade do selo **Cliniq Verified**, um serviço de auditoria automatizada (bot de voz com transcrição ou SMS interativo):
- Dispara pings trimestrais para as recepções cadastradas nos finais de semana ou horários de atendimento;
- Confirma se o telefone principal continua ativo e atendendo chamadas;
- Se houver 3 tentativas consecutivas sem resposta, o status da clínica é automaticamente rebaixado para `PENDING_VERIFICATION` no `AdminService` até revisão manual por um operador.
