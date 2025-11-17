import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import About from "./pages/About";
import Recipe from "./pages/Recipe";
import Editor from "./pages/Editor";
import AdminRecipes from "./pages/AdminRecipes"; 
export default function App() {
  return (
    <>
      <AppHeader />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/acerca" element={<About />} />
          <Route path="/receta/:id" element={<Recipe />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/admin/recetas" element={<AdminRecipes />} /> {/* ✅ ruta admin */}
          <Route path="*" element={<div className="container">Página no encontrada</div>} />
        </Routes>
      </main>
    </>
  );
}
