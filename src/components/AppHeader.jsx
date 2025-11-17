import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/authContext"; 

const Icon = { /* tus íconos */ };

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { role } = useContext(AuthContext); 

  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }) => `nav-btn${isActive ? " active" : ""}`;

  return (
    <header className="appbar" role="banner">
      <div className="appbar-inner">
        <Link to="/" className="brand" aria-label="Super Recetario - Inicio">
          <span className="brand-title">SUPER · RECETARIO</span>
        </Link>

        <nav className="nav nav-desktop" aria-label="Principal">
          <NavLink to="/" className={linkClass} end style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <Icon.Home/> Inicio
          </NavLink>
          <NavLink to="/favoritos" className={linkClass} style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <Icon.Heart/> Favoritos
          </NavLink>
          <NavLink to="/cuenta" className={linkClass} style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <Icon.User/> Cuenta
          </NavLink>
          <NavLink to="/acerca" className={linkClass} style={{display:"inline-flex",alignItems:"center",gap:6}}>
            <Icon.Info/> Acerca
          </NavLink>
          {role === "admin" && (
            <NavLink to="/admin/recetas" className={linkClass} style={{display:"inline-flex",alignItems:"center",gap:6}}>
              🛠️ Administración
            </NavLink>
          )}
        </nav>

        <button
          className="hamburger"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(v => !v)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="nav-mobile" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="nav-mobile-inner">
            <NavLink to="/" className={linkClass} end>Inicio</NavLink>
            <NavLink to="/favoritos" className={linkClass}>Favoritos</NavLink>
            <NavLink to="/cuenta" className={linkClass}>Cuenta</NavLink>
            <NavLink to="/acerca" className={linkClass}>Acerca</NavLink>
            {role === "admin" && (
              <NavLink to="/admin/recetas" className={linkClass}>Administración</NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
