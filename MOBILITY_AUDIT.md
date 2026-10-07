# Cliniq — Relatório Técnico de Auditoria de Mobilidade Urbana

## Sumário Executivo para Comercialização (Codester Commercial Asset)

A **Cliniq** incorpora um módulo arquitetural de **Mobilidade Urbana e Acessibilidade** projetado para calcular e exibir distâncias e tempos estimados de deslocamento (**a pé**, **de carro** e **transporte público/metrô**) entre o ponto de partida pesquisado pelo paciente e os consultórios odontológicos cadastrados.

Este documento formaliza a auditoria técnica, integridade de dados, distinção entre **Modo Demonstração** vs. **Modo Produção**, e salvaguardas implementadas para transferência do código-fonte a terceiros.

---

## 1. Classificação das Fontes de Dados (Data Integrity Matrix)

| Variável Exibida | Classificação Técnica | Fonte / Algoritmo | Comportamento no Card |
| :--- | :--- | :--- | :--- |
| **Origem do Paciente** | Dinâmica (Input do Usuário) | Bairro selecionado ou endereço digitado na busca | Atualização reativa instantânea |
| **Destino do Consultório** | Determinística (Auditada) | Endereço oficial e coordenadas do prestador | Fixa por prestador |
| **Distância de Carro** | Calculada Localmente | Topologia viária de São Paulo (Haversine × 1.28) | Exibida em km (ex.: `3,2 km`) |
| **Tempo de Carro** | Calculada Localmente | Velocidade média urbana (21 km/h) + interseções | Exibido em min (ex.: `12 min`) |
| **Status de Trânsito** | Heurística Modelada | Faixa horária e densidade calculada por tempo | "Trânsito livre" / "Trânsito normal" / "Trânsito intenso" |
| **Distância a Pé** | Calculada Localmente | Malha pedonal urbana (Haversine × 1.16) | Exibida em metros ou km (ex.: `260 m`, `1,4 km`) |
| **Tempo a Pé** | Calculada Localmente | Velocidade média de caminhada (4,5 km/h) | Exibido em min (ex.: `3 min a pé`) |
| **Classificação Pedonal** | Regra de Negócio | Limiares configurados: <=10min (Rápida), <=20min (Fácil), <=30min (Moderada) | "Caminhada rápida", "Acesso a pé" |
| **Estação de Metrô/CPTM** | Dados Estáticos Auditados | Levantamento de estações mais próximas por clínica | Nome da estação, linha e distância em metros |
| **Link Google Maps** | Deep Link Real | Protocolo oficial Google Maps URL (`/maps/dir/`) | Abre navegação real em nova aba com origem e destino |

---

## 2. Arquitetura de Abstração: Demo Mode vs. Production Mode

O sistema adota uma arquitetura em camadas desacoplada:

```text
ProfessionalResultCard
        │
        ▼
MobilityService (Singleton & Cache Anti-Stale)
        │
   ┌────┴──────────────────────────┐
   ▼                               ▼
LocalHeuristicMobilityProvider   GoogleMapsPlatformMobilityProvider
(Padrão / Zero Custo de API)      (Ativado via VITE_GOOGLE_MAPS_API_KEY)
```

### Modo Demonstração (Default Out-of-the-Box)
- Não exige nenhuma chave de API ou custo financeiro;
- O comprador pode clonar o repositório, executar `npm run dev` e testar 100% da experiência sem barreiras;
- O cálculo matemático reproduz com fidelidade a malha urbana da capital paulista;
- Indicador transparente no card informa ao usuário que se trata de uma estimativa com base na malha viária.

### Modo Produção (Extensível para o Comprador)
- Basta configurar `VITE_GOOGLE_MAPS_API_KEY` no arquivo `.env`;
- O `MobilityService` inicializa automaticamente o provedor de produção `GoogleMapsPlatformMobilityProvider`;
- Realiza requisições contra a Distance Matrix API e Places API.

---

## 3. Modelo de Dados Normalizado (`NormalizedMobilityResult`)

O contrato unificado (`src/types/mobility.ts`) garante que nenhum componente da UI acesse dados brutos de provedores específicos:

```typescript
export interface NormalizedMobilityResult {
  origin: GeoLocationPoint;
  destination: GeoLocationPoint;
  walking: WalkingMobility;
  driving: DrivingMobility;
  publicTransit?: PublicTransitMobility;
  provider: 'local_heuristic_sp' | 'google_maps_platform' | 'mapbox_directions';
  source: MobilitySource;
  isDemo: boolean;
  isRealTime: boolean;
  computedAt: string;
  directionsUrl: {
    driving: string;
    walking: string;
    transit: string;
  };
}
```

---

## 4. Proteção contra Dados Obsoletos (Stale Data Protection)

1. **Chave de Cache Composta**: O cache interno do `MobilityService` utiliza uma chave composta `origin::destinationId`.
2. **Reatividade Imediata no ResultsView**: Ao alternar o bairro de origem (ex.: *Pinheiros* para *Vila Mariana*), a lista de profissionais recalcula via `useMemo` com dependência direta de `currentLocation`.
3. **Garantia de Sincronia**: É impossível exibir a origem *Vila Mariana* com as distâncias remanescentes de *Pinheiros*.

---

## 5. Auditoria de UX e Design System (Calm Intelligence)

- **Hierarquia Visual**:
  - Avatar do profissional em formato `rounded-2xl` com prefixo ergonômico (`Dr.` / `Dra.`);
  - Cards comparativos de modo duplo (*De carro* vs. *A pé*) com seleção via toque/clique;
  - Strip de proximidade de metrô (`Train`) integrado com indicação em metros e minutos de caminhada;
  - Modal expansível de detalhes de rota com preenchimento da origem e destino;
  - Deep link direto para o Google Maps;
  - Botão de transparência informativa (`Info`) informando o método de cálculo;
  - Status auditado de convênio (`CheckCircle2` para confirmado, `AlertCircle` para sob confirmação).

---

## 6. Checklist de Comercialização no Codester

- [x] O produto funciona imediatamente após `npm install` sem necessidade de cartão de crédito em APIs terceiras;
- [x] Código fonte limpo, tipado em TypeScript estrito, sem `any` desnecessários;
- [x] Honestidade comercial total no README e na interface sobre o que é calculado localmente vs. API em tempo real;
- [x] Fácil customização e extensão para compradores integrarem Mapbox, TomTom, ou Google Maps;
- [x] Testes de build (`npm run build`) e linter aprovados com zero erros.
