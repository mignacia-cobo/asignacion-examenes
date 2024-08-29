import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './GesSalas.css';


function GesSalas() {

        const [salas, setSalas] = useState([]);
        const [salasConfirmadas, setSalasConfirmadas] = useState([]);
    
        const handleFileUpload = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
    
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    
                const salasCargadas = data.slice(1).map((row) => ({
                    id: row[0],
                    codigo:row[1],
                    nombre: row[2],
                    capacidad: row[3],
                    edificio: row[4]
                }));
    
                setSalas(salasCargadas);
            };
    
            reader.readAsBinaryString(file);
        };
    
        const confirmarSalas = () => {
            // podría agregar lógica adicional para agregar- provisorio localStorage**
            setSalasConfirmadas(salas);
            localStorage.setItem('salasConfirmadas', JSON.stringify(salas));
            localStorage.setItem('salas', JSON.stringify(salas));
            alert('Salas confirmadas con éxito.');
        };

        useEffect(() => {
            const salasGuardadas = localStorage.getItem('salasConfirmadas');
            if (salasGuardadas) {
                setSalasConfirmadas(JSON.parse(salasGuardadas));
                setSalas(JSON.parse(salasGuardadas));
            }
        }, []);

        const handleRemoveSalasConfirmadas = () => {
            localStorage.removeItem('salasConfirmadas');
            localStorage.removeItem('salas');
            //Para el botón eliminar salas confirmadas
        };
    
        return (
            <div className='carga-masiva-container'>
                <h1>Carga Masiva de Salas</h1>
                <button onClick={handleRemoveSalasConfirmadas} className="btn">
                <img className="imagen-boton" src="eliminar.png" alt="Eliminar" />
                </button>
                <input type="file" onChange={handleFileUpload} accept=".xls, .xlsx" />
                
                {salas.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Capacidad</th>
                                    <th>Edificio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salas.map((sala, index) => (
                                    <tr key={index}>
                                        <td>{sala.id}</td>
                                        <td>{sala.codigo}</td>
                                        <td>{sala.nombre}</td>
                                        <td>{sala.capacidad}</td>
                                        <td>{sala.edificio}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <button onClick={confirmarSalas}>Confirmar Salas</button>
                        </table>
                        
                    </>
                )}
    
                {salasConfirmadas.length > 0 && (
                    <>
                        <h2>Salas Confirmadas</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Código</th>
                                    <th>Nombre Sala</th>
                                    <th>Capacidad</th>
                                    <th>Edificio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salasConfirmadas.map((sala, index) => (
                                    <tr key={index}>
                                        <td>{sala.id}</td>
                                        <td>{sala.codigo}</td>
                                        <td>{sala.nombre}</td>
                                        <td>{sala.capacidad}</td>
                                        <td>{sala.edificio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        );
    }

export default GesSalas;