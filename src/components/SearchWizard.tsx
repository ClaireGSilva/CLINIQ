import React, { useState } from 'react';
import { 
  ClipboardCheck, Sparkles, AlertCircle, Smile, ShieldAlert, 
  Layers, Boxes, SunMedium, MoreHorizontal, MapPin, 
  Clock, ShieldCheck, ArrowRight, ArrowLeft, Check
} from 'lucide-react';
import { DentalNeed, DentalPlan, SearchState } from '../types';
import { DENTAL_NEEDS, DENTAL_PLANS, PROTOTYPE_DISCLAIMER } from '../data/mockData';

interface Props {
  onSearch: (state: SearchState) => void;
  initialState?: Partial<SearchState>;
  onOpenAssistant?: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  ClipboardCheck: <ClipboardCheck className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  SunMedium: <SunMedium className="w-4 h-4" />,
  MoreHorizontal: <MoreHorizontal className="w-4 h-4" />,
};

export const SearchWizard: React.FC<Props> = ({
  onSearch,
  initialState,
  onOpenAssistant,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedNeed, setSelectedNeed] = useState<string>(initialState?.needId || 'consulta');
  const [customNeedText, setCustomNeedText] = useState<string>(initialState?.customNeedText || '');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialState?.planId || 'sulamerica');
  const [location, setLocation] = useState<string>(initialState?.location || 'São Paulo, SP');
  const [preference, setPreference] = useState<string>(initialState?.preference || 'first');

  const locationPresets = [
    { label: 'Perto de mim (São Paulo)', value: 'Perto de mim — Pinheiros / Paulista' },
    { label: 'Pinheiros', value: 'Pinheiros, São Paulo' },
    { label: 'Paulista / Bela Vista', value: 'Av. Paulista, São Paulo' },
    { label: 'Jardins', value: 'Jardins, São Paulo' },
    { label: 'Moema / Vila Mariana', value: 'Moema / Vila Mariana, São Paulo' },
    { label: 'Santana / Zona Norte', value: 'Santana, São Paulo' },
  ];

  const preferenceOptions = [
    { id: 'first', label: 'Primeira disponibilidade', desc: 'Mais rápido possível' },
    { id: 'morning', label: 'Período da manhã', desc: '08:00 às 12:00' },
    { id: 'afternoon', label: 'Período da tarde', desc: '12:00 às 18:00' },
    { id: 'night', label: 'Noite / Horário estendido', desc: 'Após 18:00' },
    { id: 'saturday', label: 'Aos sábados', desc: 'Atendimento de fim de semana' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      triggerSearch();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const triggerSearch = () => {
    onSearch({
      needId: selectedNeed,
      customNeedText,
      planId: selectedPlan,
      location,
      preference,
      sortBy: 'closest',
    });
  };

  const currentNeedObj = DENTAL_NEEDS.find(n => n.id === selectedNeed);
  const currentPlanObj = DENTAL_PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E6E5DE]">
      {/* Step Progress & Breadcrumb */}
      <div className="flex items-center justify-between pb-5 border-b border-[#EFEFE9]">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                step === s 
                  ? 'text-[#0F5A47] font-semibold' 
                  : step > s 
                    ? 'text-[#48504C] hover:text-[#0F5A47]' 
                    : 'text-[#A0A6A3]'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === s 
                  ? 'bg-[#0F5A47] text-white' 
                  : step > s 
                    ? 'bg-[#E2EDE8] text-[#0F5A47]' 
                    : 'bg-[#F0EFEA] text-[#838A87]'
              }`}>
                {step > s ? '✓' : s}
              </span>
              <span className="hidden sm:inline">
                {s === 1 && 'Necessidade'}
                {s === 2 && 'Plano'}
                {s === 3 && 'Local'}
                {s === 4 && 'Horário'}
              </span>
            </button>
          ))}
        </div>

        {onOpenAssistant && (
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0F5A47] bg-[#E8F3EE] hover:bg-[#d8eade] px-3 py-1.5 rounded-full transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Usar busca com IA</span>
          </button>
        )}
      </div>

      {/* Step 1: Necessidade */}
      {step === 1 && (
        <div key="step-1" className="pt-6 space-y-5 animate-fade-in-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C1A]">
              O que você precisa?
            </h2>
            <p className="text-sm text-[#68706D] mt-1">
              Selecione o tipo de atendimento ou descreva em linguagem comum.
            </p>
          </div>

          {/* Quick Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DENTAL_NEEDS.map((need) => {
              const isSelected = selectedNeed === need.id;
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => setSelectedNeed(need.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[90px] ${
                    isSelected
                      ? 'border-[#0F5A47] bg-[#F4F9F6] shadow-xs'
                      : 'border-[#EAE9E3] bg-[#FAF9F5] hover:bg-[#F2F1EB]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-[#0F5A47] text-white' : 'bg-white text-[#4A524E]'
                    }`}>
                      {ICONS_MAP[need.iconName] || <Smile className="w-4 h-4" />}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0F5A47]" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xs font-semibold leading-snug ${
                      isSelected ? 'text-[#0F5A47]' : 'text-[#1A1C1A]'
                    }`}>
                      {need.label}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom description field */}
          <div>
            <label className="block text-xs font-semibold text-[#48504C] mb-1.5">
              Descreva com mais detalhes (opcional):
            </label>
            <input
              type="text"
              value={customNeedText}
              onChange={(e) => setCustomNeedText(e.target.value)}
              placeholder="Ex.: sinto dor ao mastigar no lado direito, ou preciso fazer restauração"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0F5A47]"
            />
          </div>
        </div>
      )}

      {/* Step 2: Plano */}
      {step === 2 && (
        <div key="step-2" className="pt-6 space-y-5 animate-fade-in-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C1A]">
              Qual é o seu plano odontológico?
            </h2>
            <p className="text-sm text-[#68706D] mt-1">
              Mostraremos apenas clínicas com credenciamento confirmado no sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DENTAL_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0F5A47] bg-[#F4F9F6] shadow-xs'
                      : 'border-[#EAE9E3] bg-[#FAF9F5] hover:bg-[#F2F1EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#0F5A47] text-white' : 'bg-white text-[#4A524E] border border-[#E7E5DF]'
                    }`}>
                      {plan.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`text-xs sm:text-sm font-semibold ${
                        isSelected ? 'text-[#0F5A47]' : 'text-[#1A1C1A]'
                      }`}>
                        {plan.name}
                      </h3>
                      <span className="text-[11px] text-[#68706D]">
                        {plan.category}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0F5A47]" />}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#FAF8F2] border border-[#EBE6D8] rounded-xl text-xs text-[#786337] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#9E7B30] mt-0.5" />
            <p>
              <strong>Atenção:</strong> {PROTOTYPE_DISCLAIMER}
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Localização */}
      {step === 3 && (
        <div key="step-3" className="pt-6 space-y-5 animate-fade-in-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C1A]">
              Onde você quer ser atendido?
            </h2>
            <p className="text-sm text-[#68706D] mt-1">
              Encontre consultórios com fácil acesso ao seu trabalho ou residência.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#48504C] mb-1.5">
              Digite bairro, endereço ou ponto de referência:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-[#68706D]" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex.: Pinheiros, Jardins, Bela Vista..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0F5A47]"
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#68706D] block mb-2">
              Opções rápidas em São Paulo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {locationPresets.map((loc) => (
                <button
                  key={loc.value}
                  type="button"
                  onClick={() => setLocation(loc.value)}
                  className={`p-2.5 text-xs rounded-xl text-left border transition-colors ${
                    location === loc.value
                      ? 'border-[#0F5A47] bg-[#F4F9F6] text-[#0F5A47] font-semibold'
                      : 'border-[#EAE9E3] bg-[#FAF9F5] text-[#2C312E] hover:bg-[#F2F1EB]'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Preferência de horário */}
      {step === 4 && (
        <div key="step-4" className="pt-6 space-y-5 animate-fade-in-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C1A]">
              Qual sua preferência de horário?
            </h2>
            <p className="text-sm text-[#68706D] mt-1">
              Filtre as opções pela sua disponibilidade na rotina.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {preferenceOptions.map((opt) => {
              const isSelected = preference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPreference(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0F5A47] bg-[#F4F9F6] shadow-xs'
                      : 'border-[#EAE9E3] bg-[#FAF9F5] hover:bg-[#F2F1EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isSelected ? 'bg-[#0F5A47] text-white' : 'bg-white text-[#4A524E] border border-[#E7E5DF]'
                    }`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`text-xs sm:text-sm font-semibold ${
                        isSelected ? 'text-[#0F5A47]' : 'text-[#1A1C1A]'
                      }`}>
                        {opt.label}
                      </h3>
                      <span className="text-[11px] text-[#68706D]">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0F5A47]" />}
                </button>
              );
            })}
          </div>

          {/* Review selection before submitting */}
          <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] text-xs space-y-1.5">
            <span className="font-semibold text-[#1A1C1A] block">Resumo da busca:</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#48504C]">
              <span><strong>Necessidade:</strong> {currentNeedObj?.label}</span>
              <span><strong>Plano:</strong> {currentPlanObj?.name}</span>
              <span><strong>Local:</strong> {location}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-5 border-t border-[#EFEFE9] flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5D8D4] text-xs font-semibold text-[#48504C] hover:bg-[#FAF9F5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold hover:bg-[#0c4738] active:scale-[0.99] transition-all shadow-sm"
        >
          <span>{step === 4 ? 'Encontrar opções' : 'Avançar'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
