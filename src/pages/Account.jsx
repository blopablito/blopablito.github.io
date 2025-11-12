import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function Account() {
  const { user, role, login, register, logout } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!user)
    return (
      <div className="container">
        <h1 className="page-title">Cuenta</h1>
        <div className="panel">
          <div className="panel-inner" style={{ maxWidth: 420, margin: "0 auto", display:"grid", gap:12 }}>
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn" onClick={() => login({ email, password })}>
                Ingresar
              </button>
              <button className="btn-outline" onClick={() => register({ email, password })}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="container">
      <h1 className="page-title">Bienvenido, {user.username || user.email}</h1>
      <p><strong>Rol:</strong> {role}</p>
      <button className="btn-outline" onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
