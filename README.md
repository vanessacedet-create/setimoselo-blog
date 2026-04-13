# Blog Editora Sétimo Selo

Blog institucional da Editora Sétimo Selo, construído com **Next.js 14**, sistema de posts em **Markdown**, painel admin com autenticação por senha e deploy na **Vercel**.

---

## Tecnologias

- **Next.js 14** — framework React com SSG/SSR
- **Markdown + gray-matter** — posts como arquivos `.md` no repositório (GitHub como CMS)
- **NextAuth.js** — autenticação segura por senha
- **Vercel** — hospedagem com deploy automático ao fazer push
- **Google Fonts** — Cormorant Garamond

---

## Funcionalidades

- ✅ Homepage com post em destaque e grid de artigos
- ✅ Página de artigo com imagem de capa, tempo de leitura, tags e artigos relacionados
- ✅ Categorias dinâmicas
- ✅ Busca por título, excerpt, categoria e tags
- ✅ Sidebar com recentes, categorias, redes sociais e link da loja
- ✅ Painel admin protegido por senha (rota `/admin`)
- ✅ Editor Markdown com barra de ferramentas e upload de imagens
- ✅ Botões personalizados no corpo do artigo (`btn-loja`, `destaque-box`)
- ✅ Upload de logo no painel
- ✅ Configurações de redes sociais, link da loja e Google Analytics
- ✅ Google Analytics via ID de medição
- ✅ SEO básico (title, description, og:image por artigo)
- ✅ Identidade visual Sétimo Selo (bordô, dourado, Cormorant Garamond)

---

## Estrutura de diretórios

```
setimoselo-blog/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx     # Layout do painel admin
│   │   └── PostEditor.tsx      # Editor Markdown com toolbar
│   └── blog/
│       ├── Layout.tsx          # Layout público (header/footer/GA)
│       ├── PostCard.tsx        # Card de post no grid
│       └── Sidebar.tsx         # Sidebar com widgets
├── content/
│   ├── posts/                  # Arquivos .md dos artigos
│   │   └── bem-vindo-ao-blog.md
│   └── settings/
│       └── site.json           # Configurações do site
├── lib/
│   ├── auth.ts                 # Configuração NextAuth
│   ├── posts.ts                # CRUD de posts em Markdown
│   ├── settings.ts             # Leitura/escrita de configurações
│   └── slugify.ts
├── pages/
│   ├── api/
│   │   ├── auth/[...nextauth].ts
│   │   ├── posts/
│   │   │   ├── index.ts        # GET lista / POST criar
│   │   │   └── [slug].ts       # GET / PUT / DELETE por slug
│   │   ├── settings.ts
│   │   ├── upload.ts           # Upload de imagens
│   │   └── categories.ts
│   ├── admin/
│   │   ├── login.tsx
│   │   ├── index.tsx           # Dashboard
│   │   ├── posts.tsx           # Listagem de artigos
│   │   ├── novo.tsx            # Criar artigo
│   │   ├── editar/[slug].tsx   # Editar artigo
│   │   └── configuracoes.tsx
│   ├── post/[slug].tsx         # Artigo completo
│   ├── categoria/[nome].tsx
│   ├── categorias.tsx
│   ├── busca.tsx
│   ├── index.tsx               # Homepage
│   ├── _app.tsx
│   └── _document.tsx
├── public/
│   ├── images/                 # Logo e imagens estáticas
│   └── uploads/                # Imagens enviadas pelo admin (gitignore)
├── styles/
│   └── globals.css             # Design tokens + estilos Sétimo Selo
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## Setup local

### 1. Clonar e instalar

```bash
git clone https://github.com/vanessacedet-create/setimoselo-blog.git
cd setimoselo-blog
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local`:

```env
# Senha de acesso ao painel admin
ADMIN_PASSWORD=minha_senha_forte_aqui

# Segredo JWT — gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=cole_o_segredo_gerado_aqui

# URL base (em desenvolvimento)
NEXTAUTH_URL=http://localhost:3000
```

### 3. Adicionar o logo

Coloque o arquivo `logo.png` (ou `.svg`) em `public/images/logo.png`.  
Ou defina outro caminho em `content/settings/site.json` no campo `"logo"`.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse:
- **Blog público**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin

---

## Deploy na Vercel

### 1. Criar repositório no GitHub

```bash
cd setimoselo-blog
git init
git add .
git commit -m "feat: blog Sétimo Selo — estrutura inicial"
git branch -M main
git remote add origin https://github.com/vanessacedet-create/setimoselo-blog.git
git push -u origin main
```

### 2. Importar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione o repositório `setimoselo-blog`
3. Framework: **Next.js** (detectado automaticamente)
4. Na aba **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `ADMIN_PASSWORD` | Sua senha forte |
| `NEXTAUTH_SECRET` | String aleatória (32+ chars) |
| `NEXTAUTH_URL` | `https://blog.editorasetimoselo.com.br` |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` (opcional) |

