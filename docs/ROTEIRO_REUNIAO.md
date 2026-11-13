# Roteiro para a reunião — Imóveis em Movimento
**Data sugerida da apresentação:** 14/11/2026  
**Ambiente:** demonstração; não prometer que já existe operação imobiliária real.

## Antes de começar (2 min)
1. Abra no notebook o site [Apresentação](https://portfolio-imoveis-em-movimento.pages.dev/apresentacao.html) e o [Mapa](https://portfolio-imoveis-em-movimento.pages.dev/mapa.html).
2. Conecte-se à internet. Verifique se o mapa mostra ruas e marcadores de Guarulhos.
3. Abra também [Exemplo Jardim Maia](https://portfolio-imoveis-em-movimento.pages.dev/imovel.html?id=teste-maia) e [Cadastro local](https://portfolio-imoveis-em-movimento.pages.dev/cadastrar.html).
4. Utilize os imóveis fictícios. **Não cadastre o endereço real de alguém no painel de demonstração sem autorização.**
5. Se a atualização do GitHub ainda não tiver chegado à Cloudflare, não faça a apresentação da nova função; consulte o status do deploy na Cloudflare.

## Demonstração rápida (5 min)
- **0:00–0:45 — Apresentar:** "Nossa ideia é tornar a busca de imóveis mais visual. O cliente navega pelo mapa, escolhe a região e abre os anúncios, inspirado na liberdade de exploração dos games."
- **0:45–2:00 — Abrir o mapa:** explicar marcadores amarelos, cards com foto, casas/apartamentos, alto padrão, filtros por quartos/preço, estado/cidade e favoritos.
- **2:00–3:00 — Escolher a Residência Jardim Maia:** clicar no marcador, abrir a ficha, mostrar a imagem **ilustrativa**, preço **simulado**, características e botões de favoritar/compartilhar.
- **3:00–4:30 — Simular cadastro:** usar um CEP válido, confirmar bairro/cidade/UF, informar número, clicar em "Localizar endereço no mapa", marcar uma posição aproximada e anexar uma foto autorizada para teste. Explicar que este cadastro fica só no navegador usado.
- **4:30–5:00 — Próxima fase:** "Para operar de verdade, ativaremos Cloudflare Access, banco D1 e fotos R2, com publicação dos imóveis para todos os visitantes. Também personalizaremos a identidade e os canais de atendimento da imobiliária."

## Perguntas para alinhar com o cliente
- Será para **uma imobiliária** ou para várias empresas?
- Quem poderá cadastrar, aprovar e publicar imóveis: proprietário, corretores, equipe de marketing?
- Contato via qual **WhatsApp corporativo** ou CRM? Qual o fluxo de agendamento de visitas?
- Haverá **venda, locação, temporada** ou os três?
- A empresa já possui fotos com autorização de publicação? Há tours 360° captados?
- Qual será o **domínio**, marca e CRECI que devem aparecer, se aplicável?

## Entregue / não entregue
**Codificado para demonstração:** site responsivo, visual verde/amarelo, mapa, oito anúncios fictícios de Guarulhos, busca/filtros, favoritos locais, compartilhamento, página individual, cadastro de teste com CEP e geolocalização aproximada. As imagens e preços desses oito anúncios são fictícios.

**Preparado, ainda sem integração ativa:** Cloudflare Access (login real), D1 (imóveis publicados), R2 (fotos) e painel online. Depende de configurar os vínculos e testar em produção.

**Não implementado:** agendamento e recebimento de leads reais, WhatsApp corporativo, contratos e tour 360° fiel produzido pela plataforma. Não afirmar que o sistema já gera vídeos de caminhada por cômodos só com fotos comuns.

## Caso o mapa não abra
O projeto usa tiles do OpenStreetMap, que precisam de internet. Se aparecer "API KEY REQUIRED", o navegador pode estar usando a versão antiga do CARTO: force a atualização (Ctrl + Shift + R) e confira a última implantação na Cloudflare. Se mostrar outro erro, use o catálogo em /imoveis.html enquanto verifica a conexão.
