
import React, { useState, useRef,useEffect } from 'react';
import './DispSalas.css';
import JSPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

function DispSalas() {
  const [searchResult, setSearchResult] = useState([]);
  const [selectedSala, setSelectedSala] = useState('');
  const [codigoSalaBusqueda, setCodigoSalaBusqueda] = useState('');
  const [nombreSalaBusqueda, setNombreSalaBusqueda] = useState('');
  const [edificioBusqueda, setEdificioBusqueda] = useState('');
  const [disponibilidadSala, setDisponibilidadSala] = useState([]);
  

  // Estados para la sección de detalles
  const [semestre, setSemestre] = useState('3000');
  const [semana, setSemana] = useState(17);

  const handleSearch = () => {
   
    const resultadoBusqueda = salasConfirmadas.filter(sala => 
      (codigoSalaBusqueda ? sala.codigo.includes(codigoSalaBusqueda) : true) &&
      (nombreSalaBusqueda ? sala.nombre.includes(nombreSalaBusqueda) : true) &&
      (edificioBusqueda ? sala.edificio.includes(edificioBusqueda) : true)
    );
  
    setSearchResult(resultadoBusqueda);
    console.log(searchResult);
  };

  const handleSelectSala = (sala) => {
    setSelectedSala(sala);

  };

  const cambiarSemana = (incremento) => {
    setSemana(semanaActual => Math.max(17, Math.min(18, semanaActual + incremento)));
  };

 

  {/* Datos simulados para la disponibilidad de la sala
  const disponibilidadSala = {
    //estructura de ejemplo para la disponibilidad
    Lunes: [{ seccion: 'MDY2131-001D', asignatura: 'CONSULTAS DE BASES DE DATOS', docente: 'PATRICIA ANDREA' }, ,
    Martes: [{ seccion: 'PRY2111-004D', asignatura: 'DISEÑO DE PROTOTIPOS', docente: 'BRYAN VICENTE' }, ],
    Miercoles:[{ seccion: 'MDY2131-001D', asignatura: 'CONSULTAS DE BASES DE DATOS', docente: 'PATRICIA ANDREA' }, ],
    Jueves:[{ seccion: 'PGY2121-001D', asignatura: 'DESARROLLO DE SOFTWARE DE E', docente: 'MARIA IGNACIA' }, ],
    Viernes:[{ seccion: 'PTK4316-001D', asignatura: 'PORTAFOLIO DE TITULO', docente: 'JUAN NESTOR' },],
    Sábado:[{ seccion: 'PRY2111-004D', asignatura: 'DISEÑO DE PROTOTIPOS', docente: 'PATRICIA ANDREA' }, ],
    // no se agrega domingo 
  }; */}


// Estructura inicial para un día
const initialDayStructure = Array(20).fill(null).map((_, index) => ({
  numero: index + 1,
  estado: null,
  seccion: null,
  asignatura: null,
  docente: null,
}));

// Estructura inicial para todos los días
const initialDias = {
  Lunes: [...initialDayStructure],
  Martes: [...initialDayStructure],
  Miercoles: [...initialDayStructure],
  Jueves: [...initialDayStructure],
  Viernes: [...initialDayStructure],
  Sabado: [...initialDayStructure],
};


// Estado inicial para las salas
const [salas, setSalas] = useState(() => {
  const salasGuardadas = localStorage.getItem('salas');
  if (salasGuardadas) {
    const salasParsed = JSON.parse(salasGuardadas);

    // Combinar la estructura inicial con los datos existentes de cada sala
    return salasParsed.map(sala => ({
      ...sala,
      dias: { ...initialDias, ...sala.dias } // Combina los días existentes con los iniciales
    }));
  } else {
    return []; // Estado inicial si no hay salas guardadas
  }
});

useEffect(() => {
  const salaSeleccionada = obtenerDatosSalaSeleccionada();
  if (salaSeleccionada) {
    setDisponibilidadSala(salaSeleccionada.dias);
  }
}, [selectedSala]);

 
  const obtenerDatosSalaSeleccionada = () => {
    // salas es la key donde se almacenan los datos en localstorage
    const salasGuardadas = localStorage.getItem('salas');
    if (salasGuardadas) {
      const salas = JSON.parse(salasGuardadas);
      // Encuentra la sala seleccionada dentro de las salas guardadas
      return salas.find(sala => sala.codigo === selectedSala.codigo);
    }
    return null;
  };

  const rangosHorarios = [
    '08:01 - 08:40', '08:41 - 09:20', '09:31 - 10:10', '10:11 - 10:50', '11:01 - 11:40', '11:41 - 12:20', '12:31 - 13:10', '13:11 - 13:50', '14:01 - 14:40', '14:41 - 15:20', '15:31 - 16:10', '16:11 - 16:50', '17:01 - 17:40', '17:41 - 18:20', '18:21 - 19:00', '19:11 - 19:50', '19:51 - 20:30', '20:41 - 21:20', '21:21 - 22:00', '22:10 - 22:50', // ... completar para todos los módulos
  ];

  

  const renderInfoModulo = (modulo) => {
    if (!modulo) return <td style={{ border: '1px solid #fff'}}>-</td>;
    return (
      <td style={{ border: '1px solid #fff'}}>
        {modulo.seccion}<br />
        {modulo.asignatura}<br />
        {modulo.docente}
      </td>
    );
  };

  /*const renderModulos = () => {
    return rangosHorarios.map((rango, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{rango}</td>
        <td>{renderInfoModulo(disponibilidadSala.Lunes[index])}</td>
        <td>{renderInfoModulo(disponibilidadSala.Martes[index])}</td>
        <td>{renderInfoModulo(disponibilidadSala.Miercoles[index])}</td>
        <td>{renderInfoModulo(disponibilidadSala.Jueves[index])}</td>
        <td>{renderInfoModulo(disponibilidadSala.Viernes[index])}</td>
        <td>{renderInfoModulo(disponibilidadSala.Sábado[index])}</td>
        
      </tr>
    ));
  };*/

  const renderModulos = () => {
    return rangosHorarios.map((rango, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{rango}</td>
        <td>{disponibilidadSala.Lunes ? renderInfoModulo(disponibilidadSala.Lunes[index]) : ''}</td>
        <td>{disponibilidadSala.Martes ? renderInfoModulo(disponibilidadSala.Martes[index]) : ''}</td>
        <td>{disponibilidadSala.Miercoles ? renderInfoModulo(disponibilidadSala.Miercoles[index]) : ''}</td>
        <td>{disponibilidadSala.Jueves ? renderInfoModulo(disponibilidadSala.Jueves[index]) : ''}</td>
        <td>{disponibilidadSala.Viernes ? renderInfoModulo(disponibilidadSala.Viernes[index]) : ''}</td>
        <td>{disponibilidadSala.Sabado ? renderInfoModulo(disponibilidadSala.Sabado[index]) : ''}</td>
      </tr>
    ));
  };

  const tableRef = useRef(null);

  const generarPDF = () => {
    html2canvas(tableRef.current, { scale: 1 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JSPDF({
        orientation: 'portrait',
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Calcular el escalado para la imagen PDF
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      let imgWidth = pdfWidth;
      let imgHeight = (canvasHeight * imgWidth) / canvasWidth;
  
      // Ajustar la altura si es demasiado grande PDF
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = (canvasWidth * imgHeight) / canvasHeight;
      }
  
      // Calcular posición x para centrar la imagen del PDF
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2; //centrar verticalmente
  
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save("tabla.pdf");
    });
  };

  const exportTableToExcel = () => {
    // tener la tabla por su ID
    let table = document.getElementById("tabla");
    let workbook = XLSX.utils.table_to_book(table);
  
    //archivo en formato XLSX
    XLSX.writeFile(workbook, "DisponibilidadSalas.xlsx");
  };

  //Para tener las salas desde localStorage
  const [salasConfirmadas, setSalasConfirmadas] = useState([]);

  useEffect(() => {
    const salasGuardadas = localStorage.getItem('salasConfirmadas');
    if (salasGuardadas) {
      setSalasConfirmadas(JSON.parse(salasGuardadas));
    
    }
  }, []);
  //fin para buscar salas desde localStorage

  {/* useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
        setReservas(JSON.parse(reservasGuardadas));
    }
}, []); */}

  const renderDetalleSala = () => {
    if (!selectedSala) return <p>Seleccione una sala para ver detalles.</p>;

    

    return (
      <div>  
        {/* selector de semestre y semana */}
        <div className="search-box">
          {/*<label>Semestre: </label>
          <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
            <option value="2023-01">2023-01</option>
            <option value="2024-01">2024-01</option>
            <option value="2024-02">2024-02</option>
          </select>*/}
          
          <label>Semana: </label>
          <button onClick={() => cambiarSemana(-1)}>-</button>
          <span>{semana}</span>
          <button onClick={() => cambiarSemana(1)}>+</button>
        </div>
        
        <div ref={tableRef}>
        <table id="tabla">
          <thead>
            {/* cabecera de la tabla */}
            <tr>
              <th colSpan="9">Sala {selectedSala.codigo} - {selectedSala.nombre} - {selectedSala.capacidad} </th>
            </tr>
            <tr>
              <th colSpan ="2" >Modulo</th>
              <th>Lunes</th>
              <th>Martes</th>
              <th>Miércoles</th>
              <th>Jueves</th>
              <th>Viernes</th>
              <th>Sábado</th>
            </tr>
          </thead>
          <tbody>
            {renderModulos()}
          </tbody>
        </table>
        </div>
        <div className='div-centrado'>
        <button onClick={generarPDF}>Generar PDF</button>
        <button onClick={exportTableToExcel}>Exportar a Excel</button>
        </div>
      </div>
    );
  };

  


  return (
       
    <>
      <p className="titulo-disp-salas">Disponibilidad de Salas</p>
        {/*  la sección de búsqueda */}
      <div className='disp-salas-container' style={{ marginTop: '45px' }}>
      <div className="search-section">
        <h2>Buscar Salas</h2>
        <div className="search-box">
          <input type="text" placeholder="Edificio" value={edificioBusqueda} onChange={(e) => setEdificioBusqueda(e.target.value)}/>
          <br />
          <input type="text" placeholder="Nombre" value={nombreSalaBusqueda} onChange={(e) => setNombreSalaBusqueda(e.target.value)}/>
          <br />
          <input type="text" placeholder="cod. Sala" value={codigoSalaBusqueda} onChange={(e) => setCodigoSalaBusqueda(e.target.value)} />

          <button onClick={handleSearch}>Buscar</button>
        
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
              {searchResult.map((sala, index) => (
                <tr key={index}>
                  <td>{sala.codigo}</td>
                  <td>{sala.nombre}</td>
                  <td>
                    <button onClick={() => handleSelectSala(sala)} className={`imagenb ${selectedSala === sala ? 'imagen-seleccionada' : ''}`} >
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
      <div>
        {renderDetalleSala()}
      </div>
      </div>
      </div>
    </>

      
  );
}

export default DispSalas;