import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

export default function Navbar() {
  const { role } = useContext(AuthContext);
  const location = useLocation();

  const baseItems = [
    { path: "/", label: "Inicio" },
    { path: "/favoritos", label: "Favoritos" },
    { path: "/cuenta", label: "Cuenta" },
    { path: "/acerca", label: "Acerca" },
  ];

  const navItems = role === "admin"
    ? [...baseItems, { path: "/admin/recetas", label: "Administración" }]
    : baseItems;

  return (
    <nav style={{
      display: "flex",
      justifyContent: "center",
      gap: "32px",
      padding: "12px 0",
      background: "#f9c74f",
      borderBottom: "2px solid #f9844a",
      fontSize: "16px",
    }}>
      {navItems.map(({ path, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            style={{
              textDecoration: "none",
              color: isActive ? "#000" : "#555",
              borderBottom: isActive ? "2px solid #000" : "none",
              paddingBottom: "4px",
              fontWeight: isActive ? "bold" : "normal",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
