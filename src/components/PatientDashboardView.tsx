import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Building2, CheckCircle2, 
  AlertCircle, XCircle, Star, Heart, ShieldCheck, 
  ArrowRight, MessageSquare, ChevronRight, Edit3, Check
} from 'lucide-react';
import { AppointmentRequest, Professional, Clinic } from '../types';
import { DENTAL_PLANS } from '../data/demoData';
import { ReviewModal } from './ReviewModal';
import { StatusBadge } from './ui/StatusBadge';

interface Props {
  appointments: AppointmentRequest[];
  favorites: Professional[];
  savedClinics?: Clinic[];
  activePlanId: string;
  onChangeActivePlan: (planId: string) => void;
  onCancelAppointment: (id: string) => void;
  onSelectProfessional: (pro: Professional) => void;
  onSelectClinic?: (clinic: Clinic) => void;
  onNewSearch: () => void;
  onSubmitReview: (reviewData: any) => void;
  patientName?: string;
  patientPhone?: string;
  onUpdatePatientProfile?: (profile: { name: string; phone: string; planId: string }) => void;
}

export const PatientDashboardView: React.FC<Props> = ({
  appointments,
  favorites,
  savedClinics = [],
  activePlanId,
  onChangeActivePlan,
  onCancelAppointment,
  onSelectProfessional,
  onSelectClinic,
  onNewSearch,
  onSubmitReview,
  patientName = 'Clarissa Silva',
  patientPhone = '(11) 99876-5432',
  onUpdatePatientProfile,
}) => {
  const [tab, setTab] = useState<'requests' | 'plan' | 'favorites' | 'history'>('requests');
  const [favoritesSubTab, setFavoritesSubTab] = useState<'providers' | 'clinics'>('providers');
  const [requestsFilter, setRequestsFilter] = useState<'all' | 'confirmadas' | 'aguardando' | 'canceladas'>('all');
  const [reviewingAppointment, setReviewingAppointment] = useState<AppointmentRequest | null>(null);

  // Edit profile state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(patientName);
  const [editPhone, setEditPhone] = useState(patientPhone);
  const [editPlan, setEditPlan] = useState(activePlanId);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const activePlanObj = DENTAL_PLANS.find(p => p.id === activePlanId) || DENTAL_PLANS[0];

  // Next upcoming confirmed or awaiting appointment
  const nextAppointment = appointments.find(a => a.status === 'confirmada' || a.status === 'aguardando');

  const filteredRequests = appointments.filter((a) => {
    if (requestsFilter === 'all') return true;
    return a.status === requestsFilter;
  });

  const pastAppointments = appointments.filter(a => a.id.includes('hist') || a.hasBeenReviewed || a.canonicalStatus === 'COMPLETED');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePatientProfile) {
      onUpdatePatientProfile({ name: editName, phone: editPhone, planId: editPlan });
    }
    onChangeActivePlan(editPlan);
    setProfileSaveSuccess(true);
    setTimeout(() => {
      setProfileSaveSuccess(false);
      setEditProfileOpen(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in-up">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs animate-fade-in-up">
        <div>
          <span className="text-xs font-semibold text-[#0F5A47]">Painel do Paciente</span>
          <h1 className="text-xl md:text-2xl font-bold text-[#1A1C1A]">Meu Atendimento</h1>
          <p className="text-xs text-[#68706D] mt-0.5">
            Acompanhe suas solicitações, plano cadastrado e histórico de consultas.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewSearch}
          className="self-start md:self-auto px-4 py-2.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <span>Buscar novo atendimento</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Next Appointment Highlight (Hero) */}
      {nextAppointment && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#0F5A47]/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F5A47]">
              Próxima Consulta
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
              nextAppointment.status === 'confirmada'
                ? 'bg-[#E8F3EE] text-[#0F5A47]'
                : 'bg-[#FEF9C3] text-[#854D0E]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                nextAppointment.status === 'confirmada' ? 'bg-[#10B981]' : 'bg-[#EAB308]'
              }`} />
              <span>{nextAppointment.status === 'confirmada' ? 'Confirmada pela clínica' : 'Aguardando confirmação'}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#1A1C1A]">
                {nextAppointment.professionalName}
              </h2>
              <p className="text-xs text-[#525A56]">
                {nextAppointment.serviceName} · <strong className="text-[#1A1C1A]">{nextAppointment.clinicName}</strong>
              </p>
              <p className="text-xs text-[#68706D]">
                Plano: <span className="text-[#0F5A47] font-semibold">{nextAppointment.planName}</span>
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-[#E7E5DF] text-right shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1C1A]">
                <Calendar className="w-4 h-4 text-[#0F5A47]" />
                <span>{nextAppointment.displayDate}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-[#68706D] mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>às {nextAppointment.time}</span>
              </div>
            </div>
          </div>

          {nextAppointment.clinicMessage && (
            <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534]">
              <strong>Mensagem da recepção:</strong> {nextAppointment.clinicMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onCancelAppointment(nextAppointment.id)}
              className="text-xs text-[#B45309] hover:text-[#991B1B] font-medium"
            >
              Cancelar consulta
            </button>
          </div>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[#E6E5DE] pb-1 text-xs">
        <button
          type="button"
          onClick={() => setTab('requests')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 -mb-1.5 ${
            tab === 'requests'
              ? 'border-[#0F5A47] text-[#0F5A47]'
              : 'border-transparent text-[#68706D] hover:text-[#1A1C1A]'
          }`}
        >
          Minhas solicitações ({appointments.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('plan')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 -mb-1.5 ${
            tab === 'plan'
              ? 'border-[#0F5A47] text-[#0F5A47]'
              : 'border-transparent text-[#68706D] hover:text-[#1A1C1A]'
          }`}
        >
          Meu plano ({activePlanObj.name})
        </button>
        <button
          type="button"
          onClick={() => setTab('favorites')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 -mb-1.5 ${
            tab === 'favorites'
              ? 'border-[#0F5A47] text-[#0F5A47]'
              : 'border-transparent text-[#68706D] hover:text-[#1A1C1A]'
          }`}
        >
          Favoritos ({favorites.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 -mb-1.5 ${
            tab === 'history'
              ? 'border-[#0F5A47] text-[#0F5A47]'
              : 'border-transparent text-[#68706D] hover:text-[#1A1C1A]'
          }`}
        >
          Histórico e Avaliações
        </button>
      </div>

      {/* Tab: Requests */}
      {tab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#68706D]">Filtrar status:</span>
            {(['all', 'confirmadas', 'aguardando', 'canceladas'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                type="button"
                onClick={() => setRequestsFilter(filterOpt)}
                className={`px-3 py-1 rounded-lg border text-xs capitalize ${
                  requestsFilter === filterOpt
                    ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47] font-semibold'
                    : 'border-[#D5D8D4] text-[#48504C] hover:bg-[#FAF9F5]'
                }`}
              >
                {filterOpt === 'all' ? 'Todas' : filterOpt}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRequests.map((req, idx) => (
              <div
                key={req.id}
                style={{ animationDelay: `${Math.min(idx * 60, 300)}ms` }}
                className="bg-white rounded-2xl p-5 border border-[#E6E5DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      req.status === 'confirmada'
                        ? 'bg-[#E8F3EE] text-[#0F5A47]'
                        : req.status === 'aguardando'
                          ? 'bg-[#FEF9C3] text-[#854D0E]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                    }`}>
                      {req.status === 'confirmada' && 'Confirmada'}
                      {req.status === 'aguardando' && 'Aguardando confirmação'}
                      {req.status === 'cancelada' && 'Cancelada'}
                    </span>
                    <span className="text-xs text-[#838A87]">· Plano: {req.planName}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1A1C1A]">
                    {req.professionalName} — {req.serviceName}
                  </h3>
                  <p className="text-xs text-[#68706D]">
                    {req.clinicName}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-semibold text-[#1A1C1A] block">
                      {req.displayDate}
                    </span>
                    <span className="text-xs text-[#68706D]">às {req.time}</span>
                  </div>

                  {req.status !== 'cancelada' && (
                    <button
                      type="button"
                      onClick={() => onCancelAppointment(req.id)}
                      className="text-[11px] text-[#B45309] hover:underline"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Plan & Profile */}
      {tab === 'plan' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1A1C1A]">Seu Perfil e Plano Odontológico</h2>
              <p className="text-xs text-[#68706D] mt-0.5">
                Utilizamos essa preferência para exibir apenas profissionais com credenciamento confirmado.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditProfileOpen(!editProfileOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5D8D4] text-xs font-semibold text-[#1A1C1A] hover:bg-[#FAF9F5] w-fit"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0F5A47]" />
              <span>{editProfileOpen ? 'Fechar edição' : 'Editar meus dados'}</span>
            </button>
          </div>

          {/* Inline Edit Profile Form */}
          {editProfileOpen && (
            <form onSubmit={handleSaveProfile} className="p-4 bg-[#FAF9F5] border border-[#E6E5DE] rounded-2xl space-y-3 animate-fade-in-up">
              <h3 className="text-xs font-bold text-[#1A1C1A] uppercase tracking-wider">Dados do Paciente</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#525A56] mb-1">Nome completo</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5D8D4] rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#525A56] mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#D5D8D4] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#525A56] mb-1">Plano principal</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D5D8D4] rounded-xl text-xs"
                >
                  {DENTAL_PLANS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0C4738]"
                >
                  Salvar alterações
                </button>
                {profileSaveSuccess && (
                  <span className="text-xs font-semibold text-[#0F5A47] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvo com sucesso!</span>
                  </span>
                )}
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DENTAL_PLANS.map((plan) => {
              const isSelected = activePlanId === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => onChangeActivePlan(plan.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#0F5A47] bg-[#F4F9F6]'
                      : 'border-[#E7E5DF] bg-[#FAF9F5] hover:bg-[#F2F1EB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#0F5A47] text-white' : 'bg-white text-[#4A524E] border border-[#E7E5DF]'
                    }`}>
                      {plan.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1C1A]">{plan.name}</h4>
                      <span className="text-[10px] text-[#68706D]">{plan.category}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-bold text-[#0F5A47]">Plano ativo</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#E7E5DF] text-xs text-[#525A56] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1C1A]">
              <ShieldCheck className="w-4 h-4 text-[#0F5A47]" />
              <span>Dicas de transparência ao usar seu convênio</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#68706D]">
              <li>Sempre leve um documento oficial com foto e o cartão virtual do plano no celular.</li>
              <li>Procedimentos cirúrgicos ou de canal podem demandar autorização da operadora no dia.</li>
              <li>A Cliniq verifica periodicamente o credenciamento de cada consultório listado.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Favorites (Providers + Clinics) */}
      {tab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E6E5DE] pb-2 text-xs">
            <button
              type="button"
              onClick={() => setFavoritesSubTab('providers')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                favoritesSubTab === 'providers' ? 'bg-[#0F5A47] text-white' : 'text-[#68706D] hover:text-[#1A1C1A]'
              }`}
            >
              Profissionais Salvos ({favorites.length})
            </button>
            <button
              type="button"
              onClick={() => setFavoritesSubTab('clinics')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                favoritesSubTab === 'clinics' ? 'bg-[#0F5A47] text-white' : 'text-[#68706D] hover:text-[#1A1C1A]'
              }`}
            >
              Clínicas Salvas ({savedClinics.length})
            </button>
          </div>

          {favoritesSubTab === 'providers' && (
            <div>
              {favorites.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-[#E6E5DE] space-y-2">
                  <Heart className="w-8 h-8 text-[#838A87] mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-[#1A1C1A]">Nenhum profissional salvo ainda</p>
                  <p className="text-xs text-[#68706D]">
                    Clique no coração em qualquer card de busca para salvar profissionais aqui.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((pro) => (
                    <div
                      key={pro.id}
                      className="bg-white rounded-2xl p-5 border border-[#E6E5DE] flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-[#1A1C1A]">{pro.name}</h3>
                        <p className="text-xs text-[#0F5A47] font-semibold">{pro.specialty}</p>
                        <p className="text-[11px] text-[#68706D]">{pro.clinicName} · {pro.neighborhood}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectProfessional(pro)}
                        className="px-3 py-1.5 bg-[#FAF9F5] border border-[#D5D8D4] hover:bg-[#0F5A47] hover:text-white hover:border-[#0F5A47] text-xs font-semibold rounded-xl transition-all"
                      >
                        Ver perfil
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {favoritesSubTab === 'clinics' && (
            <div>
              {savedClinics.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-[#E6E5DE] space-y-2">
                  <Building2 className="w-8 h-8 text-[#838A87] mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-[#1A1C1A]">Nenhuma clínica salva ainda</p>
                  <p className="text-xs text-[#68706D]">
                    Você pode salvar clínicas verificadas para acesso rápido ao agendamento de seus profissionais.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedClinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="bg-white rounded-2xl p-5 border border-[#E6E5DE] flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-bold text-[#1A1C1A]">{clinic.name}</h3>
                        <p className="text-xs text-[#0F5A47] font-semibold">{clinic.neighborhood} · {clinic.city}</p>
                        <p className="text-[11px] text-[#68706D]">{clinic.operatingHours}</p>
                      </div>
                      {onSelectClinic && (
                        <button
                          type="button"
                          onClick={() => onSelectClinic(clinic)}
                          className="px-3 py-1.5 bg-[#FAF9F5] border border-[#D5D8D4] hover:bg-[#0F5A47] hover:text-white hover:border-[#0F5A47] text-xs font-semibold rounded-xl transition-all"
                        >
                          Ver clínica
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: History & Reviews */}
      {tab === 'history' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {pastAppointments.map((past) => (
              <div
                key={past.id}
                className="bg-white rounded-2xl p-5 border border-[#E6E5DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold bg-[#E8F3EE] text-[#0F5A47] px-2 py-0.5 rounded">
                      Consulta realizada
                    </span>
                    <span className="text-xs text-[#838A87]">{past.displayDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1C1A] mt-1">
                    {past.professionalName} — {past.serviceName}
                  </h3>
                  <p className="text-xs text-[#68706D]">{past.clinicName}</p>
                </div>

                <div>
                  {past.hasBeenReviewed ? (
                    <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Avaliação registrada</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReviewingAppointment(past)}
                      className="px-4 py-2 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] flex items-center gap-1.5 shadow-xs"
                    >
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Avaliar atendimento</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingAppointment && (
        <ReviewModal
          isOpen={true}
          onClose={() => setReviewingAppointment(null)}
          appointment={reviewingAppointment}
          onSubmitReview={(data) => {
            onSubmitReview(data);
            reviewingAppointment.hasBeenReviewed = true;
          }}
        />
      )}
    </div>
  );
};
