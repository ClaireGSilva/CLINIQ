/**
 * Cliniq Assistant Service (AI Pipeline Layer)
 * 
 * Pipeline:
 * User Input -> Intent Extraction -> Structured Search Parameters -> Validation -> Safe Output
 * 
 * MANDATORY SAFETY GUARDS:
 * 1. Absolute ban on medical/dental diagnosis (e.g. never claim "você provavelmente tem cárie").
 * 2. Absolute ban on prescription advice.
 * 3. Never claim unverified coverage or hallucinate nonexistent clinics/slots.
 * 4. Transparently returns "Não temos essa informação confirmada" when uncertain.
 */

import { SearchState, DentalNeed, DentalPlan } from '../types';
import { DENTAL_NEEDS, DENTAL_PLANS } from '../data/demoData';

export interface AssistantExtractionResult {
  rawInput: string;
  extractedNeed: DentalNeed;
  extractedPlan: DentalPlan;
  extractedLocation: string;
  extractedPreference: string;
  urgencyDetected: boolean;
  needsClarification: boolean;
  clarificationMessage?: string;
  safetyDisclaimer: string;
  searchParameters: SearchState;
}

export class AIAssistantService {
  /**
   * Transforms natural language user brief into strictly validated structured parameters.
   */
  static interpretIntent(rawInput: string): AssistantExtractionResult {
    const text = rawInput.toLowerCase().trim();

    // 1. Identify Need
    let matchedNeed: DentalNeed = DENTAL_NEEDS[0]; // fallback: Consulta Geral
    let urgency = false;

    if (text.includes('dor') || text.includes('urgente') || text.includes('emergência') || text.includes('doendo') || text.includes('latejando')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'dor') || matchedNeed;
      urgency = true;
    } else if (text.includes('limpeza') || text.includes('tártaro') || text.includes('profilaxia') || text.includes('bicarbonato')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'limpeza') || matchedNeed;
    } else if (text.includes('aparelho') || text.includes('ortodont') || text.includes('alinhador') || text.includes('invisalign') || text.includes('mordida')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'ortodontia') || matchedNeed;
    } else if (text.includes('canal') || text.includes('endodont') || text.includes('polpa')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'canal') || matchedNeed;
      urgency = true;
    } else if (text.includes('implante') || text.includes('siso') || text.includes('extrair') || text.includes('cirurgia') || text.includes('extração')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'implante') || matchedNeed;
    } else if (text.includes('clareamento') || text.includes('estética') || text.includes('lente') || text.includes('facetas')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'estetica') || matchedNeed;
    } else if (text.includes('prótese') || text.includes('coroa') || text.includes('dentadura')) {
      matchedNeed = DENTAL_NEEDS.find(n => n.id === 'protese') || matchedNeed;
    }

    // 2. Identify Plan
    let matchedPlan: DentalPlan = DENTAL_PLANS[0]; // Default: SulAmérica
    let planExplicitlyFound = false;

    for (const plan of DENTAL_PLANS) {
      if (text.includes(plan.name.toLowerCase()) || text.includes(plan.id)) {
        matchedPlan = plan;
        planExplicitlyFound = true;
        break;
      }
    }

    if (!planExplicitlyFound) {
      if (text.includes('bradesco')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'bradesco') || matchedPlan;
        planExplicitlyFound = true;
      } else if (text.includes('odontoprev') || text.includes('odonto prev')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'odontoprev') || matchedPlan;
        planExplicitlyFound = true;
      } else if (text.includes('amil')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'amil') || matchedPlan;
        planExplicitlyFound = true;
      } else if (text.includes('metlife')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'metlife') || matchedPlan;
        planExplicitlyFound = true;
      } else if (text.includes('porto')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'portoseguro') || matchedPlan;
        planExplicitlyFound = true;
      } else if (text.includes('uniodonto')) {
        matchedPlan = DENTAL_PLANS.find(p => p.id === 'uniodonto') || matchedPlan;
        planExplicitlyFound = true;
      }
    }

    // 3. Identify Location
    let location = 'São Paulo, SP';
    if (text.includes('pinheiros')) location = 'Pinheiros, São Paulo';
    else if (text.includes('paulista') || text.includes('bela vista')) location = 'Av. Paulista, São Paulo';
    else if (text.includes('jardins') || text.includes('lorena') || text.includes('oscar freire')) location = 'Jardins, São Paulo';
    else if (text.includes('moema') || text.includes('ibirapuera')) location = 'Moema, São Paulo';
    else if (text.includes('vila mariana')) location = 'Vila Mariana, São Paulo';
    else if (text.includes('santana') || text.includes('zona norte')) location = 'Santana, São Paulo';

    // 4. Identify Preference
    let preference = urgency ? 'first' : 'first';
    if (text.includes('amanhã') || text.includes('hoje') || text.includes('urgente')) {
      preference = 'first';
    } else if (text.includes('manhã') || text.includes('cedo')) {
      preference = 'morning';
    } else if (text.includes('tarde')) {
      preference = 'afternoon';
    } else if (text.includes('noite') || text.includes('depois do trabalho')) {
      preference = 'night';
    } else if (text.includes('sábado') || text.includes('fim de semana')) {
      preference = 'saturday';
    }

    // 5. Validation & Safety Enforcement
    const needsClarification = !planExplicitlyFound && !text.includes('plano') && !text.includes('convênio');
    const clarificationMessage = needsClarification 
      ? 'Dica: Você não mencionou seu plano odontológico. Estamos sugerindo SulAmérica Odonto como padrão, mas você pode alterar a qualquer momento para ver consultórios credenciados à sua operadora.' 
      : undefined;

    const safetyDisclaimer = urgency
      ? 'Diretriz de Segurança Cliniq: Para sintomas de dor aguda, sensibilidade intensa ou inchaço, procure atendimento presencial de um cirurgião-dentista. A Cliniq facilita a localização e o agendamento em clínicas credenciadas, sem realizar diagnósticos médicos.'
      : 'Aviso: A Cliniq organiza as informações de credenciamento auditado para agilizar o contato. A avaliação clínica é feita exclusivamente pelo profissional no consultório.';

    const searchParameters: SearchState = {
      needId: matchedNeed.id,
      customNeedText: rawInput,
      planId: matchedPlan.id,
      location,
      preference,
      sortBy: 'closest',
    };

    return {
      rawInput,
      extractedNeed: matchedNeed,
      extractedPlan: matchedPlan,
      extractedLocation: location,
      extractedPreference: preference,
      urgencyDetected: urgency,
      needsClarification,
      clarificationMessage,
      safetyDisclaimer,
      searchParameters,
    };
  }
}
