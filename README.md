# finControl

API de controle financeiro pessoal construída com **AdonisJS 7**, **Lucid**, **VineJS** e autenticação por **Access Tokens**.

## Stack

- AdonisJS 7 + Lucid ORM
- VineJS (validação)
- Transformers (serialização de respostas)
- SQLite (`better-sqlite3`)
- Auth via Access Tokens (`@adonisjs/auth`)

## Como rodar

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

Servidor padrão: `http://localhost:3333`

## Domínio

```
User 1──* Categories 1──* Transactions
User 1──────────────────* Transactions
```

- Um usuário tem muitas categorias e muitas transações
- Uma categoria pertence a um usuário e tem muitas transações
- Uma transação pertence a um usuário e a uma categoria

## Banco de dados

### `users`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | increments | PK |
| `full_name` | string | nullable |
| `email` | string(254) | unique |
| `password` | string | hashed |
| `created_at` / `updated_at` | timestamps | |

### `auth_access_tokens`

Tokens de autenticação (scaffold do Adonis Auth).

### `categories`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | increments | PK |
| `user_id` | FK → users | `onDelete CASCADE` |
| `name` | string(100) | unique por usuário `(user_id, name)` |
| `color` | string(7) | hex (`#RRGGBB`) |
| `icon` | string(50) | nome/chave do ícone |
| `created_at` / `updated_at` | timestamps | |

### `transactions`

| Campo | Tipo | Notas |
|-------|------|--------|
| `id` | increments | PK |
| `user_id` | FK → users | `onDelete CASCADE` |
| `category_id` | FK → categories | `onDelete RESTRICT` |
| `description` | string | |
| `amount` | decimal(12,2) | |
| `type` | enum | `income` \| `expense` |
| `date` | date | data da transação |
| `observation` | string | nullable |
| `created_at` / `updated_at` | timestamps | |

## Models e relações

| Model | Relações |
|-------|----------|
| `User` | `hasMany` categories, `hasMany` transactions |
| `Category` | `belongsTo` user, `hasMany` transactions |
| `Transaction` | `belongsTo` user, `belongsTo` category |

## Validators (VineJS)

- `app/validators/user.ts` — signup / login
- `app/validators/category.ts` — create / update
- `app/validators/transaction.ts` — create / update

## Transformers

Respostas da API usam `serialize(...)` e ficam no formato `{ data: ... }`.

- `UserTransformer` — `id`, `fullName`, `email`, `initials`, timestamps (sem password)
- `CategoryTransformer` — `id`, `name`, `color`, `icon`, timestamps
- `TransactionTransformer` — `id`, `categoryId`, `description`, `amount`, `type`, `date`, `observation`, timestamps

## Controllers

### Auth / Account (rotas ativas)

Prefixo: `/api/v1`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/auth/signup` | não | Criar conta |
| `POST` | `/auth/login` | não | Login (retorna user + token) |
| `GET` | `/account/profile` | sim | Perfil do usuário |
| `POST` | `/account/logout` | sim | Invalidar token |

### Categories

Controller CRUD pronto em `app/controllers/categories_controller.ts`:

| Método | Ação | Descrição |
|--------|------|-----------|
| `index` | listar | categorias do usuário autenticado |
| `store` | criar | valida + cria via `related('categories')` |
| `show` | detalhe | busca por id do próprio usuário |
| `update` | atualizar | `merge` + `save` |
| `destroy` | deletar | `delete` (falha se houver transactions por `RESTRICT`) |

> As rotas de categories ainda **não** estão registradas em `start/routes.ts`.

### Transactions

Ainda sem controller. Já existem migration, model, validator e transformer.

## Autenticação

Rotas protegidas usam `middleware.auth()`.

Envie o token no header:

```http
Authorization: Bearer <token>
```

## Estrutura principal

```
app/
  controllers/     # HTTP
  models/          # Lucid
  validators/      # VineJS
  transformers/    # Serialização da API
database/
  migrations/      # Schema
  schema.ts        # Gerado pelo Lucid (não editar à mão)
start/
  routes.ts        # Rotas
providers/
  api_provider.ts  # ApiSerializer → { data: ... }
```

## Scripts

```bash
npm run dev        # servidor com HMR
npm run build      # build de produção
npm start          # rodar build
npm test           # testes
npm run typecheck  # TypeScript
npm run lint       # ESLint
```

## Status atual

- [x] Auth (signup, login, profile, logout)
- [x] Migrations (users, tokens, categories, transactions)
- [x] Models + relações
- [x] Validators (user, category, transaction)
- [x] Transformers (user, category, transaction)
- [x] Categories CRUD controller
- [ ] Rotas de categories
- [ ] Transactions CRUD controller + rotas
