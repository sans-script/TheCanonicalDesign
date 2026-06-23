# SICAF - Sistema de Identificação de Carteiras Funcionais

O **SICAF** é uma plataforma focada na gestão, emissão e validação de identidades funcionais para a Guarda Municipal de São Luís. O sistema automatiza o ciclo de vida das carteiras funcionais, garantindo a autenticidade dos documentos através de QR Codes e um portal público de validação.

---

## 1. Arquitetura do Sistema

### A. Painel Administrativo
*   **Gestão de Guardas (CRUD)**: Cadastro completo contendo dados pessoais (CPF, RG, Tipo Sanguíneo), dados profissionais (Matrícula, Função, Classe) e informações de porte de arma (Número SINARM).
*   **Dashboard de Controle**: Visão consolidada do efetivo, categorizando guardas por status (*Ativo, Inativo, Licença, Aposentado*) e monitorando a validade das carteiras para evitar documentos expirados.
*   **Gestão de Fotos**: Upload e armazenamento de fotos dos servidores para personalização das carteiras.

### B. Emissão de Documento Funcional
*   **Gerador de Carteira Digital**: Interface que renderiza o layout oficial da carteira (Frente e Verso), pronto para impressão ou exibição digital.
*   **QR Code Dinâmico**: Cada carteira possui um QR Code único vinculado a um token seguro gerado pelo backend.

### C. Sistema de Validação Pública
*   **Portal de Autenticidade**: Rota pública (`/validate/[token]`) que permite a qualquer cidadão ou autoridade validar a identidade funcional escaneando o QR Code.
*   **Verificação em Tempo Real**: O sistema consulta o banco de dados e confirma se o guarda está com o status "Ativo" e se os dados exibidos no papel conferem com os registros oficiais.

### D. Segurança e Infraestrutura
*   **Controle de Acesso**: Sistema de login com diferentes níveis de permissão (ADMIN e USER).
*   **Proteção Anti-Abuso**: Mecanismo de **IP Ban** e **Rate Limiting** para impedir ataques no login ou tentativas massivas de validar tokens.
*   **Infraestrutura de Produção**: Deploy otimizado em servidor Linux utilizando **Systemd** para persistência e **Nginx** como proxy reverso.

---

## 2. Stack Tecnológica
*   **Backend**: Node.js com NestJS.
*   **Frontend**: Next.js 15 (App Router) com Tailwind CSS e Shadcn/UI.
*   **Banco de Dados**: PostgreSQL gerenciado pelo Prisma ORM.
*   **Servidor**: Linux com Nginx e Systemd.
