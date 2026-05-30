import { useCallback, useEffect, useMemo, useState } from "react";

import api from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

const statusLabels = {
  pendente: "pendentes",
  em_andamento: "em andamento",
  concluida: "concluidas",
};

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" ");
  }

  return detail || "Ocorreu um erro ao processar a requisicao.";
}

function Tasks({ user, onUnauthorized }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        onUnauthorized();
        return;
      }
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleSubmit(taskData) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}`, taskData);
        setMessage("Tarefa atualizada com sucesso.");
      } else {
        await api.post("/tasks", taskData);
        setMessage("Tarefa criada com sucesso.");
      }

      setSelectedTask(null);
      await loadTasks();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(task, status) {
    setError("");
    setMessage("");

    try {
      await api.put(`/tasks/${task.id}`, { status });
      await loadTasks();
      setMessage("Status atualizado.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function confirmDelete() {
    if (!taskToDelete) {
      return;
    }
    setError("");
    setMessage("");

    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      if (selectedTask?.id === taskToDelete.id) {
        setSelectedTask(null);
      }
      setTaskToDelete(null);
      await loadTasks();
      setMessage("Tarefa excluida.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        task.titulo.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, tasks]);

  const completedCount = tasks.filter((task) => task.status === "concluida").length;

  return (
    <section className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Ola, {user.nome}</h1>
          <p>
            {filteredTasks.length} tarefa(s) encontradas
            {statusFilter ? `, ${statusLabels[statusFilter]}` : ""}.
          </p>
        </div>
        <div className="summary-pill">
          {completedCount}/{tasks.length} concluidas
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <div className="tasks-grid">
        <TaskForm
          selectedTask={selectedTask}
          loading={saving}
          onSubmit={handleSubmit}
          onCancel={() => setSelectedTask(null)}
        />

        <div className="task-list-panel">
          <div className="filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por titulo"
              aria-label="Buscar por titulo"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluida</option>
            </select>
          </div>

          {loading ? (
            <div className="empty-state">Carregando tarefas...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">Nenhuma tarefa encontrada.</div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={setSelectedTask}
                  onDelete={setTaskToDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {taskToDelete && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
          >
            <h2 id="delete-task-title">Excluir tarefa</h2>
            <p>
              Tem certeza que deseja excluir "{taskToDelete.titulo}"? Essa acao
              nao pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button
                className="button ghost"
                type="button"
                onClick={() => setTaskToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="button danger"
                type="button"
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Tasks;
