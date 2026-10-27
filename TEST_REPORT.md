# Relatório de testes · GeoScope v1.0

## Recursos estratégicos · 27/10/2026

Backup completo anterior à alteração: 68 arquivos verificados, localização em BACKUP.md. Recorte, extração, unidades e licenças em RESOURCE_SOURCES.md.

Testes executados nesta implementação:

| Verificação | Resultado |
|---|---|
| Ligação dos módulos e sintaxe | Todos os módulos, incluindo resources.js, passaram; import real de app.js executado sem iniciar aplicação no Node |
| Auditoria dos recursos | 384 registros de origem, 382 valores numéricos disponíveis; 346 registros EIA confrontados com as séries originais; todos os valores de minerais/urânio conferidos com âncoras verificadas nas fontes; hashes dos downloads conferidos |
| Valores WDI e geometrias | Teste existente confirmou 664 observações econômicas/demográficas, 177 códigos e integridade da distribuição |
| Carregamento normal | No navegador Chromium e motor Live Server instalado: Brasil inicial, 177 caminhos, sem erros no fluxo funcional |
| Cinco recursos | Todos selecionáveis e com preenchimento real do mapa: petróleo 173 entidades, gás 172, lítio 9, urânio 12, terras raras 16; seleção do país preservada |
| Consulta por busca | EUA/petróleo: 13.266,82 mil barris/dia; Rússia/gás: 642,04 bilhões m³/ano; Chile/lítio: 48.900 t Li; Cazaquistão/urânio: 23.270 t U; China/terras raras: 270.000 t REO, sempre com ano 2024 e fonte |
| Estimativas | USGS estimado/reportado, flags est. WNA e limitação de flags EIA exibidos; parser não incorporou sobrescritos das notas aos valores |
| Confidencial e ausente | Lítio dos EUA exibe Dados não disponíveis e nota W; urânio do Brasil indisponível sem zero imputado |
| Zero publicado | Terras raras do Canadá exibe 0, unidade/fonte/ano e preenchimento específico #b9b6de; não confunde com hachuras de ausência |
| Positivos muito pequenos | Formatação corrigida e testada para impedir arredondamento a zero; mínimo da legenda de gás aparece como 0,00199, não 0 |
| Zoom na troca de recurso | Transformação SVG idêntica antes/depois da mudança de seletor; restauração mundial e destaque continuam disponíveis |
| Comparador | Linha do recurso com unidades/fontes/ano; USA × BRA em terras raras conferido; inversão produziu BRA/USA; limpeza e adicionar país pelo painel funcionaram |
| Camadas anteriores | Política, população, PIB e PIB per capita alternadas no navegador, com 177 caminhos e seleção CAN preservada |
| Base opcional ausente | Rota de teste com resources.json 404: 177 países renderizados, busca habilitada, recursos desabilitados e erro explicado; core não foi bloqueado |
| Responsividade | Em 390 × 844, seletor com 299 px, documento com 375 px de largura útil, sem rolagem horizontal; mapa primeiro e controles legíveis. Viewport restaurado ao final |
| Subdiretório | Recursos visualizados e consultados em `/labs/geoscope/index.html`, servindo dist/ com caminhos relativos |

Evidências: tests/resources-browser-results.json, tests/screenshots/resources-desktop.png e resources-mobile.png. Capturas das páginas fonte USGS também foram usadas para conferência das notas/colunas. Não foram executados testes em aparelho físico, outros navegadores ou WordPress em produção. O teste usou o motor da extensão Live Server, sem acionar o comando do VS Code por interface gráfica. Erro de carregamento deliberado da base gerou aviso esperado no console; o fluxo normal não apresentou erro JavaScript.

Fontes e datasets originais são mantidos em data/raw/resources/ para auditoria, fora do pacote de publicação. Demais seções abaixo preservam os testes das etapas anteriores e não devem ser confundidas com uma nova execução exaustiva de todo o histórico.

Ocorrência do ambiente: durante a regeneração de dist/ com auto-refresh aberto, o motor Live Server encerrou com erro EBUSY lendo dist/index.html na pasta OneDrive. O servidor foi reiniciado após a gravação; a captura final foi feita com arquivos estáveis e auto-refresh desativado somente no harness de testes. A extensão instalada e suas configurações não foram modificadas. O README orienta parar o servidor antes de substituir arquivos.

## Mapa aparentemente vazio em janela baixa · 27/10/2026

Diagnóstico detalhado em MAP_DIAGNOSTIC_REPORT.md. Nesta revisão houve reprodução real de um defeito de layout: em 1280 × 500, as 177 geometrias existiam, mas o mundo começava em y=500,99, abaixo da tela. Depois do ajuste de style.css, passou a ocupar y=341,55–481,73, inteiro visível, com controles também dentro da janela. Em 1280 × 720 passou a ocupar y=362,22–642,57.

