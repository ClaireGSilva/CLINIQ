/**
 * Appointment Service (Service Layer)
 * 
 * Manages the appointment lifecycle with canonical statuses:
 * REQUESTED -> PENDING_CONFIRMATION -> CONFIRMED -> RESCHEDULE_REQUESTED -> CANCELLED -> COMPLETED
 * 
 * Currently backed by in-memory state with localStorage fallback for the MVP.
 * In Phase 2, this service points to REST/GraphQL/Firebase endpoints without altering UI consumers.
 */

import { AppointmentRequest, AppointmentStatus } from '../types';
import { INITIAL_USER_APPOINTMENTS, INITIAL_CLINIC_REQUESTS } from '../data/demoData';

const USER_APPOINTMENTS_KEY = 'cliniq_patient_appointments_v1';
const CLINIC_REQUESTS_KEY = 'cliniq_clinic_requests_v1';

export class AppointmentService {
  static getPatientAppointments(): AppointmentRequest[] {
    try {
      const stored = localStorage.getItem(USER_APPOINTMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // LocalStorage not available or parse error
    }
    return INITIAL_USER_APPOINTMENTS;
  }

  static savePatientAppointments(list: AppointmentRequest[]): void {
    try {
      localStorage.setItem(USER_APPOINTMENTS_KEY, JSON.stringify(list));
    } catch {
      // Ignore in private browsing / memory only
    }
  }

  static getClinicRequests(): AppointmentRequest[] {
    try {
      const stored = localStorage.getItem(CLINIC_REQUESTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return INITIAL_CLINIC_REQUESTS;
  }

  static saveClinicRequests(list: AppointmentRequest[]): void {
    try {
      localStorage.setItem(CLINIC_REQUESTS_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  }

  static createAppointmentRequest(data: Omit<AppointmentRequest, 'id' | 'createdAt' | 'status' | 'canonicalStatus'>): AppointmentRequest {
    const newRequest: AppointmentRequest = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'aguardando',
      canonicalStatus: 'PENDING_CONFIRMATION',
      hasBeenReviewed: false,
    };

    const currentPatient = this.getPatientAppointments();
    this.savePatientAppointments([newRequest, ...currentPatient]);

    const currentClinic = this.getClinicRequests();
    this.saveClinicRequests([newRequest, ...currentClinic]);

    return newRequest;
  }

  static updateStatus(id: string, newStatus: AppointmentStatus, message?: string, alternativeSlot?: { date: string; time: string }): AppointmentRequest | null {
    const localizedStatusMap: Record<AppointmentStatus, 'aguardando' | 'confirmada' | 'cancelada'> = {
      REQUESTED: 'aguardando',
      PENDING_CONFIRMATION: 'aguardando',
      CONFIRMED: 'confirmada',
      RESCHEDULE_REQUESTED: 'aguardando',
      CANCELLED: 'cancelada',
      COMPLETED: 'confirmada',
    };

    const currentPatient = this.getPatientAppointments();
    let updatedTarget: AppointmentRequest | null = null;

    const updatedPatient = currentPatient.map(apt => {
      if (apt.id === id) {
        const item: AppointmentRequest = {
          ...apt,
          canonicalStatus: newStatus,
          status: localizedStatusMap[newStatus],
          clinicMessage: message ?? apt.clinicMessage,
          suggestedAlternativeSlot: alternativeSlot ?? apt.suggestedAlternativeSlot,
          updatedAt: new Date().toISOString(),
        };
        updatedTarget = item;
        return item;
      }
      return apt;
    });

    this.savePatientAppointments(updatedPatient);

    const currentClinic = this.getClinicRequests();
    const updatedClinic = currentClinic.map(req => {
      if (req.id === id) {
        return {
          ...req,
          canonicalStatus: newStatus,
          status: localizedStatusMap[newStatus],
          clinicMessage: message ?? req.clinicMessage,
          suggestedAlternativeSlot: alternativeSlot ?? req.suggestedAlternativeSlot,
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    });
    this.saveClinicRequests(updatedClinic);

    return updatedTarget;
  }

  static cancelAppointment(id: string): void {
    this.updateStatus(id, 'CANCELLED', 'Cancelado pelo paciente.');
  }

  static confirmAppointment(id: string, message?: string): void {
    this.updateStatus(id, 'CONFIRMED', message || 'Consulta confirmada pela recepção do consultório.');
  }

  static markCompleted(id: string): void {
    this.updateStatus(id, 'COMPLETED', 'Atendimento concluído.');
  }

  static requestReschedule(id: string, alternativeSlot: { date: string; time: string }, message?: string): void {
    this.updateStatus(id, 'RESCHEDULE_REQUESTED', message || `Horário alternativo sugerido: ${alternativeSlot.time}`, alternativeSlot);
  }
}
