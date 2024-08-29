import React, { useState, useEffect } from 'react';
import './ReportesDocente.css';

function ReportesDocente() {
    const [reservas, setReservas] = useState([]);
    const [filtroDocente, setFiltroDocente] = useState('');
    const [resultadosAgrupados, setResultadosAgrupados] = useState([]);

    const rangosHorarios = [
        '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50',
        '11:01 - 11:40', '11:41 - 12:20', '12:31 - 13:10', '13:11 - 13:50',
        '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50',
        '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50',
        '19:51 - 20:30', '20:41 - 21:20', '21:21 - 22:00', '22:10 - 22:50'
      ];
      
        useEffect(() => {
          const reservasGuardadas = localStorage.getItem('reservas');
          if (reservasGuardadas) {
            setReservas(JSON.parse(reservasGuardadas));
          }
        }, []);
      
        useEffect(() => {
          const agrupados = {};
          reservas.forEach(sala => {
            Object.entries(sala.dias).forEach(([dia, modulos]) => {
              modulos.forEach(modulo => {
                if (modulo.estado === 'reservado' && modulo.docente.toLowerCase().includes(filtroDocente.toLowerCase())) {
                  const clave = `${dia}-${modulo.seccion}-${modulo.docente}-${sala.codigo}`;
                  if (!agrupados[clave]) {
                    agrupados[clave] = {
                      dia,
                      salaCodigo: sala.codigo,
                      salaNombre: sala.nombre,
                      seccion: modulo.seccion,
                      asignatura: modulo.asignatura,
                      rangosHorarios: [],
                      cantidadModulos: 0
                    };
                  }
                  agrupados[clave].rangosHorarios.push(rangosHorarios[modulo.numero - 1]);
                  agrupados[clave].cantidadModulos += 1;
                }
              });
            });
          });
      
          setResultadosAgrupados(Object.values(agrupados));
        }, [filtroDocente, reservas]);     
    
      return (
        <div className="reportes-container">
          <h2>Reservas por Docente</h2>
          <input
            type="text"
            value={filtroDocente}
            onChange={(e) => setFiltroDocente(e.target.value)}
            placeholder="Ingrese nombre del docente"
          />
          <table>
            <thead>
              <tr>
                <th>Día</th>
                <th>Rangos Horarios</th>
                <th>Código de Sala</th>
                <th>Nombre de Sala</th>
                <th>Sección</th>
                <th>Asignatura</th>
                <th>Cantidad de Módulos</th>
              </tr>
            </thead>
            <tbody>
              {resultadosAgrupados.map((grupo, index) => (
                <tr key={index}>
                  <td>{grupo.dia}</td>
                  <td>{grupo.rangosHorarios.join(', ')}</td>
                  <td>{grupo.salaCodigo}</td>
                  <td>{grupo.salaNombre}</td>
                  <td>{grupo.seccion}</td>
                  <td>{grupo.asignatura}</td>
                  <td>{grupo.cantidadModulos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    export default ReportesDocente;