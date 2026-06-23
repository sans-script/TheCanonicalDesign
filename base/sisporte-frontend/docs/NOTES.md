## Resumo

- Decisão: manter a carteira funcional com dados mínimos para validação por terceiros.
  - Exibir apenas: identificação do guarda, status do vínculo (ativo/inativo) e porte de arma (ativo/inativo).
  - Não exibir detalhes de arma, cursos e equipamentos ao público.
  - Nome: usar nome completo na área interna; na face pública, primeiro nome completo e demais abreviados.
  - Campos variáveis (porte, validade etc.): quando inativo ou inexistente, deixar em branco.

- Assinatura na carteira:
  - Preferência por assinatura impressa a partir de arquivo (PNG).
  - Possível coleta em mesa digitalizadora no ato e vinculação ao registro.
  - Criar banco de assinaturas se necessário, mas pode ser capturada no momento da emissão.

- Impressão da carteira:
  - Optar por máquina de PVC (custo ~R$17 mil) em vez de papel-moeda.
  - Sistema deve gerar arquivo no formato exigido pela impressora.
  - Padrão de tamanho tipo CNH/PVC; incluir gabarito de corte/dobra quando em A4.

- QR code e segurança:
  - Validação via site oficial da Prefeitura.
  - Possibilidade de desativar rapidamente (vínculo/porte inativos).
  - Auditoria de ações no sistema e controle de acessos por setor e perfil.

- Sistema (escopo atualizado):
  - Evolui de “emissão/validação de carteiras” para um sistema de gestão mais amplo.
  - Perfis e setores com permissões distintas (armaria, centro de ensino, inteligência/controle interno).
  - Auditoria completa; sem “senha geral”. Cada administrador tem credencial própria.
  - Dados sensíveis com acesso altamente restrito (nem comandante/secretário acessam diretamente).

- Cadastro e dados do servidor:
  - Campos atuais: os da carteira e porte; expandir com endereço, contatos, tipo sanguíneo, tamanhos (coturno, gandola), documentos.
  - Anexos: certificados, laudo/avaliação psicológica (data, validade, apto/inapto).
  - Fotos padronizadas fardadas, proporção 3:4, nome de arquivo pelo CPF.

- Armamentos e equipamentos:
  - Criar banco/tabelas com itens tombados (armas, coletes, rádios, taser), com número de série.
  - Vinculação única por série; impedir duplicidade.
  - Catálogo e classificação dos equipamentos a serem enviados pela Guarda.

- Relatórios e métricas:
  - Filtros por status, cursos, porte, sexo, setores etc.
  - Geração de percentuais e listagens por necessidade operacional.

- Integrações e bases:
  - Explorar integração/API com Sinesp/CAD para importar dados e ocorrências.
  - Recadastramento geral para padronizar e atualizar dados e fotos.
  - Tratamento de dados para importação em lote (planilhas/Word → banco).

- Fases de implementação:
  1) Finalizar carteira funcional (layout, QR, impressão PVC, estados ativo/inativo).
  2) Expandir cadastro (cards adicionais, anexos, laudo psicológico).
  3) Armas/equipamentos e perfis setoriais.
  4) Relatórios/métricas e integrações (CAD/Sinesp).
  5) Evoluções futuras (gestão de pessoas/escalas, a depender de escopo).