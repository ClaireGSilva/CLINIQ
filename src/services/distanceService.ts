/**
 * Distance & Transit Calculation Service (Cliniq Mobility Layer)
 * 
 * Backwards-compatibility wrapper bridging legacy calls to the new Normalized MobilityService.
 * Maintains existing TravelEstimate interface so other components (ProfileView, SearchWizard, etc.)
 * continue functioning smoothly without breaking changes.
 */

import { Professional } from '../types';
import { MobilityService } from './mobilityService';
import { NormalizedMobilityResult } from '../types/mobility';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearestTransit {
  station: string;
  line: string;
  distanceMeters: number;
  walkingMinutes: number;
  displayText: string;
}

export interface TravelEstimate {
  originLocation: string;
  originDisplayName: string;
  destinationNeighborhood: string;
  destinationAddress: string;
  aerialDistanceKm: number;
  
  // Driving metrics
  drivingDistanceKm: number;
  drivingDurationMinutes: number;
  drivingDisplay: string;
  trafficStatus: 'Trânsito livre' | 'Trânsito normal' | 'Trânsito intenso';
  
  // Walking metrics
  walkingDistanceKm: number;
  walkingDurationMinutes: number;
  walkingDisplay: string;
  isWalkable: boolean;
  walkingWalkabilityLabel?: string;
  
  // Public Transit metrics
  transitDurationMinutes: number;
  transitDisplay: string;
  nearestMetro?: NearestTransit;

  // Normalized Mobility Link
  normalizedMobility?: NormalizedMobilityResult;
}

export class DistanceService {
  /**
   * Resolves a searched location text into coordinates.
   */
  static getCoordinatesForLocation(locationString?: string): Coordinates & { name: string } {
    const mobility = MobilityService.calculateMobility(locationString || '', {
      id: 'temp',
      clinicName: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
    } as any);

    return {
      lat: mobility.origin.lat,
      lng: mobility.origin.lng,
      name: mobility.origin.displayName,
    };
  }

  /**
   * Comprehensive mobility calculator providing walking, driving and transit estimates.
   */
  static calculateTravelEstimate(searchedLocation: string | undefined, pro: Professional): TravelEstimate {
    const normalized = MobilityService.calculateMobility(searchedLocation || '', pro);

    return {
      originLocation: normalized.origin.address || 'São Paulo, SP',
      originDisplayName: normalized.origin.displayName,
      destinationNeighborhood: pro.neighborhood,
      destinationAddress: pro.address,
      aerialDistanceKm: normalized.walking.distanceKm,
      drivingDistanceKm: normalized.driving.distanceKm,
      drivingDurationMinutes: normalized.driving.durationMinutes,
      drivingDisplay: normalized.driving.displayFormatted,
      trafficStatus: normalized.driving.trafficStatus,
      walkingDistanceKm: normalized.walking.distanceKm,
      walkingDurationMinutes: normalized.walking.durationMinutes,
      walkingDisplay: normalized.walking.displayFormatted,
      isWalkable: normalized.walking.isWalkable,
      walkingWalkabilityLabel: normalized.walking.category,
      transitDurationMinutes: normalized.publicTransit?.totalTransitDurationMinutes || 15,
      transitDisplay: `${normalized.publicTransit?.totalTransitDurationMinutes || 15} min de transporte público`,
      nearestMetro: normalized.publicTransit
        ? {
            station: normalized.publicTransit.nearestStation,
            line: normalized.publicTransit.transitLine,
            distanceMeters: normalized.publicTransit.distanceMeters,
            walkingMinutes: normalized.publicTransit.walkingMinutes,
            displayText: normalized.publicTransit.displayText,
          }
        : undefined,
      normalizedMobility: normalized,
    };
  }
}
