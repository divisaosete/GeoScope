# Fontes e metodologia · GeoScope v1.0

Data de obtenção: **27/10/2026**. Respostas brutas e hashes SHA256: `data/raw/` e `data/acquisition.json`. Arquivos de produção compactados sem modificar coordenadas ou observações numéricas. Unidades mantidas; somente apresentação com separadores pt-BR e abreviações.

## Banco Mundial · World Development Indicators

[API oficial](https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures) · [WDI](https://datatopics.worldbank.org/world-development-indicators/) · [Licenciamento e termos](https://datacatalog.worldbank.org/public-licenses).

Dados abertos WDI: CC BY 4.0 com termos adicionais do Banco Mundial. Atribuição: Banco Mundial, World Development Indicators. As transformações locais são filtragem de entidades cartográficas, associação por código e compactação JSON; sem recalcular indicadores. Consulte também as atribuições institucionais específicas de cada indicador, que podem incluir fornecedores externos.

| Indicador | Código / fonte | Unidade | Ano | Cobertura no mapa |
|---|---|---|---|---|
| População total | [SP.POP.TOTL](https://data.worldbank.org/indicator/SP.POP.TOTL) | habitantes | 2023 | 169/177 |
| PIB nominal | [NY.GDP.MKTP.CD](https://data.worldbank.org/indicator/NY.GDP.MKTP.CD) | US$ correntes | 2023 | 163/177 |
| PIB per capita | [NY.GDP.PCAP.CD](https://data.worldbank.org/indicator/NY.GDP.PCAP.CD) | US$ por habitante | 2023 | 163/177 |
| Área territorial (superfície) | [AG.SRF.TOTL.K2](https://data.worldbank.org/indicator/AG.SRF.TOTL.K2) | km² | 2023 | 169/177 |

Consultas: `https://api.worldbank.org/v2/country/all/indicator/CODIGO?date=2023&format=json&per_page=400`. Cadastro de capitais e regiões: [country API](https://api.worldbank.org/v2/country?format=json&per_page=400), metadados vigentes na obtenção, sem ano histórico. Cada registro de indicador disponível preserva código, ano, valor, unidade e identificador de fonte. Dados ausentes têm `value: null` e `status: unavailable`; jamais zero imputado. Agregados regionais e mundiais são excluídos, conforme cadastro do Banco Mundial.

População é a estimativa total reportada pela fonte, não uma contagem em tempo real. PIB é atividade econômica em preços correntes; variação cambial afeta comparações. PIB per capita é um agregado médio, não salário. Não há ajuste por inflação ou paridade de poder de compra. Superfície inclui águas interiores conforme definição do indicador; não equivale apenas a terra firme. Valores podem ser estimados ou posteriormente revisados pela instituição.

## Natural Earth · cartografia

[Repositório oficial](https://github.com/nvkelso/natural-earth-vector) · [arquivo de países 110m](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson) · [termos: domínio público](https://www.naturalearthdata.com/about/terms-of-use/) · [convenções de fronteira](https://www.naturalearthdata.com/about/disputed-boundaries-policy/).

177 feições, escala 1:110 milhões. Não há ano estatístico para geometria ou nomes; este é o snapshot do repositório obtido na data acima, identificado pelo hash no manifesto de aquisição. Para reduzir tamanho foram removidas propriedades não utilizadas, mantendo geometria original. Campos `ISO_A3_EH`, `WB_A3`, `NAME_PT` e `ADMIN` orientam identificadores, associação e nomes.

Na ausência de código ISO convencional, identificadores locais `NE:CYN`, `NE:SOL` e `NE:KOS` preservam as entidades da fonte e ficam sem associação econômica nesta versão. Não atribuímos dados de um Estado pai a entidades distintas. Outras ausências refletem falta de correspondência ou observação WDI; cobertura não implica reconhecimento de soberania.

Fronteiras seguem a representação de facto da fonte e não estabelecem posição editorial sobre soberania. Territórios e países não têm necessariamente geometria com a mesma abrangência estatística da economia WDI; cautela especial com territórios ultramarinos e disputados. A resolução não comporta todos os microestados/ilhas; zoom não aumenta a precisão da fonte.

Projeção **Equal Earth**: conserva proporções de área em escala mundial; distorce formas, ângulos e distâncias. Não use o mapa para navegação ou mensuração precisa. Coropléticos: escala sequencial logarítmica independente para população, PIB e PIB per capita, domínio mínimo/máximo dos valores positivos do recorte; legenda inclui a média geométrica. Zero tem cor própria e ausências são hachuradas. Comparador: barras lineares iniciando em zero, normalizadas ao maior dos dois valores de cada linha; sem pontuação agregada.

## Recursos estratégicos

Produção de **2024**, coletada em 27/10/2026. Petróleo bruto incluindo condensado (EIA), gás natural seco (EIA), lítio e terras raras (USGS MCS 2026) e urânio (World Nuclear Association). Ver [RESOURCE_SOURCES.md](./RESOURCE_SOURCES.md) para séries, páginas, licenças, definições, estimativas e cobertura. Fontes e anos econômicos permanecem independentes. A camada não representa reservas nem ocorrência geológica.

## Software

D3.js **7.9.0**, licença ISC; distribuição local em `assets/d3.min.js`, licença em `assets/d3-LICENSE.txt`. [Código oficial e licença](https://github.com/d3/d3/tree/v7.9.0). CDN foi usada somente na aquisição do arquivo vendorizado; nenhuma chamada a CDN ocorre ao usar o produto.
