import React, { useState, useEffect } from 'react';

const CondicionAtmosferica = () => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paginaActual, setPaginaActual] = useState(1); // Página actual para la paginación
  const [totalPaginas, setTotalPaginas] = useState(99999); // Total de páginas disponibles

  const estados = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 
    'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 
    'Jalisco', 'Mexico', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 
    'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  const obtenerDatosPorEstado = async (estado) => {
    try {
      setLoading(true);
      setError('');
      let pagina = 1;
      let encontrado = false;
      let datosEncontrados = [];

      while (!encontrado) {
        const respuesta = await fetch(`https://api.datos.gob.mx/v1/condiciones-atmosfericas?page=${pagina}`);
        const data = await respuesta.json();

        if (data && data.results) {
          const resultados = data.results.filter(ciudad => ciudad.state === estado);

          if (resultados.length > 0) {
            datosEncontrados = resultados;  
            encontrado = true; 
          }
        }

        if (!encontrado) {
          pagina++;
          if (pagina > data.pagination.totalPages) {
            break; 
          }
        }
      }

      if (datosEncontrados.length > 0) {
        setDatos(datosEncontrados);  
        setTotalPaginas(pagina);    
      } else {
        setError('No se encontraron datos para el estado seleccionado.');
      }
    } catch (err) {
      setError('Error al obtener los datos de la API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estadoSeleccionado) {
      obtenerDatosPorEstado(estadoSeleccionado);  
    } else {
      setDatos([]); 
    }
  }, [estadoSeleccionado]); 

  return (
    <div className="contenedor">
      <h1>Estado del Tiempo en México</h1>

      <label htmlFor="estado">Selecciona un estado:</label>
      <select
        id="estado"
        value={estadoSeleccionado}
        onChange={(e) => setEstadoSeleccionado(e.target.value)}
      >
        <option value="">-- Selecciona un estado --</option>
        {estados.map((estado, index) => (
          <option key={index} value={estado}>
            {estado}
          </option>
        ))}
      </select>

      {estadoSeleccionado && (
        <>
          <h2>Estado seleccionado: {estadoSeleccionado}</h2>
          <h3>Estado del Tiempo</h3>

          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>{error}</p>
          ) : datos.length > 0 ? (
            datos.map((ciudad, index) => (
              <div key={index} className="ciudad">
                <p><strong>{ciudad.name}</strong> - <i>{ciudad.skydescriptionlong || "Sin descripción"}</i></p>
                <p>Temperatura: {ciudad.temp || "No disponible"} °C</p>
                <p>Probabilidad de precipitación: {ciudad.probabilityofprecip || "No disponible"}%</p>
                <p>Humedad relativa: {ciudad.relativehumidity || "No disponible"}%</p>
                <p>Dirección del viento: {ciudad.winddirectioncardinal || "No disponible"}</p>
                <p>Velocidad del viento: {ciudad.windspeed || "No disponible"} km/h</p>
              </div>
            ))
          ) : (
            <p>No se encontraron datos para el estado seleccionado.</p>
          )}
        </>
      )}

      {datos.length > 0 && (
        <div className="paginacion">
          <span>Página {paginaActual} de {totalPaginas}</span>
        </div>
      )}
    </div>
  );
};

export default CondicionAtmosferica;
