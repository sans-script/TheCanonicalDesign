export interface ETEGestor {
  id: string
  nome: string
  endereco: string
  capacidade: string
  capacidadeAtual: number
  producaoDiaria: number
  status: "Ativa" | "Manutenção" | "Inativa"
  proximaManutencao: string
  licencasValidas: boolean
  funcionarios: number
  tipoLodo: string[]
  custoOperacional: number
  receitaMensal: number
}

export interface SolicitacaoRecebida {
  id: string
  codigo: string
  produtor: {
    nome: string
    email: string
    telefone: string
    propriedade: string
  }
  volume: string
  datasolicitacao: string
  prazoEntrega: string
  status: "Pendente" | "Aprovada" | "Rejeitada" | "Em Análise"
  observacoes?: string
  distancia: string
  valorEstimado: number
}

export const etesGestor: ETEGestor[] = [
  {
    id: "1",
    nome: "ETE Central Maranhão",
    endereco: "Av. Principal, 1000 - São Luís/MA",
    capacidade: "50.000 L/dia",
    capacidadeAtual: 85,
    producaoDiaria: 42500,
    status: "Ativa",
    proximaManutencao: "15/02/2024",
    licencasValidas: true,
    funcionarios: 12,
    tipoLodo: ["Classe A", "Classe B"],
    custoOperacional: 25000,
    receitaMensal: 45000,
  },
  {
    id: "2",
    nome: "ETE Norte Industrial",
    endereco: "Distrito Industrial - São Luís/MA",
    capacidade: "75.000 L/dia",
    capacidadeAtual: 92,
    producaoDiaria: 69000,
    status: "Ativa",
    proximaManutencao: "28/01/2024",
    licencasValidas: true,
    funcionarios: 18,
    tipoLodo: ["Classe A", "Classe B", "Compostado"],
    custoOperacional: 38000,
    receitaMensal: 72000,
  },
  {
    id: "3",
    nome: "ETE Sul Residencial",
    endereco: "Bairro Cohama - São Luís/MA",
    capacidade: "30.000 L/dia",
    capacidadeAtual: 45,
    producaoDiaria: 13500,
    status: "Manutenção",
    proximaManutencao: "10/01/2024",
    licencasValidas: false,
    funcionarios: 8,
    tipoLodo: ["Classe B"],
    custoOperacional: 15000,
    receitaMensal: 18000,
  },
]

export const solicitacoesRecebidas: SolicitacaoRecebida[] = [
  {
    id: "1",
    codigo: "SOL-2024-001",
    produtor: {
      nome: "João Silva Santos",
      email: "joao.silva@email.com",
      telefone: "(98) 99999-1234",
      propriedade: "Fazenda Santa Luzia",
    },
    volume: "5.000 L",
    datasolicitacao: "10/01/2024",
    prazoEntrega: "20/01/2024",
    status: "Pendente",
    distancia: "25 km",
    valorEstimado: 2500,
  },
  {
    id: "2",
    codigo: "SOL-2024-002",
    produtor: {
      nome: "Maria Oliveira Costa",
      email: "maria.costa@email.com",
      telefone: "(98) 99999-5678",
      propriedade: "Sítio Boa Esperança",
    },
    volume: "8.000 L",
    datasolicitacao: "12/01/2024",
    prazoEntrega: "25/01/2024",
    status: "Em Análise",
    distancia: "18 km",
    valorEstimado: 4000,
  },
  {
    id: "3",
    codigo: "SOL-2024-003",
    produtor: {
      nome: "Carlos Mendes Lima",
      email: "carlos.lima@email.com",
      telefone: "(98) 99999-9012",
      propriedade: "Chácara Primavera",
    },
    volume: "3.000 L",
    datasolicitacao: "08/01/2024",
    prazoEntrega: "18/01/2024",
    status: "Aprovada",
    distancia: "12 km",
    valorEstimado: 1500,
  },
  {
    id: "4",
    codigo: "SOL-2024-004",
    produtor: {
      nome: "Ana Paula Ferreira",
      email: "ana.ferreira@email.com",
      telefone: "(98) 99999-3456",
      propriedade: "Fazenda Verde Vale",
    },
    volume: "12.000 L",
    datasolicitacao: "05/01/2024",
    prazoEntrega: "15/01/2024",
    status: "Rejeitada",
    observacoes: "Volume solicitado excede capacidade disponível",
    distancia: "45 km",
    valorEstimado: 6000,
  },
]

export const metricasGestor = {
  etesAtivas: 2,
  lodoProduzidoMes: "3.2M L",
  solicitacoesPendentes: 8,
  receitaMensal: 135000,
  custoOperacional: 78000,
  margemLucro: 42.2,
  capacidadeMedia: 74,
  clientesAtivos: 45,
}
