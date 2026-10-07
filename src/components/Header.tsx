import React from 'react';
import { NavigationTab } from '../types';

interface Props {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  pendingRequestsCount: number;
}

export const Header: React.FC<Props> = ({
  currentTab,
  onNavigate,
  pendingRequestsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E6E5DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xl font-extrabold tracking-tight text-[#1A1C1A] hover:text-[#0F5A47] transition-colors focus:outline-hidden"
        >
          CLINIQ
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#525A56]">
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className={`hover:text-[#0F5A47] transition-colors ${
              currentTab === 'search' || currentTab === 'results' ? 'text-[#0F5A47] underline underline-offset-8' : ''
            }`}
          >
            Encontrar atendimento
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-[#0F5A47] transition-colors"
          >
            Como funciona
          </button>

          <button
            type="button"
            onClick={() => onNavigate('clinic_dashboard')}
            className={`hover:text-[#0F5A47] transition-colors ${
              currentTab === 'clinic_dashboard' || currentTab === 'clinic_landing' ? 'text-[#0F5A47] underline underline-offset-8' : ''
            }`}
          >
            Para clínicas
          </button>

          <button
            type="button"
            onClick={() => onNavigate('patient_dashboard')}
            className={`hover:text-[#0F5A47] transition-colors flex items-center gap-1.5 ${
              currentTab === 'patient_dashboard' ? 'text-[#0F5A47] underline underline-offset-8' : ''
            }`}
          >
            <span>Minha conta</span>
            {pendingRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('admin_dashboard')}
            className={`text-[#838A87] hover:text-[#1A1C1A] text-[11px] font-mono transition-colors ${
              currentTab === 'admin_dashboard' ? 'text-[#0F5A47] underline' : ''
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F5A47] rounded-xl hover:bg-[#0c4738] active:scale-[0.98] transition-all whitespace-nowrap shadow-xs"
          >
            Começar
          </button>
        </div>
      </div>
    </header>
  );
};
