export interface Artisan {
  id?: number;
  nom: string;
  prenom: string;
  profession: string;
  telephone: string;
  email?: string | null;
  ville?: string;
  rating?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateArtisanDTO {
  nom: string;
  prenom: string;
  profession: string;
  telephone: string;
  email?: string;
  ville?: string;
  rating?: number;
}
export interface UpdateArtisanDTO {
  nom?: string;
  prenom?: string;
  profession?: string;
  telephone?: string;
  email?: string;
  ville?: string;
  rating?: number;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T | undefined;
  error?: string;
}
