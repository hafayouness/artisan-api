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
  total?: number;
  error?: string;
}
export interface StatsResponse {
  total_artisans: number;
  note_moyenne: number;
  par_profession: Array<{ profession: string; count: string }>;
  par_ville: Array<{ ville: string; count: string }>;
}
