// src/pages/Account.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../store/authContext";

export default function Account() {
  const { user, login, register, logout, isAuthenticated } = useContext(AuthContext); 
  
  // Estados para Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para Registro
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // === Auth Logic ===
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await login({ email, password });
    } catch (err) {
      setErrorMsg("Error al iniciar sesión.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await register({ email: regEmail, password: regPassword, username: regUsername });
    } catch (err) {
      setErrorMsg("Error al crear cuenta.");
    }
  };

  const handleLogout = () => {
    logout();
    setEmail(""); setPassword("");
    setRegEmail(""); setRegPassword(""); setRegUsername("");
  };

  // Helper para mostrar avatar (URL del usuario o generado con iniciales)
  const getDisplayAvatar = () => {
      if (user?.avatarUrl) return user.avatarUrl;
      const seed = user?.name || user?.username || "User";
      return `https://ui-avatars.com/api/?name=${seed}&background=random&size=128`;
  };

  return (
    <div className="container">
      <h1 className="page-title">Cuenta</h1>

      {isAuthenticated && user ? (
        // === USUARIO CONECTADO (SOLO LECTURA) ===
        <div className="panel" style={{ maxWidth: "500px", margin: "0 auto" }}>
          <div className="panel-inner" style={{ textAlign: "center" }}>
            
            {/* Avatar */}
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                <img 
                    src={getDisplayAvatar()} 
                    alt="Perfil" 
                    style={{ 
                        display: "block", margin: "0 auto",
                        width: "120px", height: "120px", 
                        borderRadius: "50%", objectFit: "cover",
                        border: "4px solid var(--primary-color, #eee)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }} 
                />
            </div>

            {/* Datos del Usuario */}
            <h2 style={{ margin: "0 0 5px 0", textAlign: "center" }}>{user.name || user.username}</h2>
            <p style={{ color: "var(--muted)", margin: "0 0 30px 0", textAlign: "center" }}>{user.email}</p>
            
            {/* Botón Cerrar Sesión */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button 
                    className="btn" 
                    style={{ background: "#ff6b6b", borderColor: "#ff6b6b", color: "white", minWidth: "150px" }} 
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>

          </div>
        </div>
      ) : (
        // === VISTA DESCONECTADO (DOS COLUMNAS) ===
        <div className="panel">
           <div className="panel-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", alignItems: "start" }}>
             
             {/* LOGIN */}
             <div style={{ borderRight: "1px solid #eee", paddingRight: "1rem" }}>
                 <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>
                 <form onSubmit={handleLogin} style={{ display: "grid", gap: "12px" }}>
                     <div><label>Correo</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={{ width: "100%", padding: "8px" }} /></div>
                     <div><label>Contraseña</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={{ width: "100%", padding: "8px" }} /></div>
                     <button className="btn" type="submit">Entrar</button>
                 </form>
             </div>

             {/* REGISTRO */}
             <div style={{ paddingLeft: "1rem" }}>
                 <h2 style={{ marginTop: 0 }}>Crear cuenta</h2>
                 <form onSubmit={handleRegister} style={{ display: "grid", gap: "12px" }}>
                     <div><label>Usuario</label><input type="text" required value={regUsername} onChange={e=>setRegUsername(e.target.value)} style={{ width: "100%", padding: "8px" }} /></div>
                     <div><label>Correo</label><input type="email" required value={regEmail} onChange={e=>setRegEmail(e.target.value)} style={{ width: "100%", padding: "8px" }} /></div>
                     <div><label>Contraseña</label><input type="password" required value={regPassword} onChange={e=>setRegPassword(e.target.value)} style={{ width: "100%", padding: "8px" }} /></div>
                     <button className="btn-outline" type="submit">Registrarse</button>
                 </form>
             </div>
             
             {errorMsg && <div style={{ gridColumn: "1 / -1", color: "red", textAlign: "center" }}>{errorMsg}</div>}
           </div>
        </div>
      )}
    </div>
  );
}