import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './GesAlumnos.css';

function GesAlumnos() {
  
    const [alumnos, setAlumnos] = useState([]);
    const [alumnosConfirmados, setAlumnosConfirmados] = useState([]);
  
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
        const alumnosCargados = data.slice(1).map((row) => ({
          sigla: row[0],
          idEvento: row[1],
          seccion: row[2],
          asignatura: row[3],
          rut: row[4],
          nombre: row[5],
          mail: row[6]
        }));
  
        setAlumnos(alumnosCargados);
      };
  
      reader.readAsBinaryString(file);
    };
  
    const confirmarAlumnos = () => {
        setAlumnosConfirmados(alumnos);
        localStorage.setItem('alumnosConfirmados', JSON.stringify(alumnos));
        alert('Alumnos confirmados con éxito.');
    };

    useEffect(() => {
        const alumnosGuardados = localStorage.getItem('alumnosConfirmados');
        if (alumnosGuardados) {
            setAlumnosConfirmados(JSON.parse(alumnosGuardados));
            setAlumnos(JSON.parse(alumnosGuardados));
        }
    }, []);

    const handleRemoveAlumnosConfirmados = () => {
        localStorage.removeItem('alumnosConfirmados');
        setAlumnos([]);
        setAlumnosConfirmados([]);
    };



    return (
      <div className='carga-masiva-container'>
            <h1>Carga Masiva de Alumnos</h1>
            <button onClick={handleRemoveAlumnosConfirmados} className="btn">
                <img className="imagen-boton" src="eliminar.png" alt="Eliminar" />
            </button>
            <input type="file" onChange={handleFileUpload} accept=".xls, .xlsx" />
        {alumnos.length > 0 && (
          <>
            <table>
              <thead>
                <tr>
                  <th>Sigla</th>
                  <th>ID Evento</th>
                  <th>Sección</th>
                  <th>Asignatura</th>
                  <th>Rut</th>
                  <th>Nombre</th>
                  <th>Mail</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alumno, index) => (
                  <tr key={index}>
                    <td>{alumno.sigla}</td>
                    <td>{alumno.idEvento}</td>
                    <td>{alumno.seccion}</td>
                    <td>{alumno.asignatura}</td>
                    <td>{alumno.rut}</td>
                    <td>{alumno.nombre}</td>
                    <td>{alumno.mail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={confirmarAlumnos}>Confirmar Alumnos</button>
          </>
        )}
  
  {alumnosConfirmados.length > 0 && (
                <>
                    <h2>Alumnos Confirmados</h2>
                    <table>
                        <thead>
                            <tr>
                            <th>Sigla</th>
                            <th>ID Evento</th>
                            <th>Sección</th>
                            <th>Asignatura</th>
                            <th>Rut</th>
                            <th>Nombre</th>
                            <th>Mail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alumnosConfirmados.map((alumno, index) => (
                                <tr key={index}>
                                    <td>{alumno.sigla}</td>
                                    <td>{alumno.idEvento}</td>
                                    <td>{alumno.seccion}</td>
                                    <td>{alumno.asignatura}</td>
                                    <td>{alumno.rut}</td>
                                    <td>{alumno.nombre}</td>
                                    <td>{alumno.mail}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default GesAlumnos;









            
