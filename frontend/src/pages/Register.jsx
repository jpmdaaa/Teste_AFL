import { useState } from "react";

import api from "../api/api";

function getErrorMessage(error) {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" ");
  }

  return detail || "Nao foi possivel criar sua conta.";
}

function Register({ onRegistered, onGoToLogin }) {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setSuccess("Conta criada com sucesso. Voce ja pode fazer login.");
      setForm({ nome: "", email: "", senha: "" });
      setTimeout(onRegistered, 900);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-panel">
      <div>
        <h1>Cadastro</h1>
        <p>Crie sua conta para organizar tarefas com privacidade.</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            minLength="2"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="voce@email.com"
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Minimo de 6 caracteres"
            minLength="6"
            required
          />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <button className="link-button" type="button" onClick={onGoToLogin}>
        Ja tenho uma conta
      </button>
    </section>
  );
}

export default Register;
