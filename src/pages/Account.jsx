// src/pages/Account.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";
import RegisterModal from "../components/RegisterModal";

export default function Account() {
  const { user, role, login, logout } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  if (!user)
    return (
      <div className="container">
        <h1 className="page-title">Cuenta</h1>
        <div className="panel" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="panel-inner" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Correo electrónico</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="usuario@example.com" />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => login({ email, password })}>Iniciar sesión</button>
              <button className="btn-outline" onClick={() => setShowRegister(true)}>Crear cuenta</button>
            </div>
          </div>
        </div>

        {showRegister && (
          <RegisterModal
            onClose={() => setShowRegister(false)}
          />
        )}
      </div>
    );

  const avatarSrc =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.email)}&background=ccc&color=333&rounded=true`;

  return (
    <div className="container">
      <h1 className="page-title">Mi cuenta</h1>
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="panel-inner" style={{ display: "grid", gap: 16, textAlign: "center" }}>
          <img
            src={avatarSrc}
            alt="Avatar"
            style={{ width: 96, height: 96, borderRadius: "50%", margin: "0 auto", objectFit: "cover" }}
          />
          <h2 style={{ margin: 0 }}>{user.username || user.email}</h2>
          <p style={{ color: "var(--muted)" }}>Rol: <strong>{role}</strong></p>
          <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
