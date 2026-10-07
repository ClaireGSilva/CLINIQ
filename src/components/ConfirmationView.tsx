import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Calendar, MapPin, Building2, 
  MessageSquare, XCircle, ArrowRight, ShieldCheck, Phone
} from 'lucide-react';
import { AppointmentRequest } from '../types';

interface Props {
  appointment: AppointmentRequest;
  onViewDashboard: () => void;
  onCancelRequest: (appointmentId: string) => void;
  onBackToHome: () => void;
}

export const ConfirmationView: React.FC<Props> = ({
  appointment,
  onViewDashboard,
  onCancelRequest,
  onBackToHome,
}) => {
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [cancelConfirmationOpen, setCancelConfirmationOpen] = useState(false);

  const isConfirmed = appointment.status === 'confirmada';
  const isCancelled = appointment.status === 'cancelada';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12 space-y-6 animate-fade-in-up">
      {/* Success Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6E5DE] shadow-xs text-center space-y-6 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-[#0F5A47] uppercase tracking-wider">
            Solicitação Registrada
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1C1A]">
            Tudo certo.
          </h1>
          <p className="text-sm text-[#68706D] max-w-md mx-auto">
            Sua solicitação de agendamento foi enviada para a clínica e já está na fila de atendimento.
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] animate-pulse" />
          <span>Status: Aguardando confirmação da clínica</span>
        </div>

        {/* Appointment Card */}
        <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] text-left space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A1C1A]">
                {appointment.professionalName}
              </h2>
              <p className="text-xs text-[#0F5A47] font-semibold">
                {appointment.specialty}
              </p>
              <p className="text-xs text-[#68706D] mt-0.5">
                {appointment.clinicName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#1A1C1A] block">
                {appointment.serviceName}
              </span>
              <span className="text-[11px] text-[#68706D]">
                Plano: {appointment.planName}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#EAE9E3] grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#2C312E]">
              <Calendar className="w-4 h-4 text-[#0F5A47]" />
              <span className="font-semibold">{appointment.displayDate}</span>
            </div>
            <div className="flex items-center gap-2 text-[#2C312E]">
              <Clock className="w-4 h-4 text-[#0F5A47]" />
              <span className="font-semibold">às {appointment.time}</span>
            </div>
          </div>

          {detailsExpanded && (
            <div className="pt-3 border-t border-[#EAE9E3] space-y-2 text-xs text-[#525A56] animate-in fade-in duration-150">
              <div className="flex justify-between">
                <span>Nome do paciente:</span>
                <strong className="text-[#1A1C1A]">{appointment.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span>WhatsApp de contato:</span>
                <strong className="text-[#1A1C1A]">{appointment.patientPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span>E-mail:</span>
                <strong className="text-[#1A1C1A]">{appointment.patientEmail}</strong>
              </div>
              {appointment.patientCardNumber && (
                <div className="flex justify-between">
                  <span>Carteirinha informada:</span>
                  <strong className="text-[#1A1C1A]">{appointment.patientCardNumber}</strong>
                </div>
              )}
              {appointment.patientNotes && (
                <div className="pt-1">
                  <span className="block text-[11px] text-[#838A87]">Observações:</span>
                  <p className="text-xs text-[#1A1C1A] italic">"{appointment.patientNotes}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[#D5D8D4] text-xs font-semibold text-[#2C312E] hover:bg-[#FAF9F5] transition-colors"
          >
            {detailsExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
          </button>

          <button
            type="button"
            onClick={() => setWhatsappModalOpen(true)}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0F5A47] text-white text-xs font-semibold hover:bg-[#0c4738] flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Falar com a clínica</span>
          </button>

          <button
            type="button"
            onClick={() => setCancelConfirmationOpen(true)}
            className="w-full sm:w-auto py-2.5 px-3 text-xs text-[#B45309] hover:text-[#991B1B] font-medium"
          >
            Cancelar solicitação
          </button>
        </div>

        {/* Navigation helpers */}
        <div className="pt-4 border-t border-[#F0EFEA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68706D]">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-[#1A1C1A] font-medium"
          >
            ← Voltar para a página inicial
          </button>
          <button
            type="button"
            onClick={onViewDashboard}
            className="font-semibold text-[#0F5A47] flex items-center gap-1 hover:underline"
          >
            <span>Ver no meu painel de consultas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated WhatsApp Modal */}
      {whatsappModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setWhatsappModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-[#1A1C1A]">Canal Direto da Clínica</h3>
                <p className="text-xs text-[#68706D]">
                  Simulação de mensagem pré-formatada para {appointment.clinicName}
                </p>
              </div>
              <button 
                onClick={() => setWhatsappModalOpen(false)} 
                className="text-[#838A87] hover:text-[#1A1C1A]"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#E8F3EE] border border-[#D0E2D9] text-xs space-y-2">
              <p className="font-semibold text-[#0F5A47]">Mensagem gerada para WhatsApp:</p>
              <div className="bg-white p-3 rounded-lg border border-[#D0E2D9] text-[#2C312E] leading-relaxed text-[11px] font-mono">
                "Olá! Me chamo {appointment.patientName}. Acabei de registrar um pedido de agendamento pela Cliniq para {appointment.serviceName} no dia {appointment.displayDate} às {appointment.time} pelo plano {appointment.planName}."
              </div>
            </div>

            <p className="text-[11px] text-[#68706D]">
              No ambiente real da Cliniq, clicar no botão redireciona diretamente ao WhatsApp oficial verificado da recepção do consultório.
            </p>

            <button
              type="button"
              onClick={() => setWhatsappModalOpen(false)}
              className="w-full py-2.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl"
            >
              Fechar canal
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Prompt */}
      {cancelConfirmationOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setCancelConfirmationOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1C1A]">Cancelar solicitação?</h3>
              <p className="text-xs text-[#68706D] mt-1">
                A vaga reservada para {appointment.displayDate} às {appointment.time} será liberada para outros pacientes.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelConfirmationOpen(false)}
                className="flex-1 py-2 rounded-xl border border-[#D5D8D4] text-xs font-semibold text-[#48504C]"
              >
                Manter pedido
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancelRequest(appointment.id);
                  setCancelConfirmationOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C]"
              >
                Confirmar cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
