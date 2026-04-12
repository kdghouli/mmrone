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
  vhl: Chariot | string;
  user_id:  string;
  user: User | string;
  utilisateur_id: string;
  utilisateur: Utilisateur | string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Chariot {
  id: string;
  matricule: string;
  marque: string;
  agence: string;
  statut: "actif" | "maintenance" | "inactif";
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
  utilisateur_id: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  image: null;
}

export interface Utilisateur {
  id: string;
  nom: string;
  poste: string;
  tel: string;
  mail: string;
  service_id: number;
  agence_id: number;
}