O carregamento normal de D3/JSON/imports não apresentou erro no navegador. Não foi possível inspecionar a sessão original do usuário; a causa demonstrada foi de enquadramento, sem atribuir falha de rede não observada. Comparações de todos os arquivos HTML/CSS/JS com os backups foram registradas em tests/. Código de inicialização, dados, cartografia e recursos anteriores preservados.

Foram executados testes reais no motor Live Server instalado, incluindo versão em subdiretório, busca, camada, seleção, zoom, restauração e conferência móvel; testes existentes de utilitários, módulos, dados e distribuição. Evidências em tests/map-layout-results.json e capturas map-before-window.png, map-after-window.png e map-fixed.png. Demais seções abaixo preservam o histórico das revisões anteriores.

## Ajustes finais de apresentação · 27/10/2026

Backup anterior à edição: 59 arquivos, ZIP/CRC e SHA-256 verificados, localização em BACKUP.md. Todas as 664 observações disponíveis foram inspecionadas: ano 2023 e sourceId worldbank, coerente com sources.json. Metadados de capitais/regiões foram distinguidos do período estatístico.

Testes desta etapa no navegador Chromium, com o motor da extensão Live Server instalada, distribuição em `/labs/geoscope/`:

- Mapa com 177 caminhos e inicialização normal.
- Link HTML acessível de retorno: href `https://divisaosete.com/`, sem target externo (mesma aba), alvo de 44 px de altura. Destino conferido no DOM; não foi necessária navegação ao portal externo.
- Antártida: todos os quatro indicadores ausentes exibiram “Dados não disponíveis”, sem zero imputado. Comparação Antártida × Brasil confirmou o mesmo comportamento e preservou os valores do Brasil.
- Recursos estratégicos: opção desabilitada após inicialização, texto “Em desenvolvimento” também no painel e comparador.
- Rodapé contém a origem/ano corretos e identifica o cadastro de capitais/regiões consultado em 2026.
- Busca `japao` + Enter selecionou Japão, destaque JPN; troca para população preservou seleção e atualizou legenda.
- Inspeção visual em 320 × 844: botão de retorno acomodado no cabeçalho sem sobreposição; documento sem rolagem horizontal. Conferência de largura também em 390 × 844. Viewport restaurado ao final.
- Nenhum erro/aviso de console observado no fluxo testado.
- Testes de utilitários (incluindo ausência e zero real), ligação/inicialização, sintaxe e integridade de dados/distribuição executados. Datasets e D3 comparados por hash com o backup, sem alteração.

Captura desta etapa: `tests/screenshots/prepublication.png`. Nenhuma publicação, integração WordPress em produção, teste em aparelho físico ou nova auditoria completa de acessibilidade foi realizada. Relatórios abaixo preservam o histórico de etapas anteriores.

## Complemento: correção de inicialização · 27/10/2026

Consulte INITIALIZATION_REPORT.md para diagnóstico e testes desta correção. O relato abaixo documenta a implementação inicial e não deve ser confundido com uma nova execução de todos aqueles testes.

Nesta revisão foram repetidos: sintaxe de todos os módulos (incluindo bootstrap), testes de utilitários, validação dos 177 códigos/geometrias e 664 valores WDI, hashes da distribuição e testes de carregamento em tests/startup.test.mjs. Dados e assets foram comparados com o manifesto do backup anterior à correção, sem alterações.

No navegador, o motor da extensão Live Server instalada confirmou inicialização, 177 caminhos SVG válidos, controles habilitados, busca por teclado, seleção cartográfica, camadas e zoom em subdiretório. Foram injetadas falhas reais de import, MIME, D3, HTTP, JSON e resposta pendente; todas passaram a exibir erro em vez de espera permanente. Recuperação de JSON corrigido foi confirmada sem recarregar a página em servidor HTTP sem auto-refresh.

A falha original não ocorreu na configuração padrão com os arquivos íntegros. O mesmo sintoma foi reproduzido antes da correção por import ausente. Não foi inferida uma causa específica da sessão original sem evidência.

Executados em **27/10/2026**, Windows, navegador real integrado ao Codex (Chromium), servidor HTTP local. Testes de navegador realizados tanto no diretório fonte quanto em `/dist/`, demonstrando execução em subdiretório. Não houve publicação externa.

## Resultados executados

