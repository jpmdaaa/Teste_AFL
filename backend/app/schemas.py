from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class TaskStatus(str, Enum):
    # Lista os status que uma tarefa pode ter.
    pendente = "pendente"
    em_andamento = "em_andamento"
    concluida = "concluida"


class UserCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    senha: str = Field(..., min_length=6, max_length=128)


class UserRead(BaseModel):
    id: int
    nome: str
    email: EmailStr
    data_criacao: datetime

    class Config:
        # Ajuda a transformar dados do banco em resposta da API.
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str = Field(..., min_length=1)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TaskCreate(BaseModel):
    titulo: str = Field(..., min_length=2, max_length=160)
    descricao: Optional[str] = Field(default=None, max_length=2000)
    status: TaskStatus = TaskStatus.pendente


class TaskUpdate(BaseModel):
    # Permite mudar apenas os campos enviados.
    titulo: Optional[str] = Field(default=None, min_length=2, max_length=160)
    descricao: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[TaskStatus] = None


class TaskRead(BaseModel):
    id: int
    titulo: str
    descricao: Optional[str]
    status: TaskStatus
    data_criacao: datetime
    usuario_id: int

    class Config:
        from_attributes = True
