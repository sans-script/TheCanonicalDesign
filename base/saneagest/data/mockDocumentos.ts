export interface Documento {
  title: string
  type: string
  size: string
  date: string
  status: "Válido" | "Pendente"
}

export const mockDocumentos: Documento[] = [
  {
    title: "Licença Ambiental de Operação",
    type: "PDF",
    size: "2.4 MB",
    date: "15/12/2023",
    status: "Válido",
  },
  {
    title: "Certificado de Análise de Solo",
    type: "PDF",
    size: "1.8 MB",
    date: "22/11/2023",
    status: "Válido",
  },
  {
    title: "Plano de Aplicação de Lodo",
    type: "DOCX",
    size: "856 KB",
    date: "10/01/2024",
    status: "Pendente",
  },
  {
    title: "Relatório de Monitoramento",
    type: "PDF",
    size: "3.2 MB",
    date: "05/01/2024",
    status: "Válido",
  },
  {
    title: "Autorização Municipal",
    type: "PDF",
    size: "1.2 MB",
    date: "28/12/2023",
    status: "Pendente",
  },
]
