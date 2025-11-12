import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function Account() {
  const { user, role, login, register, logout, setRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  if (!user)
    return (
      <div id="account" className="container">
        <h1 className="page-title">Cuenta</h1>
        <div className="panel">
          <div className="panel-inner" style={{ maxWidth: 400, margin: "0 auto" }}>
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: 10, margin: "10px 0" }}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => login({ email, role: "user" })}>
                Ingresar como Usuario
              </button>
              <button className="btn" onClick={() => login({ email, role: "editor" })}>
                Ingresar como Editor
              </button>
              {/* Botón para registrar usuario prueba 2 */}
              <button className="btn" onClick={() => register({ email, role: "user" })}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div id="account" className="container">
      <h1 className="page-title">Bienvenido, {user.name}</h1>
      <div className="panel">
        <div className="panel-inner">
          <p><strong>Rol:</strong> {role}</p>
          <button className="btn-outline" onClick={() => logout()}>Cerrar sesión</button>
          {role === "user" && (
            <button className="btn" style={{ marginLeft: 10 }} onClick={() => setRole("editor")}>
              Cambiar a Editor
            </button>
          )}
          {role === "editor" && (
            <button className="btn" style={{ marginLeft: 10 }} onClick={() => setRole("user")}>
              Cambiar a Usuario
            </button>
          )}
          {/* Uso adicional de register en bloque logueado */}
          <button
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={() => register({ email: user.email, role })}
          >
            Re-registrar
          </button>
        </div>
      </div>
    </div>
  );
}
"// trigger redeploy" 
