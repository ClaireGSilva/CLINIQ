/**
 * Provider & Clinic Service
 * 
 * Handles query, filtering, provider profile retrieval, and saved favorites (Providers + Clinics).
 */

import { Professional, Clinic, SearchState } from '../types';
import { MOCK_PROFESSIONALS, DEMO_CLINICS } from '../data/demoData';
import { DistanceService } from './distanceService';

const SAVED_PROVIDERS_KEY = 'cliniq_saved_providers_v1';
const SAVED_CLINICS_KEY = 'cliniq_saved_clinics_v1';

export class ProviderService {
  static getAllProviders(): Professional[] {
    return MOCK_PROFESSIONALS;
  }

  static getProviderById(id: string): Professional | undefined {
    return MOCK_PROFESSIONALS.find(p => p.id === id);
  }

  static getAllClinics(): Clinic[] {
    return DEMO_CLINICS;
  }

  static getClinicById(id: string): Clinic | undefined {
    return DEMO_CLINICS.find(c => c.id === id);
  }

  static searchProviders(filters: SearchState): Professional[] {
    return MOCK_PROFESSIONALS.map(pro => {
      const travel = DistanceService.calculateTravelEstimate(filters.location, pro);
      return {
        ...pro,
        distanceKm: travel.drivingDistanceKm, // dynamically updated from searched location
        _travel: travel,
      };
    }).filter(pro => {
      // 1. Plan check
      if (filters.planId && filters.planId !== 'all') {
        const hasPlan = pro.acceptedPlans.some(p => p.planId === filters.planId);
        if (!hasPlan) return false;
      }

      // 2. Specialty / Need check
      if (filters.specialtyFilter && filters.specialtyFilter !== 'all') {
        const matchesMain = pro.specialty.toLowerCase().includes(filters.specialtyFilter.toLowerCase());
        const matchesSec = pro.secondarySpecialties.some(s => s.toLowerCase().includes(filters.specialtyFilter!.toLowerCase()));
        if (!matchesMain && !matchesSec) return false;
      }

      // 3. Travel mode check (walking filter)
      if (filters.travelMode === 'walking' && !pro._travel.isWalkable) {
        return false;
      }

      // 4. Distance check
      if (filters.distanceMax && pro.distanceKm > filters.distanceMax) {
        return false;
      }

      // 5. Rating check
      if (filters.minRating && pro.rating < filters.minRating) {
        return false;
      }

      // 6. Cliniq Verified only
      if (filters.verifiedOnly && pro.verification.status !== 'confirmed') {
        return false;
      }

      // 7. Whatsapp Active only
      if (filters.whatsappOnly && !pro.verification.whatsappActive) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'best_rated') return b.rating - a.rating;
      if (filters.sortBy === 'next_slot') return a.nextAvailableSlot.date.localeCompare(b.nextAvailableSlot.date);
      if (filters.sortBy === 'closest_walking') return a._travel.walkingDurationMinutes - b._travel.walkingDurationMinutes;
      return a.distanceKm - b.distanceKm; // Default: closest driving distance
    });
  }

  /* ========================================================================
     Favorites (Providers & Clinics)
     ======================================================================== */

  static getSavedProviderIds(): string[] {
    try {
      const stored = localStorage.getItem(SAVED_PROVIDERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return ['mariana-alves']; // Demo default
  }

  static toggleSavedProvider(id: string): string[] {
    const current = this.getSavedProviderIds();
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    try {
      localStorage.setItem(SAVED_PROVIDERS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }

  static getSavedClinicIds(): string[] {
    try {
      const stored = localStorage.getItem(SAVED_CLINICS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore
    }
    return ['clinic-pinheiros-01']; // Demo default
  }

  static toggleSavedClinic(id: string): string[] {
    const current = this.getSavedClinicIds();
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    try {
      localStorage.setItem(SAVED_CLINICS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  }
}
