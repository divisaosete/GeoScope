# Recursos estratégicos · fontes e cobertura

## Recorte e significado

Cinco indicadores de **produção de 2024**, obtidos em **27/10/2026**. Economia e demografia continuam no recorte WDI 2023. As edições das publicações (2026 ou snapshot em 2026) não são o ano do indicador. Não há atualização em tempo real.

Produção é um fluxo de extração em determinado período; reservas são estoques com critérios técnicos/econômicos; ocorrência geológica é evidência de presença, sem necessariamente ser economicamente extraível. Esta entrega mapeia **somente produção**, sem inferir reservas ou ocorrência. País sem observação não deve ser interpretado como país sem recurso.

| Recurso | Indicador e unidade original preservada | Fonte | Observações disponíveis no mapa | Zeros publicados incluídos |
|---|---|---|---:|---:|
| Petróleo | Petróleo bruto incluindo condensado de campo; mil barris/dia, média anual | EIA, International Energy Statistics | 173/177 | 76 |
| Gás natural | Produção de gás natural seco; bilhões de m³/ano | EIA, International Energy Statistics | 172/177 | 78 |
| Lítio | Produção mineira; toneladas métricas de conteúdo de Li/ano | USGS MCS 2026, coluna 2024 | 9/177 | 0 |
| Urânio | Produção mineira; toneladas de U/ano | World Nuclear Association, coluna 2024 | 12/177 | 0 |
| Terras raras | Produção mineira; toneladas de óxidos de terras raras equivalentes (REO)/ano | USGS MCS 2026, coluna 2024 | 16/177 | 4 |

Cobertura inclui os zeros explicitamente publicados. Lítio dos EUA é confidencial (W) e fica nulo, sem imputação. Uma observação de gás não numérica no recorte também fica indisponível. Países não listados nas tabelas de minerais/urânio permanecem sem dados, sem inferir zero. Agregados como “World”, “Others” e regiões não são distribuídos entre países.

## Petróleo e gás · EIA

