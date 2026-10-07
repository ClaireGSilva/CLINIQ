import React, { useState } from 'react';
import { 
  Sparkles, Search, ShieldCheck, Check, Clock, 
  MapPin, Star, Calendar, MessageSquare, ArrowRight, 
  ChevronRight, Heart, AlertCircle, Building2, User,
  ClipboardCheck, Smile, ShieldAlert, Layers, Boxes, SunMedium, MoreHorizontal
} from 'lucide-react';
import { 
  NavigationTab, Professional, SearchState, 
  AppointmentRequest, ProfessionalService, Clinic 
} from './types';
import { 
  MOCK_PROFESSIONALS, DENTAL_NEEDS, DENTAL_PLANS, 
  INITIAL_USER_APPOINTMENTS, DEMO_CLINICS, PROTOTYPE_DISCLAIMER 
} from './data/demoData';
import { AppointmentService } from './services/appointmentService';
import { ProviderService } from './services/providerService';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchWizard } from './components/SearchWizard';
import { ResultsView } from './components/ResultsView';
import { ProfileView } from './components/ProfileView';
import { BookingModal } from './components/BookingModal';
import { ConfirmationView } from './components/ConfirmationView';
import { PatientDashboardView } from './components/PatientDashboardView';
import { ClinicPortalView } from './components/ClinicPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { CliniqAssistantModal } from './components/CliniqAssistantModal';
import { LGPDModal } from './components/LGPDModal';

