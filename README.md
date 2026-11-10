# Imóveis em Movimento — Guilherme Augusto

Portfólio comercial e estúdio demonstrativo de vídeos imobiliários.

## Funcionalidades
- Site responsivo com apresentação de serviços e exemplos ilustrativos de imóveis.
- Página individual demonstrativa de imóvel.
- Estúdio local: escolha de fotos, nome, descrição, formato horizontal/vertical e duração.
- Vídeo em WebM criado no próprio navegador, sem upload de fotos.
- HTML semântico, CSS e JavaScript separados.
- Pronto para hospedagem estática na Cloudflare Pages.

## Teste local
Abra o projeto com um servidor estático (ex.: extensão Live Server do VS Code), e acesse `index.html`. No estúdio, o Chrome ou Edge atual é recomendado para exportação WebM.

## Publicação via Cloudflare Pages
1. Abra **Workers & Pages > Create > Pages > Connect to Git**.
2. Escolha `Guilherme-code10/portfolio-imoveis-em-movimento`.
3. Framework preset: **None**.
4. Build command: **(vazio)**.
5. Build output directory: **/** (raiz do repositório; se o painel pedir, use `.`).
6. Confirme o deploy e abra a URL **pages.dev** atribuída pelo painel.

## Próximas fases
- Upload autenticado, Cloudflare R2, painel administrativo e aprovação de vídeos.
- Renderização de MP4 por serviço remoto, com chaves restritas ao backend.
- Opcional: API Claude para apoio a roteiros, sem lhe atribuir renderização de vídeos.

## Notas
As fotos de demonstração vêm de imagens ilustrativas externas (Unsplash), não representam imóveis reais em anúncio ou trabalhos de clientes. Antes de uso comercial, substitua por mídia própria/autorizada e configure os dados de contato. Esta versão não cobra pagamentos nem envia arquivos para servidores.
