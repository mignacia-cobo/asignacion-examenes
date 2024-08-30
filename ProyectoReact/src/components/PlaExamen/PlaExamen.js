import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addDays, startOfWeek, eachDayOfInterval, format } from 'date-fns';
import './PlaExamen.css';

function PlaExamen() {
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

    const obtenerFechasDeLaSemana = (fechaBase) => {
        let fechas = {};
        const inicioSemana = startOfWeek(fechaBase, { weekStartsOn: 1 });
        for (let i = 0; i < 6; i++) {
            const fechaDia = addDays(inicioSemana, i);
            const nombreDia = format(fechaDia, 'EEEE');
            fechas[nombreDia] = format(fechaDia, 'dd/MM/yyyy');
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

    const initialDayStructure = Array(20).fill(null).map((_, index) => ({
        numero: index + 1,
        estado: 'disponible',
        evento: null,
        seccion: null,
        asignatura: null,
        docente: null,
    }));

    const generarEstructuraSemanal = (fecha) => {
        const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 });
        const diasSemana = eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 5) });
        return diasSemana.map(dia => ({
            fecha: format(dia, 'MM-dd-yyyy'),
            modulos: initialDayStructure,
        }));
    };

    const handleSelectSala = (salaSeleccionada) => {
        setSelectedSala(salaSeleccionada);
        const salasActualizadas = salas.map(sala => {
            if (sala.codigo_sala === salaSeleccionada.codigo_sala) {
                return { ...sala, seleccionada: true };
            } else {
                return { ...sala, seleccionada: false };
            }
        });
        setSalas(salasActualizadas);
    };

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
            docente: docenteSeleccionado
        };

        axios.post('http://localhost:8000/api/salas/', reservas)
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

    const liberarExamen = (dia, indexModulo) => {
        if (!selectedExam || !selectedExam.id) {
            alert("No hay ningún examen seleccionado para liberar.");
            return;
        }

        const liberarTodos = window.confirm("¿Desea liberar todos los módulos reservados para este examen o solo el módulo seleccionado? \nAceptar: Todos los módulos \nCancelar: Solo este módulo");

        let quedanModulosReservados = false;

        const salasActualizadas = salas.map(sala => {
            if (sala.codigo_sala === selectedSala.codigo_sala) {
                const diasActualizados = { ...sala.dias };

                Object.keys(diasActualizados).forEach(diaNombre => {
                    diasActualizados[diaNombre] = diasActualizados[diaNombre].map((modulo, index) => {
                        if (
                            (liberarTodos && modulo.evento === selectedExam.evento) ||
                            (!liberarTodos && index === indexModulo && diaNombre === dia)
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
                    });
                });

                return { ...sala, dias: diasActualizados };
            }
            return sala;
        });

        setSalas(salasActualizadas);

        if (!quedanModulosReservados || liberarTodos) {
            setSelectedExam(null);
            setEventoSeleccionado('');
            setSeccionSeleccionada('');
            setAsignaturaSeleccionada('');
            setCantModulosSeleccionados('');
            setDocenteSeleccionado('');
          }
      };
  
      const toggleModoEdicion = (dia, indexModulo, guardar = false) => {
          if (guardar) {
              const salasActualizadas = salas.map(sala => {
                  if (sala.codigo_sala === selectedSala.codigo_sala) {
                      const diasActualizados = { ...sala.dias };
                      
                      diasActualizados[dia] = diasActualizados[dia].map((modulo, index) => {
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
                      });
  
                      return { ...sala, dias: diasActualizados };
                  }
                  return sala;
              });
  
              setSalas(salasActualizadas);
          }
  
          setModoEdicion(prevModoEdicion => ({
              ...prevModoEdicion,
              [`${dia}-${indexModulo}`]: !prevModoEdicion[`${dia}-${indexModulo}`]
          }));
      };
  
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
  
      const renderCabeceraTabla = () => {
          return (
              <tr>
                  <th colSpan="2">Módulo</th>
                  {Object.entries(fechasDeLaSemana).map(([dia, fecha]) => (
                      <th key={dia}>
                          <td>{`${dia}`} <br /> {`${fecha}`}</td>
                      </th>
                  ))}
              </tr>
          );
      };
  
      const renderFilasTabla = () => {
          if (!selectedSala || !selectedSala.dias) {
              return <tr><td>No hay sala seleccionada o datos disponibles</td></tr>;
          }
  
          const diasDeLaSemana = Object.keys(selectedSala.dias);
  
          return (
              <>
                  {initialDayStructure.map((_, indexModulo) => (
                      <tr key={indexModulo}>
                          <td>{indexModulo + 1}</td>
                          <td>{rangosHorarios[indexModulo]}</td>
                          {diasDeLaSemana.map(dia => {
                              const moduloDia = selectedSala.dias[dia];
                              const modulo = moduloDia ? moduloDia[indexModulo] : null;
  
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
  
      return (
          <>
              <p className="titulo-disp-salas">Planificación de Exámenes</p>
              <div className='disp-salas-container' style={{ marginTop: '45px' }}>
                  <div className="search-section">
                      <h2>Buscar Examen</h2>
                      <div className="search-box">
                          <input type="text" onChange={(e) => setEventoSeleccionado(e.target.value)} placeholder="Evento" />
                          <input type="text" onChange={(e) => setSeccionSeleccionada(e.target.value)} placeholder="Sección" />
                          <input type="text" onChange={(e) => setAsignaturaSeleccionada(e.target.value)} placeholder="Asignatura" />
                          <button onClick={handleSearch}>Buscar</button>
                          <div className="search-box-table">
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
                      <h2>Buscar Salas</h2>
                      <div className="search-box">
                          <input type="date" value={format(fechaSeleccionada, 'yyyy-MM-dd')} onChange={(e) => setFechaSeleccionada(new Date(e.target.value))} />
                          <br />
                          <input type="text" placeholder="Edificio" value={edificioBusqueda} onChange={(e) => setEdificioBusqueda(e.target.value)} />
                          <br />
                          <input type="text" placeholder="Nombre" value={nombreSalaBusqueda} onChange={(e) => setNombreSalaBusqueda(e.target.value)} />
                          <br />
                          <input type="text" placeholder="cod. Sala" value={codigoSalaBusqueda} onChange={(e) => setCodigoSalaBusqueda(e.target.value)} />
                          <button onClick={handleSearchSala}>Buscar</button>
                          <div className="search-box-table">
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
                    {selectedSala ? (
                        <div className="details-section" style={{ marginTop: '3px' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th colSpan="9">Sala {selectedSala.codigo_sala} - {selectedSala.nombre_sala} - {selectedSala.capacidad}</th>
                                    </tr>
                                    {renderCabeceraTabla()}
                                </thead>
                                <tbody>{renderFilasTabla()}</tbody>
                            </table>
                            <div className='div-centrado'>
                                <button onClick={reservarModulos}>Confirmar Reserva</button>
                            </div>
                        </div>
                    ) : (
                        <p>No hay ninguna sala seleccionada</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default PlaExamen;

                      
  
