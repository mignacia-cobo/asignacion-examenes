import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SlideMenu from './components/Utils/SlideMenu';
import Home from './components/Home/Home';
import DispSalas from './components/DispSalas/DispSalas';
import GesSalas from './components/GesSalas/GesSalas';
import PlaExamen from './components/PlaExamen/PlaExamen';
import GesExamen from './components/GesExamen/GesExamen';
import Login from './components/Login/Login';
import ReportesDocente from './components/Reportes/ReportesDocente/ReportesDocente';
import GesAlumnos from './components/GesAlumnos/GesAlumnos';
import ReportesAlumno from './components/Reportes/ReportesAlumno/ReportesAlumno';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const toggleMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  return (
    <Router>
      <header className="app-header">
         <img src="/logo.png" alt="Logo" />
         <div className="app-header-text">
          <h1>Planificación y Comunicación de Exámenes</h1>
        </div>
      </header> 

      {isAuthenticated ? (
        <>
          <nav className="app-nav">
            {/* Contenido de la navegación */}
          </nav>

          <div className={`main-container ${isMenuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
            <SlideMenu isExpanded={isMenuExpanded} onToggleMenu={toggleMenu} />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/DispSalas" element={<DispSalas />} />
                <Route path="/GesSalas" element={<GesSalas />} />
                <Route path="/PlaExamen" element={<PlaExamen />} />
                <Route path="/GesExamen" element={<GesExamen />} />
                <Route path="/GesAlumnos" element={<GesAlumnos />} />
                <Route path="/Reportes/ReportesDocente" element={<ReportesDocente/>} />
                <Route path="/Reportes/ReportesAlumno" element={<ReportesAlumno/>} />
                
                
                {/* Agrega otras rutas */}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;