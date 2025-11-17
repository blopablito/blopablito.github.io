import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

export default function Navbar() {
  const { role } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio" },
    { path: "/favoritos", label: "Favoritos" },
    { path: "/cuenta", label: "Cuenta" },
    { path: "/acerca", label: "Acerca" },
  ];

  if (role === "admin") {
    navItems.push({ path: "/admin/recetas", label: "Administración" });
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-around",
      padding: "12px 0",
      background: "#f9c74f",
      borderBottom: "2px solid #f9844a",
      fontSize: "16px",
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              color: isActive ? "#000" : "#555",
              borderBottom: isActive ? "2px solid #000" : "none",
              paddingBottom: "4px",
              fontWeight: isActive ? "bold" : "normal",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
