# Planejamento SICAF - Versão 2.0.0

Este documento detalha os requisitos levantados para as expansões de curto/médio prazo do sistema SICAF, focadas na emissão física e cadastro detalhado, conforme alinhamentos com a SEMUSC.

---

## 1. Carteira Funcional (Emissão e Validação Pública)

### Validação por Terceiros (QR Code)
- **Dados Mínimos**: A página pública de validação deve exibir apenas a identificação básica do guarda, status do vínculo (Ativo/Inativo) e status do porte de arma (Ativo/Inativo).
- **Ocultação de Dados Sensíveis**: Cursos, capacitações, equipamentos cautelados e especificações de armamentos **NÃO** devem ser exibidos ao público.
- **Abreviação de Nomes**: Na face pública da carteira, manter apenas o primeiro nome completo e abreviar os demais sobrenomes (ex: Donald S. C.).

### Layout e Impressão
- **Formato Físico**: Padrão CNH/PVC. O sistema deve gerar a carteira em formato otimizado para a máquina de impressão em PVC.
- **Assinatura do Servidor**: Coletada digitalmente (mesa digitalizadora/tablet) ou via arquivo de imagem (PNG) no ato da emissão, vinculada diretamente à impressão.
- **Campos Condicionais**: Informações como validade e SINARM devem ficar em branco caso o porte esteja inativo ou suspenso.

---

## 2. Expansão do Cadastro do Servidor (Gestão de Dados)

- **Novos Campos Pessoais**: Endereço, contatos de emergência, tipo sanguíneo, tamanhos de uniforme (coturno, gandola, etc).
- **Anexos e Documentos**: Upload de laudos/avaliação psicológica (com controle de datas de validade e status Apto/Inapto).
- **Padronização de Fotos**: Proporção 3:4, com o servidor fardado, utilizando o CPF como nome do arquivo de imagem para facilitar importação em lote.
- **Importação de Dados**: Prever scripts ou rotinas para ingestão em lote das planilhas em Excel e dados do SINESP/CAD para popular a base do SICAF.


