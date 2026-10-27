# GeoScope v1.0 · New Era Labs / Divisão 7

Observatório estático independente em português. Mapa SVG Equal Earth com 177 entidades Natural Earth, busca por nomes/códigos, zoom/arraste, camadas de população, economia e cinco recursos estratégicos, e comparação entre dois países. Indicadores WDI de **2023**, coletados em **27/10/2026**.

## Executar

**Live Server do VS Code:** abra a pasta GeoScope, clique com o botão direito no `index.html` da raiz e selecione **Open with Live Server**. Use a URL HTTP e a porta abertas pela extensão (por exemplo, `http://127.0.0.1:5500/index.html`). Após atualizar os arquivos, use **Ctrl+F5** para renovar o CSS em cache. Não use file://. A distribuição também pode ser conferida em `/dist/index.html` no mesmo servidor. Diagnóstico e procedimento completos em MAP_DIAGNOSTIC_REPORT.md.

Pare o Live Server antes de substituir arquivos ou gerar novamente dist/ e reinicie-o depois. Durante os testes na pasta do OneDrive, o motor da extensão encerrou com EBUSY ao ler index.html durante uma substituição do arquivo. Com os arquivos prontos e o servidor reiniciado, o teste HTTP voltou a funcionar; não é necessário alterar a extensão.

Sirva o diretório por HTTP/HTTPS. Não abra index.html diretamente via file://: o navegador restringe o carregamento dos JSON e módulos JavaScript.

Com Python instalado, execute nesta pasta:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Acesse http://127.0.0.1:8000/. Não há instalação de pacotes, backend, autenticação, banco ou chaves. A rede só é necessária na aquisição opcional dos dados; a aplicação em produção usa arquivos locais.

## Estrutura e manutenção

- `index.html`, `style.css`, `js/`: aplicação modular sem build.
- `assets/`: D3 7.9.0 local e licença ISC. D3 oferece projeção Equal Earth, geração dos caminhos e interação de zoom/arraste/toque, evitando implementar cartografia e gestos manualmente.
- `data/`: catálogo, geometrias e metadados; `data/raw/` preserva respostas originais para auditoria.
- `scripts/acquire.py`: coleta explícita, manual, de fontes; exige internet. Não roda ao abrir a aplicação. Reexecutar pode substituir a fotografia atual; arquive o projeto antes de atualizá-la.
- `scripts/prepare_data.py`: liga geometrias e WDI por códigos, remove propriedades cartográficas não utilizadas; não altera os valores nem inventa observações.
- `scripts/package.py`: gera `dist/` e manifesto SHA256, sem rede.
- `tests/data_check.py`: valida códigos, unidades, anos e igualdade de todas as observações com os arquivos originais.

## Validar

```sh
python scripts/package.py
python tests/data_check.py
node --check js/app.js
```

Execute também `node --check` para cada módulo em js/. Testes de interação e limitações estão em TEST_REPORT.md.

## Publicar manualmente

1. Confirme com a hospedagem a pasta pública e o destino; `/labs/geoscope/` é apenas a rota planejada.
2. Faça backup de qualquer conteúdo já existente no destino antes de substituir arquivos.
3. Pelo gerenciador de arquivos ou SFTP, crie a pasta independente, sem alterar WordPress, tema ou plugins.
4. Envie **o conteúdo** de `dist/`, preservando `data/`, `assets/` e `js/`. Não envie a pasta como `geoscope/dist/` por engano.
5. Confira que o servidor entrega `.js` como JavaScript e `.json`/`.geojson` como JSON; permita arquivos estáticos nesses diretórios.
6. Abra o destino por HTTPS, teste busca, camadas e comparação em computador e celular; verifique erros no console e respostas 404. Se necessário, limpe o cache de arquivos alterados.

Todos os caminhos da aplicação são relativos. Links externos abrem apenas referências solicitadas pelo visitante. Não houve publicação nem alteração no site.

## Limitações conhecidas

O cabeçalho inclui um link para voltar à New Era na mesma aba. O rodapé informa o ano/fonte dos indicadores e distingue os metadados de capitais/regiões. Indicadores ausentes usam “Dados não disponíveis”. Recursos estratégicos são interativos: selecione a camada e escolha petróleo, gás natural, lítio, urânio ou terras raras. A medida disponível é produção de 2024; unidade, fonte e estimativas aparecem no painel e legenda. Reservas e ocorrência não são mapeadas.

Cartografia de baixa resolução não inclui todos os pequenos Estados e ilhas. 177 entidades não equivalem a 177 países soberanos. Geometria francesa pode incluir territórios ultramarinos; a cobertura econômica é a do Banco Mundial, não uma medição exata do polígono. A busca inclui as entidades do mapa, com português fornecido pela Natural Earth (algumas grafias lusitanas), nome internacional e identificador.

Capitais/regiões são metadados do cadastro do Banco Mundial obtido em 2026 e podem aparecer no idioma original; não são uma série histórica de 2023. Os recursos usam produção de 2024, com cobertura parcial documentada em RESOURCE_SOURCES.md. Falta de observação não significa ausência física de recursos. Não há atualização automática.

Backup da implementação inicial: diretório vazio. Antes da correção de inicialização foi criado e verificado um backup completo de 52 arquivos, conforme BACKUP.md.

## Inicialização e diagnóstico no Live Server

Abra `index.html` com **Open with Live Server**. A raiz pode ser a própria pasta GeoScope ou um diretório superior: scripts e dados continuam relativos à aplicação. Não é necessário instalar dependências ou alterar as configurações do VS Code.

`js/bootstrap.js` é a entrada clássica carregada pelo HTML. Ela aguarda o D3 local e então importa `js/app.js` e chama sua função exportada `start()`. Falhas de D3, carregamento dos módulos, tipo MIME, HTTP e JSON aparecem na interface. As etapas de carregamento têm limite de 15 segundos. A mensagem inicial é substituída pelo país selecionado após a renderização e os controles são habilitados.

Se houver erro de módulo, corrija o arquivo/resposta indicado e use **Recarregar aplicação**: o navegador pode guardar um import malsucedido no grafo de módulos. Falhas dos dados usam **Tentar carregar novamente**, sem recarregar a página. Confira a aba Network/Rede do navegador para respostas 404, páginas HTML devolvidas no lugar de JavaScript e bloqueios de acesso. Em hospedagem estática, `.js` precisa ser servido como JavaScript. A origem específica de uma falha pode depender da configuração do servidor ou de arquivos bloqueados/incompletos; consulte INITIALIZATION_REPORT.md para a distinção entre diagnóstico comprovado e hipóteses.

Teste adicional sem navegador: `node tests/startup.test.mjs` verifica a ligação real dos imports e erros de dados. `tests/live-server.cjs` é somente um servidor de testes de falhas, usando como argumento o caminho de uma instalação existente de `live-server`; não faz parte da distribuição e não deve ser publicado.
