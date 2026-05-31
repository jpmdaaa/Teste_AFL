from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Task, User
from app.schemas import TaskCreate, TaskRead, TaskStatus, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["Tarefas"])


def get_user_task(task_id: int, user_id: int, db: Session) -> Task:
    # Busca a tarefa já filtrando pelo dono, evitando acesso a dados de outro usuário.
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.usuario_id == user_id)
        .first()
    )
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarefa nao encontrada",
        )
    return task


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # O usuário autenticado vira o dono da tarefa automaticamente.
    task = Task(
        titulo=task_data.titulo.strip(),
        descricao=task_data.descricao,
        status=task_data.status.value,
        usuario_id=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("", response_model=list[TaskRead])
def list_tasks(
    status_filter: Optional[TaskStatus] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None, min_length=1, max_length=160),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # A listagem sempre começa limitada às tarefas do usuário logado.
    query = db.query(Task).filter(Task.usuario_id == current_user.id)

    if status_filter:
        query = query.filter(Task.status == status_filter.value)

    if search:
        # A busca ignora maiúsculas e minúsculas para ficar mais confortável no uso diário.
        query = query.filter(Task.titulo.ilike(f"%{search.strip()}%"))

    return query.order_by(Task.data_criacao.desc()).all()


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_task(task_id, current_user.id, db)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_user_task(task_id, current_user.id, db)
    # exclude_unset mantém fora da atualização os campos que nem vieram na requisição.
    update_data = task_data.model_dump(exclude_unset=True)

    if "titulo" in update_data and update_data["titulo"] is not None:
        task.titulo = update_data["titulo"].strip()
    if "descricao" in update_data:
        task.descricao = update_data["descricao"]
    if "status" in update_data and update_data["status"] is not None:
        task.status = update_data["status"].value

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = get_user_task(task_id, current_user.id, db)
    db.delete(task)
    db.commit()
    return None
