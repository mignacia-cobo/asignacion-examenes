import React, { useState } from 'react';
import { Link, Routes } from 'react-router-dom';
import './SlideMenu.css';

const SlideMenu = ({ isExpanded, onToggleMenu }) => {
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);

  const toggleReportMenu = () => {
    setIsReportMenuOpen(!isReportMenuOpen);
  };

  return (
    <div className='slide-container'>
      <div className={`side-menu ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button onClick={onToggleMenu} className="toggle-menu-btn">
          Menu
        </button>

      {isExpanded && (
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/DispSalas">Disponibilidad de Salas</Link></li>
            <li><Link to="/PlaExamen">Planificación de Exámenes</Link></li>
            <li><Link to="/GesSalas">Gestión de Salas</Link></li>
            <li><Link to="/GesExamen">Gestión de Exámenes</Link></li>
            <li><Link to="/GesAlumnos">Carga Masiva de Alumnos</Link></li>
            <div className="menu-item">
              <span onClick={toggleReportMenu}>Reportes</span>
              {isReportMenuOpen && (
                <div className="submenu">
                  <li><Link to="/Reportes/ReportesAlumno" >Reportes Alumnos</Link></li>
                  <li><Link to="/Reportes/ReportesDocente" >Reportes Docente</Link></li>
                </div>
              )}
            </div>
            
            {/* otros elementos del menú */}
          </ul>
        </nav>
      )}
    </div>
  
    </div>
  );
};

export default SlideMenu;