import React from "react";
import CondicionAtmosferica from "./components/CondicionAtmosferica"; // Asegúrate de que esté en la misma carpeta o ajusta la ruta
import './App.css'; // Asegúrate de que los estilos estén aplicados aquí

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de Condiciones Atmosféricas</h1>
        {/* Llamada al componente de clima */}
        <CondicionAtmosferica />
      </header>
    </div>
  );
  
}

export default App;
