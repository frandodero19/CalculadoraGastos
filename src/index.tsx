import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Asegúrate de tener este archivo o cámbialo según tu configuración
import CalculadoraGastos from './calculadora-gastos.mejorada';

ReactDOM.render(
  <React.StrictMode>
    <CalculadoraGastos />
  </React.StrictMode>,
  document.getElementById('root')
);
