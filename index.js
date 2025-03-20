"use client";
import React from "react";
import { createRoot } from "react-dom/client";
import "./css/styles.css";
import { cargarProductos, inicializarBotonCarrito } from "./js/main.js";

const App = () => {
  React.useEffect(() => {
    inicializarApp();
  }, []);

  return <div id="app-root">PastasGourmet</div>;
};
function inicializarApp() {
  inicializarBotonCarrito();
  cargarProductos();
  console.log("Aplicación inicializada correctamente");
}
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
