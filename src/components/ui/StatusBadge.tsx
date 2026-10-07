import React from 'react';
import { AppointmentStatus, VerificationStatusType } from '../../types';

interface StatusBadgeProps {
  status: AppointmentStatus | 'aguardando' | 'confirmada' | 'cancelada' | VerificationStatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  // Normalize string
  const normalized = status.toUpperCase();

  if (normalized === 'CONFIRMED' || normalized === 'CONFIRMADA' || normalized === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5A47] bg-[#E8F3EE] px-2.5 py-1 rounded-md ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span>{normalized === 'VERIFIED' ? 'Confirmado' : 'Consulta Confirmada'}</span>
      </span>
    );
  }

  if (normalized === 'REQUESTED' || normalized === 'PENDING_CONFIRMATION' || normalized === 'AGUARDANDO' || normalized === 'PENDING') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#854D0E] bg-[#FEF9C3] border border-[#FEF08A] px-2.5 py-1 rounded-md ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308] animate-pulse" />
        <span>Aguardando confirmação</span>
      </span>
    );
  }

  if (normalized === 'RESCHEDULE_REQUESTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] bg-[#DBEAFE] border border-[#BFDBFE] px-2.5 py-1 rounded-md ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
        <span>Reagendamento sugerido</span>
      </span>
    );
  }

  if (normalized === 'COMPLETED') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F5A47] bg-[#F4F9F6] border border-[#D0E2D9] px-2.5 py-1 rounded-md ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#0F5A47]" />
        <span>Atendimento Concluído</span>
      </span>
    );
  }

  // Cancelled or Unverified/Reported
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#991B1B] bg-[#FEE2E2] px-2.5 py-1 rounded-md ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
      <span>{normalized === 'REPORTED' ? 'Dado Reportado' : 'Cancelada'}</span>
    </span>
  );
};