5. Clique em **Deploy**

### 3. Configurar domínio personalizado

1. No painel da Vercel, vá em **Settings → Domains**
2. Adicione `blog.editorasetimoselo.com.br`
3. No painel DNS do seu provedor, adicione um registro **CNAME**:
   - **Nome**: `blog`
   - **Valor**: `cname.vercel-dns.com`
4. Aguarde a propagação (geralmente < 10 min)

---

## Como publicar artigos

### Via painel admin (recomendado)

1. Acesse `/admin` e faça login com sua senha
2. Clique em **Novo Artigo**
3. Preencha título, conteúdo, categoria, imagem de capa
4. Clique em **Publicar** ou **Salvar Rascunho**
5. O arquivo `.md` é salvo em `content/posts/` automaticamente

> **Nota Vercel**: como a Vercel usa um sistema de arquivos efêmero, posts criados pelo admin em produção **não persistem entre deploys**. Para produção com volume de conteúdo, o fluxo recomendado é:

### Fluxo CMS via GitHub (recomendado para produção)

1. Crie/edite os arquivos `.md` diretamente em `content/posts/` no GitHub
2. O Vercel faz deploy automático em ~1 minuto
3. Use o painel admin apenas para rascunhos locais ou para copiar o Markdown gerado

### Formato do arquivo `.md`

```markdown
---
titulo: Título do Artigo
excerpt: Breve resumo que aparece nos cards e na busca.
data: "2025-03-20"
autor: Editora Sétimo Selo
categoria: Literatura
imagem: /uploads/nome-da-imagem.jpg
tags:
  - clássicos
  - poesia
publicado: true
---

Conteúdo do artigo em **Markdown**.

## Subtítulo

Parágrafo com _itálico_ e **negrito**.

> Citação marcante.

<a href="https://editorasetimoselo.com.br" class="btn-loja" target="_blank">Comprar →</a>
```

---

## Botões e elementos especiais no corpo do artigo

### Botão para a loja

```html
<a href="https://editorasetimoselo.com.br/produto" class="btn-loja" target="_blank">
  Ver na Loja →
</a>
```

### Caixa de destaque

```html
<div class="destaque-box">

**Sabia que?** Texto de destaque em fundo suave com borda dourada.

</div>
```

---

## Persistência de uploads na Vercel

O diretório `public/uploads/` não é persistido entre deploys na Vercel (filesystem efêmero). Para imagens de produção, recomenda-se uma das seguintes abordagens:

**Opção A — Cloudinary (gratuito até 25GB):**
1. Crie conta em [cloudinary.com](https://cloudinary.com)
2. Modifique `pages/api/upload.ts` para usar o SDK do Cloudinary
3. A URL retornada será permanente

**Opção B — Vercel Blob (nativo):**
1. Instale: `npm install @vercel/blob`
2. Adicione a variável `BLOB_READ_WRITE_TOKEN` na Vercel
3. Adapte `pages/api/upload.ts` para usar `put()` do `@vercel/blob`

**Opção C — Imagens no repositório:**
- Coloque as imagens em `public/images/` e referencie como `/images/nome.jpg`
- São versionadas no Git e sempre disponíveis

---

## Variáveis de ambiente — referência completa

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ADMIN_PASSWORD` | ✅ | Senha do painel admin |
| `NEXTAUTH_SECRET` | ✅ | Segredo JWT (mín. 32 chars) |
| `NEXTAUTH_URL` | ✅ | URL base do site (`https://...`) |
| `NEXT_PUBLIC_GA_ID` | ❌ | ID do Google Analytics (ex: `G-ABC123`) |

---

## Senhas bcrypt (opcional, mais seguro)

Para armazenar a senha em hash bcrypt em vez de plain text:

```bash
node -e "const b=require('bcryptjs'); b.hash('minha_senha',10).then(h=>console.log(h))"
```

Copie o hash gerado e use como valor de `ADMIN_PASSWORD`.

---

## Licença

Uso interno — Editora Sétimo Selo / CEDET.
