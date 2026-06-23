export interface ETE {
  id: string
  nome: string
  empresa: string
  endereco: string
  distancia: string
  capacidade: string
  telefone: string
  email: string
  status: "Ativa" | "Manutenção" | "Inativa"
  avaliacao: number
  avaliacoes: number
}

export const etesMock: ETE[] = [
  {
    id: "1",
    nome: "ETE Central",
    empresa: "Saneamento Central Ltda",
    endereco: "Centro Industrial, São Paulo - SP",
    distancia: "2.5km",
    capacidade: "50.000 L/dia",
    telefone: "(11) 3000-0001",
    email: "contato@etecentral.com.br",
    status: "Ativa",
    avaliacao: 4.8,
    avaliacoes: 127,
  },
  {
    id: "2",
    nome: "ETE Norte",
    empresa: "Tratamento Norte S.A.",
    endereco: "Distrito Industrial Norte, São Paulo - SP",
    distancia: "5.2km",
    capacidade: "75.000 L/dia",
    telefone: "(11) 3000-0002",
    email: "contato@etenorte.com.br",
    status: "Ativa",
    avaliacao: 4.6,
    avaliacoes: 89,
  },
  {
    id: "3",
    nome: "ETE Sul",
    empresa: "EcoTratamento Sul",
    endereco: "Zona Sul Industrial, São Paulo - SP",
    distancia: "8.1km",
    capacidade: "30.000 L/dia",
    telefone: "(11) 3000-0003",
    email: "contato@etesul.com.br",
    status: "Manutenção",
    avaliacao: 4.2,
    avaliacoes: 45,
  },
  {
    id: "4",
    nome: "ETE Oeste",
    empresa: "Águas do Oeste",
    endereco: "Região Oeste, São Paulo - SP",
    distancia: "12.3km",
    capacidade: "40.000 L/dia",
    telefone: "(11) 3000-0004",
    email: "contato@eteoeste.com.br",
    status: "Inativa",
    avaliacao: 3.9,
    avaliacoes: 23,
  },
  {
    id: "5",
    nome: "ETE Leste",
    empresa: "Tratamento Leste Ltda",
    endereco: "Zona Leste Industrial, São Paulo - SP",
    distancia: "7.8km",
    capacidade: "35.000 L/dia",
    telefone: "(11) 3000-0005",
    email: "contato@eteleste.com.br",
    status: "Ativa",
    avaliacao: 4.5,
    avaliacoes: 67,
  },
  {
    id: "6",
    nome: "ETE Sudeste",
    empresa: "EcoSudeste S.A.",
    endereco: "Região Sudeste, São Paulo - SP",
    distancia: "15.2km",
    capacidade: "60.000 L/dia",
    telefone: "(11) 3000-0006",
    email: "contato@etesudeste.com.br",
    status: "Ativa",
    avaliacao: 4.7,
    avaliacoes: 98,
  },
]

export const statusOptions = ["Todos", "Ativa", "Manutenção", "Inativa"] as const

export const statusColors: Record<string, string> = {
  Ativa: "bg-success-lighter text-success-dark",
  Manutenção: "bg-warning-lighter text-warning-dark",
  Inativa: "bg-error-lighter text-error-dark",
}
