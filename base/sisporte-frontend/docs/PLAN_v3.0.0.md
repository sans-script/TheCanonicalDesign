# Planejamento SICAF - Versão 3.0.0

Este documento detalha as funcionalidades avançadas de gestão operacional, logística e integrações do sistema.

---

## 1. Banco de Equipamentos e Armamentos (Armaria)
- **Catálogo de Tombamento**: Criação de tabelas independentes para registro de cada item logístico (Armas letais e não letais, Coletes, Rádios, Taser, etc).
- **Garantia de Unicidade**: Controle rígido por número de série. O sistema deve impedir duplicidades e garantir que uma arma só possa ser vinculada a um servidor por vez.
- **Tipagem de Armamento**: Classificação formal dos equipamentos enviada pelo setor de inteligência da Guarda.

## 2. Fluxo de Cautela (Custódia)
- **Gestão de Cautelas**: Vinculação entre o Banco de Equipamentos e os Servidores.
- **Gerenciamento Multi-Armas**: Suporte para que um único servidor possua múltiplas armas ou equipamentos sob sua responsabilidade simultaneamente.
- **Controle de Atrasos e Extensões**: Em cautelas temporárias (por turno), exigência de justificativa no sistema para extensão de prazo (missão especial) ou atraso na devolução.
- **Validação de Vigência**: A permissão para receber cautela de armamento de fogo deve ser estritamente vinculada à validade do porte e ao status da avaliação psicológica do servidor.

---

## 3. Relatórios, Métricas e Dashboards
- **Filtragem Avançada**: Capacidade de extrair listagens precisas de efetivo (ex: % de mulheres, guardas com porte ativo, guardas com curso de arma não letal, etc).
- **Gestão de Efetivo**: Subsídio em tempo real para tomada de decisões estratégicas de alocação de equipes em missões específicas (baseado em cursos e treinamentos).

---

## 4. Integrações Externas e Evolução para "SIG"
- **API SINESP / CAD**: Estudar a viabilidade de integração com bases do Ministério da Justiça (SINESP) e sistemas de ocorrência (CAD) para enriquecer a ficha do guarda automaticamente com as ocorrências atendidas.
- **Módulos Futuros (Gestão de RH e Escalas)**: Expansão do sistema para suportar dados de Recursos Humanos (atestados médicos, faltas) e o gerenciamento de Escalas de Serviço de todo o efetivo (meta de longo prazo).

---

## 5. Gestão de Perfis e Acesso
- **Fim da Senha Geral**: O sistema deixará de ter uma única "senha de administrador". Cada operador terá sua credencial.
- **Controle por Setores**: Criação de perfis restritos para Armaria, Centro de Ensino, e Inteligência/Controle Interno, cada qual acessando apenas os dados do seu escopo.
- **Auditoria de Ações**: Rastreabilidade completa de alterações no banco de dados (quem alterou, quando e o quê).
- **Privacidade Extrema**: Anotações disciplinares e dados estritamente sensíveis devem ser protegidos, não visíveis ao público nem a operadores não autorizados.
