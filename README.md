# To-Do List com Autenticacao

Aplicacao full stack para gerenciamento de tarefas com cadastro, login e tarefas privadas por usuario. O backend usa FastAPI, SQLite, SQLAlchemy e JWT. O frontend usa React com Vite, Axios e CSS responsivo.

## Tecnologias

**Backend**

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic
- JWT com `python-jose`
- Hash de senha com `passlib[bcrypt]`
- Uvicorn

**Frontend**

- React
- Vite
- JavaScript
- Axios
- CSS responsivo
- Lucide React para icones

## Estrutura de pastas

```text
.
├── backend
│   ├── app
│   │   ├── routers
│   │   │   ├── auth.py
│   │   │   └── tasks.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── .env.example
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── api
│   │   │   └── api.js
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend
```

Crie e ative o ambiente virtual:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

No Windows, use:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Instale as dependencias:

```bash
pip install -r requirements.txt
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Edite `SECRET_KEY` no arquivo `.env` para um valor longo e seguro.

Execute a API:

```bash
uvicorn app.main:app --reload
```

A API ficara disponivel em:

```text
http://localhost:8000
```

A documentacao interativa fica em:

```text
http://localhost:8000/docs
```

## Banco SQLite

Nao ha ferramenta de migration neste projeto. O SQLite e criado automaticamente quando a aplicacao inicia, porque `Base.metadata.create_all(bind=engine)` e executado em `backend/app/main.py`.

O arquivo gerado sera:

```text
backend/todo.db
```

Para recriar o banco do zero em desenvolvimento, pare a API e remova esse arquivo:

```bash
rm backend/todo.db
```

Se voce estiver dentro da pasta `backend`, use:

```bash
rm todo.db
```

## Como rodar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm install
```

Opcionalmente, crie o `.env`:

```bash
cp .env.example .env
```

Execute o Vite:

```bash
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:5173
```

## Endpoints

### Autenticacao

| Metodo | Rota | Descricao | Autenticacao |
| --- | --- | --- | --- |
| POST | `/auth/register` | Cadastra usuario | Nao |
| POST | `/auth/login` | Faz login e retorna JWT | Nao |
| GET | `/auth/me` | Retorna usuario logado | Sim |

### Tarefas

| Metodo | Rota | Descricao | Autenticacao |
| --- | --- | --- | --- |
| POST | `/tasks` | Cria tarefa | Sim |
| GET | `/tasks` | Lista tarefas do usuario | Sim |
| GET | `/tasks/{id}` | Busca uma tarefa do usuario | Sim |
| PUT | `/tasks/{id}` | Atualiza tarefa do usuario | Sim |
| DELETE | `/tasks/{id}` | Exclui tarefa do usuario | Sim |

Filtros disponiveis em `GET /tasks`:

- `status`: `pendente`, `em_andamento` ou `concluida`
- `search`: busca por titulo

Exemplo:

```text
GET /tasks?status=pendente&search=relatorio
```

## Exemplos de uso da API

### Cadastro

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Joao","email":"joao@email.com","senha":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'
```

Resposta:

```json
{
  "access_token": "TOKEN_JWT",
  "token_type": "bearer"
}
```

### Usuario logado

```bash
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer TOKEN_JWT"
```

### Criar tarefa

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudar FastAPI","descricao":"Revisar JWT e SQLAlchemy","status":"pendente"}'
```

### Listar tarefas

```bash
curl http://localhost:8000/tasks \
  -H "Authorization: Bearer TOKEN_JWT"
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"status":"concluida"}'
```

### Excluir tarefa

```bash
curl -X DELETE http://localhost:8000/tasks/1 \
  -H "Authorization: Bearer TOKEN_JWT"
```

## Autenticacao JWT

Ao fazer login, a API retorna um token JWT. O frontend salva esse token no `localStorage` e envia nas requisicoes privadas com o header:

```text
Authorization: Bearer TOKEN
```

As rotas de tarefas sempre usam o usuario extraido do token. Por isso, um usuario nao consegue listar, editar, consultar ou excluir tarefas de outro usuario.

Em producao, altere obrigatoriamente a `SECRET_KEY`, use HTTPS e avalie estrategias adicionais como refresh token e expiracao curta do access token.

## Funcionalidades extras implementadas

- Filtro por status
- Busca por titulo
- Confirmacao antes de excluir
- Data de criacao formatada
- Loading states
- Mensagens amigaveis de erro e sucesso
- CORS configurado para o Vite local
- `.env.example` no backend e frontend
