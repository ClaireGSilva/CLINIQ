import React, { useState } from 'react';
import { Star, X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { AppointmentRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRequest;
  onSubmitReview: (reviewData: any) => void;
}

export const ReviewModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointment,
  onSubmitReview,
}) => {
  // Profissional scores
  const [atendimento, setAtendimento] = useState<number>(5);
  const [clareza, setClareza] = useState<number>(5);
  const [pontualidade, setPontualidade] = useState<number>(5);

  // Clínica scores
  const [recepcao, setRecepcao] = useState<number>(5);
  const [organizacao, setOrganizacao] = useState<number>(5);
  const [facilidadeContato, setFacilidadeContato] = useState<number>(5);

  // Plano status
  const [usedPlan, setUsedPlan] = useState<'sim' | 'nao'>('sim');
  const [failReason, setFailReason] = useState<string>('clinica_nao_atendia');
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      appointmentId: appointment.id,
      professionalId: appointment.professionalId,
      scores: {
        professional: { atendimento, clareza, pontualidade },
        clinic: { recepcao, organizacao, facilidadeContato },
      },
      planSuccess: usedPlan === 'sim',
      failReason: usedPlan === 'nao' ? failReason : undefined,
      comment,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    onSubmitReview(data);
    setSubmitted(true);
  };

  const StarRatingSelector = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-[#48504C]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                s <= value
                  ? 'fill-[#EAB308] text-[#EAB308]'
                  : 'text-[#D5D8D4]'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-semibold text-[#1A1C1A] ml-1 w-4 text-right">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#E7E5DF] text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#F0EFEA]">
          <div>
            <h2 className="text-lg font-bold text-[#1A1C1A]">Como foi sua experiência?</h2>
            <p className="text-xs text-[#68706D] mt-0.5">
              {appointment.professionalName} · {appointment.clinicName}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-[#838A87] hover:text-[#1A1C1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#0F5A47] mx-auto" />
            <h3 className="text-base font-bold text-[#1A1C1A]">Avaliação enviada com sucesso!</h3>
            <p className="text-xs text-[#68706D] max-w-sm mx-auto">
              Sua avaliação ajuda outros pacientes a encontrarem profissionais confiáveis e auditados.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738]"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="pt-4 space-y-5">
            {/* Avaliação do Profissional */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-[#1A1C1A] uppercase tracking-wider">
                Profissional
              </h3>
              <StarRatingSelector value={atendimento} onChange={setAtendimento} label="Atendimento e escuta" />
              <StarRatingSelector value={clareza} onChange={setClareza} label="Clareza nas orientações" />
              <StarRatingSelector value={pontualidade} onChange={setPontualidade} label="Pontualidade do horário" />
            </div>

            {/* Avaliação da Clínica */}
            <div className="pt-3 border-t border-[#F0EFEA] space-y-1">
              <h3 className="text-xs font-bold text-[#1A1C1A] uppercase tracking-wider">
                Clínica e Recepção
              </h3>
              <StarRatingSelector value={recepcao} onChange={setRecepcao} label="Recepção e acolhimento" />
              <StarRatingSelector value={organizacao} onChange={setOrganizacao} label="Organização e limpeza" />
              <StarRatingSelector value={facilidadeContato} onChange={setFacilidadeContato} label="Facilidade de contato" />
            </div>

            {/* Verificação do Plano */}
            <div className="pt-3 border-t border-[#F0EFEA] space-y-2">
              <h3 className="text-xs font-bold text-[#1A1C1A] uppercase tracking-wider">
                Utilização do Plano
              </h3>
              <p className="text-xs text-[#2C312E] font-medium">
                Você conseguiu utilizar seu plano ({appointment.planName}) sem impedimentos?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUsedPlan('sim')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    usedPlan === 'sim'
                      ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47]'
                      : 'border-[#D5D8D4] text-[#48504C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  ✓ Sim, utilizei o plano
                </button>
                <button
                  type="button"
                  onClick={() => setUsedPlan('nao')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    usedPlan === 'nao'
                      ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]'
                      : 'border-[#D5D8D4] text-[#48504C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  ✕ Não consegui utilizar
                </button>
              </div>

              {usedPlan === 'nao' && (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl space-y-1.5 animate-in fade-in duration-150">
                  <label className="text-[11px] font-semibold text-[#991B1B] block">
                    Por qual motivo você não conseguiu usar o plano?
                  </label>
                  <select
                    value={failReason}
                    onChange={(e) => setFailReason(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-[#FCA5A5] text-[#1A1C1A]"
                  >
                    <option value="clinica_nao_atendia">A clínica informou que não atendia mais o plano</option>
                    <option value="procedimento_nao_coberto">Procedimento não era coberto pela minha categoria</option>
                    <option value="informacao_incorreta">Cobraram taxa adicional não prevista</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                </div>
              )}
            </div>

            {/* Comentário Geral */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-[#2C312E] block mb-1">
                Comentário sobre sua experiência (opcional):
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte como foi o atendimento..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
              />
              <p className="text-[10px] text-[#838A87] mt-1">
                Lembre-se de não incluir dados de prontuário médico sensíveis.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] transition-colors"
            >
              Publicar avaliação
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
