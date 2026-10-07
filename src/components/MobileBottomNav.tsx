import React from 'react';
import { Home, Search, Calendar, Building2 } from 'lucide-react';
import { NavigationTab } from '../types';

interface Props {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  pendingRequestsCount: number;
}

export const MobileBottomNav: React.FC<Props> = ({
  currentTab,
  onNavigate,
  pendingRequestsCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E6E5DE] h-16 pb-safe">
      <div className="grid grid-cols-4 items-center h-full">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'home' ? 'text-[#0F5A47]' : 'text-[#68706D]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Início</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('search')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'search' || currentTab === 'results' ? 'text-[#0F5A47]' : 'text-[#68706D]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Buscar</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('patient_dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] relative transition-colors ${
            currentTab === 'patient_dashboard' ? 'text-[#0F5A47]' : 'text-[#68706D]'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#10B981] rounded-full" />
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-1">Consultas</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('clinic_dashboard')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'clinic_dashboard' || currentTab === 'clinic_landing' ? 'text-[#0F5A47]' : 'text-[#68706D]'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Clínicas</span>
        </button>
      </div>
    </div>
  );
};
