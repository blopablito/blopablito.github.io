// src/components/AppHeader.jsx
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Icon = {
  Home: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path d="M3 10.5 12 3l9 7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v10h14V10" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Heart: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  User: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <circle cx="12" cy="8" r="4" strokeWidth="2"/>
      <path d="M4 20c2-4 6-6 8-6s6 2 8 6" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Info: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
      <path d="M12 8h.01M11 12h2v6h-2z" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
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
          </div>
        </div>
      )}
    </header>
  );
}
