// src/App.js
import { Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Account from "./pages/Account";
import About from "./pages/About";
import Recipe from "./pages/Recipe";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <>
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/acerca" element={<About />} />
          <Route path="/receta/:id" element={<Recipe />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<div className="container">Página no encontrada</div>} />
        </Routes>
      </main>
    </>
  );
}
