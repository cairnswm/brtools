// Common types for the application

export interface Team {
  id: string | number;
  name: string;
  leagueid?: string | number;
  average_top15_csr?: number;
  ranking_points?: number;
  national_rank?: number;
  world_rank?: number;
  country_iso?: string;
  ranking?: number;
  stadium_capacity?: number;
  bank_balance?: number;
  total_salary?: number;
  prev_world_rank?: number;
  nickname_1?: string;
  regional_rank?: number;
  stadium?: string;
  stadium_standing?: number;
  stadium_uncovered?: number;
  stadium_covered?: number;
  stadium_box?: number;
  [key: string]: any; // Allow additional properties
}

export interface Player {
  id?: string | number;
  jersey: string;
  fname: string;
  lname: string;
  age: number | string;
  csr: number | string;
  energy: number | string;
  form: number | string;
  leadership: number | string;
  experience: number | string;
  height: number | string;
  weight: number | string;
  nationality: string;
  dualnationality?: string;
  capped_for?: string;
  salary: number | string;
  stamina: number | string;
  handling: number | string;
  attack: number | string;
  defense: number | string;
  technique: number | string;
  strength: number | string;
  jumping: number | string;
  speed: number | string;
  agility: number | string;
  kicking: number | string;
  position?: string;
  [key: string]: any; // Allow additional properties
}

export interface YouthPlayer {
  jersey: string;
  fname: string;
  lname: string;
  age: number | string;
  energy: number | string;
  nationality: string;
  dualnationality?: string;
  capped_for?: string;
  stamina: number | string;
  handling: number | string;
  attack: number | string;
  defense: number | string;
  technique: number | string;
  strength: number | string;
  jumping: number | string;
  speed: number | string;
  agility: number | string;
  kicking: number | string;
}

export interface Standing {
  teamid: string | number;
  played: number | string;
  w: number | string;
  d: number | string;
  l: number | string;
  for: number | string;
  against: number | string;
  b1: number | string;
  b2: number | string;
  points: number | string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface TeamAverages {
  [key: string]: string | number;
}

export interface TeamAveragesGroup {
  allPlayers: TeamAverages;
  top15Players: TeamAverages;
  top22Players: TeamAverages;
}

export interface Fixture {
  [key: string]: any;
}
