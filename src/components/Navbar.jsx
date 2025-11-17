import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

export default function NavBar() {
  const { role } = useContext(AuthContext);

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
      <Link to="/">Inicio</Link>
      <Link to="/favoritos">Favoritos</Link>
      <Link to="/cuenta">Cuenta</Link>
      {role === "admin" && <Link to="/admin/recetas">Administración</Link>}
    </nav>
  );
}
