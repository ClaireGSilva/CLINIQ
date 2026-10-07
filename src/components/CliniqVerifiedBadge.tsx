import React, { useState } from 'react';
import { ShieldCheck, Info, X, Check, Clock, AlertTriangle } from 'lucide-react';
import { VerificationDetails } from '../types';

interface Props {
  verification: VerificationDetails;
  showDetailsButton?: boolean;
  compact?: boolean;
}

export const CliniqVerifiedBadge: React.FC<Props> = ({
  verification,
  showDetailsButton = true,
  compact = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F5A47]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Cliniq Verified</span>
        </div>

        {showDetailsButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="text-[#68706D] hover:text-[#0F5A47] p-0.5 rounded transition-colors"
            title="Ver detalhes da verificação"
            aria-label="Ver detalhes da auditoria de verificação"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!compact && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#404744]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Plano confirmado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Telefone confirmado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>WhatsApp ativo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Perfil atualizado</span>
          </div>
        </div>
      )}

      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E8F3EE] flex items-center justify-center text-[#0F5A47]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-[#1A1C1A]">Cliniq Verified</h3>
                  <p className="text-xs text-[#68706D]">
                    Última checagem: {verification.lastUpdatedDate}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-[#8B9390] hover:text-[#1A1C1A] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1 border-t border-[#F0EFEA]">
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span className="font-medium text-[#2C312E]">Plano odontológico</span>
                </div>
                <span className="text-[#0F5A47] font-medium">Confirmado com recepção</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span className="font-medium text-[#2C312E]">Telefone fixo</span>
                </div>
                <span className="text-[#0F5A47] font-medium">Ativo e testado</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span className="font-medium text-[#2C312E]">Canal de WhatsApp</span>
                </div>
                <span className="text-[#0F5A47] font-medium">Resposta ativa</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#10B981]" />
                  <span className="font-medium text-[#2C312E]">Atualização recente</span>
                </div>
                <span className="text-[#68706D]">{verification.lastUpdatedDate}</span>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl text-xs text-[#92400E] leading-relaxed">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#B45309] mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Critério de Transparência</strong>
                  O selo Cliniq Verified audita a acurácia dos dados cadastrais (planos aceitos, canais de contato e disponibilidade). Não constitui garantia de resultado clínico ou substituição de consulta odontológica presencial.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 px-4 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
