import { Calendar, Pencil, Trash2 } from "lucide-react";

const statusLabels = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluida",
};

function formatDate(value) {
  // Mostra a data no formato brasileiro para combinar com o restante da interface.
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="task-item">
      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.titulo}</h3>
          <span className={`status-badge status-${task.status}`}>
            {statusLabels[task.status]}
          </span>
        </div>
        {task.descricao && <p>{task.descricao}</p>}
        <span className="task-date">
          <Calendar size={15} />
          {formatDate(task.data_criacao)}
        </span>
      </div>

      <div className="task-controls">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task, event.target.value)}
          aria-label="Alterar status da tarefa"
        >
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluida</option>
        </select>
        <button
          className="icon-button"
          type="button"
          onClick={() => onEdit(task)}
          aria-label="Editar tarefa"
          title="Editar"
        >
          <Pencil size={18} />
        </button>
        <button
          className="icon-button danger"
          type="button"
          onClick={() => onDelete(task)}
          aria-label="Excluir tarefa"
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
