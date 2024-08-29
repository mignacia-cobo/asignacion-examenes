import React, { useState, useEffect } from 'react';
import './ReportesAlumno.css';

function ReportesAlumno() {
  const [reservas, setReservas] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [filtroAlumno, setFiltroAlumno] = useState('');
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
    const alumnosGuardados = localStorage.getItem('alumnosConfirmados');

    if (reservasGuardadas) {
      setReservas(JSON.parse(reservasGuardadas));
    }
    if (alumnosGuardados) {
      setAlumnos(JSON.parse(alumnosGuardados));
    }
  }, []);

  useEffect(() => {
    const agrupados = {};

    reservas.forEach(sala => {
      Object.entries(sala.dias).forEach(([dia, modulos]) => {
        modulos.forEach(modulo => {
          if (modulo.estado === 'reservado') {
            const alumnoCorrespondiente = alumnos.find(alumno =>
              modulo.seccion === alumno.seccion && (alumno.rut.toLowerCase().includes(filtroAlumno.toLowerCase()) || alumno.nombre.toLowerCase().includes(filtroAlumno.toLowerCase()))
            );

            if (alumnoCorrespondiente) {
              const clave = `${dia}-${modulo.seccion}-${sala.codigo}-${alumnoCorrespondiente.rut}`;
              if (!agrupados[clave]) {
                agrupados[clave] = {
                  dia,
                  salaCodigo: sala.codigo,
                  salaNombre: sala.nombre,
                  seccion: modulo.seccion,
                  asignatura: modulo.asignatura,
                  docente: modulo.docente,
                  rangosHorarios: [],
                  cantidadModulos: 0
                };
              }
              agrupados[clave].rangosHorarios.push(rangosHorarios[modulo.numero - 1]);
              agrupados[clave].cantidadModulos += 1;
            }
          }
        });
      });
    });

    setResultadosAgrupados(Object.values(agrupados));
  }, [filtroAlumno, reservas, alumnos]);

  return (
    <div className="reportes-container">
      <h2>Exámenes Reservados por Alumno</h2>
      <input
        type="text"
        value={filtroAlumno}
        onChange={(e) => setFiltroAlumno(e.target.value)}
        placeholder="Ingrese RUT o nombre del alumno"
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
            <th>Docente</th>
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
              <td>{grupo.docente}</td>
              <td>{grupo.cantidadModulos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesAlumno;