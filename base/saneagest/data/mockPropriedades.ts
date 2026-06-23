export interface Propriedade {
  id: string
  nome: string
  localizacao: string
  tipoCultura: string
  areaHa: number
}

export const propriedadesIniciais: Propriedade[] = [
  {
    id: "1",
    nome: "Fazenda Santa Luzia",
    localizacao: "Rua dos Bobos, 0 - Zona Rural, São Paulo - SP",
    tipoCultura: "Hortaliças",
    areaHa: 10,
  },
  {
    id: "2",
    nome: "Sítio Boa Esperança",
    localizacao: "Estrada do Campo, 123 - Interior, São Paulo - SP",
    tipoCultura: "Trigo",
    areaHa: 25,
  },
  {
    id: "3",
    nome: "Chácara Primavera",
    localizacao: "Avenida das Flores, 45 - Zona Rural, São Paulo - SP",
    tipoCultura: "Flores Ornamentais",
    areaHa: 5,
  },
  {
    id: "4",
    nome: "Fazenda do Vale",
    localizacao: "Rodovia SP-123, Km 45 - Interior, São Paulo - SP",
    tipoCultura: "Milho",
    areaHa: 50,
  },
  {
    id: "5",
    nome: "Propriedade Rural São João",
    localizacao: "Estrada Municipal, 789 - Zona Rural, São Paulo - SP",
    tipoCultura: "Soja",
    areaHa: 35,
  },
]
