export interface Fertilizante {
  id: string
  nome: string
  tipo: "Composto orgânico" | "Lodo seco" | "Biofertilizante líquido" | "Pelletizado"
  origem: string
  especificoPara: string[]
  preco: number
  avaliacao: number
  numeroAvaliacoes: number
  disponibilidade: "Em estoque" | "Pronto para retirada"
  imagem?: string
  descricao: string
}

export const mockFertilizantes: Fertilizante[] = [
  {
    id: "1",
    nome: "Fertilizante Orgânico Premium",
    tipo: "Composto orgânico",
    origem: "ETE São Luís - MA",
    especificoPara: ["Milho", "Hortaliças"],
    preco: 150.0,
    avaliacao: 4.8,
    numeroAvaliacoes: 20,
    disponibilidade: "Em estoque",
    descricao: "Fertilizante orgânico de alta qualidade, ideal para culturas de milho e hortaliças.",
    imagem: "/produto_img1.jpg",
  },
  {
    id: "2",
    nome: "Composto Orgânico Especial",
    tipo: "Composto orgânico",
    origem: "ETE São Luís - MA",
    especificoPara: ["Cana-de-açúcar"],
    preco: 150.0,
    avaliacao: 4.6,
    numeroAvaliacoes: 20,
    disponibilidade: "Em estoque",
    descricao: "Composto orgânico especialmente formulado para plantações de cana-de-açúcar.",
    imagem: "/produto_img2.jpg",
  },
  {
    id: "3",
    nome: "Fertilizante Líquido Bio",
    tipo: "Biofertilizante líquido",
    origem: "ETE Bacabal - MA",
    especificoPara: ["Eucalipto", "Hortaliças"],
    preco: 150.0,
    avaliacao: 4.7,
        imagem: "/produto_img2.jpg",
    numeroAvaliacoes: 20,
    disponibilidade: "Pronto para retirada",
    descricao: "Biofertilizante líquido concentrado, perfeito para eucalipto e hortaliças.",
  },
  {
    id: "4",
    nome: "Pellets Orgânicos",
    tipo: "Pelletizado",
    origem: "ETE São Luís - MA",
    especificoPara: ["Milho"],
    preco: 150.0,
    avaliacao: 4.5,
    numeroAvaliacoes: 20,
    disponibilidade: "Em estoque",
    descricao: "Fertilizante pelletizado de fácil aplicação, ideal para culturas de milho.",
    imagem: "/produto_img2.jpg",
  },
  {
    id: "5",
    nome: "Lodo Seco Tratado",
    tipo: "Lodo seco",
    origem: "ETE Bacabal - MA",
    especificoPara: ["Cana-de-açúcar", "Eucalipto"],
    preco: 120.0,
    avaliacao: 4.3,
    numeroAvaliacoes: 15,
    disponibilidade: "Em estoque",
        imagem: "/produto_img2.jpg",
    descricao: "Lodo seco tratado e estabilizado, excelente para cana-de-açúcar e eucalipto.",
  },
  {
    id: "6",
    nome: "Composto Premium Plus",
    tipo: "Composto orgânico",
    origem: "ETE São Luís - MA",
    especificoPara: ["Hortaliças"],
    preco: 180.0,
    avaliacao: 4.9,
        imagem: "/produto_img1.jpg",
    numeroAvaliacoes: 25,
    disponibilidade: "Pronto para retirada",
    descricao: "Composto orgânico premium com nutrientes balanceados para hortaliças.",
  },
]

export const tiposFertilizante = ["Composto orgânico", "Lodo seco", "Biofertilizante líquido", "Pelletizado"] as const

export const origensETE = ["ETE São Luís - MA", "ETE Bacabal - MA"] as const

export const culturas = ["Milho", "Cana-de-açúcar", "Eucalipto", "Hortaliças"] as const

export const faixasPreco = [
  { label: "Todos os preços", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Abaixo de R$ 20", min: 0, max: 20 },
  { label: "Entre R$ 25 e R$ 100", min: 25, max: 100 },
  { label: "Entre R$ 100 e R$ 300", min: 100, max: 300 },
  { label: "Entre R$ 300 e R$ 500", min: 300, max: 500 },
] as const

export const disponibilidades = ["Em estoque", "Pronto para retirada"] as const
