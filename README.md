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
