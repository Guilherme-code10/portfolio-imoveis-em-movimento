# Imóveis em Movimento — Portfólio Guilherme Augusto

Site demonstrativo para produção de apresentações imobiliárias com fotografias, vídeos animados e páginas individuais para imóveis.

## Páginas
- `index.html` — apresentação comercial e acesso rápido.
- `imoveis.html` — vitrine pesquisável de imóveis demonstrativos e cadastrados neste navegador.
- `videos.html` — três apresentações animadas prontas para assistir, criadas a partir de sequências de fotografias ilustrativas.
- `cadastrar.html` — painel de cadastro e edição, salvando informações e imagens localmente com IndexedDB.
- `imovel.html?id=aurora` — página detalhada dinâmica de cada imóvel.
- `estudio.html` — gerador local de arquivo WebM com fotos reais, formatos horizontal e vertical.

## Estado atual e limitações importantes
- Os cadastros são uma **demonstração local**: ficam no IndexedDB do navegador em que foram criados; não aparecem para outros usuários ou dispositivos. O painel não tem login e não deve receber dados confidenciais. A próxima fase inclui Cloudflare D1, R2 e proteção de administração.
- As três apresentações em `videos.html` são **prévias visuais animadas no navegador** (não arquivos MP4 de filmagem) e usam fotos ilustrativas externas. Elas representam o estilo de apresentação que podemos produzir.
- O estúdio exporta WebM em navegadores que suportam `MediaRecorder`. Não há API Claude nem renderização automática MP4 integrada.
- Nenhum imóvel demonstrativo está à venda; preços, metragens e endereços não são factuais.

## Testar localmente
Use o Live Server no VS Code ou um servidor estático, ex. `python -m http.server 8000`. Abra `http://localhost:8000`.
Teste: três vídeos em `videos.html`, cadastro com fotografias em `cadastrar.html`, visualização em `imoveis.html`, detalhes em `imovel.html`, e criação de WebM em `estudio.html`.

## Cloudflare Pages
Repositório: Guilherme-code10/portfolio-imoveis-em-movimento.
Vincular a branch `main`; framework preset None; build command vazio; output directory `/` ou `.`. Atualizações em main são publicadas automaticamente se a integração Git estiver ativa.

## Próxima fase
1. Banco de dados Cloudflare D1 para cadastros compartilhados.
2. Cloudflare R2 para fotos e vídeos.
3. Login de administrador, permissões e aprovação antes de publicação.
4. Fila de renderização MP4, webhooks, custos e limites.
5. Opcional: API Claude para assistência de roteiros (não como renderizador de vídeo).

As mídias ilustrativas são fotografias externas de referência. Para uso comercial e trabalhos reais, substitua por fotos próprias ou com autorização e confirme as licenças dos materiais.

## Visita virtual 360° — nova demonstração
- `tour-virtual.html` — exemplo **externo** de tour 3D Matterport, atribuído claramente ao serviço e ao autor, carregado somente após o visitante clicar em "Iniciar passeio".
- A mesma página oferece um visualizador próprio usando Pannellum (MIT), com upload **local** de 2 a 8 fotos equiretangulares 360°, ajuste do nome dos cômodos e navegação por setas/hotspots.
- Os arquivos do usuário **não são enviados** ao servidor. Não há gravação persistente de tours, login, planta baixa real ou medição do imóvel.
- As setas locais conectam imagens na ordem do upload, em posições iniciais exemplificativas, e **não mapeiam passagens reais**; para isso é necessário capturar panorama por cômodo e configurar hotspots com a geometria correta.
- URL do tour externo usada no exemplo: https://my.matterport.com/show/?m=U2qqEaNwtwb (documentada em material oficial de demonstração; a disponibilidade depende do proprietário e da plataforma).
- Motor Pannellum: https://pannellum.org/ (MIT). Seus exemplos panorâmicos podem ter licença CC BY-SA; não estamos hospedando ou redistribuindo tais imagens.

## Caso real de teste (12 nov 2026)
A demonstração principal em `tour-virtual.html` agora apresenta uma propriedade **existente**, com anúncio público verificado:
- Casa: 4 Herberton Road, South Ripley, Queensland, Austrália.
- Comercialização: Ray White Ipswich, portal Domain.
- Dados do anúncio: 4 quartos, 2 banheiros, 2 vagas, 209 m² construídos e terreno de 392 m².
- Anúncio original: https://www.domain.com.au/4-herberton-road-south-ripley-qld-4306-2021295007
- Passeio 3D incluído no anúncio: https://my.matterport.com/show/?m=ovWEMMzTD2V
- O embed Matterport está identificado como **externo, não produzido por nós**. Não há cópias de fotografias ou panoramas do anúncio hospedadas neste repositório.
- Para integrar tours próprios, capte imagens 360° autorizadas ou use um escaneamento 3D com permissão do proprietário e direitos sobre os arquivos. Fotos 2D convencionais não geram reconstrução fiel automaticamente.

