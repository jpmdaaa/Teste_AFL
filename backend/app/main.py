from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, tasks

# Cria as tabelas no SQLite quando a API é iniciada.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="To-Do List API",
    description="API para gerenciamento de tarefas com autenticacao JWT.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    # Deixa o frontend local acessar a API.
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "To-Do List API em execucao"}
