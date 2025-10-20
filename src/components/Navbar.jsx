import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <h1 className="logo">SUPER RECETARIO</h1>
      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>Inicio</NavLink>
        <NavLink to="/favoritos" className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>Favoritos</NavLink>
        <NavLink to="/perfil" className={({ isActive }) => isActive ? "nav-btn active" : "nav-btn"}>Perfil</NavLink>
      </nav>
    </header>
  );
}
