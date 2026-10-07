import React, { useState } from 'react';
import { 
  Star, MapPin, Calendar, Clock, Phone, MessageSquare, 
  ArrowLeft, CheckCircle2, ShieldCheck, Check, Info, 
  ExternalLink, ThumbsUp, Building2, User, Car, Footprints, Navigation, Bus
} from 'lucide-react';
import { Professional, ProfessionalService } from '../types';
import { CliniqVerifiedBadge } from './CliniqVerifiedBadge';
import { DistanceService, TravelEstimate } from '../services/distanceService';

interface Props {
  professional: Professional;
  activePlanId: string;
  onBack: () => void;
  onBook: (service?: ProfessionalService) => void;
  onContactWhatsApp: () => void;
  searchedLocation?: string;
}

export const ProfileView: React.FC<Props> = ({
  professional,
  activePlanId,
  onBack,
  onBook,
  onContactWhatsApp,
  searchedLocation = 'Pinheiros, São Paulo',
}) => {
  const [selectedPlanTab, setSelectedPlanTab] = useState<string>('all');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportSent, setReportSent] = useState<boolean>(false);
  const [reportIssueType, setReportIssueType] = useState<string>('plano_nao_atende');
  const [reportNotes, setReportNotes] = useState<string>('');

  const matchedPlan = professional.acceptedPlans.find(p => p.planId === activePlanId);

  // Dynamic travel estimate from patient's location
  const travel: TravelEstimate = DistanceService.calculateTravelEstimate(
    searchedLocation,
    professional
  );

  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    searchedLocation || 'São Paulo, SP'
  )}&destination=${encodeURIComponent(
    `${professional.clinicName}, ${professional.address}, ${professional.neighborhood}, ${professional.city} - ${professional.state}`
  )}`;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in-up">
      {/* Top back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#48504C] hover:text-[#0F5A47] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar aos resultados</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E6E5DE] shadow-xs animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-[#E8F3EE] text-[#0F5A47] font-bold text-xl md:text-2xl flex items-center justify-center shrink-0 border border-[#D0E2D9]">
              {professional.gender === 'f' ? 'Dra.' : 'Dr.'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-[#1A1C1A]">
                  {professional.name}
                </h1>
                <span className="text-xs text-[#68706D] font-mono">
                  {professional.cro}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#0F5A47]">
                {professional.specialty}
              </p>
              <p className="text-xs text-[#525A56] flex items-center gap-1.5 pt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#838A87]" />
                <span>{professional.clinicName}</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 text-[#838A87]" />
                <span>{professional.neighborhood}, {professional.city} ({professional.distanceKm} km)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-bold text-[#1A1C1A] bg-[#FAF9F5] px-3 py-1.5 rounded-xl border border-[#E7E5DF]">
                <Star className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
                <span>{professional.rating.toFixed(1)}</span>
                <span className="text-xs text-[#838A87] font-normal">
                  ({professional.reviewCount} avaliações)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onContactWhatsApp}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5D8D4] text-xs font-semibold text-[#2C312E] hover:bg-[#FAF9F5] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => onBook()}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold hover:bg-[#0c4738] active:scale-[0.99] transition-all shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar consulta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cliniq Verified Audit Section */}
        <div className="mt-6 pt-5 border-t border-[#F0EFEA] bg-[#FAF9F5] -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8 rounded-b-3xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CliniqVerifiedBadge verification={professional.verification} showDetailsButton={true} />
              <span className="text-xs text-[#68706D]">
                · Auditoria realizada em {professional.verification.lastUpdatedDate}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="text-[11px] text-[#68706D] hover:text-[#B45309] underline self-start sm:self-auto"
            >
              Reportar dado desatualizado
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#E7E5DF]">
              <span className="text-[11px] text-[#68706D] block">Plano ativo</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <strong className="text-[#1A1C1A] font-semibold truncate">
                  {matchedPlan?.planName || 'Confirmado'}
                </strong>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E7E5DF]">
              <span className="text-[11px] text-[#68706D] block">Telefone consultório</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <strong className="text-[#1A1C1A] font-semibold truncate">{professional.phone}</strong>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E7E5DF]">
              <span className="text-[11px] text-[#68706D] block">WhatsApp de apoio</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <strong className="text-[#1A1C1A] font-semibold truncate">{professional.whatsapp}</strong>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E7E5DF]">
              <span className="text-[11px] text-[#68706D] block">Sucesso com plano</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <strong className="text-[#1A1C1A] font-semibold">{professional.scores.planMatchRate}% confirmados</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: About, Specialties, Services, Location */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E6E5DE] space-y-3">
            <h2 className="text-base font-bold text-[#1A1C1A]">Sobre</h2>
            <p className="text-sm text-[#48504C] leading-relaxed">
              {professional.about}
            </p>

            <div className="pt-3">
              <h3 className="text-xs font-semibold text-[#1A1C1A] mb-2">Especialidades e áreas de foco</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-[#FAF9F5] border border-[#E7E5DF] text-[#2C312E] font-medium">
                  {professional.specialty}
                </span>
                {professional.secondarySpecialties.map((spec, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-[#FAF9F5] border border-[#E7E5DF] text-[#48504C]">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E6E5DE] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1C1A]">Serviços oferecidos</h2>
              <span className="text-xs text-[#68706D]">{professional.services.length} procedimentos</span>
            </div>

            <div className="space-y-3">
              {professional.services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] hover:border-[#0F5A47]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#1A1C1A]">
                        {svc.name}
                      </h3>
                      {svc.coveredByDefault && (
                        <span className="text-[10px] font-semibold text-[#0F5A47] bg-[#E8F3EE] px-2 py-0.5 rounded-md">
                          Coberto pelo plano
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#68706D] leading-relaxed">
                      {svc.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#838A87] pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#0F5A47]" />
                      <span>Duração estimada: ~{svc.durationMinutes} min</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBook(svc)}
                    className="self-start sm:self-center px-4 py-2 bg-white hover:bg-[#0F5A47] hover:text-white border border-[#D5D8D4] hover:border-[#0F5A47] text-xs font-semibold text-[#1A1C1A] rounded-xl transition-all shrink-0"
                  >
                    Agendar este
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Planos aceitos */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E6E5DE] space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#1A1C1A]">Planos aceitos</h2>
              <p className="text-xs text-[#68706D] mt-0.5">
                Status de credenciamento auditado diretamente com a equipe do consultório.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {professional.acceptedPlans.map((plan) => (
                <div
                  key={plan.planId}
                  className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <h3 className="text-xs font-bold text-[#1A1C1A]">
                        {plan.planName}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#68706D] mt-1">
                      {plan.copayRule || 'Cobertura integral para consultas e procedimentos previstos em rol'}
                    </p>
                    <span className="text-[10px] text-[#838A87] block mt-1">
                      Auditado em {plan.lastVerified}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Location & Simulated Map */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E6E5DE] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#1A1C1A]">Localização e Acesso</h2>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0F5A47] hover:underline flex items-center gap-1"
              >
                <span>Traçar rota</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="text-xs text-[#48504C] space-y-1">
              <p className="font-semibold text-sm text-[#1A1C1A]">{professional.clinicName}</p>
              <p>{professional.address}</p>
              <p>{professional.neighborhood} · {professional.city} — {professional.state}</p>
            </div>

            {/* Travel Mobility Estimates from Patient Location */}
            <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E7E5DF] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#525A56] flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#0F5A47]" />
                  <span>Deslocamento a partir de:</span>
                </span>
                <span className="text-[11px] font-bold text-[#1A1C1A]">{travel.originDisplayName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-[#E0DFD8] flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0F5A47] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#68706D] block uppercase font-bold tracking-wider">De carro</span>
                    <strong className="text-xs text-[#1A1C1A]">{travel.drivingDurationMinutes} min ({travel.drivingDistanceKm} km)</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-[#E0DFD8] flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#0F5A47] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#68706D] block uppercase font-bold tracking-wider">A pé</span>
                    <strong className="text-xs text-[#1A1C1A]">{travel.walkingDurationMinutes} min ({travel.walkingDistanceKm} km)</strong>
                  </div>
                </div>
              </div>

              {travel.isWalkable ? (
                <div className="flex items-center gap-1.5 text-[11px] text-[#0F5A47] font-semibold bg-[#E8F3EE] p-2 rounded-xl">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{travel.walkingWalkabilityLabel || 'Excelente para ir a pé'} (~{travel.walkingDurationMinutes} min)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-[#68706D] bg-white p-2 rounded-xl border border-[#E7E5DF]">
                  <Bus className="w-3.5 h-3.5 text-[#0F5A47]" />
                  <span>Transporte público: {travel.transitDisplay}</span>
                </div>
              )}

              {travel.nearestMetro && (
                <div className="flex items-center gap-2 text-[11px] text-[#4B5563] bg-white p-2 rounded-xl border border-[#E7E5DF]">
                  <Navigation className="w-3.5 h-3.5 text-[#0F5A47] shrink-0" />
                  <span className="truncate">{travel.nearestMetro.displayText}</span>
                </div>
              )}
            </div>

            {/* Simulated Map */}
            <div className="w-full h-48 rounded-2xl bg-[#EBECE9] relative overflow-hidden border border-[#DCDFD9] flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Simulated Map Road Geometry */}
              <div className="absolute w-full h-3 bg-white top-1/2 -translate-y-1/2 opacity-70" />
              <div className="absolute h-full w-3 bg-white left-1/3 opacity-70" />
              <div className="absolute h-full w-2 bg-[#D5D8D4] left-2/3 opacity-70" />

              {/* Pin */}
              <div className="relative z-10 flex flex-col items-center animate-bounce">
                <div className="p-2.5 rounded-full bg-[#0F5A47] text-white shadow-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="mt-1 px-2.5 py-0.5 rounded-md bg-white text-[10px] font-bold text-[#1A1C1A] shadow-md border border-[#E7E5DF]">
                  {professional.clinicName}
                </div>
              </div>

              <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-xs rounded text-[10px] text-[#68706D]">
                Mapa demonstrativo simulado
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reviews breakdown & Booking Sticky CTA */}
        <div className="space-y-6">
          {/* Quick Booking Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E5DE] shadow-xs space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#68706D]">Próximo horário</span>
              <span className="text-xs font-bold text-[#0F5A47] bg-[#E8F3EE] px-2 py-0.5 rounded-md">
                Disponível
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E7E5DF] text-center">
              <p className="text-xs text-[#68706D]">Data mais próxima</p>
              <p className="text-lg font-bold text-[#1A1C1A] mt-0.5">
                {professional.nextAvailableSlot.displayDate}
              </p>
              <p className="text-sm font-semibold text-[#0F5A47] mt-0.5">
                às {professional.nextAvailableSlot.time}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onBook()}
              className="w-full py-3 px-4 bg-[#0F5A47] text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-[#0c4738] active:scale-[0.99] transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Solicitar agendamento</span>
            </button>

            <p className="text-[11px] text-[#838A87] text-center leading-tight">
              Confirmação rápida por WhatsApp ou ligação da clínica.
            </p>

            {/* Separated Granular Reviews Breakdown */}
            <div className="pt-4 border-t border-[#F0EFEA] space-y-4">
              <h3 className="text-xs font-bold text-[#1A1C1A]">Avaliações auditadas</h3>

              {/* Profissional */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-[#2C312E] block">Atendimento Profissional</span>
                <div className="space-y-1 text-[#68706D]">
                  <div className="flex justify-between">
                    <span>Atendimento geral:</span>
                    <span className="font-semibold text-[#1A1C1A]">{professional.scores.atendimento.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clareza nas orientações:</span>
                    <span className="font-semibold text-[#1A1C1A]">{professional.scores.clareza.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pontualidade:</span>
                    <span className="font-semibold text-[#1A1C1A]">{professional.scores.pontualidade.toFixed(1)} / 5</span>
                  </div>
                </div>
              </div>

              {/* Clínica */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-[#F0EFEA]">
                <span className="font-semibold text-[#2C312E] block">Estrutura da Clínica</span>
                <div className="space-y-1 text-[#68706D]">
                  <div className="flex justify-between">
                    <span>Recepção e acolhimento:</span>
                    <span className="font-semibold text-[#1A1C1A]">{professional.scores.recepcao.toFixed(1)} / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organização e limpeza:</span>
                    <span className="font-semibold text-[#1A1C1A]">{professional.scores.organizacao.toFixed(1)} / 5</span>
                  </div>
                </div>
              </div>

              {/* Plano de saúde */}
              <div className="p-3 rounded-2xl bg-[#E8F3EE] border border-[#D0E2D9] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0F5A47]">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Utilização do plano</span>
                </div>
                <p className="text-[#3A4A43] text-[11px] leading-relaxed">
                  <strong>{professional.scores.planMatchRate}%</strong> dos pacientes confirmaram que conseguiram utilizar o plano sem divergência de cobrança.
                </p>
              </div>

              {/* Patient comments */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-semibold text-[#68706D] block">Depoimentos recentes:</span>
                {professional.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E7E5DF] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <strong className="font-semibold text-[#1A1C1A]">{rev.author}</strong>
                      <span className="text-[10px] text-[#838A87]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#EAB308]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#EAB308]" />
                      ))}
                      <span className="text-[10px] font-medium text-[#0F5A47] ml-1">
                        · Plano: {rev.planUsed}
                      </span>
                    </div>
                    <p className="text-[#48504C] text-[11px] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Outdated Info Modal */}
      {reportModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setReportModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E7E5DF] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-[#1A1C1A]">Reportar informação incorreta</h3>
            <p className="text-xs text-[#68706D]">
              Ajude a manter a Cliniq transparente e precisa para toda a comunidade de pacientes.
            </p>

            {reportSent ? (
              <div className="p-4 rounded-xl bg-[#E8F3EE] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#0F5A47] mx-auto" />
                <p className="text-xs font-semibold text-[#0F5A47]">Obrigado pelo seu relato!</p>
                <p className="text-[11px] text-[#48504C]">
                  Nossa equipe de auditoria irá checar o credenciamento junto à clínica em até 24h úteis.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setReportSent(false);
                    setReportModalOpen(false);
                  }}
                  className="mt-2 px-4 py-2 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Qual o motivo?</label>
                  <select
                    value={reportIssueType}
                    onChange={(e) => setReportIssueType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  >
                    <option value="plano_nao_atende">Clínica não atende mais o plano indicado</option>
                    <option value="telefone_desatualizado">Telefone ou WhatsApp desatualizado</option>
                    <option value="horario_invalido">Horários ou endereço incorretos</option>
                    <option value="outro">Outro apontamento</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#2C312E] block mb-1">Detalhes adicionais:</label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Ex.: Liguei lá hoje e a recepcionista disse que suspenderam o convênio mês passado..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5D8D4]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-[#D5D8D4] text-xs text-[#48504C]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportSent(true)}
                    className="flex-1 py-2 rounded-xl bg-[#0F5A47] text-white text-xs font-semibold"
                  >
                    Enviar reporte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
