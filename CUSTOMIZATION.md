# Cliniq — Guia Completo de Customização e Extensão

Este guia orienta o comprador a personalizar o Cliniq para sua própria marca, região geográfica, catálogo de especialidades e integrações de banco de dados.

---

## 1. Identidade Visual e Branding (White-Label)

### A. Nome da Aplicação e Metadados
Para alterar o nome e a descrição do produto:
1. Abra `index.html` e edite as tags `<title>`, `<meta name="description">`, `og:title` e `og:description`.
2. Abra `src/components/Header.tsx` e altere o logotipo textual e badges na barra superior.
3. Abra `src/components/ui/tokens.ts` para revisar strings e títulos institucionais.

### B. Cores e Design System
Todas as cores e estilos principais utilizam Tailwind CSS e o arquivo centralizado de tokens:
- **Arquivo**: `src/components/ui/tokens.ts`
- **Paleta Padrão**:
  - `bg-cream` (`#FAF9F5`): Fundo caloroso, evitando a estética hospitalar fria.
  - `brand-teal` (`#0F5A47`): Verde mineral de acolhimento e credibilidade clínica.
  - `surface-card` (`#FFFFFF`): Branco puro para cards de alta legibilidade.
  - `text-primary` (`#1A1C1A`): Grafite escuro para tipografia nítida com alto contraste.
  - `text-secondary` (`#68706D`): Cinza médio para metadados secundários.

Para substituir a paleta por tons de azul marinho, violeta ou outra identidade de marca, você pode customizar os valores em `tokens.ts` ou ajustar as classes no CSS global (`src/index.css`).

### C. Tipografia
A fonte padrão configurada em `index.html` é **Plus Jakarta Sans**, conhecida por sua excelente leiturabilidade técnica e editorial.
Caso deseje utilizar **Inter**, **Geist** ou **Roboto**, altere o link no `<head>` do `index.html` e a família tipográfica no `src/index.css`.

---

## 2. Dados de Demonstração, Planos e Especialidades

### A. Onde os dados estão organizados
Os dados de demonstração estão isolados no diretório:
```text
src/data/demoData/index.ts
```
Este arquivo contém:
- `DEMO_CLINICS`: Cadastro das clínicas e consultórios parceiros;
- `DEMO_PROFESSIONALS`: Lista de cirurgiões-dentistas e especialistas;
- `DEMO_PLANS`: Operadoras de planos odontológicos (SulAmérica, OdontoPrev, Bradesco, Amil, Porto, etc.);
- `DEMO_NEEDS`: Especialidades e queixas comuns de pacientes (Dor de Dente, Limpeza, Aparelho, Canal, Implante, etc.);
- `DEMO_NEIGHBORHOODS`: Bairros e centros urbanos com coordenadas de referência para cálculo de distância.

### B. Adicionando Novos Planos de Saúde
Para adicionar uma nova operadora:
1. Abra `src/data/demoData/index.ts`.
2. Localize o array `DEMO_PLANS`.
3. Adicione o novo objeto no formato:
   ```typescript
   {
     id: 'unimed-odonto',
     name: 'Unimed Odonto',
     tier: 'Essencial / Pleno / Master',
     ansCode: '41738-9',
     logo: 'https://...',
     popular: true,
   }
   ```
4. Atualize a lista de planos aceitos pelas clínicas em `DEMO_CLINICS` e `DEMO_PROFESSIONALS`.

### C. Adicionando Novas Cidades e Bairros
Para expandir o produto para o Rio de Janeiro, Belo Horizonte, Curitiba ou qualquer outra cidade:
1. Abra `src/data/demoData/index.ts` e localize `DEMO_NEIGHBORHOODS`.
2. Adicione as novas localidades com suas coordenadas de latitude e longitude:
   ```typescript
   {
     name: 'Copacabana',
     city: 'Rio de Janeiro',
     lat: -22.9698,
     lng: -43.1869,
   }
   ```
3. O serviço `mobilityService.ts` utilizará essas coordenadas automaticamente para calcular as distâncias de caminhada e condução!

---

## 3. Conectando um Backend e Banco de Dados Real

A aplicação foi desenvolvida com **arquitetura orientada a serviços (`src/services/`)**, permitindo substituir a camada de dados simulada por chamadas de API reais (REST, GraphQL, Supabase ou Firebase) sem alterar os componentes de interface.

### Estrutura dos Serviços:
- **`src/services/providerService.ts`**:
  - `searchProviders(filters)`: Altere este método para executar um `fetch('/api/providers?...')`.
  - `getProviderById(id)`: Substitua por chamada GET individual.
  - `toggleSaveProvider(id)`: Envie a requisição para a tabela de favoritos do usuário.
- **`src/services/appointmentService.ts`**:
  - `createAppointmentRequest(...)`: Substitua a gravação local por um `POST /api/appointments`.
  - `getAppointmentsByPatient(userId)`: Obtenha a lista em tempo real do banco de dados.
- **`src/services/adminService.ts`**:
  - Estatísticas de conversão e aprovação do selo *Cliniq Verified*.

Consulte o arquivo `DATA_MODEL.md` para visualizar o modelo relacional completo em PostgreSQL pronto para criação das tabelas via Prisma, Drizzle ou TypeORM.

---

## 4. Personalizando o Módulo de Mobilidade Urbana

O Cliniq implementa uma camada desacoplada em `src/services/mobilityService.ts`:

### Como ativar a API Oficial do Google Maps:
1. Obtenha uma chave no Google Cloud Console com as APIs **Distance Matrix** e **Places** ativadas.
2. Adicione a chave no arquivo `.env`:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY="sua_chave_aqui"
   ```
3. O `MobilityService` detectará a variável e alternará do provedor heurístico para chamadas diretas de matriz de distância.

### Como adicionar outro provedor (Mapbox, OSRM ou GraphHopper):
Basta implementar a interface `MobilityProvider` definida em `src/types/mobility.ts`:
```typescript
export interface MobilityProvider {
  calculateMobility(origin: GeoLocationPoint, destination: GeoLocationPoint): Promise<NormalizedMobilityResult>;
}
```

---

## 5. Personalizando o Assistente de Inteligência Artificial

O assistente de busca em linguagem natural está isolado em:
```text
src/services/aiAssistantService.ts
```

### Regras de Segurança Integradas:
- O prompt de sistema instrui o modelo a **nunca realizar diagnósticos médicos** nem indicar medicamentos.
- Caso o usuário mencione sintomas emergenciais severos, o assistente aciona um alerta imediato orientando busca por Pronto-Socorro presencial ou SAMU 192.
- A saída é estruturada em JSON, preenchendo automaticamente os filtros de especialidade, plano e sintomas na busca do paciente.

Para alternar de Gemini para outro provedor (OpenAI GPT-4o, Anthropic Claude ou modelo local):
1. Abra `src/services/aiAssistantService.ts`.
2. Substitua a chamada ao SDK `@google/genai` pelo cliente de sua preferência mantendo a mesma assinatura de retorno do método `analyzePatientIntent()`.
