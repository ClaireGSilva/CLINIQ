import React, { useState } from 'react';
import { 
  Building2, Users, CheckCircle2, Clock, Calendar, 
  ArrowRight, ShieldCheck, Plus, Check, MessageSquare, 
  Phone, AlertTriangle, FileText, ChevronRight
} from 'lucide-react';
import { AppointmentRequest, ClinicRegistrationData } from '../types';
import { INITIAL_CLINIC_REQUESTS, DENTAL_PLANS } from '../data/mockData';

interface Props {
  onBackToPatient: () => void;
}

export const ClinicPortalView: React.FC<Props> = ({ onBackToPatient }) => {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'register'>('dashboard');
  const [requests, setRequests] = useState<AppointmentRequest[]>(INITIAL_CLINIC_REQUESTS);
  const [suggestModalOpen, setSuggestModalOpen] = useState<AppointmentRequest | null>(null);
  const [suggestedTime, setSuggestedTime] = useState<string>('15:30');

  // Clinic registration form state
  const [clinicForm, setClinicForm] = useState<ClinicRegistrationData>({
    name: 'Clínica Odonto+ Pinheiros',
    cnpjDemo: '12.345.678/0001-90 (demonstrativo)',
    address: 'Rua Fradique Coutinho, 382 — cj. 41',
    neighborhood: 'Pinheiros',
    city: 'São Paulo - SP',
    phone: '(11) 3081-4490',
    whatsapp: '(11) 98721-4320',
    hours: 'Seg a Sex: 08h às 19h | Sáb: 08h às 13h',
    specialties: ['Odontologia Geral', 'Prevenção', 'Restaurações Estéticas'],
    acceptedPlans: ['sulamerica', 'bradesco', 'odontoprev', 'metlife'],
    responsibleDentist: 'Dra. Mariana Alves',
    croResponsible: 'CRO-SP 118.492',
  });
  const [registeredSuccess, setRegisteredSuccess] = useState<boolean>(false);

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  // Metrics
  const totalToday = requests.length + 3; // simulated
  const awaitingCount = requests.filter(r => r.status === 'aguardando' || r.canonicalStatus === 'PENDING_CONFIRMATION' || r.canonicalStatus === 'REQUESTED').length;
  const confirmedCount = requests.filter(r => r.status === 'confirmada' || r.canonicalStatus === 'CONFIRMED').length + 3;
  const completedCount = requests.filter(r => r.canonicalStatus === 'COMPLETED').length + 2;

  const handleAccept = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmada', canonicalStatus: 'CONFIRMED' } : r));
  };

  const handleDecline = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { 
      ...r, 
      status: 'cancelada', 
      canonicalStatus: 'CANCELLED',
      clinicMessage: 'Horário indisponível no momento na agenda da clínica.'
    } : r));
  };

  const handleMarkCompleted = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, canonicalStatus: 'COMPLETED' } : r));
  };

  const handleSuggest = (id: string, time: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { 
      ...r, 
      time, 
      status: 'aguardando',
      canonicalStatus: 'RESCHEDULE_REQUESTED',
      clinicMessage: `Horário alternativo sugerido pela clínica: ${time}. Aguardando confirmação do paciente.` 
    } : r));
    setSuggestModalOpen(null);
  };

  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'NEW' || statusFilter === 'PENDING') {
      return req.status === 'aguardando' || req.canonicalStatus === 'REQUESTED' || req.canonicalStatus === 'PENDING_CONFIRMATION' || req.canonicalStatus === 'RESCHEDULE_REQUESTED';
    }
    if (statusFilter === 'CONFIRMED') {
      return req.status === 'confirmada' || req.canonicalStatus === 'CONFIRMED';
    }
    if (statusFilter === 'COMPLETED') {
      return req.canonicalStatus === 'COMPLETED';
    }
    return true;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisteredSuccess(true);
    setTimeout(() => {
      setViewMode('dashboard');
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in-up">
      {/* Clinic View Switcher bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2421] text-white rounded-2xl px-5 py-3 text-xs animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#34D399]" />
          <span className="font-semibold text-white">Cliniq para Clínicas & Consultórios</span>
          <span className="text-[#9CA3AF] hidden sm:inline">| Painel do Prestador</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'dashboard' ? 'landing' : 'dashboard')}
            className="px-3 py-1.5 rounded-lg bg-[#2E3834] hover:bg-[#3E4A45] font-medium transition-colors"
          >
            {viewMode === 'dashboard' ? 'Ver apresentação' : 'Acessar painel'}
          </button>
          <button
            type="button"
            onClick={onBackToPatient}
            className="px-3 py-1.5 rounded-lg text-[#D1D5DB] hover:text-white underline font-medium"
          >
            Voltar para o paciente
          </button>
        </div>
      </div>

      {/* Mode 1: Landing Page for Clinics */}
      {viewMode === 'landing' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#E6E5DE] shadow-xs text-center space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5A47]">
              Solução para consultórios e clínicas
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#1A1C1A] max-w-2xl mx-auto leading-tight">
              Mais pacientes compatíveis. Menos contatos perdidos.
            </h1>
            <p className="text-sm md:text-base text-[#525A56] max-w-2xl mx-auto leading-relaxed">
              A Cliniq ajuda clínicas e profissionais a receber solicitações de pacientes que já informaram necessidade, localização e plano odontológico confirmado.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('register')}
                className="w-full sm:w-auto px-6 py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] shadow-sm flex items-center justify-center gap-2"
              >
                <span>Cadastrar clínica</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="w-full sm:w-auto px-6 py-3 border border-[#D5D8D4] text-xs sm:text-sm font-semibold text-[#1A1C1A] rounded-xl hover:bg-[#FAF9F5]"
              >
                Ver demonstração do painel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E6E5DE] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-[#1A1C1A]">Sem ligações perdidas</h3>
              <p className="text-xs text-[#68706D] leading-relaxed">
                O paciente já entra em contato com necessidade específica, período de preferência e operadora checada.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E6E5DE] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-[#1A1C1A]">Selo Cliniq Verified</h3>
              <p className="text-xs text-[#68706D] leading-relaxed">
                Garanta credibilidade comunicando diretamente aos pacientes que seus telefones e convênios estão 100% atualizados.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E6E5DE] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-[#1A1C1A]">Gestão ágil de vagas</h3>
              <p className="text-xs text-[#68706D] leading-relaxed">
                Aceite com um clique ou sugira um horário alternativo em instantes sem atrito ou chamadas telefônicas ocupadas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Clinic Dashboard */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Clinic Header */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#0F5A47]">{clinicForm.neighborhood} · {clinicForm.city}</span>
              <h1 className="text-xl md:text-2xl font-bold text-[#1A1C1A]">
                {clinicForm.name}
              </h1>
              <p className="text-xs text-[#68706D]">
                Responsável técnico: {clinicForm.responsibleDentist} ({clinicForm.croResponsible})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('register')}
                className="px-3 py-2 border border-[#D5D8D4] text-xs font-semibold rounded-xl text-[#2C312E] hover:bg-[#FAF9F5]"
              >
                Editar dados cadastrais
              </button>
            </div>
          </div>

          {/* Metrics bar: Solicitações hoje: 8, Aguardando: 3, Confirmadas: 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-[#E6E5DE] shadow-xs">
              <span className="text-xs text-[#68706D]">Solicitações hoje</span>
              <p className="text-2xl font-bold text-[#1A1C1A] mt-1 tabular-nums">
                8
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#E6E5DE] shadow-xs">
              <span className="text-xs text-[#B45309]">Aguardando resposta</span>
              <p className="text-2xl font-bold text-[#B45309] mt-1 tabular-nums">
                {awaitingCount}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#E6E5DE] shadow-xs">
              <span className="text-xs text-[#0F5A47]">Confirmadas</span>
              <p className="text-2xl font-bold text-[#0F5A47] mt-1 tabular-nums">
                {confirmedCount}
              </p>
            </div>
          </div>

          {/* Requests Queue */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#1A1C1A]">Fila de Solicitações</h2>
                <p className="text-xs text-[#68706D]">
                  Pacientes aguardando confirmação ou adequação de horário
                </p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] border border-[#E6E5DE] rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'ALL' ? 'bg-white text-[#1A1C1A] shadow-xs' : 'text-[#68706D] hover:text-[#1A1C1A]'
                  }`}
                >
                  Todas ({requests.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('PENDING')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'PENDING' ? 'bg-white text-[#1A1C1A] shadow-xs' : 'text-[#68706D] hover:text-[#1A1C1A]'
                  }`}
                >
                  Aguardando ({awaitingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('CONFIRMED')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'CONFIRMED' ? 'bg-white text-[#1A1C1A] shadow-xs' : 'text-[#68706D] hover:text-[#1A1C1A]'
                  }`}
                >
                  Confirmadas
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === 'COMPLETED' ? 'bg-white text-[#1A1C1A] shadow-xs' : 'text-[#68706D] hover:text-[#1A1C1A]'
                  }`}
                >
                  Concluídas
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#838A87] bg-[#FAF9F5] rounded-2xl">
                  Nenhuma solicitação nesta categoria de status.
                </div>
              ) : (
                filteredRequests.map((req) => {
                  const isAwaiting = req.status === 'aguardando' || req.canonicalStatus === 'REQUESTED' || req.canonicalStatus === 'PENDING_CONFIRMATION' || req.canonicalStatus === 'RESCHEDULE_REQUESTED';
                  const isConfirmed = req.status === 'confirmada' || req.canonicalStatus === 'CONFIRMED';
                  const isCompleted = req.canonicalStatus === 'COMPLETED';
                  const isCancelled = req.status === 'cancelada' || req.canonicalStatus === 'CANCELLED';

                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCompleted
                              ? 'bg-[#E8F3EE] text-[#0F5A47]'
                              : isConfirmed
                                ? 'bg-[#E8F3EE] text-[#0F5A47]'
                                : isCancelled
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : 'bg-[#FEF9C3] text-[#854D0E]'
                          }`}>
                            {isCompleted && 'Atendimento Concluído'}
                            {isConfirmed && 'Confirmada'}
                            {isCancelled && 'Recusada / Cancelada'}
                            {isAwaiting && (req.canonicalStatus === 'RESCHEDULE_REQUESTED' ? 'Reagendamento enviado' : 'Aguardando resposta')}
                          </span>
                          <span className="text-[11px] text-[#838A87]">{req.createdAt}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="font-bold text-sm text-[#1A1C1A]">
                            {req.patientName}
                          </span>
                          <span className="text-[#0F5A47] font-semibold">
                            · {req.serviceName}
                          </span>
                          <span className="text-[#525A56]">
                            · Plano: <strong>{req.planName}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#68706D] pt-0.5">
                          <span>Preferência: <strong>{req.displayDate} às {req.time}</strong></span>
                          {req.patientNotes && <span>· "{req.patientNotes}"</span>}
                        </div>

                        {req.clinicMessage && (
                          <div className="text-[11px] text-[#0F5A47] pt-0.5 italic">
                            Nota da clínica: {req.clinicMessage}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isAwaiting && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAccept(req.id)}
                              className="px-4 py-2 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setSuggestModalOpen(req)}
                              className="px-3.5 py-2 border border-[#D5D8D4] text-xs font-semibold text-[#2C312E] hover:bg-white rounded-xl transition-colors"
                            >
                              Sugerir horário
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(req.id)}
                              className="px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FEE2E2] rounded-xl transition-colors"
                            >
                              Recusar
                            </button>
                          </>
                        )}

                        {isConfirmed && !isCompleted && (
                          <>
                            <span className="text-xs text-[#0F5A47] font-semibold flex items-center gap-1.5 px-3 py-1.5 bg-[#E8F3EE] rounded-xl">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Confirmado</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(req.id)}
                              className="px-3 py-1.5 text-xs font-medium border border-[#0F5A47] text-[#0F5A47] hover:bg-[#E8F3EE] rounded-xl transition-colors"
                            >
                              Marcar como concluído
                            </button>
                          </>
                        )}

                        {isCompleted && (
                          <span className="text-xs text-[#0F5A47] font-medium flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F9F6] border border-[#D0E2D9] rounded-xl">
                            <Check className="w-3.5 h-3.5" />
                            <span>Concluído</span>
                          </span>
                        )}

                        {isCancelled && (
                          <span className="text-xs text-[#DC2626] font-medium px-3 py-1.5 bg-[#FEE2E2] rounded-xl">
                            Cancelado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Clinic Registration */}
      {viewMode === 'register' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6E5DE] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-semibold text-[#0F5A47]">Credenciamento na Cliniq</span>
            <h1 className="text-xl md:text-2xl font-bold text-[#1A1C1A]">Cadastrar Clínica ou Consultório</h1>
            <p className="text-xs text-[#68706D] mt-0.5">
              Mantenha os dados de contato e planos aceitos confirmados para receber o selo Cliniq Verified.
            </p>
          </div>

          {registeredSuccess ? (
            <div className="p-8 text-center space-y-3 bg-[#E8F3EE] rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-[#0F5A47] mx-auto" />
              <h2 className="text-lg font-bold text-[#1A1C1A]">Informações cadastradas com sucesso!</h2>
              <p className="text-xs text-[#48504C] max-w-md mx-auto">
                Seu consultório foi registrado e receberá o selo Cliniq Verified após a confirmação dos dados. Redirecionando para seu painel...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Nome da clínica / consultório</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.name}
                    onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">CNPJ (demonstrativo — não use dados fiscais sensíveis)</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.cnpjDemo}
                    onChange={(e) => setClinicForm({ ...clinicForm, cnpjDemo: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Endereço completo</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.address}
                    onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Bairro e Cidade</label>
                  <input
                    type="text"
                    required
                    value={`${clinicForm.neighborhood}, ${clinicForm.city}`}
                    onChange={(e) => setClinicForm({ ...clinicForm, neighborhood: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Telefone fixo da recepção</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.phone}
                    onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">WhatsApp oficial</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.whatsapp}
                    onChange={(e) => setClinicForm({ ...clinicForm, whatsapp: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Dentista Responsável Técnico</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.responsibleDentist}
                    onChange={(e) => setClinicForm({ ...clinicForm, responsibleDentist: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">CRO do Responsável</label>
                  <input
                    type="text"
                    required
                    value={clinicForm.croResponsible}
                    onChange={(e) => setClinicForm({ ...clinicForm, croResponsible: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>
              </div>

              {/* Planos aceitos checkbox */}
              <div>
                <label className="text-xs font-semibold text-[#2C312E] block mb-1.5">
                  Planos odontológicos que sua clínica atende ativamente:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DENTAL_PLANS.map((plan) => {
                    const isChecked = clinicForm.acceptedPlans.includes(plan.id);
                    return (
                      <label
                        key={plan.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#0F5A47] bg-[#F4F9F6] text-[#0F5A47] font-semibold'
                            : 'border-[#E7E5DF] text-[#48504C]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setClinicForm({ ...clinicForm, acceptedPlans: [...clinicForm.acceptedPlans, plan.id] });
                            } else {
                              setClinicForm({ ...clinicForm, acceptedPlans: clinicForm.acceptedPlans.filter(id => id !== plan.id) });
                            }
                          }}
                          className="accent-[#0F5A47]"
                        />
                        <span>{plan.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] border border-[#EBE6D8] rounded-xl text-xs text-[#786337]">
                <p>
                  <strong>Confirmação de informações:</strong> Ao submeter o formulário, você declara que os convênios assinalados possuem credenciamento válido na data presente.
                </p>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setViewMode('dashboard')}
                  className="py-3 px-5 border border-[#D5D8D4] text-xs font-semibold text-[#48504C] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738]"
                >
                  Confirmar informações e ativar cadastro
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Suggest Time Modal */}
      {suggestModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSuggestModalOpen(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[#1A1C1A]">Sugerir outro horário</h3>
            <p className="text-xs text-[#68706D]">
              O paciente <strong>{suggestModalOpen.patientName}</strong> solicitou atendimento para {suggestModalOpen.displayDate} às {suggestModalOpen.time}.
            </p>

            <div>
              <label className="text-xs font-semibold text-[#2C312E] block mb-1">
                Novo horário disponível:
              </label>
              <select
                value={suggestedTime}
                onChange={(e) => setSuggestedTime(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
              >
                <option value="15:30">15:30 (mesmo dia)</option>
                <option value="17:00">17:00 (mesmo dia)</option>
                <option value="09:00">09:00 (dia seguinte)</option>
                <option value="11:30">11:30 (dia seguinte)</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSuggestModalOpen(null)}
                className="flex-1 py-2 rounded-xl border border-[#D5D8D4] text-xs font-semibold"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => handleSuggest(suggestModalOpen.id, suggestedTime)}
                className="flex-1 py-2 rounded-xl bg-[#0F5A47] text-white text-xs font-semibold"
              >
                Enviar sugestão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
