import React, { useState, useEffect  } from 'react';
/* import { addDays } from 'date-fns'; */
import { addDays, startOfWeek, eachDayOfInterval, format } from 'date-fns';
/* import { startOfWeek, eachDayOfInterval, format } from 'date-fns'; */
import './PlaExamen.css';

function PlaExamen(){ 
   // Estados para los detalles de la reserva de sala
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
   const [salasConfirmadas, setSalasConfirmadas] = useState([]);
   const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
   const [modoEdicion, setModoEdicion] = useState({});



   
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
    '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50', '11:01 - 11:40', '11:41 - 12:20', '12:31 - 13:10', '13:11 - 13:50', '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50', '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50', '19:51 - 20:30', '20:41 - 21:20', '21:21 - 22:00', '22:10 - 22:50', // ... completar para todos los módulos
  ];

   // Estructura inicial para un día
   const initialDayStructure = Array(20).fill(null).map((_, index) => ({
    numero: index + 1,
    estado: 'disponible',
    evento: null,
    seccion: null,
    asignatura: null,
    docente: null,
  }));

   // Funciones auxiliares
   const generarEstructuraSemanal = (fecha) => {
    const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 });
    const diasSemana = eachDayOfInterval({ start: inicioSemana, end: addDays(inicioSemana, 5) });
    /*const diasSemana = eachDayOfInterval({ start: inicioSemana, end: new Date(inicioSemana).setDate(inicioSemana.getDate() + 5) }); */
    return diasSemana.map(dia => ({
        fecha: format(dia, 'MM-dd-yyyy'),
        modulos: initialDayStructure,
    }));
  };

  // Estado inicial para las salas
  /* const [salas, setSalas] = useState([]); */
  
  // Estado inicial para las salas
  const [salas, setSalas] = useState(() => {
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
        return JSON.parse(salasGuardadas).map(sala => ({
            ...sala,
            dias: generarEstructuraSemanal(new Date()) // Usa la fecha actual como ejemplo
        }));
    }
    return [];
  }); 

 

  const actualizarEstructuraSemanalSalas = (fecha) => {
    const diasSemana = generarEstructuraSemanal(fecha);
    setSalas(salas.map(sala => ({
        ...sala,
        dias: diasSemana.reduce((acc, dia) => {
            acc[format(dia.fecha, 'EEEE')] = dia.modulos;
            return acc;
        }, {})
    })));
  };

  


   // useEffects
  useEffect(() => {
    // Cargar salas desde localStorage o inicializar vacías
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      const salasParseadas = JSON.parse(salasGuardadas);
      // Aquí puedes llamar a actualizarEstructuraSemanalSalas si es necesario
      setSalas(salasParseadas);
    }
  }, []);

  useEffect(() => {
    // Actualizar estructura semanal de las salas
    const salasActualizadas = salas.map(sala => ({
      ...sala,
      dias: generarEstructuraSemanal(fechaSeleccionada)
    }));
    setSalas(salasActualizadas);
  }, [fechaSeleccionada]);

   useEffect(() => {
       actualizarEstructuraSemanalSalas(fechaSeleccionada);
   }, [fechaSeleccionada]); 

  
 /* useEffect(() => {
    // Cargar salas desde localStorage o inicializar vacías
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      setSalas(JSON.parse(salasGuardadas));
    }
  }, []);   */

   // Funciones para manejar los cambios de los inputs
   const handleEventoChange = (e) => setEventoSeleccionado(e.target.value);
   const handleSeccionChange = (e) => setSeccionSeleccionada(e.target.value);
   const handleAsignaturaChange = (e) => setAsignaturaSeleccionada(e.target.value);
   const handleCantModulosChange = (e) => setCantModulosSeleccionados(e.target.value);
   const handleDocenteChange = (e) => setDocenteSeleccionado(e.target.value);
  

   const salaSeleccionada = selectedSala ? salas.find(sala => sala.codigo === selectedSala.codigo) : null;
 
  // Funciones para seleccionar sala y módulo
   const handleSelectSala = (salaSeleccionada) => {
    setSelectedSala(salaSeleccionada);
    // Actualizar el estado de todas las salas
    const salasActualizadas = salas.map(salas => {
      if (salas.codigo === salaSeleccionada.codigo) {
        // Marca la sala seleccionada y actualiza sus detalles
        return { ...salas, seleccionada: true };
      } else {
        // Las demás salas no están seleccionadas
        return { ...salas, seleccionada: false };
      }
    });
  
    // Actualizar el estado 'salas' con las salas actualizadas
    setSalas(salasActualizadas);
  
    // Opcional: Guardar en localStorage si es necesario
    localStorage.setItem('salas', JSON.stringify(salasActualizadas));
  };


   
  


  /*const seleccionarModulo = (fecha, numeroModulo) => { */
  const seleccionarModulo = (dia, fecha, numeroModulo) => {
    if (new Date(fecha) < new Date()) {
      alert("No se puede seleccionar un módulo en una fecha pasada.");
      return;
    }
    setModulosSeleccionados(modulosAnteriores => {
      const moduloExistenteIndex = modulosAnteriores.findIndex(
       /* modulo => modulo.fecha === fecha && modulo.numero === numeroModulo */
       modulo => modulo.dia === dia && modulo.fecha === fecha && modulo.numero === numeroModulo
      );
  
      if (moduloExistenteIndex !== -1) {
        return [
          ...modulosAnteriores.slice(0, moduloExistenteIndex),
          ...modulosAnteriores.slice(moduloExistenteIndex + 1)
        ];
      }
  
      /*return [...modulosAnteriores, { fecha, numero: numeroModulo }];*/
      return [...modulosAnteriores, { dia, fecha, numero: numeroModulo }];
      
    });
  };
  
  const handleSearchSala = () => {
    console.log("Salas Confirmadas antes de la búsqueda:", salas);
    const resultadoBusquedaSala = salas.filter(sala => 
      (codigoSalaBusqueda ? sala.codigo.includes(codigoSalaBusqueda) : true) &&
      (nombreSalaBusqueda ? sala.nombre.includes(nombreSalaBusqueda) : true) &&
      (edificioBusqueda ? sala.edificio.includes(edificioBusqueda) : true)
    );
  
    setSearchResultSala(resultadoBusquedaSala);
    console.log(searchResultSala);
  };

  const reservarModulos = () => {
   
    if (!salaSeleccionada || modulosSeleccionados.length === 0) {
      alert("Por favor, selecciona una sala y al menos un módulo.");
      return;
    }
 
    // Verificar si se ha seleccionado un examen
    if (!selectedExam || !selectedExam.id) {
      alert("Por favor, selecciona un examen.");
      return;
    }
 
    if (new Date(selectedExam.fecha) < new Date()) {
      alert("No se puede reservar en una fecha pasada.");
      return;
    }
 
 
    const salasActualizadas = salas.map(sala => {
      if (sala.codigo === salaSeleccionada.codigo) {
        const diasActualizados = Object.keys(sala.dias).reduce((acc, diaNombre) => {
          const dia = sala.dias[diaNombre];
  

          const modulosActualizados = dia.map((modulo, index) => {
            const moduloSeleccionado = modulosSeleccionados.find(moduloSel => 
             /* moduloSel.fecha === diaNombre && moduloSel.numero === index + 1  */
             moduloSel.dia === diaNombre && moduloSel.fecha === fechasDeLaSemana[diaNombre] && moduloSel.numero === index + 1
            );
  
            if (moduloSeleccionado) {
              /* return {
                ...modulo,
                estado: 'reservado',
                evento: eventoSeleccionado,
                seccion: seccionSeleccionada,
                asignatura: asignaturaSeleccionada,
                cantModulos: cantModulosSeleccionados,
                docente: docenteSeleccionado
              }; */
              return {
                ...modulo,
                estado: 'reservado',
                evento: moduloSeleccionado.evento || eventoSeleccionado,
                seccion: moduloSeleccionado.seccion || seccionSeleccionada,
                asignatura: moduloSeleccionado.asignatura || asignaturaSeleccionada,
                cantModulos: cantModulosSeleccionados,
                docente: moduloSeleccionado.docente || docenteSeleccionado
              };
            }
            return modulo;
          });
  
          acc[diaNombre] = modulosActualizados;
          return acc;
        }, {});
  
        return { ...sala, dias: diasActualizados };
      }
      return sala;
    });
  
    setSalas(salasActualizadas);
    setModulosSeleccionados([]);
    

      const actualizarExamenesConfirmados = (examenes) => {
        localStorage.setItem('examenesConfirmados', JSON.stringify(examenes));
        setExamenesConfirmados(examenes);
      };
   
      // Guardar en localStorage la reserva
      localStorage.setItem('reservas', JSON.stringify(salasActualizadas));
      localStorage.setItem('salas', JSON.stringify(salasActualizadas));
    
   
      // Actualizar el estado de reservado del examen seleccionado
      const examenesActualizados = examenesConfirmados.map(examen =>
        examen.id === selectedExam.id ? { ...examen, reservado: true } : examen
      );
      actualizarExamenesConfirmados(examenesActualizados);
    };

      
 
      


     const handleSearch = () => {
      console.log("encuentra examen")
      const resultadoBusquedaExam = examenesConfirmados.filter(examen => 
        (eventoSeleccionado ? examen.evento.includes(eventoSeleccionado) : true) &&
        (seccionSeleccionada ? examen.seccion.includes(seccionSeleccionada) : true) &&
        (asignaturaSeleccionada ? examen.asignatura.includes(asignaturaSeleccionada): true)
      );
    
      setSearchResultExam(resultadoBusquedaExam);
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
  
    // Preguntar al usuario si desea liberar todos los módulos o solo el módulo seleccionado
    const liberarTodos = window.confirm("¿Desea liberar todos los módulos reservados para este examen o solo el módulo seleccionado? \nAceptar: Todos los módulos \nCancelar: Solo este módulo");
  
    let quedanModulosReservados = false;
  
    // Actualizar la estructura de la sala para liberar los módulos seleccionados
    const salasActualizadas = salas.map(sala => {
      if (sala.codigo === salaSeleccionada.codigo) {
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
            // Si no se está liberando este módulo, y está reservado para el mismo examen, significa que quedan módulos reservados
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
    localStorage.setItem('salas', JSON.stringify(salasActualizadas));
  
    // Si no quedan más módulos reservados, limpiar la selección del examen
    if (!quedanModulosReservados || liberarTodos) {
      setSelectedExam(null);
      setEventoSeleccionado('');
      setSeccionSeleccionada('');
      setAsignaturaSeleccionada('');
      setCantModulosSeleccionados('');
      setDocenteSeleccionado('');
    }
  };
  
  

   
useEffect(() => {
  actualizarEstructuraSemanalSalas(fechaSeleccionada);
 }, [fechaSeleccionada]);
 
 /* prueba ultima
 useEffect(() => {
  const salasGuardadas = localStorage.getItem('salas');
  if (salasGuardadas) {
    setSalas(JSON.parse(salasGuardadas));
  }
 }, []); 
 */
 /* useEffect(() => {
  const salasActualizadas = salas.map(sala => ({
    ...sala,
    dias: generarEstructuraSemanal(fechaSeleccionada)
  }));
 
  setSalas(salasActualizadas);
 }, [fechaSeleccionada, salas]);
 */
  
   //prueba
  /*
   useEffect(() => {
     const dias = generarEstructuraSemanal(fechaSeleccionada);
     // Aquí  podria establecer los días en el estado de tu componente 
   }, [fechaSeleccionada]);
   */
 
   useEffect(() => {
    const examenesGuardados = localStorage.getItem('examenesConfirmados');
    if (examenesGuardados) {
      setExamenesConfirmados(JSON.parse(examenesGuardados));
    }
  }, []);
 
  useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      setSalas(JSON.parse(reservasGuardadas));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(salas));
  }, [salas]);
 
  const toggleModoEdicion = (dia, indexModulo, guardar = false) => {
    if (guardar) {
      // Actualizar el estado de las salas al guardar
      const salasActualizadas = salas.map(sala => {
        if (sala.codigo === salaSeleccionada.codigo) {
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
      localStorage.setItem('salas', JSON.stringify(salasActualizadas));
    }
  
    // Alternar el modo de edición
    setModoEdicion(prevModoEdicion => ({
      ...prevModoEdicion,
      [`${dia}-${indexModulo}`]: !prevModoEdicion[`${dia}-${indexModulo}`]
    }));
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
    if (!salaSeleccionada || !salaSeleccionada.dias) {
      return <tr><td>No hay sala seleccionada o datos disponibles</td></tr>;
    }
  
    const diasDeLaSemana = Object.keys(salaSeleccionada.dias);
  
    return (
      <>
        {initialDayStructure.map((_, indexModulo) => (
          <tr key={indexModulo}>
            <td>{indexModulo + 1}</td>
            <td>{rangosHorarios[indexModulo]}</td>
            {diasDeLaSemana.map(dia => {
              const moduloDia = salaSeleccionada.dias[dia];
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
                          <button onClick={() => toggleModoEdicion(dia, indexModulo, true)}>Guardar</button> {/* Aquí llamamos a toggleModoEdicion con guardar=true */}
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
        <p className="titulo-disp-salas">Planificación de Examenes</p>
        <div className='disp-salas-container' style={{ marginTop: '45px' }}>
        <div className="search-section">
          <h2>Buscar Examen</h2>
          <div className="search-box">
            {/* Inputs para sección, asignatura y docente */}
            <input type="text"  onChange={handleEventoChange} placeholder="Evento" />
            <input type="text"  onChange={handleSeccionChange} placeholder="Sección" />
            <input type="text"  onChange={handleAsignaturaChange} placeholder="Asignatura" />
            {/* <input type="text" value={docenteSeleccionado} onChange={handleDocenteChange} placeholder="Docente" /> */}
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
                {searchResultSala.map((salas, index) => (
                  <tr key={index}>
                    <td>{salas.codigo}</td>
                    <td>{salas.nombre}</td>
                    <td>
                      <button onClick={() => handleSelectSala(salas)} className={`imagenb ${selectedSala === salas ? 'imagen-seleccionada' : ''}`}>
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
        
        {/* Renderizar la tabla solo si hay una sala seleccionada */}
        <div>
        {salaSeleccionada ? (
          <div className="details-section" style={{ marginTop: '3px' }}>
            {/*<h2>Módulos de la Sala: {salaSeleccionada.nombre}</h2>*/}
            <table /*className="table-container-right"*/>
            <thead>
              
              <tr>
                <th colSpan="9">Sala {salaSeleccionada.codigo} - {salaSeleccionada.nombre} - {salaSeleccionada.capacidad}</th>
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



 




