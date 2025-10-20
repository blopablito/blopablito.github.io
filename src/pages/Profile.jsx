export default function Profile() {
  return (
    <>
      <header>
        <div className="header-inner">
          <div className="brand">
            <span className="logo"></span>
            <span className="brand-title">SUPER RECETARIO</span>
          </div>
          <nav className="nav">
            <a href="/" className="nav-btn">Inicio</a>
            <a href="/favoritos" className="nav-btn">Favoritos</a>
            <a href="/perfil" className="nav-btn active">Perfil</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="shell">
          <div className="search-banner" style={{ backgroundColor: "#E8DCCF" }}>Perfil de usuario</div>
          <div className="profile-layout" style={{ backgroundColor: "#FF6A3D" }}>
            <div className="profile-box" style={{ alignItems: "center", justifyContent: "center" }}>
              <div className="avatar-circle"></div>
              <p className="username">usuario123</p>
            </div>
            <div className="profile-box">
              <p><strong>Correo:</strong> correo@gmail.com</p>
              <p><strong>Registro:</strong> 01 enero 2025</p>
              <button className="btn">Editar preferencias</button>
              <button className="btn">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}