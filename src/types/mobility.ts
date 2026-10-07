/**
 * Normalized Mobility Model & Types (Cliniq Mobility Layer)
 * 
 * Defines standard data models for origin, destination, multi-modal travel
 * (walking, driving, transit), traffic states, walkability categorization,
 * and service provider abstraction (Demo vs Production Google Maps/Mapbox).
 */

export type MobilitySource = 'LOCAL_TOPOLOGY_CALCULATOR' | 'GOOGLE_MAPS_MATRIX_API' | 'MAPBOX_DIRECTIONS_API';

export type TrafficCondition = 'Trânsito livre' | 'Trânsito normal' | 'Trânsito intenso';

export type WalkabilityCategory = 'Caminhada rápida' | 'Acesso a pé' | 'Distância estendida' | 'Não recomendada a pé';

export interface GeoLocationPoint {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  displayName: string;
}

export interface WalkingMobility {
  distanceKm: number;
  distanceMeters: number;
  durationMinutes: number;
  displayFormatted: string; // e.g. "4 min a pé · 320 m" or "18 min a pé · 1,4 km"
  isWalkable: boolean; // duration <= 30 min
  category: WalkabilityCategory;
  calculationMethod: 'PEDESTRIAN_TOPOLOGY' | 'REALTIME_DIRECTIONS';
}

export interface DrivingMobility {
  distanceKm: number;
  durationMinutes: number;
  displayFormatted: string; // e.g. "12 min · 3,2 km"
  trafficStatus: TrafficCondition;
  calculationMethod: 'URBAN_GRID_FLOW' | 'REALTIME_TRAFFIC_MATRIX';
}

export interface PublicTransitMobility {
  nearestStation: string;
  transitLine: string;
  distanceMeters: number;
  walkingMinutes: number;
  totalTransitDurationMinutes: number;
  displayText: string;
  source: 'VERIFIED_SP_METRO_CPTM_GTFS' | 'STATIC_CLINIC_AUDIT';
}

/**
 * Normalized mobility result contract consumed by UI components.
 */
export interface NormalizedMobilityResult {
  origin: GeoLocationPoint;
  destination: GeoLocationPoint;
  walking: WalkingMobility;
  driving: DrivingMobility;
  publicTransit?: PublicTransitMobility;
  
  // Provider and metadata transparency
  provider: 'local_heuristic_sp' | 'google_maps_platform' | 'mapbox_directions';
  source: MobilitySource;
  isDemo: boolean;
  isRealTime: boolean;
  computedAt: string;
  directionsUrl: {
    driving: string;
    walking: string;
    transit: string;
  };
}

export interface MobilityProviderInterface {
  name: string;
  isLive: boolean;
  calculateMobility(originText: string, destination: {
    id: string;
    name: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    lat?: number;
    lng?: number;
  }): Promise<NormalizedMobilityResult>;
}
