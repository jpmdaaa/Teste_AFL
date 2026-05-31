import { useEffect, useState } from "react";

const initialValues = {
  titulo: "",
  descricao: "",
  status: "pendente",
};

function TaskForm({ selectedTask, loading, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    // Ao editar, coloca os dados da tarefa no formulário.
    if (selectedTask) {
      setForm({
        titulo: selectedTask.titulo,
        descricao: selectedTask.descricao || "",
        status: selectedTask.status,
      });
    } else {
      setForm(initialValues);
    }
  }, [selectedTask]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // Tira espaços sobrando antes de enviar.
    await onSubmit({
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      status: form.status,
    });

    if (!selectedTask) {
      setForm(initialValues);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{selectedTask ? "Editar tarefa" : "Nova tarefa"}</h2>
        {selectedTask && (
          <button className="button ghost" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>

      <label>
        Titulo
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Ex: Revisar proposta"
          minLength="2"
          maxLength="160"
          required
        />
      </label>

      <label>
        Descricao
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Detalhes opcionais da tarefa"
          maxLength="2000"
          rows="4"
        />
      </label>

      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluida</option>
        </select>
      </label>

      <button className="button primary" type="submit" disabled={loading}>
        {loading ? "Salvando..." : selectedTask ? "Atualizar" : "Criar tarefa"}
      </button>
    </form>
  );
}

export default TaskForm;
