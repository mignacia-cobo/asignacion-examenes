import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './GesExamen.css';


function GesExamen() {

        const [examenes, setExamenes] = useState([]);
        const [examenesConfirmados, setExamenesConfirmados] = useState([]);
    
        const handleFileUpload = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
    
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
                const examenesCargados = data.slice(1).map((row) => ({
                    id: row[0],
                    evento:row[1],
                    seccion:row[2],
                    asignatura: row[3],
                    cantModulos: row[4],
                    docente: row[5]
                }));
    
                setExamenes(examenesCargados);
            };
    
            reader.readAsBinaryString(file);
        };
    

        const confirmarExamenes = () => {
            const examenesParaGuardar = examenes.map(examen => ({
              ...examen,
              reservado: false // Inicialmente ningún examen está reservado
            }));
          
            setExamenesConfirmados(examenesParaGuardar);
            localStorage.setItem('examenesConfirmados', JSON.stringify(examenesParaGuardar));
            alert('Examenes confirmados con éxito.');
          };

        useEffect(() => {
            const examenesGuardados = localStorage.getItem('examenesConfirmados');
            if (examenesGuardados) {
                setExamenesConfirmados(JSON.parse(examenesGuardados));
            }
        }, []);

        const handleRemoveExamenesConfirmados = () => {
            localStorage.removeItem('examenesConfirmados');
            //Para el botón eliminar examenes confirmados
        };
    
        return (
            <div className='carga-masiva-container'>
                <h1>Carga Masiva de Exámenes</h1>
                <button onClick={handleRemoveExamenesConfirmados} className="btn">
                <img className="imagen-boton" src="eliminar.png" alt="Eliminar" />
                </button>
                <input type="file" onChange={handleFileUpload} accept=".xls, .xlsx" />
                
                {examenes.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Evento</th>
                                    <th>Sección</th>
                                    <th>Asignatura</th>
                                    <th>Módulos</th>
                                    <th>Docente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examenes.map((examen, index) => (
                                    <tr key={index}>
                                        <td>{examen.id}</td>
                                        <td>{examen.evento}</td>
                                        <td>{examen.seccion}</td>
                                        <td>{examen.asignatura}</td>
                                        <td>{examen.cantModulos}</td>
                                        <td>{examen.docente}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <button onClick={confirmarExamenes}>Confirmar Examenes</button>
                        </table>
                        
                    </>
                )}
    
                {examenesConfirmados.length > 0 && (
                    <>
                        <h2>Exámenes Confirmados</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Evento</th>
                                    <th>Sección</th>
                                    <th>Asignatura</th>
                                    <th>Módulos</th>
                                    <th>Docente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examenesConfirmados.map((examen, index) => (
                                    <tr key={index}>
                                        <td>{examen.id}</td>
                                        <td>{examen.evento}</td>
                                        <td>{examen.seccion}</td>
                                        <td>{examen.asignatura}</td>
                                        <td>{examen.cantModulos}</td>
                                        <td>{examen.docente}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        );
    }

export default GesExamen;

