/**
 * Cliniq Core Domain Types
 * 
 * Standardized data models preparing the application for transition from
 * Prototype -> Functional MVP -> Transferable Product -> Exit-Ready Asset.
 */

export type NavigationTab = 
  | 'home' 
  | 'search' 
  | 'results' 
  | 'profile' 
  | 'booking_confirmation' 
  | 'patient_dashboard' 
  | 'clinic_landing' 
  | 'clinic_dashboard' 
  | 'admin_dashboard';

/* ==========================================================================
   User & Profile Entities
   ========================================================================== */

export type UserRole = 'PATIENT' | 'CLINIC' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfile {
  userId: string;
  insuranceProvider: string;
  insurancePlanId: string;
  insuranceCardNumber?: string;
  preferences: {
    preferredTimeSlot?: 'morning' | 'afternoon' | 'night' | 'saturday' | 'first';
    preferredDistanceKm?: number;
  };
  savedProviders: string[]; // Provider IDs
  savedClinics: string[];   // Clinic IDs
}

/* ==========================================================================
   Verification Domain (Cliniq Verified)
   ========================================================================== */

export type VerificationStatusType = 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REPORTED';

export interface VerifiableField<T = string | boolean> {
  value: T;
  status: VerificationStatusType;
  verifiedAt: string;
  verificationSource: 'DIRECT_RECEPTION_AUDIT' | 'CLINIC_OWNER' | 'INSURANCE_FEED' | 'USER_REPORT';
}

export interface VerificationDetails {
  planConfirmed: boolean;
  phoneConfirmed: boolean;
  whatsappActive: boolean;
  profileUpdated: boolean;
  lastUpdatedDate: string;
  status: 'confirmed' | 'pending' | 'unconfirmed';
  notes: string;
  source?: string;
}

/* ==========================================================================
   Insurance & Clinical Offerings
   ========================================================================== */

export interface DentalPlan {
  id: string;
  name: string;
  category: string;
  popular?: boolean;
}

export interface InsurancePlan {
  id: string;
  providerName: string;
  planName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ClinicInsurance {
  clinicId: string;
  insurancePlanId: string;
  verificationStatus: VerificationStatusType;
  verifiedAt: string;
  verificationSource: string;
  copayRule?: string;
}

export interface DentalNeed {
  id: string;
  label: string;
  description: string;
  iconName: string;
  suggestedSpecialty: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes?: number;
}

export interface ProfessionalService {
  id: string;
  name: string;
  durationMinutes: number;
  description: string;
  coveredByDefault: boolean;
}

export interface AcceptedPlanDetail {
  planId: string;
  planName: string;
  status: 'confirmed' | 'pending' | 'unconfirmed';
  copayRule?: string;
  lastVerified: string;
}

/* ==========================================================================
   Clinic & Provider (Professional) Entities
   ========================================================================== */

export interface Clinic {
  id: string;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  website?: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'REPORTED';
  verificationStatus: VerificationStatusType;
  createdAt: string;
  updatedAt: string;
  acceptedPlans: string[]; // InsurancePlan IDs
  operatingHours: string;
}

export interface ProfessionalReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  planUsed: string;
  planSuccess: boolean;
  comment: string;
  moderationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  breakdown: {
    professional: {
      atendimento: number;
      clareza: number;
      pontualidade: number;
    };
    clinic: {
      recepcao: number;
      organizacao: number;
      facilidadeContato: number;
    };
  };
}

export interface Professional {
  id: string;
  clinicId?: string;
  name: string;
  gender: 'f' | 'm';
  cro: string;
  specialty: string;
  secondarySpecialties: string[];
  clinicName: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  about: string;
  acceptedPlans: AcceptedPlanDetail[];
  services: ProfessionalService[];
  verification: VerificationDetails;
  nextAvailableSlot: {
    date: string;
    displayDate: string;
    time: string;
  };
  availableSlots: {
    [dateKey: string]: string[];
  };
  scores: {
    atendimento: number;
    clareza: number;
    pontualidade: number;
    recepcao: number;
    organizacao: number;
    planMatchRate: number; // e.g., 99%
  };
  reviews: ProfessionalReview[];
  phone: string;
  whatsapp: string;
  status?: 'ACTIVE' | 'PENDING';
}

export * from './mobility';

/* ==========================================================================
   Appointment Lifecycle
   ========================================================================== */

export type AppointmentStatus = 
  | 'REQUESTED' 
  | 'PENDING_CONFIRMATION' 
  | 'CONFIRMED' 
  | 'RESCHEDULE_REQUESTED' 
  | 'CANCELLED' 
  | 'COMPLETED';

export interface AppointmentRequest {
  id: string;
  createdAt: string;
  updatedAt?: string;
  patientId?: string;
  clinicId?: string;
  providerId?: string;
  professionalId: string;
  professionalName: string;
  clinicName: string;
  specialty: string;
  serviceName: string;
  planId: string;
  planName: string;
  date: string;
  displayDate: string;
  time: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientCardNumber?: string;
  patientNotes?: string;
  status: 'aguardando' | 'confirmada' | 'cancelada' | AppointmentStatus;
  canonicalStatus?: AppointmentStatus;
  clinicMessage?: string;
  suggestedAlternativeSlot?: {
    date: string;
    time: string;
  };
  hasBeenReviewed?: boolean;
}

/* ==========================================================================
   Reviews & Moderation
   ========================================================================== */

export type ReviewModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: string;
  patientId: string;
  providerId: string;
  clinicId: string;
  professionalRating: number;
  clinicRating: number;
  insuranceExperience: 'positive' | 'negative';
  insuranceNegativeReason?: 'clinica_nao_atendia' | 'procedimento_nao_coberto' | 'informacao_incorreta' | 'outro';
  comment: string;
  createdAt: string;
  moderationStatus: ReviewModerationStatus;
}

/* ==========================================================================
   Search State & Reporting
   ========================================================================== */

export interface SearchState {
  needId: string;
  customNeedText: string;
  planId: string;
  location: string;
  preference: string; // 'any' | 'first' | 'morning' | 'afternoon' | 'night' | 'saturday'
  specialtyFilter?: string;
  minRating?: number;
  distanceMax?: number;
  verifiedOnly?: boolean;
  whatsappOnly?: boolean;
  onlineBookingOnly?: boolean;
  sortBy?: 'closest' | 'next_slot' | 'best_rated' | 'closest_walking';
  travelMode?: 'all' | 'driving' | 'walking';
}

export interface ClinicRegistrationData {
  name: string;
  cnpjDemo: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  whatsapp: string;
  hours: string;
  specialties: string[];
  acceptedPlans: string[];
  responsibleDentist: string;
  croResponsible: string;
}

export interface ReportedIssue {
  id: string;
  clinicName: string;
  professionalName: string;
  planReported: string;
  issueType: 'plano_nao_atende' | 'telefone_desatualizado' | 'horario_invalido' | 'inappropriate_review' | 'outro';
  description: string;
  reportedAt: string;
  status: 'pendente' | 'revisado' | 'resolvido';
}
