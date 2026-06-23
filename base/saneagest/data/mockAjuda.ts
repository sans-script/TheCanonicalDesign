export interface PerguntaFrequente {
  id: string
  pergunta: string
  resposta: string
  keywords: string[]
}

export interface GuiaTutorial {
  id: string
  titulo: string
  conteudo: string
  keywords: string[]
}

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    id: "1",
    pergunta: "Como solicitar lodo de uma ETE?",
    resposta:
      "Para solicitar lodo, acesse a seção 'ETEs Parceiras', escolha uma ETE ativa e clique em 'Solicitar Lodo'. Preencha o formulário com as informações da sua propriedade e aguarde a aprovação.",
    keywords: ["solicitar", "lodo", "ete", "formulário", "aprovação"],
  },
  {
    id: "2",
    pergunta: "Quais documentos são necessários?",
    resposta:
      "São necessários: Licença Ambiental de Operação, Certificado de Análise de Solo, Plano de Aplicação de Lodo e Autorização Municipal. Todos os documentos devem estar válidos.",
    keywords: ["documentos", "licença", "análise", "solo", "autorização"],
  },
  {
    id: "3",
    pergunta: "Como acompanhar o status da minha solicitação?",
    resposta:
      "Acesse 'Minhas Solicitações' para ver o status atual de todas as suas solicitações. Você receberá notificações por email sobre mudanças de status.",
    keywords: ["status", "solicitação", "acompanhar", "notificação", "email"],
  },
  {
    id: "4",
    pergunta: "Qual o prazo para aprovação?",
    resposta:
      "O prazo médio para aprovação é de 5 a 10 dias úteis, dependendo da complexidade da solicitação e da documentação apresentada.",
    keywords: ["prazo", "aprovação", "dias", "úteis", "documentação"],
  },
]

export const guiasTutoriais: GuiaTutorial[] = [
  {
    id: "1",
    titulo: "Como cadastrar uma nova propriedade",
    conteudo:
      "1. Acesse 'Minhas Propriedades'\n2. Clique em 'Nova Propriedade'\n3. Preencha os dados: nome, localização, tipo de cultura e área\n4. Clique em 'Salvar'\n\nSua propriedade estará disponível para solicitações de lodo.",
    keywords: ["cadastrar", "propriedade", "nova", "dados", "salvar"],
  },
  {
    id: "2",
    titulo: "Upload de documentos",
    conteudo:
      "1. Vá para 'Documentos e Licenças'\n2. Clique em 'Adicionar Documento'\n3. Selecione o tipo de documento\n4. Faça o upload do arquivo (PDF ou DOCX)\n5. Aguarde a validação\n\nDocumentos válidos são essenciais para aprovação das solicitações.",
    keywords: ["upload", "documentos", "arquivo", "pdf", "validação"],
  },
  {
    id: "3",
    titulo: "Entendendo os tipos de lodo",
    conteudo:
      "Classe A: Lodo tratado com baixa concentração de patógenos, ideal para culturas alimentícias.\n\nClasse B: Lodo com tratamento básico, adequado para culturas não alimentícias e reflorestamento.\n\nVerifique sempre a compatibilidade com sua cultura antes de solicitar.",
    keywords: ["tipos", "lodo", "classe", "patógenos", "culturas"],
  },
]
