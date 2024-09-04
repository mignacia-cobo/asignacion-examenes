import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addDays, startOfWeek, eachDayOfInterval, format } from 'date-fns';
import './PlaExamen.css';

function PlaExamen() {
    // Definición de estados para manejar los datos del formulario y la búsqueda
    const [eventoSeleccionado, setEventoSeleccionado] = useState('');
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
    const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
    const [docenteSeleccionado, setDocenteSeleccionado] = useState('');
    const [cantModulosSeleccionados, setCantModulosSeleccionados] = useState('');
    const [modulosSeleccionados, setModulosSeleccionados] = useState([]);
    const [searchResultExam, setSearchResultExam] = useState([]);
    const [searchResultSala, setSearchResultSala] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [examenesConfirmados, setExamenesConfirmados] = useState([]);
    const [codigoSalaBusqueda, setCodigoSalaBusqueda] = useState('');
    const [nombreSalaBusqueda, setNombreSalaBusqueda] = useState('');
    const [edificioBusqueda, setEdificioBusqueda] = useState('');
    const [selectedSala, setSelectedSala] = useState(null);
    const [salas, setSalas] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
    const [reservas, setReservas] = useState([]);  // Estado para manejar las reservas
    const [modoEdicion, setModoEdicion] = useState({});

    useEffect(() => {
        // Obtener salas desde el backend de Django
        axios.get('http://localhost:8000/api/salas/')
            .then(response => {
                const salasActualizadas = response.data.map(sala => ({
                    ...sala,
                    dias: generarEstructuraSemanal(fechaSeleccionada) // Genera la estructura semanal para cada sala
                }));
                setSalas(salasActualizadas);
            })
            .catch(error => console.error('Error fetching salas:', error));
    }, [fechaSeleccionada]);

    useEffect(() => {
        // Obtener exámenes confirmados desde el backend de Django
        axios.get('http://localhost:8000/api/examenes/')
            .then(response => setExamenesConfirmados(response.data))
            .catch(error => console.error('Error fetching examenes:', error));
    }, []);

    useEffect(() => {
        // Obtener reservas desde el backend de Django
        axios.get('http://localhost:8000/api/reservas/', {
            params: {
                fecha: format(fechaSeleccionada, 'yyyy-MM-dd') // Envía la fecha seleccionada como parámetro en la solicitud
            }
        })
        .then(response => {
            console.log('Reservas obtenidas:', response.data); // Verifica qué datos se obtienen
            // Procesar la respuesta para cada reserva obtenida
            const reservasActualizadas = response.data.map(reserva => ({
                ...reserva,
                dias: generarEstructuraSemanal(fechaSeleccionada) // Genera la estructura semanal para cada reserva
            }));
            setReservas(reservasActualizadas); // Actualiza el estado de las reservas con la nueva estructura
        })
        .catch(error => console.error('Error al obtener las reservas:', error)); // Maneja los errores de la solicitud
    }, [fechaSeleccionada]); // Este efecto se ejecuta cada vez que la fecha seleccionada cambia

    // Función para obtener las fechas de la semana según la fecha seleccionada
    const obtenerFechasDeLaSemana = (fechaBase) => {
        let fechas = {};
        const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
        for (let i = 0; i < 6; i++) {
            const fechaDia = addDays(inicioSemana, i);
            const nombreDia = format(fechaDia, 'EEEE');
            fechas[nombreDia] = format(fechaDia, 'yyyy-MM-dd');
        }
        return fechas;
    };

    const fechasDeLaSemana = obtenerFechasDeLaSemana(fechaSeleccionada);

    const rangosHorarios = [
        '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50', '11:01 - 11:40', '11:41 - 12:20',
        '12:31 - 13:10', '13:11 - 13:50', '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50',
        '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50', '19:51 - 20:30', '20:41 - 21:20',
        '21:21 - 22:00', '22:10 - 22:50'
    ];

    // Estructura inicial para los días de la semana
    const initialDayStructure = Array(20).fill(null).map((_, index) => ({
        numero: index + 1,
        estado: 'disponible',
        evento: null,
        seccion: null,
        asignatura: null,
        docente: null,
    }));

    // Genera la estructura semanal para la sala seleccionada
    const generarEstructuraSemanal = (fecha) => {
        const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 });
        const diasSemana = eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 5) });
        return diasSemana.map(dia => ({
            fecha: format(dia, 'yyyy-MM-dd'),
            modulos: initialDayStructure,
        }));
    };

    // Maneja la selección de una sala
    const handleSelectSala = (salaSeleccionada) => {
        setSelectedSala(salaSeleccionada);

        const diasConReservas = reservas.filter(reserva => reserva.sala === salaSeleccionada.id);

        const diasActualizados = generarEstructuraSemanal(fechaSeleccionada).map(dia => {
            const reservaDelDia = diasConReservas.find(reserva => reserva.fecha === dia.fecha);
            if (reservaDelDia) {
                return {
                    ...dia,
                    modulos: reservaDelDia.modulos
                };
            }
            return dia;
        });

        setSelectedSala({
            ...salaSeleccionada,
            dias: diasActualizados
        });
    };

    // Maneja la reserva de módulos
    const reservarModulos = () => {
        if (!selectedSala || modulosSeleccionados.length === 0) {
            alert("Por favor, selecciona una sala y al menos un módulo.");
            return;
        }

        if (!selectedExam || !selectedExam.id) {
            alert("Por favor, selecciona un examen.");
            return;
        }

        if (new Date(selectedExam.fecha) < new Date()) {
            alert("No se puede reservar en una fecha pasada.");
            return;
        }

        const reservas = {
            sala: selectedSala.codigo_sala,
            modulos: modulosSeleccionados,
            evento: eventoSeleccionado,
            seccion: seccionSeleccionada,
            asignatura: asignaturaSeleccionada,
            docente: docenteSeleccionado,
            fecha: format(fechaSeleccionada, 'yyyy-MM-dd')
        };

        axios.post('http://localhost:8000/api/reservas/', reservas)
            .then(response => {
                console.log('Reserva confirmada:', response.data);
                setSalas(prevSalas => prevSalas.map(sala =>
                    sala.codigo_sala === selectedSala.codigo_sala ? response.data : sala
                ));
            })
            .catch(error => console.error('Error reserving:', error));
    };

    // Método para buscar exámenes
    const handleSearch = () => {
        axios.get('http://localhost:8000/api/examenes/', {
            params: {
                evento: eventoSeleccionado,
                seccion: seccionSeleccionada,
                asignatura: asignaturaSeleccionada,
            }
        })
        .then(response => {
            setSearchResultExam(response.data);
        })
        .catch(error => console.error('Error al buscar exámenes:', error));
    };

    // Método para buscar salas
    const handleSearchSala = () => {
        axios.get('http://localhost:8000/api/salas/', {
            params: {
                codigo: codigoSalaBusqueda,
                nombre: nombreSalaBusqueda,
                edificio: edificioBusqueda,
            }
        })
        .then(response => {
            setSearchResultSala(response.data);
        })
        .catch(error => console.error('Error al buscar salas:', error));
    };

    // Maneja la selección de un examen
    const handleSelectExam = (examen) => {
        if (examen.reservado) {
            alert("Este examen ya ha sido reservado.");
            return;
        }
        setSelectedExam(examen);
        setEventoSeleccionado(examen.evento);
        setSeccionSeleccionada(examen.seccion);
        setAsignaturaSeleccionada(examen.asignatura);
        setCantModulosSeleccionados(examen.cantModulos);
        setDocenteSeleccionado(examen.docente);
    };

    // Libera un módulo reservado
    const liberarExamen = (dia, indexModulo) => {
        if (!selectedExam || !selectedExam.id) {
            alert("No hay ningún examen seleccionado para liberar.");
            return;
        }

        const liberarTodos = window.confirm("¿Desea liberar todos los módulos reservados para este examen o solo el módulo seleccionado? \nAceptar: Todos los módulos \nCancelar: Solo este módulo");

        let quedanModulosReservados = false;

        const salasActualizadas = salas.map(sala => {
            if (sala.codigo_sala === selectedSala.codigo_sala) {
                const diasActualizados = sala.dias.map(d => {
                    if (d.fecha === dia) {
                        return {
                            ...d,
                            modulos: d.modulos.map((modulo, index) => {
                                if (
                                    (liberarTodos && modulo.evento === selectedExam.evento) ||
                                    (!liberarTodos && index === indexModulo)
                                ) {
                                    return {
                                        ...modulo,
                                        estado: 'disponible',
                                        evento: null,
                                        seccion: null,
                                        asignatura: null,
                                        docente: null,
                                    };
                                }
                                if (modulo.evento === selectedExam.evento && modulo.estado === 'reservado') {
                                    quedanModulosReservados = true;
                                }
                                return modulo;
                            })
                        };
                    }
                    return d;
                });

                return { ...sala, dias: diasActualizados };
            }
            return sala;
        });

        setSalas(salasActualizadas);

        // Si no quedan módulos reservados o se liberan todos, se restablece la selección del examen
        if (!quedanModulosReservados || liberarTodos) {
            setSelectedExam(null);
            setEventoSeleccionado('');
            setSeccionSeleccionada('');
            setAsignaturaSeleccionada('');
            setCantModulosSeleccionados('');
            setDocenteSeleccionado('');
        }
    };

    // Alterna el modo de edición para un módulo específico
    const toggleModoEdicion = (dia, indexModulo, guardar = false) => {
        if (guardar) {
            const salasActualizadas = salas.map(sala => {
                if (sala.codigo_sala === selectedSala.codigo_sala) {
                    const diasActualizados = sala.dias.map(d => {
                        if (d.fecha === dia) {
                            return {
                                ...d,
                                modulos: d.modulos.map((modulo, index) => {
                                    if (index === indexModulo) {
                                        return {
                                            ...modulo,
                                            evento: eventoSeleccionado,
                                            seccion: seccionSeleccionada,
                                            asignatura: asignaturaSeleccionada,
                                            docente: docenteSeleccionado,
                                        };
                                    }
                                    return modulo;
                                })
                            };
                        }
                        return d;
                    });

                    return { ...sala, dias: diasActualizados };
                }
                return sala;
            });

            setSalas(salasActualizadas);
        }

        // Cambia el estado de edición del módulo
        setModoEdicion(prevModoEdicion => ({
            ...prevModoEdicion,
            [`${dia}-${indexModulo}`]: !prevModoEdicion[`${dia}-${indexModulo}`]
        }));
    };

    // Maneja la selección de un módulo específico para reserva
    const seleccionarModulo = (dia, fecha, numeroModulo) => {
        if (new Date(fecha) < new Date()) {
            alert("No se puede seleccionar un módulo en una fecha pasada.");
            return;
        }

        setModulosSeleccionados(modulosAnteriores => {
            const moduloExistenteIndex = modulosAnteriores.findIndex(
                modulo => modulo.dia === dia && modulo.fecha === fecha && modulo.numero === numeroModulo
            );

            if (moduloExistenteIndex !== -1) {
                return [
                    ...modulosAnteriores.slice(0, moduloExistenteIndex),
                    ...modulosAnteriores.slice(moduloExistenteIndex + 1)
                ];
            }

            return [...modulosAnteriores, { dia, fecha, numero: numeroModulo }];
        });
    };

    // Renderiza las filas de la tabla con los módulos y su estado
    const renderFilasTabla = () => {
        if (!selectedSala || !selectedSala.dias) {
            return (
                <tr>
                    <td colSpan={Object.keys(fechasDeLaSemana).length + 2}>
                        No hay sala seleccionada o datos disponibles
                    </td>
                </tr>
            );
        }

        const diasDeLaSemana = Object.keys(fechasDeLaSemana);

        return (
            <>
                {initialDayStructure.map((_, indexModulo) => (
                    <tr key={indexModulo}>
                        <td>{indexModulo + 1}</td>  {/* Muestra el número del módulo */}
                        <td>{rangosHorarios[indexModulo]}</td>  {/* Muestra el rango horario del módulo */}
                        {diasDeLaSemana.map(dia => {
                            const diaEncontrado = selectedSala.dias.find(d => d.fecha === fechasDeLaSemana[dia]);
                            if (!diaEncontrado) {
                                return <td key={`${dia}-${indexModulo}`}>No disponible</td>;
                            }

                            const modulo = diaEncontrado.modulos[indexModulo];
                            if (!modulo) {
                                return <td key={`${dia}-${indexModulo}`}>No disponible</td>;
                            }

                            const estaSeleccionado = modulosSeleccionados.some(seleccionado =>
                                seleccionado.dia === dia && seleccionado.fecha === fechasDeLaSemana[dia] && seleccionado.numero === indexModulo + 1
                            );

                            return (
                                <td key={`${dia}-${indexModulo}`}>
                                    {modulo.estado === 'reservado' ? (
                                        <div>
                                            {/* Si el módulo está reservado, se muestra la información correspondiente */}
                                            {modoEdicion[`${dia}-${indexModulo}`] ? (
                                                <div>
                                                    <input type="text" placeholder="Evento" value={eventoSeleccionado} onChange={(e) => setEventoSeleccionado(e.target.value)} />
                                                    <input type="text" placeholder="Sección" value={seccionSeleccionada} onChange={(e) => setSeccionSeleccionada(e.target.value)} />
                                                    <input type="text" placeholder="Asignatura" value={asignaturaSeleccionada} onChange={(e) => setAsignaturaSeleccionada(e.target.value)} />
                                                    <input type="text" placeholder="Docente" value={docenteSeleccionado} onChange={(e) => setDocenteSeleccionado(e.target.value)} />
                                                    <button onClick={() => toggleModoEdicion(dia, indexModulo, true)}>Guardar</button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <span><strong>Evento:</strong> {modulo.evento || 'N/A'}</span><br />
                                                    <span><strong>Sección:</strong> {modulo.seccion || 'N/A'}</span><br />
                                                    <span><strong>Asignatura:</strong> {modulo.asignatura || 'N/A'}</span><br />
                                                    <span><strong>Docente:</strong> {modulo.docente || 'N/A'}</span><br />
                                                    <button onClick={() => toggleModoEdicion(dia, indexModulo)}>Editar</button>
                                                    <button onClick={() => liberarExamen(dia, indexModulo)}>Liberar</button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <button className={estaSeleccionado ? 'boton-modulo-seleccionado' : ''} onClick={() => seleccionarModulo(dia, fechasDeLaSemana[dia], indexModulo + 1)}>
                                                Seleccionar
                                            </button>
                                            {estaSeleccionado && (
                                                <div>
                                                    <span><strong>Evento:</strong> {eventoSeleccionado}</span><br />
                                                    <span><strong>Sección:</strong> {seccionSeleccionada}</span><br />
                                                    <span><strong>Asignatura:</strong> {asignaturaSeleccionada}</span><br />
                                                    <span><strong>Docente:</strong> {docenteSeleccionado}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </>
        );
    };

    // Renderiza la cabecera de la tabla
    const renderCabeceraTabla = () => {
        return (
            <tr>
                <th colSpan="2">Módulo</th>
                {Object.entries(fechasDeLaSemana).map(([dia, fecha]) => (
                    <th key={dia}>
                        {`${dia}`} <br /> {`${fecha}`}
                    </th>
                ))}
            </tr>
        );
    };

    return (
        <>
            {/* Título de la página */}
            <p className="titulo-disp-salas">Planificación de Exámenes</p>
            <div className='disp-salas-container' style={{ marginTop: '45px' }}>
                <div className="search-section">
                    {/* Sección para buscar exámenes */}
                    <h2>Buscar Examen</h2>
                    <div className="search-box">
                        {/* Inputs para ingresar los criterios de búsqueda de exámenes */}
                        <input type="text" onChange={(e) => setEventoSeleccionado(e.target.value)} placeholder="Evento" />
                        <input type="text" onChange={(e) => setSeccionSeleccionada(e.target.value)} placeholder="Sección" />
                        <input type="text" onChange={(e) => setAsignaturaSeleccionada(e.target.value)} placeholder="Asignatura" />
                        <button onClick={handleSearch}>Buscar</button> {/* Botón para ejecutar la búsqueda */}
                        <div className="search-box-table">
                            {/* Tabla para mostrar los resultados de la búsqueda de exámenes */}
                            <table>
                                <thead>
                                    <tr>
                                        <th>Evento</th>
                                        <th>Sección</th>
                                        <th>Asignatura</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResultExam.map((exam, index) => (
                                        <tr key={index}>
                                            <td>{exam.evento}</td>
                                            <td>{exam.seccion}</td>
                                            <td>{exam.asignatura}</td>
                                            <td>
                                                {/* Botón para seleccionar un examen de la lista */}
                                                <button onClick={() => handleSelectExam(exam)} className={`imagenb ${selectedExam === exam ? 'imagen-seleccionada' : ''}`}>
                                                    <img className="imagen-boton" src="sel.png" alt="Seleccionar" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sección para buscar salas */}
                    <h2>Buscar Salas</h2>
                    <div className="search-box">
                        {/* Inputs para ingresar los criterios de búsqueda de salas */}
                        <input type="date" value={format(fechaSeleccionada, 'yyyy-MM-dd')} onChange={(e) => setFechaSeleccionada(new Date(e.target.value))} />
                        <br />
                        <input type="text" placeholder="Edificio" value={edificioBusqueda} onChange={(e) => setEdificioBusqueda(e.target.value)} />
                        <br />
                        <input type="text" placeholder="Nombre" value={nombreSalaBusqueda} onChange={(e) => setNombreSalaBusqueda(e.target.value)} />
                        <br />
                        <input type="text" placeholder="cod. Sala" value={codigoSalaBusqueda} onChange={(e) => setCodigoSalaBusqueda(e.target.value)} />
                        <button onClick={handleSearchSala}>Buscar</button> {/* Botón para ejecutar la búsqueda */}
                        <div className="search-box-table">
                            {/* Tabla para mostrar los resultados de la búsqueda de salas */}
                            <table>
                                <thead>
                                    <tr>
                                        <th>cod. Sala</th>
                                        <th>Nombre</th>
                                        <th>-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResultSala.map((sala, index) => (
                                        <tr key={index}>
                                            <td>{sala.codigo_sala}</td>
                                            <td>{sala.nombre_sala}</td>
                                            <td>
                                                {/* Botón para seleccionar una sala de la lista */}
                                                <button onClick={() => handleSelectSala(sala)} className={`imagenb ${selectedSala === sala ? 'imagen-seleccionada' : ''}`}>
                                                    <img className="imagen-boton" src="sel.png" alt="Seleccionar" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div>
                    {/* Muestra la tabla de módulos solo si hay una sala seleccionada */}
                    {selectedSala ? (
                        <div className="details-section" style={{ marginTop: '3px' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan="9">Sala {selectedSala.codigo_sala} - {selectedSala.nombre_sala} - {selectedSala.capacidad}</th>
                                    </tr>
                                    {renderCabeceraTabla()} {/* Renderiza la cabecera de la tabla */}
                                </thead>
                                <tbody>{renderFilasTabla()}</tbody> {/* Renderiza las filas de la tabla */}
                            </table>
                            <div className='div-centrado'>
                                {/* Botón para confirmar la reserva de los módulos seleccionados */}
                                <button onClick={reservarModulos}>Confirmar Reserva</button>
                            </div>
                        </div>
                    ) : (
                        <p>No hay ninguna sala seleccionada</p>  /* Mensaje si no hay sala seleccionada */
                    )}
                </div>
            </div>
        </>
    );
}

export default PlaExamen;  // Exporta el componente para ser usado en otros lugares de la aplicación


