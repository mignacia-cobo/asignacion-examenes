import React, { useState } from 'react';
import './Login.css';


function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [perfil, setPerfil] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Agregar lógica para verificar las credenciales -> pendiente
    console.log('Inicio de sesión:', username, password, perfil);

    // solo para simular autenticación exitosa
    if (username === "usuario" && password === "contraseña") {
      //Luego de la autentificación exitosa, actualizar el estado de autenticación en el componente App
      setIsAuthenticated(true);
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="image-container">
      {/* <img src='/logo-duoc.png' alt="Logo" /> */}
      </div>
      <div>
        <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
          <option value="">Seleccione un perfil</option>
          <option value="Administrador">Administrador</option>
          <option value="Coordinador">Coordinador</option>
          <option value="Docente">Docente</option>
          <option value="Alumno">Alumno</option>
        </select>
      </div>
      <div>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );

}

export default Login;