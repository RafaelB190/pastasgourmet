import Swal from "sweetalert2";
import "../css/styles.css";
let todosLosProductos = [];
let carrito;

class Carrito {
  constructor() {
    this.productos = [];
  }

  agregarProducto(producto) {
    this.productos.push(producto);
    this.actualizarLocalStorage();
  }

  eliminarProducto(productoId) {
    this.productos = this.productos.filter(
      (producto) => producto.id !== productoId
    );
    this.actualizarLocalStorage();
  }

  obtenerProductos() {
    return this.productos;
  }

  actualizarLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  }

  cargarDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      this.productos = JSON.parse(carritoGuardado);
    }
  }
}

class Producto {
  constructor(id, nombre, precio, imagen, descripcion, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.categoria = categoria || this.determinarCategoria(nombre);
  }

  determinarCategoria(nombre) {
    return nombre.toLowerCase().includes("salsa") ? "salsas" : "pastas";
  }
}

async function verificarImagen(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error(`Error al verificar la imagen:`, error);
    return false;
  }
}

function mostrarProductosPorCategoria() {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) {
    console.error("No se encontró el contenedor de productos");
    return;
  }

  contenedor.innerHTML = "";

  const filtrosContainer = document.createElement("div");
  filtrosContainer.className = "filtros-container";

  const tituloFiltros = document.createElement("h2");
  tituloFiltros.textContent = "Categorías";
  filtrosContainer.appendChild(tituloFiltros);

  const botonesContainer = document.createElement("div");
  botonesContainer.className = "botones-filtro";

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todos";
  btnTodos.className = "btn-filtro activo";
  btnTodos.addEventListener("click", () => {
    document
      .querySelectorAll(".btn-filtro")
      .forEach((btn) => btn.classList.remove("activo"));
    btnTodos.classList.add("activo");
    mostrarProductos(todosLosProductos);
  });

  const btnPastas = document.createElement("button");
  btnPastas.textContent = "Pastas";
  btnPastas.className = "btn-filtro";
  btnPastas.addEventListener("click", () => {
    document
      .querySelectorAll(".btn-filtro")
      .forEach((btn) => btn.classList.remove("activo"));
    btnPastas.classList.add("activo");
    const pastasFiltradas = todosLosProductos.filter(
      (producto) => producto.categoria === "pastas"
    );
    mostrarProductos(pastasFiltradas);
  });

  const btnSalsas = document.createElement("button");
  btnSalsas.textContent = "Salsas";
  btnSalsas.className = "btn-filtro";
  btnSalsas.addEventListener("click", () => {
    document
      .querySelectorAll(".btn-filtro")
      .forEach((btn) => btn.classList.remove("activo"));
    btnSalsas.classList.add("activo");
    const salsasFiltradas = todosLosProductos.filter(
      (producto) => producto.categoria === "salsas"
    );
    mostrarProductos(salsasFiltradas);
  });

  botonesContainer.appendChild(btnTodos);
  botonesContainer.appendChild(btnPastas);
  botonesContainer.appendChild(btnSalsas);
  filtrosContainer.appendChild(botonesContainer);

  contenedor.appendChild(filtrosContainer);

  mostrarProductos(todosLosProductos);
}

function mostrarProductosDestacados() {
  const productosDestacados = todosLosProductos.slice(0, 4);
  mostrarProductos(productosDestacados);
}

function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos-container");
  if (!contenedor) {
    console.error("No se encontró el contenedor de productos");
    return;
  }

  const filtrosContainer = document.querySelector(".filtros-container");

  const productosExistentes = document.querySelector(".productos-grid");
  if (productosExistentes) {
    productosExistentes.remove();
  }

  if (!filtrosContainer && !contenedor.querySelector("h2")) {
    const titulo = document.createElement("h2");
    titulo.textContent = "Nuestros Productos";
    titulo.className = "text-2xl font-bold mb-4";
    contenedor.appendChild(titulo);
  }

  const productosGrid = document.createElement("div");
  productosGrid.className = "productos-grid";

  productos.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto-card";

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;

    imagen.onerror = function () {
      console.error(`Error al cargar la imagen: ${producto.imagen}`);
      this.src = window.location.pathname.includes("/page/")
        ? "../assets/image/placeholder.jpeg"
        : "assets/image/placeholder.jpeg";
      this.alt = "Imagen no disponible";
    };

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "descripcion";
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = `$${producto.precio}`;

    const boton = document.createElement("button");
    boton.textContent = "Agregar al carrito";
    boton.className = "btn-agregar";

    boton.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });

    card.appendChild(imagen);
    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(precio);
    card.appendChild(boton);

    productosGrid.appendChild(card);
  });

  contenedor.appendChild(productosGrid);
}

function agregarAlCarrito(producto) {
  if (!window.carrito) {
    window.carrito = new Carrito();
  }

  window.carrito.agregarProducto(producto);

  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: "¡Producto agregado!",
      text: `${producto.nombre} se ha agregado al carrito`,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } else {
    alert(`${producto.nombre} se ha agregado al carrito`);
  }

  if (typeof window.actualizarContadorCarrito === "function") {
    window.actualizarContadorCarrito();
  }
}

window.Producto = Producto;
window.verificarImagen = verificarImagen;
window.cargarProductos = cargarProductos;
window.agregarAlCarrito = agregarAlCarrito;
