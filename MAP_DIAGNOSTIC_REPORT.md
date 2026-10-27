# Diagnóstico do mapa vazio · 27/10/2026

## Proteção

Antes de alterações foi criado um backup completo de 60 arquivos, com CRC do ZIP e SHA-256 de todos os conteúdos comparados aos originais:

`C:\Users\joaol\.codex\visualizations\2026\10\27\01a17e97-5ffb-7802-9c44-a85e8ec1b847\GeoScope-backup-mapa-20261027-163820\GeoScope.zip`

Manifesto e confirmação de integridade estão na mesma pasta externa. Outros projetos não foram modificados.

## Comparação com a versão anterior funcional

Referência: `GeoScope-backup-prepublicacao-20261027-162718`, anterior aos últimos ajustes de apresentação. Diferenças completas em `tests/comparison-GeoScope-backup-prepublicacao-20261027-162718.diff`; relação de arquivos em `tests/map-comparison.json`.

| Arquivo fonte alterado nos últimos ajustes | Diferença |
|---|---|
| index.html | Link de retorno, recurso estratégico desabilitado/identificado em desenvolvimento, origem e período no rodapé |
| style.css | Estilos adicionais do link, recursos desabilitados e rodapé; adaptação do cabeçalho móvel |
| js/compare.js | Textos de ausência e recursos em desenvolvimento |
| js/countries.js | Textos de ausência e recursos em desenvolvimento no painel |
| js/layers.js | Textos de ausência nas legendas e recursos em desenvolvimento |
| js/utils.js | Texto retornado para indicador ausente |
| tests/utils.test.mjs | Expectativa atualizada para o novo texto de ausência |

As mesmas seis alterações de produção foram refletidas em dist/index.html, dist/style.css e nos quatro módulos correspondentes. Nenhuma alteração em js/map.js, js/bootstrap.js ou js/app.js nesses últimos ajustes. Dados e D3 preservados. O backup anterior à primeira correção de inicialização também foi consultado; as mudanças de bootstrap/export/timeout naquela etapa já estão documentadas em INITIALIZATION_REPORT.md.

## Causa concreta reproduzida

Com os arquivos atuais íntegros, D3 e módulos carregaram normalmente, os JSON foram lidos e **177 países receberam caminhos SVG**. Não houve erro de console no fluxo normal. Logo, nesse teste o mapa não estava vazio por falta de geometria.

O problema reproduzido foi de **enquadramento vertical**: `.workspace` fica alta devido ao conteúdo dos painéis adjacentes, enquanto `#map` usava `height:100%` e `min-height:530px`. O SVG 1000 × 600, ajustado a um contêiner alto e estreito, centralizava verticalmente o desenho pelo alinhamento padrão. Assim, a parte superior do painel parecia vazia, embora o mundo estivesse desenhado abaixo.

Antes da correção, em janela **1280 × 500** sem rolagem: SVG com 755,5 px de altura; início do mundo em **500,99 px**, inteiramente fora da tela. Em 1280 × 720, o mundo terminava abaixo da tela, em aproximadamente 819,7 px. As 177 geometrias estavam presentes em ambos os casos. Captura: `tests/screenshots/map-before-window.png`.

Essa deficiência de layout já existia antes dos últimos ajustes. Mudanças no comprimento dos textos podem alterar a altura dos painéis; a comparação não revelou regressão de imports ou cartografia introduzida pelos novos textos.

Não foi possível conferir a URL, mensagem ou console da sessão original do usuário. Portanto, este relatório demonstra e corrige uma causa concreta do mapa aparentemente vazio em janela baixa, sem afirmar que alguma falha não observada de servidor, cache ou arquivo bloqueado também esteja excluída na sessão original.

## Correção aplicada

Somente **style.css** foi alterado na lógica/apresentação do produto, além de sua cópia regenerada em dist:

- Acima de 560 px de largura, altura do SVG independente dos painéis laterais: `clamp(180px, calc(100vh - 360px), 600px)`.
- Remoção do mínimo de 530 px nesse intervalo e alinhamento ao início da área central, com espaço para o cabeçalho do mapa.
- Controles e rodapé cartográfico reposicionados para acompanhar a área visível do SVG.
- Regras móveis existentes preservadas; projeção, cores e geometria não foram modificadas.

Na mesma janela **1280 × 500**, o mundo passou a ocupar de **341,55 a 481,73 px**; controles de **335,89 a 477,89 px**. Todo o mundo e todos os botões ficaram visíveis, com 177 caminhos. Captura: `tests/screenshots/map-after-window.png`. Em **1280 × 720**, o mundo passou a ocupar de **362,22 a 642,57 px**, também inteiro dentro da janela.

## Testes reais

- Motor Live Server 2.2.0 incluído na extensão VS Code ritwickdey.liveserver 5.7.10 instalada, iniciado com raiz explícita do GeoScope e HTTP local.
- HTML e D3 local, ligação dos imports/exports, carregamento dos JSON, ausência de erros de console e 177 caminhos SVG confirmados no navegador Chromium.
- Reprodução visual antes/depois em 1280 × 500; medição e inspeção em 1280 × 720.
- Busca japao + Enter selecionou Japão; troca para população preservou destaque JPN e atualizou camada. Zoom, restauração, seleção cartográfica e layout móvel conferidos na revisão final.
- Distribuição regenerada e testada no subdiretório `/labs/geoscope/`.
- Testes existentes de utilitários, ligação real dos módulos e integridade de dados/distribuição executados. Comparação por SHA-256 preservou HTML, JavaScript, dados e biblioteca em relação ao backup anterior a esta correção.

Evidências numéricas: `tests/map-layout-results.json`. Captura final: `tests/screenshots/map-fixed.png`. Não houve publicação, teste em WordPress de produção ou em dispositivos físicos. Os testes usaram o motor da extensão, sem acionar o comando do VS Code por interface gráfica.

## Como executar pelo Live Server

1. No VS Code, use **Arquivo → Abrir Pasta** e selecione `C:\Users\joaol\OneDrive\Documentos\Divisão-7\Projetos\GeoScope`.
2. Se houver outro Live Server aberto, pare-o antes de iniciar o desta pasta.
3. No explorador do VS Code, clique com o botão direito no **index.html da raiz** e escolha **Open with Live Server**.
4. Acesse a URL HTTP aberta pela extensão. Se a porta for 5500, será normalmente `http://127.0.0.1:5500/index.html`; use a porta efetivamente informada pelo VS Code.
5. Faça uma recarga completa com **Ctrl+F5** para carregar o CSS corrigido. Não abra pelo caminho `file://`.
6. Confirme a mensagem “Brasil selecionado”, o mundo visível e os controles ativos. Para conferir a distribuição separadamente, abra `http://127.0.0.1:PORTA/dist/index.html`.

Não é necessário instalar pacotes, executar build ou alterar dados. Para hospedar depois, use o conteúdo de dist/ ou o ZIP atualizado, sem publicar esta pasta de testes.
