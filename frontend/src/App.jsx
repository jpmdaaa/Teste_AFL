import { useEffect, useState } from "react";

import api from "./api/api";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  async function loadCurrentUser() {
    // Ao abrir a aplicação, tentamos reaproveitar o token salvo para manter o usuário logado.
    const token = localStorage.getItem("token");

    if (!token) {
      setCheckingAuth(false);
      setUser(null);
      setPage("login");
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      setPage("tasks");
    } catch {
      // Token inválido ou expirado volta o usuário para o login, sem quebrar a tela.
      localStorage.removeItem("token");
      setUser(null);
      setPage("login");
    } finally {
      setCheckingAuth(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
  }, []);

  function handleAuthenticated(authenticatedUser) {
    setUser(authenticatedUser);
    setPage("tasks");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
  }

  if (checkingAuth) {
    return <div className="page-loader">Carregando...</div>;
  }

  const isAuthenticated = Boolean(user);

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        currentPage={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {!isAuthenticated && page === "register" && (
          <Register
            onRegistered={() => setPage("login")}
            onGoToLogin={() => setPage("login")}
          />
        )}

        {!isAuthenticated && page !== "register" && (
          <Login
            onAuthenticated={handleAuthenticated}
            onGoToRegister={() => setPage("register")}
          />
        )}

        {isAuthenticated && (
          <Tasks user={user} onUnauthorized={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;