[Fonte e visualizador oficial](https://www.eia.gov/international/) · [dados públicos em lote](https://api.eia.gov/bulk/INTL.zip) · [documentação de acesso](https://www.eia.gov/opendata/) · [direitos de uso](https://www.eia.gov/about/copyrights_reuse.php).

Download oficial `INTL.zip`, arquivo `INTL.txt`, JSON por linha. Filtradas exclusivamente as séries anuais canônicas por ISO3, cuja geografia corresponde ao país do mapa:

- Petróleo: `INTL.57-1-ISO3-TBPD.A`, ano `2024`, unidade `thousand barrels per day`. Não confundir com a série 55, que inclui NGPL e outros líquidos, nem com reservas.
- Gás: `INTL.26-1-ISO3-BCM.A`, ano `2024`, unidade `billion cubic meters`. Não equivale a produção bruta ou reservas. A unidade BCM já vem da EIA: não foi aplicada conversão local.

Identificadores alternativos WP foram excluídos para evitar duplicação. Não se transferem observações de uma geografia para outra por proximidade. A série pode conter estimativas e revisões da EIA, sem flag de estimativa por observação no arquivo; o painel informa essa limitação em vez de afirmar que cada número é uma medição direta. Data de atualização da série é preservada por registro.

EIA informa uso e redistribuição de seus dados em domínio público, com atribuição solicitada. O arquivo identifica essas séries como `copyright: None`. Atribuição: U.S. Energy Information Administration, International Energy Statistics, snapshot de 27/10/2026; apresentação/tradução de rótulos pelo GeoScope. Nenhum logotipo da EIA é reproduzido.

O Energy Institute foi consultado prioritariamente. Os downloads do arquivo Excel de 2025 e do PDF retornaram **HTTP 403** no acesso direto deste ambiente. Sua documentação foi consultada, mas nenhum valor foi atribuído ao EI nem copiado de fontes secundárias. A EIA foi usada como alternativa pública oficial, com indicador e definição próprios.

## Lítio e terras raras · USGS

[Lítio, capítulo MCS 2026](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-lithium.pdf) · [Terras raras, capítulo MCS 2026](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-rare-earths.pdf) · [Política de uso USGS](https://www.usgs.gov/faqs/are-usgs-reportspublications-copyrighted).

Tabela **World Mine Production and Reserves**, segunda página de cada capítulo, somente coluna **2024 de Mine production**. Reservas e seção World Resources não foram importadas. Lítio é conteúdo Li, não carbonato de lítio equivalente; terras raras são REO, incluem lantanídeos e ítrio e excluem a maior parte do escândio. Não representam capacidade de refino.

Os PDFs foram extraídos com remoção de pequenos dígitos sobrescritos de notas, e as duas páginas foram renderizadas e conferidas visualmente. Por exemplo, `5` antes de `13,800` (Argentina, lítio) é uma nota, não parte do valor; `11` antes de `45,500` (EUA, terras raras) também é uma nota. Testes com âncoras verificam todos os valores incorporados dessas duas tabelas.

O cabeçalho marca produção estimada. Exceções explicitamente reportadas: Argentina e Chile em lítio (nota 5), e EUA em terras raras (nota 11). Burma/Myanmar, Madagascar, Malásia, Tailândia e Vietnã em terras raras têm estimativas baseadas nas importações reportadas pela China, conforme nota 12 do USGS (Trade Data Monitor); essa procedência é preservada nas observações. `—` é zero conforme a própria legenda do USGS e só é convertido para zero nessa tabela; `W` é confidencial e permanece nulo. Nenhum país omitido foi convertido em zero.

Mapeamento explícito: Burma → MMR, Greenland → GRL, South Africa → ZAF e demais nomes para ISO3 da cartografia. USGS MCS 2026 contém revisões das observações de 2024; edições anteriores podem divergir. Dados USGS são de domínio público nos termos publicados, com atribuição USGS e notas de fontes derivadas preservadas. Não foram reproduzidos preços comerciais ou fotografias.

## Urânio · World Nuclear Association

[World Uranium Mining Production](https://world-nuclear.org/information-library/Nuclear-Fuel-Cycle/Mining-of-Uranium/World-Uranium-Mining-Production) · [permissão de uso](https://world-nuclear.org/general/permission-for-use-of-content).

Recorte da tabela **Production from mines (tonnes U)**, coluna 2024, com 12 países nomeados. Não inclui “Others”, totais mundiais, gráficos, outras colunas históricas ou a tabela de recursos recuperáveis. Os números são toneladas de urânio contido, não toneladas de U3O8. A WNA alerta que números podem ser revisados.

Flags “est.” da fonte foram preservadas para Uzbequistão, China, Índia, África do Sul e Ucrânia. Não se atribui produção zero a países ausentes da lista, inclusive Brasil.

**© World Nuclear Association.** O recorte reproduz somente nomes e um valor por país, com atribuição e link para a página original, dentro do limite de 150 palavras da licença consultada. Não são reproduzidos artigos integrais, marcas ou gráficos. Nenhum endosso da WNA é sugerido. O HTML bruto é mantido apenas na pasta de auditoria local, fora de dist/ e do ZIP de publicação.

## Transformações, auditoria e escala

- `data/resources.json`: dados prontos para a aplicação, metadados e flags por observação.
- `data/resources-acquisition.json`: URLs, data de obtenção e SHA-256 dos downloads, incluindo tentativas indisponíveis documentadas.
- `data/raw/resources/`: arquivos originais e observações extraídas; não enviados à hospedagem.
- `scripts/prepare_resources.py`: extração e associação reproduzíveis, sem rede. Aquisição é manual por `scripts/acquire_resources.py`; arquive a versão antes de atualizar os dados.
- `tests/resources_check.py`: valores conferidos contra séries EIA originais e âncoras verificadas nas fontes minerais/urânio.
- `tests/resources.test.mjs`: validação de unidades, ano, identidade, flags, zero real, dado confidencial e números positivos muito pequenos.

Coropléticos usam escala logarítmica independente por recurso, domínio mínimo/máximo dos valores positivos disponíveis, com extremos e média geométrica na legenda. Zero recebe cor própria; ausência recebe hachuras. Os valores continuam intactos no JSON; a apresentação usa até duas casas decimais, exceto positivos menores que 1, apresentados com até três algarismos significativos para não aparecerem como zero. Abreviações da legenda usam pt-BR. Não comparar cores entre recursos como se tivessem a mesma escala.

Recursos também podem ser consultados na seleção/busca existente e na última linha do comparador, que acompanha o recurso selecionado. Não há ranking geral de países. A abrangência das geometrias Natural Earth e da geografia estatística da fonte pode divergir; a camada não resolve disputas territoriais nem representa jazidas pontuais.
