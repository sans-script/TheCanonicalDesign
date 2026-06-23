export interface Certificate {
  id: string
  name: string
  institution: string
  startDate?: string
  date: string
  expiryDate?: string
  guardId: string
  documentUrl?: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  serialNumber?: string
  guardId: string
}

export interface PsychologicalEvaluation {
  id: string
  title?: string
  evaluationDate: string
  expirationDate?: string
  status: "fit" | "unfit"
  documentUrl?: string
  evaluatorInfo?: string
  guardId: string
}

export interface Guard {
  id: string
  token: string
  name: string
  registrationNumber: string
  admissionDate: string
  role: string
  rank: string
  cardIssuingPlace: string
  cardIssuingDate: string
  serial: string
  sinarmNumber: string
  expirationDate: string
  birthPlace: string
  state: string
  birthDate: string
  bloodType: string
  rg: string
  cpf: string
  fatherName?: string
  motherName?: string
  photoUrl?: string
  status: "active" | "inactive" | "onLeave" | "retired"
  weaponCarryStatus: "active" | "inactive" | "expired" | "revoked" | "suspended"
  address?: string
  cep?: string
  emergencyContact?: string
  bootSize?: string
  shirtSize?: string
  notes?: string
  certificates?: Certificate[]
  equipments?: Equipment[]
  psychologicalEvaluations?: PsychologicalEvaluation[]
  signatureUrl?: string | null
  signatureX?: number
  signatureY?: number
  signatureScale?: number
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalGuards: number
  active: number
  inactive: number
  onLeave: number
  retired: number
  expiringCards: number
  expiredCards: number
}

export interface SignatureConfig {
  signatureUrl: string | null
  x: number      // center-x on 540px wide card
  y: number      // center-y on 340px tall card
  scale: number  // size multiplier
}

export interface UserAccount {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "OPERA";
  createdAt: string;
  updatedAt: string;
}
