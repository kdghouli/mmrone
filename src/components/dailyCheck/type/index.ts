// types/index.ts

export interface DailyCheck {
  id: string;
  dateControle: Date | string;
  frein: boolean;
  pneus: boolean;
  eclairage: boolean;
  extincteur: boolean;
  batterie: boolean;
  fuite: boolean;
  avertisseur: boolean;
  ceinture: boolean;
  retroviseur: boolean;
  observation: string;
  kilometrage: number;
  vhl_id: string;
  user_id: string;
  utilisateur_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Chariot {
  id: string;
  nom: string;
  type: string;
  statut: 'actif' | 'maintenance' | 'inactif';
}

export interface DailyCheckFormData {
  dateControle: string;
  frein: boolean;
  pneus: boolean;
  eclairage: boolean;
  extincteur: boolean;
  batterie: boolean;
  fuite: boolean;
  avertisseur: boolean;
  ceinture: boolean;
  retroviseur: boolean;
  observation: string;
  kilometrage: number;
  vhl_id: string;
}