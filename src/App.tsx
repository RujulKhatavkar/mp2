import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import ListView from "./pages/ListView";
import GalleryView from "./pages/GalleryView";
import DetailView from "./pages/DetailView";

// Use "/" in dev, "/mp2" when deployed on GitHub Pages
const BASENAME = process.env.NODE_ENV === "production" ? "/mp2" : "/";

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <header className="topbar">
        <div className="brand-row">
          <a href={BASENAME} className="brand">PokéInfo</a>
          <nav className="nav">
            <NavLink to="/" end className="navlink">List</NavLink>
            <NavLink to="/gallery" className="navlink">Gallery</NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/detail/:id" element={<DetailView />} />
          <Route path="*" element={<div className="container">404</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
