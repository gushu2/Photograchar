export interface GalleryPhoto {
  id: string;
  url: string; // Base64 or Blob URL
  timestamp: number;
  photographerId: string;
}

export interface MatchResult {
  photoId: string;
  confidence: number;
  match: boolean;
}

export enum UserRole {
  NONE = 'NONE',
  PHOTOGRAPHER = 'PHOTOGRAPHER',
  USER = 'USER'
}

export enum AppState {
  LANDING = 'LANDING',
  PHOTOGRAPHER_DASHBOARD = 'PHOTOGRAPHER_DASHBOARD',
  USER_CAMERA = 'USER_CAMERA',
  USER_SCANNING = 'USER_SCANNING',
  USER_RESULTS = 'USER_RESULTS'
}