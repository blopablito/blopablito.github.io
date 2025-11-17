// src/pages/Account.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function Account() {
  const { user, login, register, logout } = useContext(AuthContext); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password, username }); 
    } catch (err) {
      console.error("Error al registrarse:", err);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <h1 className="page-title">Cuenta</h1>

      {user ? (
        <div className="panel">
          <div className="panel-inner">
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-inner" style={{ display: "grid", gap: 16 }}>
            <form onSubmit={handleLogin} style={{ display: "grid", gap: 8 }}>
              <h3>Iniciar sesión</h3>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn">Entrar</button>
            </form>

            <form onSubmit={handleRegister} style={{ display: "grid", gap: 8 }}>
              <h3>Registrarse</h3>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn">Crear cuenta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
