export default function Perfil() {
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
          <div className="search-banner crema">Perfil de usuario</div>

          <section className="panel perfil-box">
            <div className="perfil-info">
              <p><strong>Nombre:</strong> Usuario123</p>
              <p><strong>Email:</strong> usuario@ejemplo.com</p>
              <p><strong>Recetas guardadas:</strong> 12</p>
              <p><strong>Preferencias:</strong> Vegetariano, Sin gluten</p>
              <button className="btn">Editar perfil</button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
