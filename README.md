# FSC Finance App API

API REST para gerenciamento financeiro (usuários + transações), com autenticação JWT (access token + refresh token), validação com **Zod v4**, e persistência em **PostgreSQL** via **Prisma**.

> **Docs interativas (Swagger):** `GET /docs`

---

## Stack
- Node.js (ESM) + Express
- PostgreSQL
- Prisma Client
- Zod (validação)
- JWT (`jsonwebtoken`)
- bcrypt (hash de senha)
- Jest + Supertest (testes)
- Swagger UI (`swagger-ui-express`)

---

## Como rodar

### Pré-requisitos
- Node 18+ (recomendado: 20+)
- Docker (opcional, mas facilita o Postgres)

### 1) Instalar dependências
```bash
npm install
```

### 2) Subir o Postgres (Docker)
O projeto já tem um `docker-compose.yml` com Postgres:

```bash
docker compose up -d
```

### 3) Criar `.env`
Crie um arquivo `.env` na raiz do projeto (ou use `.env.development` se você rodar pelo script `start:dev`):

```env
PORT=3000
DATABASE_URL="postgresql://user:senha@localhost:5432/financeapp?schema=public"

JWT_ACCESS_TOKEN_SECRET="coloque-um-segredo-forte-aqui"
JWT_REFRESH_TOKEN_SECRET="coloque-outro-segredo-forte-aqui"
```

> Dica visionária 💡: gere segredos com pelo menos 32+ caracteres aleatórios (password manager) e **nunca** versione o `.env`.

### 4) Prisma (generate + migrate)
O `postinstall` já roda `prisma generate`, mas para criar as tabelas:

```bash
npx prisma migrate dev
```

### 5) Rodar a API
Modo dev (usa `.env.development`):
```bash
npm run start:dev
```

Modo normal (usa `.env`):
```bash
npm start
```

A API sobe em:
- `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`

---

## Scripts úteis
```bash
npm test
npm run test:watch
npm run test:coverage

npm run eslint:check
npm run prettier:check
```

---

## Arquitetura (visão rápida)
Este projeto segue uma separação bem “Clean-ish”:

- **routes/**: define endpoints Express (camada HTTP)
- **controllers/**: valida input, chama use case, formata resposta
- **user-case/**: regras de negócio
- **repositories/**: acesso ao banco (Prisma)
- **adapters/**: integrações/infra (JWT generator/verifier, comparadores)
- **schemas/**: Zod schemas (DTOs/validação)
- **errors/**: erros de domínio

Os controllers são instanciados via **factories** (`src/factories/...`), o que facilita testes, troca de implementações e DI sem framework.

---

## Autenticação

### Como funciona
- **Login** (`POST /api/users/login`) retorna `accessToken` e `refreshToken`.
- Você usa o **access token** no header `Authorization: Bearer <token>` para rotas protegidas.
- Quando o access token expirar, você usa `POST /api/users/refresh-token` com o refresh token para obter novos tokens.

### Header esperado nas rotas protegidas
```http
Authorization: Bearer <access_token>
```

> O middleware `auth` extrai o token do header e injeta `request.userId` (lido do payload JWT).

---

## Rotas

Base URL: `/api`

### Users
#### Criar usuário
`POST /users`

Body (aceita camelCase ou snake_case):
```json
{
  "firstName": "Douglas",
  "lastName": "Pimenta",
  "email": "douglas@email.com",
  "password": "123456"
}
```

Respostas comuns:
- `201` usuário criado
- `400` validação/Zod ou email já em uso

#### Login
`POST /users/login`

Body:
```json
{
  "email": "douglas@email.com",
  "password": "123456"
}
```

Respostas comuns:
- `200` retorna usuário + tokens
- `401` senha inválida
- `404` usuário não encontrado

#### Refresh token
`POST /users/refresh-token`

Body:
```json
{
  "refreshToken": "<refresh_token>"
}
```

Respostas comuns:
- `200` retorna novos tokens
- `400` refresh token ausente/inválido
- `401` refresh expirado/inválido (Unauthorized)

#### Perfil do usuário (me)
`GET /users/me` (protegida)

Respostas comuns:
- `200` usuário
- `401` não autenticado

#### Atualizar usuário (me)
`PATCH /users/me` (protegida)

Body (campos opcionais):
```json
{
  "first_name": "Novo Nome"
}
```

Respostas comuns:
- `200` usuário atualizado
- `400` validação/strict
- `401` não autenticado

#### Deletar usuário (me)
`DELETE /users/me` (protegida)

Respostas comuns:
- `200` usuário deletado
- `401` não autenticado

#### Saldo (me)
`GET /users/me/balance?from=2025-01-01&to=2025-12-31` (protegida)

Retorna somatórios por tipo de transação (expenses, earnings, investments) e o balanço calculado (depende do use case).

---

### Transactions
#### Criar transação
`POST /transaction/me` (protegida)

Body:
```json
{
  "name": "Salário",
  "date": "2025-12-01",
  "amount": 2500.00,
  "type": "EARNINGS"
}
```

> O `user_id` é injetado automaticamente pelo router a partir do token.

Respostas comuns:
- `201` transação criada
- `400` validação (Zod)
- `404` usuário não encontrado

#### Listar transações do usuário
`GET /transaction/me?from=2025-01-01&to=2025-12-31` (protegida)

Respostas comuns:
- `200` lista de transações
- `400` validação (Zod)
- `401` não autenticado

#### Atualizar transação
`PATCH /transaction/me/:transactionId` (protegida)

Body (campos opcionais; apenas permitidos):
```json
{
  "name": "Mercado",
  "amount": 120.50
}
```

Respostas comuns:
- `200` transação atualizada
- `400` transaction não encontrada / acesso não autorizado / validação
- `401` não autenticado

#### Deletar transação
`DELETE /transaction/me/:transactionId` (protegida)

Respostas comuns:
- `200` transação deletada
- `400` id inválido
- `404` transaction não encontrada (quando aplicável)
- `401` não autenticado

---

## Exemplos rápidos (cURL)

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"douglas@email.com","password":"123456"}'
```

### Criar transação (com token)
```bash
curl -X POST http://localhost:3000/api/transaction/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"name":"Salário","date":"2025-12-01","amount":2500.00,"type":"EARNINGS"}'
```

---

## Padrão de erro (geral)
O projeto tende a responder erros assim:

```json
{ "message": "..." }
```

Alguns pontos retornam:
```json
{ "error": "Unauthorized" }
```

---

## Observações e melhorias sugeridas (próximos passos)
Uma visão mais “produto pronto para o mundo”:

1) **Padronizar respostas de erro** (sempre `{ message, code, details }`).
2) **Versionar API** (`/api/v1/...`) para evoluir sem quebrar clientes.
3) **Rate limit / anti-spam** em login e create-user.
4) **Refresh token rotation com blacklist** (armazenar `jti`/token no banco e invalidar o anterior).
5) **Logs estruturados + tracing** (pino/winston + request-id).
6) **Docs como contrato**: manter Swagger como fonte da verdade e gerar clients automaticamente.

### Nota técnica (importante)
No endpoint `GET /api/transaction/me`, o controller valida `from/to`, mas atualmente chama o use case sem repassar `from/to`.  
Se você perceber erro ou retorno vazio, o ajuste é: passar `from, to` na chamada do use case (e do repository), mantendo o contrato do Swagger.

---

## Licença
ISC