| Verificação | Resultado / evidência |
|---|---|
| Carregamento inicial e mapa | Passou: 177 caminhos SVG e Brasil selecionado com painel preenchido |
| Seleção por clique no mapa | Passou: caminho de Argentina atualizou título e destaque |
| Busca sem acento e teclado | Passou: `japao` + seta + Enter selecionou Japão e centralizou em 6× |
| Busca com acento | Passou: `Antártida` selecionou a entidade correspondente |
| Busca sem resultados | Passou: `zzzzzz` exibiu mensagem explícita |
| Zoom pelos botões | Passou: ampliação para 1,5×; restauração para 1× |
| Zoom por roda | Passou: interação sobre o mapa alterou escala de 1,5× para 4,1× |
| Arraste | Passou: transformação mudou de `translate(-250,-150)` para aproximadamente `translate(-103,-91)` em escala 1,5× |
| Camadas e legenda | Passou: política, população, PIB e PIB per capita alteram preenchimento e legenda; recursos exibe hachuras e indisponibilidade |
| Seleção/zoom na troca de camada | Passou: Japão e escala 6× preservados ao ativar PIB nominal |
| Comparação | Passou: Brasil × Estados Unidos apresentou quatro indicadores, anos, unidades e links; inversão produziu USA/BRA; limpeza restaurou estado vazio |
| Indicadores ausentes | Passou: Antártida mostrou “Dado indisponível”; nenhum zero imputado |
| Arquivo ausente | Passou: fixture local sem countries.json produziu 404 tratado, mensagem e botão de nova tentativa |
| Recuperação de arquivo ausente | Passou: arquivo restaurado e nova tentativa renderizaram Brasil sem recarregar a página |
| Dados inválidos | Passou: fixture com PIB como string foi rejeitada antes da renderização |
| Recuperação de dados inválidos | Passou após correção do cache: restaurar JSON + nova tentativa renderizou Brasil; confirmação aguardou título do país, não só término do clique |
| Console em funcionamento normal | Nenhum erro/aviso observado na primeira sessão funcional. Falhas injetadas emitiram erros esperados e tratados no console; não contam como falha desconhecida |
| Desktop | Inspeção visual em largura padrão (~1265 px), três regiões, captura completa em tests/screenshots/desktop.png |
| Tablet | Inspeção visual e DOM em 768 × 1024, painel abaixo do mapa, sem largura horizontal excedente; tests/screenshots/tablet.png |
| Smartphone | Inspeção visual e DOM em 390 × 844, mapa antes dos controles, painel abaixo, sem rolagem horizontal; tests/screenshots/mobile.png |
| Sintaxe JavaScript | `node --check` executado para todos os seis módulos, sem erro |
| Valores e identidade | `python tests/data_check.py`: 177 identificadores únicos, correspondência exata com geometrias e 664 observações iguais às respostas brutas WDI |
| Integridade e distribuição | SHA256 dos downloads e arquivos de dist conferidos; unidades, anos 2023 e valores finitos/nulos validados |
| Utilitários críticos | `node tests/utils.test.mjs`: normalização, zero real, rejeição de ausências/valores inválidos e escape HTML aprovados |
| Independência de rede | Inspeção dos arquivos: D3, CSS, JS e dados referenciados localmente; apenas links de referência são externos. Não foi simulada desconexão de rede no navegador |

## Correções durante a validação

1. Controles foram bloqueados durante a carga. A camada inicialmente marcada passou a orientar a renderização, evitando divergência entre opção e mapa se houver interação muito cedo.
2. Requisições JSON usam `cache: no-store` para que a recuperação não reutilize JSON inválido após restauração com data de modificação anterior.
3. Listas do comparador são recriadas sem duplicação em eventual reinicialização.

## Verificações pendentes / limites

- Pinça e arraste em aparelho físico com toque: implementados por D3, mas não testados em dispositivo físico.
- Safari, Firefox, navegadores antigos e hospedagem final: não testados.
- Leitor de tela, auditoria automática completa de acessibilidade e medição formal de contraste: não executados. HTML usa rótulos, foco visível, combobox com teclado, anúncios de estado, link de salto e preferência de movimento reduzido.
- Tooltip por hover: implementado e nome nativo SVG disponível; não houve teste automatizado específico de hover.
- Enquadramento máximo 12× e preferência de movimento reduzido: verificados no código, sem execução dedicada nos extremos.
- Recursos estratégicos permanecem sem dataset quantitativo validado, conforme documentação e interface.
- O mapa 110m não representa todos os pequenos Estados/ilhas. Não houve cruzamento manual exaustivo de fronteiras ou conferência demográfica independente dos valores WDI.
- Nenhum teste de publicação ou integração WordPress foi executado; arquivos do site não foram acessados ou alterados.

Não foram identificados erros críticos conhecidos no núcleo testado. Este relatório não equivale a aprovação universal de compatibilidade ou auditoria cartográfica independente.
