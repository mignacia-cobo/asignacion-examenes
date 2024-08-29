import React, { useState, useEffect  } from 'react';
import { addDays } from 'date-fns';
import { startOfWeek, eachDayOfInterval, format } from 'date-fns';
import './PlaExamen.css';

function PlaExamen() {
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
    '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50', '11:01 - 11:40', '11:41 - 12:20', '12:31 - 13:10', '13:11 - 13:50', '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50', '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50', '19:51 - 20:30', '20:41 - 21:20', '21:21 - 22:00', '22:10 - 22:50'
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
    const diasSemana = eachDayOfInterval({ start: inicioSemana, end: new Date(inicioSemana).setDate(inicioSemana.getDate() + 5) });
    return diasSemana.map(dia => ({
        fecha: format(dia, 'MM-dd-yyyy'),
        modulos: initialDayStructure,
    }));
  };

  // Estado inicial para las salas
  const [salas, setSalas] = useState(() => {
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
        return JSON.parse(salasGuardadas).map(sala => ({
            ...sala,
            dias: generarEstructuraSemanal(new Date())
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
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      setSalas(JSON.parse(salasGuardadas));
    }
  }, []);

  useEffect(() => {
    const salasActualizadas = salas.map(sala => ({
      ...sala,
      dias: generarEstructuraSemanal(fechaSeleccionada)
    }));
    setSalas(salasActualizadas);
  }, [fechaSeleccionada]);

  useEffect(() => {
       actualizarEstructuraSemanalSalas(fechaSeleccionada);
   }, [fechaSeleccionada]);

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
    const salasActualizadas = salas.map(salas => {
      if (salas.codigo === salaSeleccionada.codigo) {
        return { ...salas, seleccionada: true };
      } else {
        return { ...salas, seleccionada: false };
      }
    });
    setSalas(salasActualizadas);
    localStorage.setItem('salas', JSON.stringify(salasActualizadas));
  };

  const seleccionarModulo = (fecha, numeroModulo) => {
    if (new Date(fecha) < new Date()) {
      alert("No se puede seleccionar un módulo en una fecha pasada.");
      return;
    }
    setModulosSeleccionados(modulosAnteriores => {
      const moduloExistenteIndex = modulosAnteriores.findIndex(
        modulo => modulo.fecha === fecha && modulo.numero === numeroModulo
      );
      if (moduloExistenteIndex !== -1) {
        return [
          ...modulosAnteriores.slice(0, moduloExistenteIndex),
          ...modulosAnteriores.slice(moduloExistenteIndex + 1)
        ];
      }
      return [...modulosAnteriores, { fecha, numero: numeroModulo }];
    });
  };

  const handleSearchSala = () => {
    const resultadoBusquedaSala = salas.filter(sala => 
      (codigoSalaBusqueda ? sala.codigo.includes(codigoSalaBusqueda) : true) &&
      (nombreSalaBusqueda ? sala.nombre.includes(nombreSalaBusqueda) : true) &&
      (edificioBusqueda ? sala.edificio.includes(edificioBusqueda) : true)
    );
    setSearchResultSala(resultadoBusquedaSala);
  };

  const reservarModulos = () => {
    if (!salaSeleccionada || modulosSeleccionados.length === 0) {
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
    const salasActualizadas = salas.map(sala => {
      if (sala.codigo === salaSeleccionada.codigo) {
        const diasActualizados = Object.keys(sala.dias).reduce((acc, diaNombre) => {
          const dia = sala.dias[diaNombre];
          const modulosActualizados = dia.map((modulo, index) => {
            const moduloSeleccionado = modulosSeleccionados.find(moduloSel => 
              moduloSel.fecha === diaNombre && moduloSel.numero === index + 1
            );
            if (moduloSeleccionado) {
              return {
                ...modulo,
                estado: 'reservado',
                evento: eventoSeleccionado,
                seccion: seccionSeleccionada,
                asignatura: asignaturaSeleccionada,
                cantModulos: cantModulosSeleccionados,
                docente: docenteSeleccionado
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
    localStorage.setItem('reservas', JSON.stringify(salasActualizadas));
    localStorage.setItem('salas', JSON.stringify(salasActualizadas));
    const examenesActualizados = examenesConfirmados.map(examen =>
      examen.id === selectedExam.id ? { ...examen, reservado: true } : examen
    );
    actualizarExamenesConfirmados(examenesActualizados);
  };

  const handleSearch = () => {
    const resultadoBusquedaExam = examenesConfirmados.filter(examen => 
      (typeof examen.evento === 'string' && examen.evento.includes(eventoSeleccionado)) &&
      (typeof examen.seccion === 'string' && examen.seccion.includes(seccionSeleccionada)) &&
      (typeof examen.asignatura === 'string' && examen.asignatura.includes(asignaturaSeleccionada))
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

  useEffect(() => {
    actualizarEstructuraSemanalSalas(fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => {
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      setSalas(JSON.parse(salasGuardadas));
    }
  }, []);

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

  const renderCabeceraTabla = () => {
    return (
      <tr>
        <th colSpan="2">Módulo</th>
        {Object.entries(fechasDeLaSemana).map(([dia, fecha]) => (
          <th key={dia}>
            <td>{`${dia}`} {<br></br>} {`${fecha}`}</td>
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
            <td>{indexModulo+1}</td>
            <td>{rangosHorarios[indexModulo]}</td>
            {diasDeLaSemana.map(dia => {
              const moduloDia = salaSeleccionada.dias[dia];
              const modulo = moduloDia ? moduloDia[indexModulo] : null;
              if (!modulo) {
                return <td key={`${dia}-${indexModulo}`}>No disponible</td>;
              }
              const estaSeleccionado = modulosSeleccionados.some(seleccionado => 
                seleccionado.dia === dia && seleccionado.numero === indexModulo + 1
              );
              const claseBoton = estaSeleccionado ? 'boton-modulo-seleccionado' : '';
              return (
                <td key={`${dia}-${indexModulo}`}>
                  {modulo.estado === 'reservado'
                    ? <div>
                        <span>{`${modulo.evento || 'N/A'}`}</span><br />
                        <span>{`${modulo.seccion || 'N/A'}`}</span><br />
                        <span>{`${modulo.asignatura || 'N/A'}`}</span><br />
                        <span>{`${modulo.docente || 'N/A'}`}</span>
                      </div>
                    : <button className={claseBoton} onClick={() => seleccionarModulo(dia, indexModulo)}>
                        Seleccionar
                      </button>
                  }
                </td>
              );
            })}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div>
      {/* Aquí irían los elementos JSX para el renderizado de la aplicación */}
      {/* Tabla de horarios y reservas */}
      <table>
        <thead>{renderCabeceraTabla()}</thead>
        <tbody>{renderFilasTabla()}</tbody>
      </table>
    </div>
  );
}

export default PlaExamen;
