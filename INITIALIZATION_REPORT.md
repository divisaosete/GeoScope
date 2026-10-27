# Correção da inicialização · GeoScope v1.0

Data: 27/10/2026. Ambiente: Windows, navegador Chromium integrado, motor `live-server` 2.2.0 incluído na extensão VS Code `ritwickdey.liveserver` 5.7.10 instalada, porta local 5501. Também usado servidor HTTP Python local na porta 8766 para testar recuperação sem interferência do recarregamento automático. Não houve publicação nem alteração de configurações da extensão, WordPress ou outros projetos.

## Causa comprovada e limite do diagnóstico

O HTML original referenciava corretamente `assets/d3.min.js` e `js/app.js`. Todos os cinco imports estáticos de app.js existem e exportam os símbolos utilizados. Os caminhos de world.geojson e countries.json estavam corretos quando servidos como arquivos estáticos. **A versão anterior abriu normalmente com os arquivos íntegros**, tanto em HTTP simples quanto no próprio motor do Live Server instalado: 177 geometrias e busca habilitada. Portanto, não há evidência para afirmar qual requisição/configuração falhou na sessão original relatada pelo usuário.

A causa reproduzível do estado preso em “Carregando…” é uma lacuna no tratamento de falhas: o navegador precisa buscar, analisar e ligar todo o grafo de imports **antes de executar app.js**. Um módulo ausente, inválido ou servido com MIME inadequado impede a execução de `start()`. O `try/catch` interno não pode capturar essa falha anterior à sua própria execução. Além disso, as requisições de dados não tinham prazo de cancelamento; um servidor que não conclui uma resposta podia manter `Promise.all` pendente indefinidamente.

Reprodução antes da correção: cópia isolada da aplicação sem js/map.js, servida pelo Live Server, mostrou **zero caminhos, mensagem “Carregando cartografia e indicadores…” e botão de recuperação oculto**. Isso reproduziu exatamente o sintoma de interface. Não é prova de que map.js estivesse ausente na sessão original; os arquivos atuais estavam presentes.

## Alterações de produção

- `index.html`: troca das duas entradas independentes por `js/bootstrap.js` clássico com defer e mensagem de falha de carregamento da própria entrada.
- `js/bootstrap.js` (novo): carrega e valida D3 local, aguarda a biblioteca, importa app.js com captura de rejeição e chama start(). Limites de 15 segundos e botão de recarga para falhas do grafo de módulos.
- `js/app.js`: exporta start() sem iniciá-la durante import; protege a preparação inicial dos controles; resolve URLs de dados relativamente a import.meta.url; verifica se os caminhos renderizados correspondem às feições carregadas. Mantém busca, camadas, seleção e comparação existentes.
- `js/utils.js`: carregamento JSON com AbortController, mensagens contendo caminho e status HTTP, diagnóstico de JSON inválido, cancelamento após 15 segundos e limpeza do temporizador.
- `dist/` e `geoscope-v1.0.zip`: regenerados a partir das fontes corrigidas.

Documentação atualizada: BACKUP.md, README.md, CHANGELOG.md, TEST_REPORT.md e este relatório. Novos testes: tests/startup.test.mjs e tests/live-server.cjs. Fixtures temporárias foram usadas somente em tests/.

Design, CSS, arquivos de dados e D3 foram preservados. Nenhum endereço absoluto de hospedagem, CDN, backend ou chave foi introduzido na aplicação.

## Testes efetivamente executados nesta correção

| Teste | Resultado |
|---|---|
| Versão anterior intacta em HTTP e Live Server instalado | Funcionou: 177 caminhos, controles habilitados; falha original não reproduzida nessa configuração |
| Versão anterior sem import map.js | Reproduziu carregamento permanente, mapa vazio, sem botão de recuperação |
| Versão corrigida sem import map.js | Erro explícito de módulo e botão “Recarregar aplicação”; controles bloqueados |
| Módulo servido como text/html | Erro explícito de módulo/MIME, sem carregamento permanente |
| D3 ausente (HTTP 404) | Mensagem com caminho da biblioteca, botão de recarga e controles bloqueados |
| world.geojson com HTTP 404 | Mensagem com caminho e HTTP 404; nova tentativa disponível |
| countries.json malformado | Mensagem de JSON inválido com caminho; nova tentativa disponível |
| world.geojson sem resposta | Cancelado pelo cliente após 15 segundos; mensagem “Tempo limite” e nova tentativa disponível |
| Restaurar JSON e clicar nova tentativa | Renderizou Brasil sem recarregar a página, em HTTP simples para evitar auto-refresh do Live Server |
| Distribuição em `/labs/geoscope/index.html` pelo Live Server | 177 caminhos SVG, todos com atributo d preenchido; mensagem inicial substituída por “Brasil selecionado”; zero controles desabilitados entre os nove verificados |
| Busca japao, seta, Enter | Selecionou Japão; painel e destaque JPN atualizados |
| Camada população | Legenda e preenchimento atualizados; seleção JPN preservada |
| Clique cartográfico | Argentina selecionada e painel atualizado |
| Botão de zoom | Ampliação do mapa executada no navegador |
| Console no fluxo funcional do subdiretório | Nenhum erro ou aviso observado; sessões de falha produzem os erros esperados |
| Ligação real de módulos no Node | Import de app.js ligou todos os imports sem iniciar a aplicação nem acessar o DOM |
| Testes automatizados de dados/carregamento | Verificações de HTTP 404, JSON inválido, timeout e resolução em subdiretório |

Evidências adicionais: tests/initialization-results.json e tests/screenshots/initialization-fixed.png. As verificações finais de sintaxe, utilitários e integridade são registradas em TEST_REPORT.md.

Não foi acionado o comando do VS Code por interface gráfica: o teste usou diretamente o motor instalado da extensão, com raiz explícita do GeoScope e recarregamento automático. Configurações particulares da sessão original, Safari/Firefox, WordPress em produção e dispositivos físicos não foram testados. Um arquivo realmente bloqueado, ausente ou uma configuração de servidor incorreta ainda precisa ser corrigido na origem; agora a aplicação apresenta o erro em vez de manter a espera sem explicação.
