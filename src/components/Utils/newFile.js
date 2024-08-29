import React from 'react';

<div className={`side-menu ${isExpanded ? 'expanded' : 'collapsed'}`}>
    <button onClick={toggleMenu} className="App.js">
        {/* podría agregar un icono para el botón */}
    </button>

    {/* Contenido del menú */}
    {isExpanded && (
        <nav>
            <ul>
                {/* Lista de elementos del menú */}
            </ul>
        </nav>
    )}
</div>;
