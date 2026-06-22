# 📦 Guia de Instalação — Linkly

## Pré-requisitos

- **Node.js 18.18+** (recomendado 20+)
- **PostgreSQL 14+** (local, Docker, Neon, Supabase ou Railway)
- **npm** (ou pnpm/yarn)

---

## 1. Clonar e entrar na pasta

```bash
git clone <seu-repo>
cd url-shortener
```

## 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

| Variável             | Descrição                                              |
| -------------------- | ------------------------------------------------------ |
| `DATABASE_URL`       | Connection string do PostgreSQL                        |
| `AUTH_SECRET`        | Segredo do Auth.js — gere com `openssl rand -base64 32`|
| `NEXTAUTH_URL`       | URL base (ex.: `http://localhost:3000`)                |
| `NEXT_PUBLIC_APP_URL`| URL pública usada para montar o link curto             |
| `SEED_ADMIN_EMAIL`   | E-mail do admin criado pelo seed                       |
| `SEED_ADMIN_PASSWORD`| Senha do admin criado pelo seed                        |

### PostgreSQL local com Docker (opcional)

```bash
docker run --name linkly-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=linkly -p 5432:5432 -d postgres:16
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Banco de dados

```bash
npm run prisma:generate   # gera o client
npm run prisma:migrate    # aplica as migrations (cria as tabelas)
npm run db:seed           # (opcional) admin + dados de exemplo
```

## 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse <http://localhost:3000>.

---

## Scripts disponíveis

| Script                  | Ação                                          |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento                   |
| `npm run build`         | Build de produção (`prisma generate` + build) |
| `npm start`             | Inicia o build de produção                    |
| `npm run lint`          | ESLint                                        |
| `npm run typecheck`     | Checagem de tipos (tsc)                        |
| `npm test`              | Testes (Vitest)                               |
| `npm run prisma:studio` | Interface visual do banco                     |
| `npm run db:seed`       | Popula o banco                                |
| `npm run deploy`        | `migrate deploy` + build (produção)           |

---

## Solução de problemas

- **`Can't reach database server`** → verifique `DATABASE_URL` e se o Postgres está rodando.
- **`AUTH_SECRET` ausente** → defina a variável; o login não funciona sem ela.
- **Slug sempre "reservado"** → veja `RESERVED_SLUGS` em `lib/validations.ts`.
- **Erro no `prisma generate` na Vercel** → garanta o script `build` com `prisma generate`.
