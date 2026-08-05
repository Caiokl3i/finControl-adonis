# FinControl — API em AdonisJS

Projeto de estudo para aprender a criar uma **API REST com AdonisJS**: autenticação com access tokens, validação Vine, models Lucid, transformers, ownership por usuário e um controle financeiro (categorias, transações, dashboard e estatísticas).

Inclui um frontend React (**Fluxo**) só para exercitar a integração front ↔ API — o foco do repositório é o backend.

## O que você aprende aqui

- Rotas em grupos + middleware `auth`
- Signup / login / logout com **access tokens** (Bearer)
- Validators com Vine (`create` vs `update` + filtros de query)
- Models Lucid + relações `hasMany` / `belongsTo`
- Controllers CRUD com ownership via `user.related(...)`
- Transformers para formatar a resposta JSON
- Query Builder: filtros (`month`, `year`, `type`, `category`), `SUM`, `COUNT`, `orderBy`
- Regras de negócio: amount positivo, categoria do usuário, não apagar categoria em uso
- Migrations (SQLite) e foreign keys (`CASCADE` / `RESTRICT`)
- Consumir a API com `fetch` + token no frontend

## Stack

| Camada | Tecnologia |
|---|---|
| API | AdonisJS 7, Lucid, Vine, Access Tokens |
| Banco | SQLite (`better-sqlite3`) |
| Frontend (opcional) | React + Vite + TypeScript |

## Funcionalidades

**Auth**

- `POST /auth/signup` — criar conta + token
- `POST /auth/login` — login + token
- `GET /account/profile` — perfil (autenticado)
- `POST /account/logout` — invalidar token

**Categories** (autenticadas)

- CRUD em `/categories`
- Delete retorna **409** se a categoria tiver lançamentos

**Transactions** (autenticadas)

- CRUD em `/transactions`
- Filtros: `?month=&year=&type=&category=`
- `categoryId` precisa existir e pertencer ao usuário

**Dashboard / Statistics**

- `GET /dashboard?month=&year=` → `balance`, `income`, `expense`, `month`
- `GET /statistics?month=&year=` → maiores lançamentos + contagem

## Como rodar

### Pré-requisitos

- Node.js 20+
- npm

### API

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

API em [http://localhost:3333](http://localhost:3333).

### Frontend (opcional)

```bash
cd frontend
npm install
npm run dev
```

UI em [http://localhost:5173](http://localhost:5173). O Vite faz proxy das rotas da API → `:3333`.

Detalhes do front: [`frontend/README.md`](./frontend/README.md)

## Exemplo rápido (auth)

```http
POST /auth/signup
Content-Type: application/json

{
  "name": "Caio",
  "email": "caio@example.com",
  "password": "senha12345",
  "passwordConfirmation": "senha12345"
}
```

Nas rotas protegidas:

```http
Authorization: Bearer <token>
```

## Domínio

```
User 1──* Categories 1──* Transactions
User 1──────────────────* Transactions
```

Amount fica sempre **positivo** no banco; o campo `type` (`income` | `expense`) decide se entra ou sai do saldo.

## Estrutura (visão geral)

```
app/
  controllers/     # HTTP → regras de negócio
  models/          # Lucid (User, Category, Transaction)
  validators/      # Vine
  transformers/    # JSON público
database/
  migrations/      # schema
frontend/          # React para testar a API
start/
  routes.ts        # rotas
```

## Licença

MIT
