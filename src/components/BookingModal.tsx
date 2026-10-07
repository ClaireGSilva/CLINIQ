import React, { useState } from 'react';
import { 
  X, Calendar, Clock, CheckCircle2, ShieldCheck, 
  ArrowRight, ArrowLeft, User, Phone, Mail, FileText, AlertCircle
} from 'lucide-react';
import { Professional, ProfessionalService, AppointmentRequest } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional;
  initialService?: ProfessionalService;
  activePlanId: string;
  onConfirmBooking: (booking: AppointmentRequest) => void;
}

export const BookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  professional,
  initialService,
  activePlanId,
  onConfirmBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || professional.services[0]?.id || ''
  );

  // Available dates for booking
  const availableDates = [
    { dateKey: '2026-10-06', dayNum: '06', dayWeek: 'Ter', full: '06 out (Terça)' },
    { dateKey: '2026-10-07', dayNum: '07', dayWeek: 'Qua', full: '07 out (Quarta)' },
    { dateKey: '2026-10-08', dayNum: '08', dayWeek: 'Qui', full: '08 out (Quinta)' },
    { dateKey: '2026-10-09', dayNum: '09', dayWeek: 'Sex', full: '09 out (Sexta)' },
    { dateKey: '2026-10-10', dayNum: '10', dayWeek: 'Sáb', full: '10 out (Sábado)' },
  ];

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[2].dateKey);
  const [selectedTime, setSelectedTime] = useState<string>('14:30');

  // Available time slots
  const timeSlots = ['08:30', '09:00', '10:30', '14:00', '14:30', '16:00'];

  // Patient contact state
  const [patientName, setPatientName] = useState<string>('Clarissa Silva');
  const [patientPhone, setPatientPhone] = useState<string>('(11) 99876-5432');
  const [patientEmail, setPatientEmail] = useState<string>('clarissa.silva@exemplo.com.br');
  const [patientCardNumber, setPatientCardNumber] = useState<string>('7482.9910.4420.0019');
  const [patientNotes, setPatientNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentService = professional.services.find(s => s.id === selectedServiceId) || professional.services[0];
  const matchedPlan = professional.acceptedPlans.find(p => p.planId === activePlanId) || professional.acceptedPlans[0];
  const chosenDateObj = availableDates.find(d => d.dateKey === selectedDate) || availableDates[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking: AppointmentRequest = {
        id: `apt-${Date.now()}`,
        createdAt: new Date().toISOString(),
        professionalId: professional.id,
        professionalName: professional.name,
        clinicName: professional.clinicName,
        specialty: professional.specialty,
        serviceName: currentService?.name || 'Consulta Odontológica',
        planId: matchedPlan?.planId || 'sulamerica',
        planName: matchedPlan?.planName || 'Plano Odontológico',
        date: selectedDate,
        displayDate: chosenDateObj.full,
        time: selectedTime,
        patientName,
        patientPhone,
        patientEmail,
        patientCardNumber,
        patientNotes,
        status: 'aguardando',
        hasBeenReviewed: false,
      };

      setIsSubmitting(false);
      onConfirmBooking(newBooking);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#E7E5DF] text-left relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F0EFEA]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#0F5A47] font-semibold mb-0.5">
              <span>Etapa {step} de 3</span>
              <span>·</span>
              <span>Agendamento Cliniq</span>
            </div>
            <h2 className="text-xl font-bold text-[#1A1C1A]">Agendar atendimento</h2>
            <p className="text-xs text-[#68706D] mt-0.5">
              {professional.name} · {professional.clinicName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#838A87] hover:text-[#1A1C1A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Procedimento e Plano */}
        {step === 1 && (
          <div className="pt-5 space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-1.5">
                Escolha o serviço / procedimento:
              </label>
              <div className="space-y-2">
                {professional.services.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      selectedServiceId === svc.id
                        ? 'border-[#0F5A47] bg-[#F4F9F6]'
                        : 'border-[#E7E5DF] bg-[#FAF9F5] hover:bg-[#F2F1EB]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1A1C1A]">{svc.name}</h4>
                        {svc.coveredByDefault && (
                          <span className="text-[10px] text-[#0F5A47] bg-[#E8F3EE] px-1.5 py-0.5 rounded font-medium">
                            Coberto
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#68706D] mt-0.5 line-clamp-1">{svc.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[11px] text-[#838A87]">~{svc.durationMinutes} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plan check box */}
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] space-y-1">
              <span className="text-[11px] text-[#68706D] block">Plano que será utilizado:</span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1C1A]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{matchedPlan?.planName}</span>
                </div>
                <span className="text-[11px] text-[#0F5A47] font-semibold">Credenciamento Confirmado</span>
              </div>
              <p className="text-[10px] text-[#68706D] pt-0.5">
                Apresente documento com foto e sua carteirinha virtual no momento do atendimento.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continuar para data e horário</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Data e Horário */}
        {step === 2 && (
          <div className="pt-5 space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-2">
                Selecione a data:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableDates.map((item) => {
                  const isSelected = selectedDate === item.dateKey;
                  return (
                    <button
                      key={item.dateKey}
                      type="button"
                      onClick={() => setSelectedDate(item.dateKey)}
                      className={`p-2.5 rounded-2xl text-center border transition-all ${
                        isSelected
                          ? 'border-[#0F5A47] bg-[#0F5A47] text-white shadow-xs'
                          : 'border-[#E7E5DF] bg-[#FAF9F5] text-[#2C312E] hover:bg-[#F2F1EB]'
                      }`}
                    >
                      <span className="text-[10px] block font-medium opacity-80">{item.dayWeek}</span>
                      <strong className="text-base block font-bold leading-none mt-1">{item.dayNum}</strong>
                      <span className="text-[9px] block uppercase mt-1 opacity-70">Out</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-2">
                Selecione o horário disponível:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        isSelected
                          ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47]'
                          : 'border-[#E7E5DF] bg-white text-[#2C312E] hover:bg-[#FAF9F5]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl text-xs text-[#525A56] flex items-center justify-between">
              <span>Data selecionada:</span>
              <strong className="text-[#1A1C1A]">{chosenDateObj.full} às {selectedTime}</strong>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-[#D5D8D4] text-xs font-semibold text-[#48504C] rounded-xl hover:bg-[#FAF9F5]"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] flex items-center justify-center gap-2"
              >
                <span>Avançar para identificação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Dados do Paciente e Envio */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="pt-5 space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C312E] block mb-1">Nome completo</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C312E] block mb-1">WhatsApp / Telefone</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#2C312E] block mb-1">E-mail para confirmação</label>
                <input
                  type="email"
                  required
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2C312E] block mb-1">
                  Número da carteirinha do plano (demonstrativo)
                </label>
                <input
                  type="text"
                  value={patientCardNumber}
                  onChange={(e) => setPatientCardNumber(e.target.value)}
                  placeholder="Número impresso ou no app"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-1">
                Observações ou queixa principal (opcional)
              </label>
              <textarea
                rows={2}
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Ex.: Gostaria de focar na limpeza e sinto leve sensibilidade ao tomar água fria..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4] bg-white text-[#1A1C1A]"
              />
            </div>

            {/* Disclaimer LGPD & Não integração falsa */}
            <div className="p-3 bg-[#FAF8F2] border border-[#EBE6D8] rounded-xl text-[11px] text-[#786337] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-3.5 h-3.5 text-[#9E7B30]" />
                <span>Privacidade & Transparência</span>
              </div>
              <p>
                Os dados são transmitidos unicamente para triagem e agendamento da clínica solicitada. A solicitação entra com status <strong>Aguardando confirmação</strong> e será confirmada pelo consultório.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 border border-[#D5D8D4] text-xs font-semibold text-[#48504C] rounded-xl hover:bg-[#FAF9F5]"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enviando solicitação...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar e enviar solicitação</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
