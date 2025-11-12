// src/pages/Account.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function Account() {
  const { user, role, login, register, logout, setRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!user)
    return (
      <div id="account" className="container">
        <h1 className="page-title">Cuenta</h1>
        <div className="panel">
          <div className="panel-inner" style={{ maxWidth: 420, margin: "0 auto", display:"grid", gap:12 }}>
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="usuario@example.com" />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button className="btn" onClick={() => login({ email, password })}>Ingresar</button>
              <button className="btn-outline" onClick={() => register({ email, password })}>Registrarse</button>
            </div>
            <small style={{ color:"var(--muted)" }}>
              Tip: admin actual – johndoe@gmail.com
            </small>
          </div>
        </div>
      </div>
    );

  return (
    <div id="account" className="container">
      <h1 className="page-title">Bienvenido, {user.email}</h1>
      <div className="panel">
        <div className="panel-inner" style={{ display:"grid", gap:12 }}>
          <p><strong>Rol:</strong> {role}</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button className="btn-outline" onClick={() => logout()}>Cerrar sesión</button>
            {role !== "admin" && (
              <button className="btn" onClick={() => setRole("admin")}>Cambiar a Admin</button>
            )}
            {role !== "user" && (
              <button className="btn" onClick={() => setRole("user")}>Cambiar a Usuario</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
