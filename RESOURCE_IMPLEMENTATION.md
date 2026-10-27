# Implementação da camada de recursos

Entrega funcional: cinco seletores de recurso, mapa quantitativo de produção, fonte/unidade/ano no painel e comparação do recurso ativo. Dados de 2024; obtenção em 27/10/2026; cobertura parcial explicitada por indicador. Não há reservas ou ocorrência geológica mapeadas.

## Arquivos

- `index.html`: habilitação condicional da camada, seletor de cinco recursos, metodologia e rodapé com fontes/anos separados.
- `style.css`: estilos do seletor e seção de recurso; conserva a correção de enquadramento e as cores do mapa.
- `js/resources.js` (novo): validação, formatação, consulta, legendas, fonte e coroplético.
- `js/app.js`: carga opcional da base, estado do recurso, sincronização de busca/seleção/painel/comparador e preservação do zoom.
- `js/layers.js`: encaminha a camada de recursos ao renderer correspondente; mantém as camadas anteriores.
- `js/countries.js`: painel do recurso ativo com prioridade quando a camada é selecionada.
- `js/compare.js`: compara o recurso selecionado, distinguindo 2024 de WDI 2023.
- `js/bootstrap.js`: diagnóstico inclui o novo módulo e bloqueia o seletor em falha de inicialização.
- `data/resources.json`: 384 registros preparados, sendo 382 valores disponíveis, com fontes e metadados; substitui o placeholder anterior.
- `data/sources.json`, `data/resources-acquisition.json`, `data/raw/resources/`: catálogo, hashes e auditoria de fontes.
- `scripts/acquire_resources.py`, `scripts/prepare_resources.py` (novos): aquisição manual e extração reproduzível.
- `scripts/package.py`: inclui a base/manifesto e documentação específica, sem arquivos brutos na hospedagem.
- `tests/resources.test.mjs`, `tests/resources_check.py` (novos): validação e conferência dos dados.
- `tests/live-server.cjs`: inclui falha deliberada apenas da base de recursos para verificar isolamento do núcleo.
- `README.md`, `SOURCES.md`, `RESOURCE_SOURCES.md`, `BACKUP.md`, `TEST_REPORT.md`, `CHANGELOG.md`: documentação atualizada.
- `dist/` e `geoscope-v1.0.zip`: distribuição regenerada.

`js/map.js`, D3, geometrias e valores econômicos/demográficos originais foram preservados. Fontes/definições/licenças detalhadas em RESOURCE_SOURCES.md; testes reais em TEST_REPORT.md. Backup integral anterior à edição em BACKUP.md. Não houve publicação nem alteração em outro projeto.

## Usar

Abra a pasta GeoScope no VS Code, clique no index.html da raiz com o botão direito e escolha **Open with Live Server**. Recarregue com Ctrl+F5 após substituir os arquivos. Selecione **Recursos estratégicos** no painel de camadas e escolha uma das cinco opções. Clique em um país ou use a busca; o indicador aparece no painel do país. As hachuras significam ausência de observação, não ausência física do recurso. Zero publicado tem cor própria. A legenda e a seção Definição e limites explicam a medida.

Para hospedagem, envie somente o conteúdo de dist/ ou extraia o ZIP de distribuição. Não há backend, chaves, autenticação, dependências remotas ou aquisição automática durante o uso.
