import React, { useState, useMemo } from 'react';
import { 
  Star, MapPin, Calendar, Clock, SlidersHorizontal, 
  ArrowUpDown, Check, X, ShieldCheck, ChevronRight, MessageSquare, 
  Heart, Car, Footprints, Navigation, Sparkles, RefreshCw
} from 'lucide-react';
import { Professional, SearchState } from '../types';
import { DENTAL_PLANS, DENTAL_NEEDS } from '../data/mockData';
import { DistanceService, TravelEstimate } from '../services/distanceService';
import { ProfessionalResultCard } from './ProfessionalResultCard';
import { EmptyState } from './ui/EmptyState';
import { ResultsGridSkeleton } from './ui/LoadingSkeleton';

interface Props {
  professionals: Professional[];
  searchState: SearchState;
  onSelectProfessional: (pro: Professional) => void;
  onBookProfessional: (pro: Professional) => void;
  onModifySearch: () => void;
  savedProviderIds?: string[];
  onToggleSaveProvider?: (id: string) => void;
  isLoading?: boolean;
}

export const ResultsView: React.FC<Props> = ({
  professionals,
  searchState,
  onSelectProfessional,
  onBookProfessional,
  onModifySearch,
  savedProviderIds = [],
  onToggleSaveProvider,
  isLoading = false,
}) => {
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>(searchState.planId || 'all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyWhatsapp, setOnlyWhatsapp] = useState<boolean>(false);
  const [travelModeFilter, setTravelModeFilter] = useState<'all' | 'driving' | 'walking'>(
    searchState.travelMode || 'all'
  );
  const [sortBy, setSortBy] = useState<'closest' | 'closest_walking' | 'next_slot' | 'best_rated'>('closest');
  const [mobileFilterDrawerOpen, setMobileFilterDrawerOpen] = useState<boolean>(false);

  // Active searched location with quick-switcher capability
  const [currentLocation, setCurrentLocation] = useState<string>(
    searchState.location || 'Pinheiros, São Paulo'
  );
  const [isChangingLocation, setIsChangingLocation] = useState<boolean>(false);
  const [customLocationInput, setCustomLocationInput] = useState<string>('');

  const activePlanObj = DENTAL_PLANS.find(
    p => p.id === (selectedPlanFilter !== 'all' ? selectedPlanFilter : searchState.planId)
  );
  const activeNeedObj = DENTAL_NEEDS.find(n => n.id === searchState.needId);

  const POPULAR_LOCATIONS = [
    'Pinheiros, São Paulo',
    'Av. Paulista, São Paulo',
    'Jardins, São Paulo',
    'Moema, São Paulo',
    'Vila Mariana, São Paulo',
    'Santana, São Paulo',
    'Itaim Bibi, São Paulo',
    'Vila Olímpia, São Paulo',
    'Perdizes, São Paulo',
  ];

  // Map each professional with its calculated travel estimate from the user's location
  const professionalsWithTravel = useMemo(() => {
    return professionals.map(pro => {
      const travel = DistanceService.calculateTravelEstimate(currentLocation, pro);
      return {
        pro,
        travel,
      };
    });
  }, [professionals, currentLocation]);

  // Filter & sort logic using calculated driving & walking metrics
  const filteredProfessionalsWithTravel = useMemo(() => {
    return professionalsWithTravel.filter(({ pro, travel }) => {
      // 1. Plan check
      if (selectedPlanFilter !== 'all') {
        const hasPlan = pro.acceptedPlans.some(p => p.planId === selectedPlanFilter);
        if (!hasPlan) return false;
      }

      // 2. Specialty check
      if (selectedSpecialty !== 'all') {
        const matchesMain = pro.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
        const matchesSec = pro.secondarySpecialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
        if (!matchesMain && !matchesSec) return false;
      }

      // 3. Travel mode constraint
      if (travelModeFilter === 'walking') {
        // Only show clinics reachable comfortably on foot (<= 32 min or <= 2.5 km)
        if (!travel.isWalkable) return false;
      }

      // 4. Distance check based on calculated driving distance
      if (travel.drivingDistanceKm > maxDistance) return false;

      // 5. Rating check
      if (pro.rating < minRating) return false;

      // 6. Verified only
      if (onlyVerified && pro.verification.status !== 'confirmed') return false;

      // 7. Whatsapp check
      if (onlyWhatsapp && !pro.verification.whatsappActive) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'closest') return a.travel.drivingDistanceKm - b.travel.drivingDistanceKm;
      if (sortBy === 'closest_walking') return a.travel.walkingDurationMinutes - b.travel.walkingDurationMinutes;
      if (sortBy === 'best_rated') return b.pro.rating - a.pro.rating;
      if (sortBy === 'next_slot') return a.pro.nextAvailableSlot.date.localeCompare(b.pro.nextAvailableSlot.date);
      return 0;
    });
  }, [professionalsWithTravel, selectedPlanFilter, selectedSpecialty, travelModeFilter, maxDistance, minRating, onlyVerified, onlyWhatsapp, sortBy]);

  const handleApplyCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      setCurrentLocation(customLocationInput.trim());
      setIsChangingLocation(false);
      setCustomLocationInput('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-fade-in-up">
      {/* Top Banner & Search Summary with Dynamic Location Context */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E6E5DE] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#68706D] flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-[#1A1C1A] bg-[#FAF9F5] px-2.5 py-1 rounded-lg border border-[#E6E5DE]">
                <MapPin className="w-3.5 h-3.5 text-[#0F5A47]" />
                <span>{currentLocation}</span>
              </span>
              <span>·</span>
              <span>{activeNeedObj?.label || 'Odontologia Geral'}</span>
              <span>·</span>
              <span className="font-semibold text-[#0F5A47]">{activePlanObj?.name || 'Convênio'}</span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1A1C1A]">
              Encontramos {filteredProfessionalsWithTravel.length} opções perto de você
            </h1>
            <p className="text-xs text-[#68706D] leading-relaxed">
              Distâncias e tempos de <strong>carro</strong> e <strong>a pé</strong> calculados dinamicamente a partir de{' '}
              <span className="text-[#1A1C1A] font-semibold">{currentLocation.split(',')[0]}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsChangingLocation(!isChangingLocation)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#0F5A47]/30 bg-[#E8F3EE] text-[#0F5A47] hover:bg-[#D8ECE2] transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Trocar ponto de partida</span>
            </button>

            <button
              type="button"
              onClick={onModifySearch}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#D5D8D4] text-[#2C312E] hover:bg-[#FAF9F5] transition-colors"
            >
              Alterar busca
            </button>

            <button
              type="button"
              onClick={() => setMobileFilterDrawerOpen(true)}
              className="md:hidden flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#0F5A47] text-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Quick Location Switcher Bar */}
        {isChangingLocation && (
          <div className="mt-4 pt-4 border-t border-[#F0EFEA] space-y-3 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#1A1C1A]">Selecione ou digite seu bairro / endereço de partida:</span>
              <form onSubmit={handleApplyCustomLocation} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={(e) => setCustomLocationInput(e.target.value)}
                  placeholder="Ex.: Rua Oscar Freire, Moema, etc."
                  className="text-xs px-3 py-1.5 rounded-xl border border-[#D5D8D4] bg-[#FAF9F5] text-[#1A1C1A] focus:outline-hidden focus:ring-1 focus:ring-[#0F5A47] w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738] shrink-0"
                >
                  Calcular
                </button>
              </form>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#68706D] font-medium mr-1">Bairros frequentes:</span>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setCurrentLocation(loc);
                    setIsChangingLocation(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    currentLocation === loc
                      ? 'bg-[#0F5A47] text-white border-[#0F5A47] font-semibold'
                      : 'bg-white border-[#D5D8D4] text-[#48504C] hover:bg-[#FAF9F5]'
                  }`}
                >
                  {loc.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Mobility & Filter Bar */}
        <div className="hidden md:flex items-center justify-between pt-4 mt-4 border-t border-[#F0EFEA] text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Travel Mode Toggle: All / Driving / Walking */}
            <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E0DFD8]">
              <button
                type="button"
                onClick={() => setTravelModeFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  travelModeFilter === 'all'
                    ? 'bg-white text-[#1A1C1A] shadow-xs'
                    : 'text-[#68706D] hover:text-[#1A1C1A]'
                }`}
              >
                Todos os trajetos
              </button>

              <button
                type="button"
                onClick={() => {
                  setTravelModeFilter('driving');
                  setSortBy('closest');
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  travelModeFilter === 'driving'
                    ? 'bg-white text-[#0F5A47] shadow-xs'
                    : 'text-[#68706D] hover:text-[#1A1C1A]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>De carro</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTravelModeFilter('walking');
                  setSortBy('closest_walking');
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  travelModeFilter === 'walking'
                    ? 'bg-white text-[#0F5A47] shadow-xs'
                    : 'text-[#68706D] hover:text-[#1A1C1A]'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>A pé (&lt; 30 min)</span>
              </button>
            </div>

            {/* Specialty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#68706D]">Especialidade:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-[#FAF9F5] border border-[#D5D8D4] rounded-lg px-2.5 py-1 text-xs text-[#1A1C1A] focus:outline-hidden focus:ring-1 focus:ring-[#0F5A47]"
              >
                <option value="all">Todas</option>
                <option value="Odontologia Geral">Geral</option>
                <option value="Endodontia">Endodontia (Canal)</option>
                <option value="Ortodontia">Ortodontia</option>
                <option value="Implantodontia">Implantes</option>
                <option value="Odontopediatria">Odontopediatria</option>
                <option value="Dentística">Dentística</option>
              </select>
            </div>

            {/* Cliniq Verified toggle */}
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                onlyVerified
                  ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47] font-semibold'
                  : 'border-[#D5D8D4] text-[#404744] hover:bg-[#FAF9F5]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-[#0F5A47]" />
              <span>Apenas Verified</span>
            </button>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#68706D]" />
            <span className="text-[#68706D]">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF9F5] border border-[#D5D8D4] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1A1C1A] focus:outline-hidden"
            >
              <option value="closest">Mais próximos de carro</option>
              <option value="closest_walking">Mais rápidos a pé</option>
              <option value="next_slot">Próxima disponibilidade</option>
              <option value="best_rated">Melhor avaliação</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid List */}
      {isLoading ? (
        <ResultsGridSkeleton />
      ) : filteredProfessionalsWithTravel.length === 0 ? (
        <EmptyState
          type="empty"
          title="Nenhum consultório compatível dentro deste raio"
          description={
            travelModeFilter === 'walking'
              ? 'Não encontramos dentistas credenciados a menos de 30 minutos de caminhada desta localização. Tente selecionar o modo de carro ou aumentar o raio.'
              : 'Experimente aumentar o raio de distância ou desmarcar filtros restritivos para visualizar mais opções credenciadas.'
          }
          actionLabel="Ver opções de carro / raio maior"
          onAction={() => {
            setTravelModeFilter('all');
            setSelectedPlanFilter('all');
            setSelectedSpecialty('all');
            setMaxDistance(25);
            setOnlyVerified(false);
          }}
          secondaryActionLabel="Alterar localização de busca"
          onSecondaryAction={() => setIsChangingLocation(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProfessionalsWithTravel.map(({ pro }, index) => {
            const isSaved = savedProviderIds.includes(pro.id);

            return (
              <ProfessionalResultCard
                key={pro.id}
                professional={pro}
                searchedLocation={currentLocation}
                selectedPlanId={selectedPlanFilter !== 'all' ? selectedPlanFilter : searchState.planId}
                activePlanName={activePlanObj?.name}
                isSaved={isSaved}
                onToggleSave={onToggleSaveProvider}
                onSelectProfessional={onSelectProfessional}
                onBookProfessional={onBookProfessional}
                index={index}
                preferredTravelMode={travelModeFilter}
              />
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Sheet for Filters */}
      {mobileFilterDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileFilterDrawerOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#D5D8D4] rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
              <h3 className="font-bold text-base text-[#1A1C1A]">Filtros e Locomoção</h3>
              <button 
                onClick={() => setMobileFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-[#68706D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Travel Mode Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2C312E] block">Meio de locomoção preferido</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTravelModeFilter('all')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center ${
                    travelModeFilter === 'all'
                      ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47] font-semibold'
                      : 'border-[#D5D8D4] text-[#48504C]'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setTravelModeFilter('driving')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center flex items-center justify-center gap-1 ${
                    travelModeFilter === 'driving'
                      ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47] font-semibold'
                      : 'border-[#D5D8D4] text-[#48504C]'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Carro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTravelModeFilter('walking')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center flex items-center justify-center gap-1 ${
                    travelModeFilter === 'walking'
                      ? 'border-[#0F5A47] bg-[#E8F3EE] text-[#0F5A47] font-semibold'
                      : 'border-[#D5D8D4] text-[#48504C]'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>A pé</span>
                </button>
              </div>
            </div>

            {/* Sort By in Mobile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2C312E] block">Ordenar resultados por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#D5D8D4] text-xs font-medium bg-[#FAF9F5]"
              >
                <option value="closest">Mais próximos de carro</option>
                <option value="closest_walking">Mais rápidos a pé</option>
                <option value="next_slot">Próxima disponibilidade</option>
                <option value="best_rated">Melhor avaliação</option>
              </select>
            </div>

            {/* Filter by Plan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2C312E] block">Plano odontológico</label>
              <select
                value={selectedPlanFilter}
                onChange={(e) => setSelectedPlanFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D5D8D4] text-xs"
              >
                <option value="all">Todos os planos</option>
                {DENTAL_PLANS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by Specialty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2C312E] block">Especialidade</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#D5D8D4] text-xs"
              >
                <option value="all">Todas as especialidades</option>
                <option value="Odontologia Geral">Odontologia Geral</option>
                <option value="Endodontia">Endodontia (Canal)</option>
                <option value="Ortodontia">Ortodontia</option>
                <option value="Implantodontia">Implantodontia</option>
                <option value="Odontopediatria">Odontopediatria</option>
                <option value="Dentística">Dentística</option>
              </select>
            </div>

            {/* Distance slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#2C312E]">Raio máximo de deslocamento</span>
                <span className="text-[#0F5A47] font-semibold">{maxDistance} km de carro</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-[#0F5A47]"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-[#2C312E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded text-[#0F5A47] accent-[#0F5A47] w-4 h-4"
                />
                <span>Exibir apenas Cliniq Verified</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#2C312E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyWhatsapp}
                  onChange={(e) => setOnlyWhatsapp(e.target.checked)}
                  className="rounded text-[#0F5A47] accent-[#0F5A47] w-4 h-4"
                />
                <span>WhatsApp confirmado ativo</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterDrawerOpen(false)}
              className="w-full py-3 bg-[#0F5A47] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4738]"
            >
              Ver {filteredProfessionalsWithTravel.length} resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
