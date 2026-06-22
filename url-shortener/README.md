# 🔗 Linkly — Encurtador de Links Completo

Encurtador de URLs moderno e completo (estilo Bitly / Dub.co), construído com
**Next.js 15 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL**,
**Tailwind CSS**, **shadcn/ui** e **Auth.js**.

> Pronto para deploy na Vercel.

---

## ✨ Funcionalidades

### Visitante (sem login)
- Criar links curtos temporários (expiram em 7 dias)
- Slug aleatório ou personalizado (se disponível)
- Copiar link e gerar/baixar **QR Code**
- Validação completa de URL (Zod)

### Usuário autenticado
- **Dashboard** com cards e gráficos (cliques por dia, top links, navegadores,
  SO, países, dispositivos)
- Lista de links com **busca, filtro, ordenação e paginação**
- Editar, excluir, **ativar/desativar**, definir expiração
- Estatísticas detalhadas por link

### Redirecionamento
Ao acessar `https://dominio.com/abc123`, o sistema: localiza o slug → verifica
existência → verifica se está ativo → verifica expiração → **registra
estatísticas** → **incrementa o contador** → **redireciona com HTTP 302**.

---

## 🧱 Stack

| Camada        | Tecnologia                          |
| ------------- | ----------------------------------- |
| Frontend      | Next.js 15, React 19, TypeScript    |
| Estilo        | Tailwind CSS + shadcn/ui            |
| Backend       | API Routes (Route Handlers)         |
| Banco         | PostgreSQL                          |
| ORM           | Prisma                              |
| Auth          | Auth.js (NextAuth v5) — Credentials |
| Validação     | Zod                                 |
| IDs           | NanoID                              |
| Gráficos      | Recharts                            |
| Toasts        | Sonner                              |

---

## 📁 Estrutura de pastas

```
url-shortener/
├── app/                    # Rotas (App Router) + API + páginas
│   ├── api/                #   shorten, links, stats, auth
│   ├── [slug]/route.ts     #   redirecionamento 302
│   ├── dashboard/          #   painel autenticado
│   ├── login/ register/    #   autenticação
│   ├── layout.tsx page.tsx #   shell + landing page
│   ├── robots.ts sitemap.ts manifest.ts
├── components/             # UI (shadcn/ui) + componentes de domínio
│   ├── ui/                 #   primitivos shadcn
│   ├── dashboard/          #   cards, gráficos, tabela, modais
│   └── auth/               #   formulários de login/cadastro
├── hooks/                  # use-links, use-debounce
├── lib/                    # prisma, auth, validações, rate-limit, utils
├── repositories/           # acesso a dados (Repository Pattern)
├── services/               # regras de negócio
├── types/                  # DTOs e tipos compartilhados
├── utils/                  # formatação e datas
├── prisma/                 # schema + seed
├── tests/                  # testes (Vitest)
├── public/                 # assets estáticos (ícones)
└── middleware.ts           # segurança + rate limit + proteção de rotas
```

---

## 🚀 Instalação rápida

Veja o guia detalhado em [`INSTALL.md`](./INSTALL.md).

```bash
cd url-shortener
cp .env.example .env          # configure DATABASE_URL e AUTH_SECRET
npm install
npm run prisma:migrate        # cria as tabelas
npm run db:seed               # (opcional) dados de exemplo + admin
npm run dev                   # http://localhost:3000
```

Usuário admin do seed: `admin@linkly.dev` / `admin123456` (configurável no `.env`).

---

## 🔌 Rotas da API

| Método | Rota                | Descrição                                   | Auth |
| ------ | ------------------- | ------------------------------------------- | ---- |
| POST   | `/api/shorten`      | Cria um link curto                          | Opc. |
| GET    | `/:slug`            | Redireciona (302) e registra o clique       | —    |
| GET    | `/api/links`        | Lista links (busca/filtro/ordenação/página) | ✅   |
| PUT    | `/api/links/:id`    | Edita um link                               | ✅   |
| DELETE | `/api/links/:id`    | Exclui um link                              | ✅   |
| GET    | `/api/stats/:id`    | Estatísticas detalhadas de um link          | ✅   |
| POST   | `/api/auth/register`| Cadastro de usuário                         | —    |

Todas as respostas usam o envelope `{ success, data }` ou `{ success, error }`.

---

## 🔒 Segurança

- **Rate limit** (janela deslizante) nas rotas mutáveis via `middleware.ts`
- **Validação/sanitização** com Zod (bloqueio de `javascript:`, hosts internos)
- **Headers seguros** (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
- **Proteção XSS** (React escapa por padrão; sem `dangerouslySetInnerHTML`)
- **Proteção SQL Injection** (Prisma — queries parametrizadas)
- **CSRF/Sessão** gerenciados pelo Auth.js
- **Autorização**: cada link só pode ser editado/excluído pelo dono

---

## 🧪 Testes

```bash
npm test           # executa os testes uma vez (Vitest)
npm run test:watch # modo observação
```

Cobrem: validações Zod, geração de slug, série temporal e rate limit.

---

## 📈 SEO & Performance

- Metadata, Open Graph e Twitter Cards (`app/layout.tsx`)
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest` (PWA básica), favicon SVG
- Server Components, Suspense/streaming no dashboard, `force-dynamic` no redirect
- Otimização de fontes (`next/font`) e imagens (`next/image`)

---

## ☁️ Deploy (Vercel)

1. Importe o repositório na Vercel e selecione a pasta `url-shortener` como root.
2. Configure as variáveis de ambiente (`DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`).
3. O `vercel.json` já roda `prisma generate && prisma migrate deploy && next build`.
4. Deploy. 🎉

Veja também `scripts/deploy.sh` e o [checklist](./CHECKLIST.md).

---

## 📄 Licença

MIT.