## Link do tour Matterport no cadastro (modo local)
O cadastro `cadastrar.html` agora aceita, opcionalmente, URL pública de modelo Matterport com hostname exato `my.matterport.com`, caminho `/show/` e ID alfanumérico de 11 caracteres. É guardada somente a URL no IndexedDB; a prévia no imóvel carrega o iframe após interação explícita. Links não autorizados não devem ser inseridos. O cadastro completo ainda depende de uma foto de capa autorizada.

## Estudo de caso: Casa Cabral / Ponte Grande
- Página `cabral-ponte-grande.html` — prévia audiovisual em HTML/CSS/JS de **20 segundos**, que usa uma única fotografia verificável do anúncio original e fatos conferidos. **Não é um arquivo MP4 nem um passeio 3D**.
- Referência CA67890-CABU. Dados do anúncio consultado: 338m² anunciados, 2 quartos, 2 banheiros, 5 vagas, R$ 1.190.000 de preço de vitrine.
- Fonte primária: https://www.cabralimobiliaria.com/imovel/casa-guarulhos-2-quartos/CA67890-CABU
- Outra galeria do mesmo anúncio: https://www.chavesnamao.com.br/imovel/casa-a-venda-2-quartos-com-garagem-sp-guarulhos-ponte-grande-338m2-RS1190000/id-44616697/
- Uma imagem da garagem é carregada diretamente do portal Chaves na Mão com crédito, sem repositório de cópias; o portal poderá bloquear o hotlink. Os direitos autorais pertencem aos titulares. Uso comercial e arquivo MP4 dependem de fotografias obtidas com permissão.
- Para completar o vídeo real é necessário obter as imagens dos outros ambientes, autorização de uso e, para tour imersivo fiel, panoramas 360° ou escaneamento 3D.

## Correção de escopo / 13 nov 2026
A prévia anterior da Cabral, baseada numa única fotografia, foi removida dos destaques. A URL `cabral-ponte-grande.html` agora informa claramente que o passeio do imóvel **não existe ainda** e exige panoramas 360° ou um escaneamento 3D autorizados. O site mantém demonstração externa identificada de uma **outra** casa real em `tour-virtual.html`. O vídeo de uma foto não cumpre o objetivo de caminhar pelos cômodos.

## 13 nov 2026 — recurso experimental não divulgado
A navegação pública e os destaques deixaram de promover o `tour-virtual.html`, porque o fluxo de captação de panorama e produção de tour próprio ainda não foi validado. A página de demonstração e seu código permanecem acessíveis por endereço direto somente para desenvolvimento. NÃO apresentar a demo Matterport de terceiros como serviço próprio. Próximo teste: captar de 2 a 4 panoramas 360° autorizados de uma única casa e verificar a transição entre cenas; depois desenvolver implantação em R2/D1 e habilitar o recurso ao público.

## 13 nov 2026 — mapa do Brasil, protótipo local
- `mapa.html`: mapa Leaflet com cartografia OpenStreetMap e filtros por UF, cidade e nome. Só mostra imóveis reais cadastrados no IndexedDB e com coordenadas válidas; nunca usa as três casas fictícias ou o tour externo como se fossem parte da carteira.
- `cadastrar.html`: cidade e UF obrigatórias; mapa para seleção aproximada da cidade e botão opcional de geocodificação via OpenStreetMap Nominatim. O cliente precisa clicar para consultar a cidade; portanto, evita buscas automáticas em massa. A posição é arredondada a duas casas decimais para indicar a região aproximada, nunca o endereço exato.
- A lista nacional é **local ao navegador**. Não há login ou banco de dados remoto, e visitantes não enxergam os seus cadastros. A próxima fase é conectar Cloudflare D1 + R2 e Cloudflare Access. Não coloque uma senha no front-end nem crie um "login" simulado.
- A aplicação usa bibliotecas externas Leaflet/OSM. Caso bloqueadas, o mapa exibirá mensagem de erro; o cadastro de imóvel continua funcionando sem localização.

## 13 nov 2026 — redesign UX inspirada na navegação Dynasty 8 (GTA V)
- **Identidade visual própria** (verde-floresta e amarelo) criada para Imóveis em Movimento, sem copiar logos, fotografias ou imagens do jogo. Referência apenas na organização e na interação (filtros de categoria + lista de imóveis + mapa com ícones).
- `mapa.html` agora apresenta o mapa como protagonista: barra de categorias (Todos, Casas, Apartamentos, Alto padrão), catálogo lateral com foto e preço, filtro por cidade/estado, ordenação por preço e marcação de imóvel com destaque dentro do mapa.
- `js/mapa.js` permanece ligado aos **imóveis reais cadastrados localmente** no IndexedDB, com coordenadas aproximadas. Dados fictícios nunca são inseridos para parecer imóveis de verdade. Se não há imóveis cadastrados, o estado vazio explica como iniciar.
- `css/mapa.css` renovado; `css/realty-theme.css` atualiza visual de todas as páginas (home/galeria/admin/estúdio).
- Página inicial muda o foco para descoberta no mapa, mantendo recursos demonstrativos de vídeo. O sistema continua sem login real e sem sincronização remota até integrar Cloudflare Access/D1/R2.
- O mapa usa Leaflet e tiles CARTO (attribution OpenStreetMap / CARTO), carregados externamente.
