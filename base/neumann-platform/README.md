# Neumann - Healthcare Monitoring Platform

Plataforma inteligente de monitoramento de saúde ocupacional com IA avançada para análise de dados biométricos em tempo real.

## Sobre o Projeto

O Neumann é uma plataforma completa de monitoramento de saúde ocupacional que utiliza inteligência artificial para analisar dados biométricos de funcionários em tempo real. O sistema detecta anomalias, padrões de risco e fornece alertas inteligentes para prevenir problemas de saúde relacionados ao trabalho.

### Principais Funcionalidades

- **Monitoramento Biométrico**: Frequência cardíaca, temperatura corporal, variabilidade cardíaca (HRV), atividade eletrodérmica (EDA)
- **IA Avançada**: Detecção automática de anomalias e padrões de risco
- **Dashboard Interativo**: Visualização em tempo real dos dados de saúde
- **Alertas Inteligentes**: Notificações baseadas em IA com níveis de confiança
- **Conformidade LGPD**: Proteção completa de dados pessoais
- **Relatórios SESST**: Geração automática de relatórios para órgãos reguladores

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis e customizáveis
- **React Query** - Gerenciamento de estado e cache
- **Lucide React** - Ícones modernos e consistentes

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ e npm instalados
- Git

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório do projeto
cd azure-shine-main

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Build para Produção

```bash
# Build otimizado para produção
npm run build

# Execute o build de produção
npm start
```

## Estrutura do Projeto

```
├── app/                    # Diretório do Next.js App Router
│   ├── components/         # Componentes React
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── page.tsx           # Página inicial
│   └── providers.tsx      # Provedores globais
├── lib/                   # Utilitários e configurações
├── public/                # Assets estáticos
└── styles/               # Estilos globais
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executa o build de produção
- `npm run lint` - Executa o linter

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
