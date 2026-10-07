import React, { useState } from 'react';
import { ShieldCheck, X, Trash2, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClearUserData: () => void;
}

export const LGPDModal: React.FC<Props> = ({ isOpen, onClose, onClearUserData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'lgpd' | 'terms' | 'manage'>('lgpd');
  const [dataCleared, setDataCleared] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#E7E5DF] text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#F0EFEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F3EE] flex items-center justify-center text-[#0F5A47]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1C1A]">Privacidade e Termos (LGPD)</h2>
              <p className="text-xs text-[#68706D]">Transparência e controle sobre seus dados pessoais</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#838A87] hover:text-[#1A1C1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 pt-3 border-b border-[#F0EFEA] text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('lgpd')}
            className={`pb-2 font-semibold border-b-2 -mb-px transition-colors ${
              activeSubTab === 'lgpd' ? 'border-[#0F5A47] text-[#0F5A47]' : 'border-transparent text-[#68706D]'
            }`}
          >
            Política de Privacidade
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('terms')}
            className={`pb-2 font-semibold border-b-2 -mb-px transition-colors ${
              activeSubTab === 'terms' ? 'border-[#0F5A47] text-[#0F5A47]' : 'border-transparent text-[#68706D]'
            }`}
          >
            Termos de Uso
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('manage')}
            className={`pb-2 font-semibold border-b-2 -mb-px transition-colors ${
              activeSubTab === 'manage' ? 'border-[#0F5A47] text-[#0F5A47]' : 'border-transparent text-[#68706D]'
            }`}
          >
            Meus Dados & Exclusão
          </button>
        </div>

        <div className="py-4 text-xs text-[#48504C] leading-relaxed space-y-3">
          {activeSubTab === 'lgpd' && (
            <>
              <p>
                <strong>Minimização de Dados (LGPD Art. 6º, III):</strong> A Cliniq coleta exclusivamente os dados estritamente necessários para viabilizar o contato e agendamento da consulta odontológica (nome, telefone/WhatsApp e plano informado).
              </p>
              <p>
                <strong>Natureza do Serviço:</strong> A Cliniq é uma plataforma tecnológica de descoberta, transparência de credenciamento e facilitação de agendamento. A plataforma <strong>não é prestadora de serviços médicos ou odontológicos</strong> e não realiza diagnósticos clínicos.
              </p>
              <p>
                <strong>Compartilhamento:</strong> Seus dados de contato e número demonstrativo de carteirinha são compartilhados unicamente com o consultório ou clínica no qual você confirmou o pedido de agendamento.
              </p>
            </>
          )}

          {activeSubTab === 'terms' && (
            <>
              <p>
                <strong>Responsabilidade Clínica:</strong> Toda a avaliação diagnóstica, prescrição medicamentosa e execução de procedimentos é de exclusiva responsabilidade do cirurgião-dentista credenciado e da clínica prestadora.
              </p>
              <p>
                <strong>Cobertura de Convênios:</strong> O selo Cliniq Verified representa uma auditoria cadastral periódica das informações de credenciamento. A Cliniq recomenda que o paciente confirme a elegibilidade específica do seu plano no momento da recepção presencial.
              </p>
            </>
          )}

          {activeSubTab === 'manage' && (
            <div className="space-y-4">
              <p>
                Você tem o direito de solicitar a exclusão de todos os seus registros de agendamento e preferências armazenadas localmente no seu dispositivo.
              </p>

              {dataCleared ? (
                <div className="p-3 bg-[#E8F3EE] rounded-xl text-[#0F5A47] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Seus dados locais foram redefinidos com sucesso.</span>
                </div>
              ) : (
                <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#991B1B]">
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir registros e reiniciar demonstração</span>
                  </div>
                  <p className="text-[11px] text-[#991B1B]">
                    Isso cancelará solicitações pendentes e redefinirá seus favoritos salvos.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClearUserData();
                      setDataCleared(true);
                    }}
                    className="px-4 py-2 bg-[#DC2626] text-white text-xs font-semibold rounded-lg hover:bg-[#B91C1C]"
                  >
                    Excluir todos os meus dados
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#F0EFEA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
