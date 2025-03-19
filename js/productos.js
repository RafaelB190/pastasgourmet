import {
  actualizarContadorCarrito,
  agregarAlCarrito,
  Producto,
  verificarImagen,
} from "./main.js";

async function cargarProductos() {
  try {
    const paginaActual = window.location.pathname;
    const esSubpagina = paginaActual.includes("/page/");

    const jsonPath = esSubpagina
      ? "../assets/data/data.json"
      : "./assets/data/data.json";

    console.log("Intentando cargar productos desde:", jsonPath);

    const response = await fetch(jsonPath);
    console.log("Response status:", response.status);

    if (!response.ok) {
      console.error("Response text:", await response.text());
      throw new Error("No se pudieron cargar los productos");
    }

    const data = await response.json();
    console.log("Datos cargados:", data);

    todosLosProductos = await Promise.all(
      data.productos.map(async (item) => {
        const rutaImagen = esSubpagina ? `../${item.imagen}` : item.imagen;
        console.log("Verificando imagen:", rutaImagen);

        const categoria = item.nombre.toLowerCase().includes("salsa")
          ? "salsas"
          : "pastas";

        const imagenExiste = await verificarImagen(rutaImagen);
        console.log(`Imagen ${rutaImagen} existe: ${imagenExiste}`);

        const imagenFinal = imagenExiste
          ? rutaImagen
          : esSubpagina
          ? "../assets/image/placeholder.jpeg"
          : "./assets/image/placeholder.jpeg";

        return new Producto(
          item.id,
          item.nombre,
          item.precio,
          imagenFinal,
          item.descripcion,
          categoria
        );
      })
    );

    console.log("Productos cargados:", todosLosProductos);

    if (paginaActual.includes("productos.html")) {
      mostrarProductosPorCategoria();
    } else {
      mostrarProductosDestacados();
    }

    if (typeof actualizarContadorCarrito === "function") {
      actualizarContadorCarrito();
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);

    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los productos. Intente nuevamente más tarde.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      alert(
        "No se pudieron cargar los productos. Intente nuevamente más tarde."
      );
    }
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

  if (!filtrosContainer) {
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
        ? "../assets/imagen/placeholder.jpeg"
        : "assets/imagen/placeholder.jpeg";
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
      if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
      }
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
