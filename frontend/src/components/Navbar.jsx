import { LogOut } from "lucide-react";

import aflLogo from "../assets/afl-logo.svg";

function Navbar({ user, currentPage, onNavigate, onLogout }) {
  return (
    <header className="navbar">
      <button
        className="brand-button"
        type="button"
        onClick={() => onNavigate(user ? "tasks" : "login")}
        aria-label="Ir para inicio"
      >
        <img
          className="brand-logo"
          src={aflLogo}
          alt="AFL Consultores Associados"
        />
      </button>

      <nav className="nav-actions">
        {user ? (
          <>
            <span className="user-chip">{user.nome}</span>
            <button className="button ghost" type="button" onClick={onLogout}>
              <LogOut size={18} />
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              className={currentPage === "login" ? "button" : "button ghost"}
              type="button"
              onClick={() => onNavigate("login")}
            >
              Login
            </button>
            <button
              className={currentPage === "register" ? "button" : "button ghost"}
              type="button"
              onClick={() => onNavigate("register")}
            >
              Cadastro
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
