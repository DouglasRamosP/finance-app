# Endpoints (resumo)

Base URL: `/api`

## Users

- `POST /users` — cria usuário
- `POST /users/login` — login (retorna access/refresh tokens)
- `POST /users/refresh-token` — renova tokens
- `GET /users/me` — retorna usuário autenticado (Bearer)
- `PATCH /users/me` — atualiza usuário autenticado (Bearer)
- `DELETE /users/me` — remove usuário autenticado (Bearer)
- `GET /users/me/balance?from=YYYY-MM-DD&to=YYYY-MM-DD` — saldo no intervalo (Bearer)

## Transactions

- `POST /transactions/me` — cria transação (Bearer)
- `GET /transactions/me?from=YYYY-MM-DD&to=YYYY-MM-DD` — lista transações no intervalo (Bearer)
- `PATCH /transactions/me/:id` — atualiza transação (Bearer)
- `DELETE /transactions/me/:id` — remove transação (Bearer)

> Para detalhes completos (schemas, exemplos e respostas), use o Swagger em `GET /docs`.
