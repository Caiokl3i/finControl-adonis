# Frontend — Fluxo

Interface React para testar a API Adonis do **finControl**.

## Como rodar

Em dois terminais:

```bash
# 1) Backend Adonis (na raiz do projeto)
npm run dev

# 2) Frontend
cd frontend
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

O Vite faz **proxy** das rotas da API (`/auth`, `/account`, `/categories`, `/transactions`, `/dashboard`, `/statistics`) → `http://localhost:3333`.

## O que cada tela faz

| UI | Request | Controller |
|---|---|---|
| Criar conta | `POST /auth/signup` | `NewAccountController.store` |
| Entrar | `POST /auth/login` | `AccessTokensController.store` |
| Sair | `POST /account/logout` | `AccessTokensController.destroy` |
| Resumo | `GET /dashboard` + `GET /statistics` | Dashboard / Statistics |
| Lançamentos | `GET/POST/DELETE /transactions` | `TransactionsController` |
| Categorias | `GET/POST/DELETE /categories` | `CategoriesController` |

O token fica em `localStorage` (`fluxo_token`) e vai no header:

```http
Authorization: Bearer <token>
```

## Estrutura

```
src/
  api/      → client HTTP + chamadas tipadas
  auth/     → contexto de sessão
  pages/    → AuthPage e HomePage
  lib/      → formatação (BRL, datas)
```

Leia `src/api/client.ts` para ver a integração linha a linha.
