export interface Solicitacao {
  code: string
  origin: string
  property: string
  volume: string
  date: string
  status: string
}

export const mockSolicitacoes: Solicitacao[] = [
  {
    code: "SOL-2024-001",
    origin: "ETE Central",
    property: "Fazenda Santa Luzia",
    volume: "5.000 L",
    date: "15/01/2024",
    status: "Aprovada",
  },
  {
    code: "SOL-2024-002",
    origin: "ETE Norte",
    property: "Sítio Boa Esperança",
    volume: "8.500 L",
    date: "18/01/2024",
    status: "Em Análise",
  },
  {
    code: "SOL-2024-003",
    origin: "ETE Sul",
    property: "Chácara Primavera",
    volume: "3.200 L",
    date: "22/01/2024",
    status: "Pendente",
  },
  {
    code: "SOL-2024-004",
    origin: "ETE Oeste",
    property: "Fazenda do Vale",
    volume: "12.000 L",
    date: "25/01/2024",
    status: "Rejeitada",
  },
  {
    code: "SOL-2024-005",
    origin: "ETE Leste",
    property: "Propriedade Rural São João",
    volume: "6.800 L",
    date: "28/01/2024",
    status: "Aprovada",
  },
]
