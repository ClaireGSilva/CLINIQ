import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SearchState } from '../types';
import { AIAssistantService, AssistantExtractionResult } from '../services/aiAssistantService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplySearch: (params: SearchState) => void;
  initialQuery?: string;
}

export const CliniqAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplySearch,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [analyzed, setAnalyzed] = useState(false);
  const [extractionResult, setExtractionResult] = useState<AssistantExtractionResult | null>(null);

  const samplePrompts = [
    'Estou com dor no dente e tenho Bradesco Dental. Quero algo perto amanhã.',
    'Preciso fazer uma limpeza de rotina pelo SulAmérica Odonto em Pinheiros.',
    'Quero colocar aparelho fixo e meu plano é Amil Dental.',
    'Preciso tratar canal urgente com OdontoPrev perto da Paulista.',
  ];

  const handleAnalyze = (textToAnalyze: string) => {
    const result = AIAssistantService.interpretIntent(textToAnalyze);
    setExtractionResult(result);
    setAnalyzed(true);
  };

  const handleApply = () => {
    if (!extractionResult) return;
    onApplySearch(extractionResult.searchParameters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF9F5] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7E5DF] text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#ECEAE3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E2EDE8] flex items-center justify-center text-[#0F5A47]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1A1C1A]">Cliniq Assistant</h2>
              <p className="text-xs text-[#68706D]">Transforme linguagem natural em busca estruturada</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#88908D] hover:text-[#1A1C1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C312E] mb-1.5">
              Diga o que você precisa em suas próprias palavras:
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setAnalyzed(false);
                }}
                rows={3}
                placeholder="Ex.: Estou com dor em um dente e preciso encontrar um dentista pelo Bradesco Dental perto de mim amanhã..."
                className="w-full text-sm p-3 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0F5A47] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#68706D] block mb-1.5">Exemplos rápidos:</span>
            <div className="space-y-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(prompt);
                    handleAnalyze(prompt);
                  }}
                  className="w-full text-left text-xs p-2 rounded-lg bg-white border border-[#E7E5DF] text-[#404744] hover:bg-[#F2F1EC] hover:text-[#1A1C1A] transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {!analyzed && (
            <button
              type="button"
              disabled={!query.trim()}
              onClick={() => handleAnalyze(query)}
              className="w-full py-2.5 px-4 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Interpretar minha necessidade</span>
            </button>
          )}

          {analyzed && extractionResult && (
            <div className="p-4 rounded-xl bg-white border border-[#D9DFDC] space-y-3.5 animate-fade-in-up">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F5A47]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Entendi! Vou procurar os melhores profissionais:</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#FAF9F5]">
                  <span className="text-[#68706D] block text-[11px]">Necessidade identificada</span>
                  <strong className="text-[#1A1C1A] font-semibold">{extractionResult.extractedNeed.label}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF9F5]">
                  <span className="text-[#68706D] block text-[11px]">Plano informado</span>
                  <strong className="text-[#1A1C1A] font-semibold">{extractionResult.extractedPlan.name}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF9F5]">
                  <span className="text-[#68706D] block text-[11px]">Localização</span>
                  <strong className="text-[#1A1C1A] font-semibold">{extractionResult.extractedLocation}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF9F5]">
                  <span className="text-[#68706D] block text-[11px]">Preferência</span>
                  <strong className="text-[#1A1C1A] font-semibold">
                    {extractionResult.extractedPreference === 'first' ? 'Primeira disponibilidade' : extractionResult.extractedPreference}
                  </strong>
                </div>
              </div>

              {extractionResult.clarificationMessage && (
                <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[11px] text-[#166534] leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#15803D]" />
                  <span>{extractionResult.clarificationMessage}</span>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E] leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" />
                <span>{extractionResult.safetyDisclaimer}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAnalyzed(false)}
                  className="py-2.5 px-3 rounded-xl border border-[#D5D8D4] text-xs font-medium text-[#404744] hover:bg-[#FAF9F5]"
                >
                  Editar busca
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 py-2.5 px-4 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Encontrar opções compatíveis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
