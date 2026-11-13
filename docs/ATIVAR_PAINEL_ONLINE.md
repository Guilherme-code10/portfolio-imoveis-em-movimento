# Ativação segura — Central de Imóveis

Este projeto usa Cloudflare Pages estático com Pages Functions. A base foi adicionada ao repositório, **mas não está ativada** até conectar os recursos da conta e validar o deploy.

## O que já está codificado

- `painel-online.html`: interface para cadastrar, editar, publicar e arquivar imóveis reais; envia fotos ao R2. O painel só mostra o formulário depois de consultar `/api/admin/session`.
- `functions/api/admin/session.js`: exige Cloudflare Access JWT assinado válido.
- `functions/api/admin/properties.js`: CRUD autenticado com D1. Apenas usuários na variável `ADMIN_EMAILS` podem escrever.
- `functions/api/admin/media.js`: upload JPG/PNG/WebP limitado a 8MB por arquivo, validando assinatura de bytes, com R2.
- `functions/api/properties.js`: lista/detalha publicamente **apenas** imóveis com `status='published'`.
- `functions/api/media/[file].js`: disponibiliza somente fotos autorizadas do bucket R2.
- `js/imoveis-core.js`: passa a tentar consultar a API pública. Se o banco ainda não estiver pronto, o mapa e as páginas continuam exibindo os oito imóveis fictícios de Guarulhos com aviso de teste.

## Para ativar na conta Cloudflare

1. Em **Workers & Pages**, selecione o projeto `portfolio-imoveis-em-movimento`. Confirme que ele usa o repositório GitHub correto e a branch `main`.
2. No Cloudflare D1, crie um banco (exemplo: `imoveis-em-movimento`). No projeto Pages, em **Settings > Bindings**, conecte-o com o nome exato **`DB`**.
3. No Cloudflare R2, crie um bucket exclusivo para as fotos; vincule-o ao Pages com o nome exato **`PHOTOS`**.
4. Aplique o arquivo `schema.sql` no D1 pela interface SQL do banco ou no Git Bash, depois de `npx wrangler login`:
   ```bash
   npx wrangler d1 execute imoveis-em-movimento --remote --file=schema.sql
   ```
   Ajuste o nome acima se tiver escolhido outro banco.
5. Configure **Cloudflare Zero Trust > Access** para proteger `/painel-online.html` e `/api/admin/*` com política que permita **somente os administradores autorizados**. Teste o comportamento com um navegador anônimo. **Não habilite uma política que bloqueie todo o site público.** Se o seu domínio `pages.dev` não permitir proteção por rota como planejado, use domínio personalizado ou implantação administrativa separada. As rotas de API continuarão recusando JWT inválido mesmo sem proteção na borda.
6. No ambiente de produção do projeto Pages, crie as variáveis **`ACCESS_TEAM_DOMAIN`** (por exemplo `equipe.cloudflareaccess.com`, sem URL de login), **`ACCESS_AUD`** (audience da aplicação Access) e **`ADMIN_EMAILS`** (endereços de e-mail autorizados, separados por vírgula). Não armazene esses valores em arquivos Git.
7. Reimplante o projeto no Pages após criar os vínculos e variáveis.

## Testes obrigatórios antes de liberar

- Sem as variáveis, `GET /api/admin/session` deve retornar 503; sem token Access, com variáveis configuradas, deve retornar 401. Uma pessoa fora da lista de e-mails deve receber 403.
- Um administrador autenticado deve obter 200 na sessão; enviar uma imagem com sucesso; criar um imóvel em rascunho; verificar que o imóvel **não** aparece no mapa público.
- Depois, mudar o status para publicado; confirmar que aparece no mapa, nos filtros e na página de detalhes, em outro navegador.
- Arquivar o imóvel e confirmar que desaparece da vitrine pública, sem apagar o registro do banco.
- Conferir a navegação por celular, comportamento do upload e possíveis erros de migração.
- Verificar os custos e limites do D1, R2 e Pages conforme seu plano.

## Limites atuais

- Primeiro MVP dedicado a **uma imobiliária** com administradores selecionados. Futuras múltiplas imobiliárias exigirão organização por locatário (tenant), controle de permissões por organização, isolamento de dados e políticas de fotos.
- Não há formulários públicos para coletar dados pessoais de interessados nesta fase. Leads/agendamentos exigem proteção anti-spam e políticas LGPD antes de ativar.
- A API foi preparada, mas ainda não foi validada com um banco D1/R2 real; não considerar o serviço pronto até concluir testes de integração.
- O tour 360° continua experimental e fora do menu público até haver captura verdadeira autorizada.

Referências oficiais:
- https://developers.cloudflare.com/pages/functions/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/

## Cadastro por CEP (versão para demonstração)
- `js/endereco.js` consulta ViaCEP quando são inseridos 8 dígitos. Preenche rua, bairro, cidade e UF; usuário confere número e complemento.
- O botão "Localizar endereço" consulta o Nominatim sob ação explícita, tenta rua/bairro/cidade e salva apenas as **coordenadas arredondadas a duas casas** para o mapa.
- Rua, número, complemento e CEP ficam em colunas **somente administrativas** no D1. A API pública `/api/properties` não serializa esses campos.
- `schema.sql` contém as novas colunas `cep`, `street`, `number` e `complement` para instalações novas. Para D1 já existente, é necessária migração (não basta rodar CREATE TABLE IF NOT EXISTS).
- ViaCEP e Nominatim exigem internet; CEP nem sempre identifica rua ou número e geocodificação não garante precisão. Confirme visualmente antes de salvar.
