# Changelog

## Recursos estratégicos · produção de 2024 · 27/10/2026

- Cinco indicadores locais interativos: petróleo bruto/condensado, gás natural seco, lítio, urânio e terras raras. Seletor integrado ao painel de camadas.
- EIA como alternativa oficial após HTTP 403 nos downloads do Energy Institute; USGS MCS 2026 para minerais e World Nuclear Association para urânio. Fontes, licenças, estimativas e cobertura em RESOURCE_SOURCES.md.
- Escalas logarítmicas próprias, legenda com unidade/ano, zero real separado de indisponibilidade, fonte por indicador e destaque da seleção preservado.
- Painel do recurso priorizado quando a camada está ativa; busca e seleção existentes atualizam os dados. Linha do comparador acompanha o recurso selecionado, distinguindo recursos 2024 de economia 2023.
- Base opcional validada: arquivo de recursos ausente não impede mapa, busca ou economia. Sem inferência de reservas ou ocorrência a partir de produção.
- Preservados cartografia, D3, valores WDI e enquadramento corrigido anteriormente. Dist e ZIP regenerados; sem publicação.

## Enquadramento do mapa em janelas baixas · 27/10/2026

- Corrigida a altura do SVG, que acompanhava os painéis laterais e deixava o desenho inteiro abaixo de uma janela 1280 × 500, apesar das 177 geometrias carregadas.
- Altura responsiva independente dos painéis e reposicionamento de controles/legenda cartográfica no desktop/tablet; regras móveis e identidade visual mantidas.
- Sem alterações em HTML, módulos JavaScript, cartografia, indicadores ou D3 nesta correção. Recursos adicionados anteriormente preservados.
- Reprodução e medições antes/depois no Live Server, comparação de backups e instruções em MAP_DIAGNOSTIC_REPORT.md. Dist e ZIP regenerados; nada publicado.

## Ajustes de apresentação antes da publicação · 27/10/2026

- Link acessível “← Voltar à New Era” no cabeçalho, mesma aba, com adaptação para telas estreitas.
- Mensagem “Dados não disponíveis” no painel, comparador e legendas, preservando zero real e valores ausentes nos dados originais.
- Recursos estratégicos identificados como “Em desenvolvimento”; opção desabilitada até existir dataset validado.
- Rodapé informa “Indicadores: 2023 | Fonte: Banco Mundial”, confirmado em todas as 664 observações disponíveis. Capitais e regiões identificadas separadamente como cadastro consultado em 2026.
- Backup completo verificado, sem mudanças nos dados, cartografia, biblioteca, cores temáticas ou lógica de pesquisa/seleção. Distribuição e ZIP regenerados. Sem publicação.

## Correção de inicialização · 27/10/2026

- Backup integral verificado antes de alterações; localização em BACKUP.md.
- Entrada clássica `js/bootstrap.js` carrega D3 antes de importar o módulo principal e captura falhas do grafo de imports, que antes escapavam do tratamento de `start()`.
- `start()` exportada, sem execução automática durante import; preparação dos controles dentro do bloco protegido e conferência do número de caminhos SVG.
- JSON resolvido relativamente ao módulo principal; mensagens de HTTP/JSON inválido e cancelamento após 15 segundos. Bootstrap também limita espera de D3 e módulos.
- Mensagens de erro e recuperação visíveis; caminhos relativos e estrutura estática preservados.
- Nenhuma alteração de design, geometria, valores de indicadores ou biblioteca D3.
- Testes com o motor da extensão Live Server instalada, falhas deliberadas e distribuição montada em `/labs/geoscope/`. A falha original não ocorreu com os arquivos íntegros na configuração padrão testada; relatório detalha essa limitação.

## 1.0.0 · 27/10/2026

- Aplicação estática independente, sem backend, contas, segredos ou dependências de rede no uso normal.
- Cartografia Natural Earth 110m, 177 entidades, projeção Equal Earth, zoom limitado a 1–12× e arraste/toque via D3 local.
- Busca parcial tolerante a acentos com português, nome internacional e códigos; seleção por teclado e mapa.
- Painel com capitais/regiões do cadastro WDI e quatro indicadores de 2023, unidades, fontes e estados de ausência.
- Camadas política, população, PIB e PIB per capita com escalas próprias e legenda; recursos estratégicos explicitamente indisponíveis.
- Comparação de dois países, inversão, limpeza e barras proporcionais lineares por indicador.
- Layout desktop/tablet/mobile, foco visível, link de salto, anúncios de estado e movimento reduzido.
- Recuperação de carregamento de arquivos com botão de nova tentativa; validação dos dados antes de renderizar.
- Arquivos de auditoria, aquisição manual, empacotamento e verificação de integridade.
- Sem publicação automática e sem modificações em projetos vizinhos. Backup não aplicável: diretório inicialmente vazio.