const QUICK_ICONS: Record<string, React.ReactNode> = {
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

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [clinics, setClinics] = useState<Clinic[]>(DEMO_CLINICS);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(() => AppointmentService.getPatientAppointments());
  const [savedProviderIds, setSavedProviderIds] = useState<string[]>(() => ProviderService.getSavedProviderIds());
  const [savedClinicIds, setSavedClinicIds] = useState<string[]>(() => ProviderService.getSavedClinicIds());
  const [activePlanId, setActivePlanId] = useState<string>('sulamerica');
  const [patientName, setPatientName] = useState<string>('Clarissa Silva');
  const [patientPhone, setPatientPhone] = useState<string>('(11) 99876-5432');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Search parameters
  const [searchState, setSearchState] = useState<SearchState>({
    needId: 'consulta',
    customNeedText: '',
    planId: 'sulamerica',
    location: 'Pinheiros, São Paulo',
    preference: 'first',
    sortBy: 'closest',
  });

  // Home natural search input state
  const [quickSearchInput, setQuickSearchInput] = useState<string>('');

  // Modals & Active Selections
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingService, setBookingService] = useState<ProfessionalService | undefined>(undefined);
  const [latestAppointment, setLatestAppointment] = useState<AppointmentRequest | null>(null);
  const [assistantModalOpen, setAssistantModalOpen] = useState<boolean>(false);
  const [lgpdModalOpen, setLgpdModalOpen] = useState<boolean>(false);

  // Search trigger with realistic short loading transition
  const handlePerformSearch = (newState: SearchState) => {
    setIsSearching(true);
    setSearchState(newState);
    setActivePlanId(newState.planId);
    setCurrentTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setIsSearching(false);
    }, 220);
  };

  // Toggle saved provider
  const handleToggleSaveProvider = (id: string) => {
    const updated = ProviderService.toggleSavedProvider(id);
    setSavedProviderIds(updated);
  };

  // Toggle saved clinic
  const handleToggleSaveClinic = (id: string) => {
    const updated = ProviderService.toggleSavedClinic(id);
    setSavedClinicIds(updated);
  };

  // Home quick natural language search submission
  const handleHomeQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) {
      setCurrentTab('search');
      return;
    }
    setAssistantModalOpen(true);
  };

  // Quick category click on Home
  const handleQuickCategoryClick = (needId: string) => {
    setSearchState(prev => ({
      ...prev,
      needId,
      planId: activePlanId,
    }));
    setCurrentTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select professional for profile view
  const handleSelectProfessional = (pro: Professional) => {
    setSelectedProfessional(pro);
    setCurrentTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start booking
  const handleOpenBooking = (pro: Professional, service?: ProfessionalService) => {
    setSelectedProfessional(pro);
    setBookingService(service);
    setBookingModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = (newBooking: AppointmentRequest) => {
    const saved = AppointmentService.createAppointmentRequest(newBooking);
    setAppointments(prev => [saved, ...prev]);
    setLatestAppointment(saved);
    setBookingModalOpen(false);
    setCurrentTab('booking_confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel appointment
  const handleCancelAppointment = (id: string) => {
    AppointmentService.cancelAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelada', canonicalStatus: 'CANCELLED' } : a));
    if (latestAppointment && latestAppointment.id === id) {
      setLatestAppointment(prev => prev ? { ...prev, status: 'cancelada', canonicalStatus: 'CANCELLED' } : null);
    }
  };

  // Submit review
  const handleSubmitReview = (reviewData: any) => {
    setAppointments(prev => prev.map(a => 
      a.id === reviewData.appointmentId ? { ...a, hasBeenReviewed: true } : a
    ));
  };

  // Clear user data (LGPD)
  const handleClearUserData = () => {
    setAppointments(INITIAL_USER_APPOINTMENTS.filter(a => a.id.includes('hist')));
    setSavedProviderIds([]);
    setSavedClinicIds([]);
  };

  const pendingRequestsCount = appointments.filter(a => a.status === 'aguardando' || a.canonicalStatus === 'PENDING_CONFIRMATION').length;

  const favoriteProviders = professionals.filter(p => savedProviderIds.includes(p.id));
  const favoriteClinics = clinics.filter(c => savedClinicIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1C1A]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main App Content Viewport */}
      <main key={currentTab} className="flex-1 pb-20 md:pb-12 animate-fade-in-up">
        {/* VIEW 1: HOME LANDING */}
        {currentTab === 'home' && (
          <div className="space-y-12 animate-fade-in-up">
            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 pt-10 sm:pt-16 pb-8 text-center space-y-6">
              <div className="space-y-3 animate-fade-in-up">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F5A47]">
                  Encontre quem atende seu plano · Agende sem complicação
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A1C1A] leading-[1.15] max-w-3xl mx-auto">
                  Encontrar um dentista pelo seu plano não deveria ser difícil.
                </h1>
                <p className="text-sm sm:text-base text-[#525A56] max-w-2xl mx-auto leading-relaxed">
                  Diga o que você precisa, informe seu plano e encontre profissionais e clínicas compatíveis perto de você.
                </p>
              </div>

              {/* Natural Language Main Search Field */}
              <div className="max-w-2xl mx-auto animate-fade-in-up stagger-1">
                <form
                  onSubmit={handleHomeQuickSubmit}
                  className="bg-white p-2 rounded-2xl sm:rounded-3xl border border-[#D5D8D4] shadow-sm hover:border-[#0F5A47]/40 transition-all flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-3 px-3 w-full py-1">
                    <Search className="w-5 h-5 text-[#68706D] shrink-0" />
                    <input
                      type="text"
                      value={quickSearchInput}
                      onChange={(e) => setQuickSearchInput(e.target.value)}
                      placeholder="Ex.: preciso fazer uma limpeza e tenho SulAmérica Odonto"
                      className="w-full text-xs sm:text-sm bg-transparent text-[#1A1C1A] placeholder-[#8B9390] focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#0F5A47] hover:bg-[#0c4738] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>Encontrar atendimento</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between mt-2.5 px-2 text-[11px] text-[#68706D]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F5A47]" />
                    <span>Cliniq Verified: Telefones e convênios auditados</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAssistantModalOpen(true)}
                    className="text-[#0F5A47] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Usar IA Cliniq</span>
                  </button>
                </div>
              </div>

              {/* Quick Access Categories */}
              <div className="pt-6 space-y-3 max-w-3xl mx-auto animate-fade-in-up stagger-2">
                <span className="text-xs font-semibold text-[#525A56] block">
                  Acesso rápido por necessidade:
                </span>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-left">
                  {DENTAL_NEEDS.slice(0, 9).map((need) => (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => handleQuickCategoryClick(need.id)}
                      className="p-3 bg-white border border-[#E7E5DF] hover:border-[#0F5A47] hover:bg-[#F4F9F6] rounded-2xl transition-all group flex flex-col justify-between h-20"
                    >
                      <div className="p-1.5 rounded-lg bg-[#FAF9F5] group-hover:bg-[#E8F3EE] group-hover:text-[#0F5A47] text-[#4A524E] w-fit transition-colors">
                        {QUICK_ICONS[need.iconName] || <Smile className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-semibold text-[#2C312E] group-hover:text-[#0F5A47] leading-tight line-clamp-1">
                        {need.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Embedded Guided Search Card */}
            <section className="max-w-3xl mx-auto px-4 animate-fade-in-up stagger-2">
              <SearchWizard
                onSearch={handlePerformSearch}
                initialState={searchState}
                onOpenAssistant={() => setAssistantModalOpen(true)}
              />
            </section>

            {/* Value Pillars Section: "Como funciona a Cliniq" */}
            <section className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in-up stagger-3">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F5A47]">
                  O fim das listas desatualizadas
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1C1A]">
                  Seu plano. Sua necessidade. Seu atendimento.
                </h2>
                <p className="text-xs sm:text-sm text-[#525A56] max-w-lg mx-auto">
                  A Cliniq transforma a incerteza de credenciamentos em um agendamento seguro em poucos passos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="text-base font-bold text-[#1A1C1A]">
                    Auditoria Cliniq Verified
                  </h3>
                  <p className="text-xs text-[#68706D] leading-relaxed">
                    Não adivinhamos planos. Confirmamos periodicamente se o profissional e a clínica estão ativos no seu convênio e respondendo no WhatsApp.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="text-base font-bold text-[#1A1C1A]">
                    Linguagem Natural sem Jargões
                  </h3>
                  <p className="text-xs text-[#68706D] leading-relaxed">
                    Você não precisa saber se precisa de um 'endodontista' ou 'periodontista'. Diga o que sente e nossa plataforma direciona à especialidade correta.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8F3EE] text-[#0F5A47] flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="text-base font-bold text-[#1A1C1A]">
                    Agendamento Real e Acompanhado
                  </h3>
                  <p className="text-xs text-[#68706D] leading-relaxed">
                    Escolha a data e o horário. Sua solicitação é transmitida diretamente à recepção e você acompanha a confirmação em seu painel.
                  </p>
                </div>
              </div>

              {/* Verified Trust Banner */}
              <div className="bg-[#E8F3EE] rounded-3xl p-6 md:p-8 border border-[#D0E2D9] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-sm font-bold text-[#0F5A47]">O que significa Cliniq Verified?</span>
                  </div>
                  <p className="text-xs text-[#283832] max-w-xl leading-relaxed">
                    A verificação indica que confirmamos telefones, canais de WhatsApp e a aceitação do plano odontológico com a recepção da clínica. Não é garantia de qualidade clínica nem diagnóstico, mas sim transparência de informação.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentTab('search')}
                  className="px-5 py-2.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] shrink-0"
                >
                  Ver profissionais verificados
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SEARCH WIZARD STANDALONE */}
        {currentTab === 'search' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <SearchWizard
              onSearch={handlePerformSearch}
              initialState={searchState}
              onOpenAssistant={() => setAssistantModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: RESULTS VIEW */}
        {currentTab === 'results' && (
          <ResultsView
            professionals={professionals}
            searchState={searchState}
            onSelectProfessional={handleSelectProfessional}
            onBookProfessional={(pro) => handleOpenBooking(pro)}
            onModifySearch={() => setCurrentTab('search')}
            savedProviderIds={savedProviderIds}
            onToggleSaveProvider={handleToggleSaveProvider}
            isLoading={isSearching}
          />
        )}

        {/* VIEW 4: PROFILE VIEW */}
        {currentTab === 'profile' && selectedProfessional && (
          <ProfileView
            professional={selectedProfessional}
            activePlanId={activePlanId}
            searchedLocation={searchState.location}
            onBack={() => setCurrentTab('results')}
            onBook={(service) => handleOpenBooking(selectedProfessional, service)}
            onContactWhatsApp={() => {
              // Prepopulate simulated contact
              handleOpenBooking(selectedProfessional);
            }}
          />
        )}

        {/* VIEW 5: CONFIRMATION VIEW */}
        {currentTab === 'booking_confirmation' && latestAppointment && (
          <ConfirmationView
            appointment={latestAppointment}
            onViewDashboard={() => setCurrentTab('patient_dashboard')}
            onCancelRequest={handleCancelAppointment}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}

        {/* VIEW 6: PATIENT DASHBOARD */}
        {currentTab === 'patient_dashboard' && (
          <PatientDashboardView
            appointments={appointments}
            favorites={favoriteProviders}
            savedClinics={favoriteClinics}
            activePlanId={activePlanId}
            onChangeActivePlan={setActivePlanId}
            onCancelAppointment={handleCancelAppointment}
            onSelectProfessional={handleSelectProfessional}
            onSelectClinic={(clinic) => {
              // Find matching provider or navigate to results with location
              const match = professionals.find(p => p.clinicName === clinic.name);
              if (match) {
                handleSelectProfessional(match);
              } else {
                setSearchState(prev => ({ ...prev, location: clinic.neighborhood }));
                setCurrentTab('results');
              }
            }}
            onNewSearch={() => setCurrentTab('search')}
            onSubmitReview={handleSubmitReview}
            patientName={patientName}
            patientPhone={patientPhone}
            onUpdatePatientProfile={(prof) => {
              setPatientName(prof.name);
              setPatientPhone(prof.phone);
              setActivePlanId(prof.planId);
            }}
          />
        )}

        {/* VIEW 7: CLINIC EXPERIENCE */}
        {(currentTab === 'clinic_dashboard' || currentTab === 'clinic_landing') && (
          <ClinicPortalView onBackToPatient={() => setCurrentTab('home')} />
        )}

        {/* VIEW 8: ADMIN EXPERIENCE */}
        {currentTab === 'admin_dashboard' && (
          <AdminPortalView onBackToPatient={() => setCurrentTab('home')} />
        )}
      </main>

      {/* Booking Modal */}
      {bookingModalOpen && selectedProfessional && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          professional={selectedProfessional}
          initialService={bookingService}
          activePlanId={activePlanId}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Cliniq Assistant Modal (AI Intent Parser) */}
      <CliniqAssistantModal
        isOpen={assistantModalOpen}
        onClose={() => setAssistantModalOpen(false)}
        initialQuery={quickSearchInput}
        onApplySearch={handlePerformSearch}
      />

      {/* LGPD Modal */}
      <LGPDModal
        isOpen={lgpdModalOpen}
        onClose={() => setLgpdModalOpen(false)}
        onClearUserData={handleClearUserData}
      />

      {/* Footer */}
      <footer className="border-t border-[#E6E5DE] bg-white py-10 px-4 text-xs text-[#68706D] mt-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-extrabold text-base text-[#1A1C1A] tracking-tight">CLINIQ</span>
              <p className="text-[11px] text-[#838A87]">
                Encontre quem atende seu plano. Agende sem complicação.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-medium text-[#48504C]">
              <button onClick={() => setCurrentTab('search')} className="hover:text-[#0F5A47]">
                Buscar atendimento
              </button>
              <button onClick={() => setCurrentTab('clinic_dashboard')} className="hover:text-[#0F5A47]">
                Área da clínica
              </button>
              <button onClick={() => setCurrentTab('patient_dashboard')} className="hover:text-[#0F5A47]">
                Minha conta
              </button>
              <button onClick={() => setCurrentTab('admin_dashboard')} className="hover:text-[#0F5A47]">
                Admin Cliniq
              </button>
              <button onClick={() => setLgpdModalOpen(true)} className="hover:text-[#0F5A47] underline">
                Privacidade & LGPD
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0EFEA] text-[11px] text-[#838A87] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              © {new Date().getFullYear()} Cliniq Brasil. {PROTOTYPE_DISCLAIMER}
            </p>
            <p>
              A Cliniq é uma plataforma de tecnologia e descoberta e não presta serviços médicos nem realiza diagnósticos.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pendingRequestsCount={pendingRequestsCount}
      />
    </div>
  );
}
