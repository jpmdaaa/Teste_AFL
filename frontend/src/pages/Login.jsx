import { useState } from "react";

import api from "../api/api";

function getErrorMessage(error) {
  return error.response?.data?.detail || "Nao foi possivel fazer login.";
}

function Login({ onAuthenticated, onGoToRegister }) {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginResponse = await api.post("/auth/login", form);
      // Salva o token para a próxima chamada já ir autenticada.
      localStorage.setItem("token", loginResponse.data.access_token);

      const userResponse = await api.get("/auth/me");
      onAuthenticated(userResponse.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-panel">
      <div>
        <h1>Entrar</h1>
        <p>Acesse suas tarefas e continue de onde parou.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
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
            placeholder="Sua senha"
            required
          />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <button className="link-button" type="button" onClick={onGoToRegister}>
        Criar uma conta
      </button>
    </section>
  );
}

export default Login;
