import React from "react";
import ReactDOM from "react-dom";
import { inicializarBotonCarrito } from "./js/carrito.js";
import { cargarProductos } from "./js/productos.js";

const App = () => {
  React.useEffect(() => {
    cargarProductos();
    inicializarBotonCarrito();
  }, []);

  return <h1>PAstasGourmet</h1>;
};

ReactDOM.render(<App />, document.getElementById("root"));
