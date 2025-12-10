// src/pages/Account.jsx
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../store/authContext";

// === IMPORTACIÓN DE IMÁGENES LOCALES ===
// Asegúrate de que las imágenes existan en src/assets/avatars/
import avatar1 from "../assets/avatars/1.png";
import avatar2 from "../assets/avatars/2.png";
import avatar3 from "../assets/avatars/3.png";
import avatar4 from "../assets/avatars/4.png";
import avatar5 from "../assets/avatars/5.png";
import avatar6 from "../assets/avatars/6.png";
import avatar7 from "../assets/avatars/7.png";
import avatar8 from "../assets/avatars/8.png";
import avatar9 from "../assets/avatars/9.png";
import avatar10 from "../assets/avatars/10.png";

// Lista ordenada para mostrar en la selección
const AVATAR_OPTIONS = [
  avatar1, avatar2, avatar3, avatar4, avatar5,
  avatar6, avatar7, avatar8, avatar9, avatar10
];

export default function Account() {
  const { user, login, register, logout, updateProfile, isAuthenticated } = useContext(AuthContext); 
  
  // Estados para Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para Registro
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // Estados Edición
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    if (user) {
        setEditName(user.name || user.username || "");
        setSelectedAvatar(user.avatarUrl || "");
    }
  }, [user]);

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

  // === Update Profile Logic ===
  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      
      const payload = { 
          name: editName,
          avatarUrl: selectedAvatar
      };
      
      if (editPassword.trim().length > 0) {
          payload.password = editPassword;
      }

      // Llamada segura a updateProfile
      const result = await updateProfile(user.id, payload);
      
      if (result && result.success) {
          setIsEditing(false);
          setEditPassword("");
          alert("Perfil actualizado correctamente");
      } else {
          alert("Error al actualizar perfil: " + (result?.msg || "Desconocido"));
      }
  };

  // Lógica para mostrar avatar (Local > User > UI Avatars)
  const getDisplayAvatar = () => {
      // 1. Si estamos editando y seleccionó uno, mostrar ese
      if (isEditing && selectedAvatar) return selectedAvatar;
      // 2. Si el usuario ya tiene uno guardado, mostrar ese
      if (user?.avatarUrl) return user.avatarUrl;
      // 3. Fallback: Generador de letras
      const seed = user?.name || user?.username || "User";
      return `https://ui-avatars.com/api/?name=${seed}&background=random&size=128`;
  };

  return (
    <div className="container">
      <h1 className="page-title">Cuenta</h1>

      {isAuthenticated && user ? (
        // === VISTA DE USUARIO LOGUEADO ===
        <div className="panel" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="panel-inner" style={{ textAlign: "center" }}>
            
            {/* Avatar Centrado */}
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

            {!isEditing ? (
                <>
                    <h2 style={{ margin: "0 0 5px 0", textAlign: "center" }}>{user.name || user.username}</h2>
                    <p style={{ color: "var(--muted)", margin: "0 0 20px 0", textAlign: "center" }}>{user.email}</p>
                    
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button className="btn-outline" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                        <button className="btn" style={{ background: "#ff6b6b", borderColor: "#ff6b6b", color: "white" }} onClick={handleLogout}>Cerrar sesión</button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleUpdateProfile} style={{ textAlign: "left" }}>
                    
                    {/* Grid de Avatares Locales */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "0.9rem", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Elige tu Avatar</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", background: "#f9f9f9", padding: "10px", borderRadius: "10px" }}>
                            {AVATAR_OPTIONS.map((imgSrc, index) => (
                                <img 
                                    key={index} 
                                    src={imgSrc} 
                                    alt={`Avatar ${index + 1}`} 
                                    onClick={() => setSelectedAvatar(imgSrc)}
                                    style={{ 
                                        width: "100%", aspectRatio: "1/1", borderRadius: "50%", cursor: "pointer", objectFit: "cover", 
                                        border: selectedAvatar === imgSrc ? "3px solid #ff9800" : "2px solid transparent", 
                                        transition: "transform 0.2s" 
                                    }} 
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gap: "12px" }}>
                        <div>
                            <label style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Nombre</label>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Nueva Contraseña (Opcional)</label>
                            <input type="password" placeholder="Dejar vacía para no cambiar" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                        </div>
                        <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
                            <button className="btn" type="submit">Guardar Cambios</button>
                            <button className="btn-outline" type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                        </div>
                    </div>
                </form>
            )}
          </div>
        </div>
      ) : (
        // === VISTA DE DOS COLUMNAS (LOGIN / REGISTRO) ===
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