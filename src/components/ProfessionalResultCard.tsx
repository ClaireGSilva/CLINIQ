import React, { useState } from 'react';
import { 
  Star, Calendar, Clock, ShieldCheck, 
  ChevronRight, Heart, Car, Footprints, Navigation, 
  ExternalLink, ChevronDown, ChevronUp, Train,
  Building2, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { Professional, AcceptedPlanDetail } from '../types';
import { MobilityService } from '../services/mobilityService';
import { NormalizedMobilityResult } from '../types/mobility';

interface Props {
  professional: Professional;
  searchedLocation: string;
  selectedPlanId?: string;
  activePlanName?: string;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelectProfessional: (pro: Professional) => void;
  onBookProfessional: (pro: Professional) => void;
  index?: number;
  preferredTravelMode?: 'all' | 'driving' | 'walking';
}

export const ProfessionalResultCard: React.FC<Props> = ({
  professional,
  searchedLocation,
  selectedPlanId,
  activePlanName,
  isSaved = false,
  onToggleSave,
  onSelectProfessional,
  onBookProfessional,
  index = 0,
  preferredTravelMode = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'driving' | 'walking'>(
    preferredTravelMode === 'walking' ? 'walking' : 'driving'
  );
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false);

  // Consume normalized mobility data with stale-data protection
  const mobility: NormalizedMobilityResult = MobilityService.calculateMobility(
    searchedLocation,
    professional
  );

  const planDetail: AcceptedPlanDetail | undefined = professional.acceptedPlans.find(
    p => p.planId === selectedPlanId
  );
  const isPlanConfirmed = planDetail?.status === 'confirmed';

  // Real Google Maps direct deep link for patient GPS routing
  const mapsDirectionsUrl = activeTab === 'walking'
    ? mobility.directionsUrl.walking
    : mobility.directionsUrl.driving;

  // Traffic badge styling - honest display based on heuristic SP model
  const getTrafficBadge = (status: NormalizedMobilityResult['driving']['trafficStatus']) => {
    switch (status) {
      case 'Trânsito livre':
        return { label: 'Trânsito livre', color: 'text-[#0F5A47] bg-[#E8F3EE] border-[#CDE3D8]' };
      case 'Trânsito intenso':
        return { label: 'Trânsito intenso', color: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]' };
      default:
        return { label: 'Trânsito normal', color: 'text-[#4B5563] bg-[#F3F4F6] border-[#E5E7EB]' };
    }
  };

  const trafficInfo = getTrafficBadge(mobility.driving.trafficStatus);

  return (
    <article
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
      className="bg-white rounded-3xl p-5 md:p-6 border border-[#E6E5DE] hover:border-[#0F5A47]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between animate-fade-in-up group relative"
    >
      <div className="space-y-4">
        {/* Top Header: Doctor, Specialty, Clinic, Rating, Favorite */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Doctor Avatar / Monogram */}
            <div 
              onClick={() => onSelectProfessional(professional)}
              className="w-12 h-12 rounded-2xl bg-[#E8F3EE] text-[#0F5A47] font-bold text-sm flex items-center justify-center shrink-0 border border-[#D0E2D9] group-hover:scale-105 transition-transform cursor-pointer shadow-2xs"
            >
              {professional.gender === 'f' ? 'Dra.' : 'Dr.'}
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 
                  onClick={() => onSelectProfessional(professional)}
                  className="text-base font-bold text-[#1A1C1A] hover:text-[#0F5A47] cursor-pointer transition-colors truncate"
                  title={professional.name}
                >
                  {professional.name}
                </h2>
                <span className="text-[10px] text-[#68706D] font-mono bg-[#FAF9F5] px-1.5 py-0.5 rounded-md border border-[#E6E5DE]">
                  {professional.cro}
                </span>

                {onToggleSave && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(professional.id);
                    }}
                    className={`p-1 rounded-md transition-colors ${
                      isSaved ? 'text-[#DC2626]' : 'text-[#A0A6A3] hover:text-[#DC2626]'
                    }`}
                    aria-label={isSaved ? `Remover ${professional.name} dos favoritos` : `Salvar ${professional.name} nos favoritos`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>

              <p className="text-xs font-semibold text-[#0F5A47] truncate">
                {professional.specialty}
              </p>

              <div className="flex items-center gap-1 text-[11px] text-[#525A56] truncate">
                <Building2 className="w-3 h-3 text-[#838A87] shrink-0" />
                <span className="truncate">{professional.clinicName}</span>
                <span className="text-[#A0A6A3]">·</span>
                <span className="text-[#68706D]">{professional.neighborhood}</span>
              </div>
            </div>
          </div>

          {/* Rating & Match Rate */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end text-xs font-bold text-[#1A1C1A] bg-[#FAF9F5] px-2 py-1 rounded-xl border border-[#E7E5DF]">
              <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
              <span>{professional.rating.toFixed(1)}</span>
              <span className="text-[#838A87] font-normal text-[10px]">({professional.reviewCount})</span>
            </div>
            <span className="text-[10px] text-[#0F5A47] font-semibold block mt-1">
              {professional.scores.planMatchRate}% satisfação
            </span>
          </div>
        </div>

        {/* Dynamic Mobility & Distance Calculation Module */}
        <div className="bg-[#FAF9F5] rounded-2xl p-3.5 border border-[#E7E5DF] space-y-2.5">
          {/* Origin Location Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#525A56]">
              <Navigation className="w-3.5 h-3.5 text-[#0F5A47]" />
              <span>Distância a partir de:</span>
              <strong 
                className="text-[#1A1C1A] underline decoration-[#0F5A47]/40 truncate max-w-[140px] sm:max-w-[180px]" 
                title={mobility.origin.displayName}
              >
                {mobility.origin.displayName}
              </strong>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#0F5A47] bg-[#E8F3EE] px-2 py-0.5 rounded-full font-medium border border-[#D0E2D9]">
                Tempo estimado
              </span>
              <button
                type="button"
                onClick={() => setShowDataSourceInfo(!showDataSourceInfo)}
                className="text-[#838A87] hover:text-[#0F5A47] p-0.5 transition-colors"
                title="Transparência: fonte dos dados de mobilidade"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Transparent Source Banner (Codester Compliance) */}
          {showDataSourceInfo && (
            <div className="p-2.5 rounded-xl bg-white border border-[#E2E1D9] text-[10px] space-y-1 animate-fade-in-up">
              <div className="flex items-center justify-between font-bold text-[#1A1C1A]">
                <span>Transparência da Informação</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FAF9F5] text-[#0F5A47] border border-[#E6E5DE]">
                  {mobility.isDemo ? 'Modelo Heurístico SP' : 'API em Tempo Real'}
                </span>
              </div>
              <p className="text-[#68706D] leading-tight">
                Origem: <strong>{mobility.origin.displayName}</strong> · Destino: <strong>{professional.clinicName}</strong> ({professional.neighborhood}).
              </p>
              <p className="text-[#838A87] leading-tight">
                Cálculo via malha urbana e topologia viária paulistana (Haversine ajustado). Tráfego e acessibilidade são estimativas baseadas em limites de velocidade e fluxo urbano.
              </p>
            </div>
          )}

          {/* Dual Travel Mode Comparison (Driving vs Walking) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Driving Option Card */}
            <button
              type="button"
              onClick={() => setActiveTab('driving')}
              className={`p-2.5 rounded-xl text-left transition-all relative ${
                activeTab === 'driving'
                  ? 'bg-white border-2 border-[#0F5A47] shadow-xs'
                  : 'bg-white/70 border border-[#E0DFD8] hover:bg-white text-[#525A56]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-lg ${activeTab === 'driving' ? 'bg-[#E8F3EE] text-[#0F5A47]' : 'bg-[#F0EFEA] text-[#68706D]'}`}>
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#68706D]">
                    De carro
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#68706D]">
                  {mobility.driving.distanceKm.toFixed(1).replace('.', ',')} km
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-base font-bold text-[#1A1C1A] leading-none">
                  {mobility.driving.durationMinutes} <span className="text-xs font-medium text-[#68706D]">min</span>
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-medium ${trafficInfo.color}`}>
                  {trafficInfo.label}
                </span>
              </div>
            </button>

            {/* Walking Option Card */}
            <button
              type="button"
              onClick={() => setActiveTab('walking')}
              className={`p-2.5 rounded-xl text-left transition-all relative ${
                activeTab === 'walking'
                  ? 'bg-white border-2 border-[#0F5A47] shadow-xs'
                  : 'bg-white/70 border border-[#E0DFD8] hover:bg-white text-[#525A56]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1 rounded-lg ${activeTab === 'walking' ? 'bg-[#E8F3EE] text-[#0F5A47]' : 'bg-[#F0EFEA] text-[#68706D]'}`}>
                    <Footprints className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#68706D]">
                    A pé
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#68706D]">
                  {mobility.walking.distanceKm < 1.0 
                    ? `${mobility.walking.distanceMeters} m` 
                    : `${mobility.walking.distanceKm.toFixed(1).replace('.', ',')} km`}
                </span>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="text-base font-bold text-[#1A1C1A] leading-none">
                  {mobility.walking.durationMinutes} <span className="text-xs font-medium text-[#68706D]">min</span>
                </span>
                {mobility.walking.isWalkable ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#E8F3EE] text-[#0F5A47] border border-[#CDE3D8] font-semibold">
                    {mobility.walking.category}
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
                    +30 min a pé
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Transit / Subway Connection Proximity */}
          {mobility.publicTransit && (
            <div className="flex items-center gap-2 text-[11px] text-[#4B5563] bg-white px-2.5 py-1.5 rounded-xl border border-[#E7E5DF]">
              <Train className="w-3.5 h-3.5 text-[#0F5A47] shrink-0" />
              <span className="truncate">
                {mobility.publicTransit.displayText}
              </span>
            </div>
          )}

          {/* Route Details Toggle & External Google Maps Directions Link */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <button
              type="button"
              onClick={() => setShowRouteDetails(!showRouteDetails)}
              className="text-[11px] text-[#0F5A47] hover:underline font-semibold flex items-center gap-1"
            >
              <span>{showRouteDetails ? 'Ocultar detalhes da rota' : 'Ver rota e direções'}</span>
              {showRouteDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#0F5A47] font-bold hover:underline"
              title="Abrir navegação no Google Maps com sua origem e destino exatos"
            >
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Expandable Route Details Preview */}
          {showRouteDetails && (
            <div className="pt-2 border-t border-[#E8E7DF] space-y-2 animate-fade-in-up">
              <div className="bg-white p-2.5 rounded-xl border border-[#E7E5DF] text-[11px] space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6] mt-1 shrink-0" />
                  <p className="leading-tight text-[#4B5563]">
                    <strong className="text-[#1A1C1A]">Origem pesquisada:</strong> {mobility.origin.address}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] mt-1 shrink-0" />
                  <p className="leading-tight text-[#4B5563]">
                    <strong className="text-[#1A1C1A]">Destino:</strong> {professional.clinicName} — {professional.address}, {professional.neighborhood}
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-[#68706D] leading-tight">
                {activeTab === 'driving'
                  ? `Rota calculada de carro (~${mobility.driving.durationMinutes} min com fluxo urbano típico em SP).`
                  : `Rota calculada para pedestre (~${mobility.walking.durationMinutes} min via travessias e calçadas regulares).`}
              </p>
            </div>
          )}
        </div>

        {/* Verification, Insurance Plan & Next Slot Strip */}
        <div className="space-y-2 text-xs">
          {/* Plan Coverage Status */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E7E5DF]">
            <span className="text-[#68706D] text-[11px]">Plano selecionado:</span>
            <div className="flex items-center gap-1.5 font-medium text-[11px]">
              {isPlanConfirmed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5A47]" />
                  <span className="text-[#0F5A47] font-semibold">
                    {planDetail?.planName || activePlanName} confirmado
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
                  <span className="text-[#B45309]">
                    {activePlanName ? `${activePlanName} · Sob confirmação` : 'Consultar cobertura'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Verification & Reception Status */}
          <div className="flex items-center justify-between px-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#0F5A47] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F5A47]" />
              <span>Cliniq Verified</span>
            </div>

            <div className="flex items-center gap-1.5 text-[#525A56]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>WhatsApp e recepção auditados</span>
            </div>
          </div>

          {/* Next Available Slot Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E7E5DF]">
            <div className="flex items-center gap-1.5 text-[#404744] text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#0F5A47]" />
              <span className="font-medium">Próximo horário:</span>
            </div>
            <span className="font-bold text-xs text-[#1A1C1A]">
              {professional.nextAvailableSlot.displayDate} · {professional.nextAvailableSlot.time}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3.5 border-t border-[#F0EFEA] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectProfessional(professional)}
          className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl border border-[#D5D8D4] text-[#2C312E] hover:bg-[#FAF9F5] hover:border-[#0F5A47]/40 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Ver perfil completo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onBookProfessional(professional)}
          className="flex-1 py-2.5 px-4 bg-[#0F5A47] hover:bg-[#0c4738] active:scale-[0.99] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agendar consulta</span>
        </button>
      </div>
    </article>
  );
};
