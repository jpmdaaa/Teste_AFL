from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "usuarios"

    # Guarda os dados da pessoa cadastrada.
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow, nullable=False)

    tarefas = relationship(
        "Task",
        back_populates="usuario",
        # Ao apagar o usuário, apaga também as tarefas dele.
        cascade="all, delete-orphan",
    )


class Task(Base):
    __tablename__ = "tarefas"

    # Cada tarefa fica ligada ao usuário que a criou.
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(160), index=True, nullable=False)
    descricao = Column(Text, nullable=True)
    status = Column(String(20), default="pendente", nullable=False)
    data_criacao = Column(DateTime, default=datetime.utcnow, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    usuario = relationship("User", back_populates="tarefas")
