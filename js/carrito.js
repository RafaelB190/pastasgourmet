let carrito;

class ItemCarrito {
  constructor(producto, cantidad = 1) {
    this.producto = producto;
    this.cantidad = cantidad;
  }

  obtenerSubtotal() {
    return this.producto.precio * this.cantidad;
  }
}

class Carrito {
  constructor() {
    this.items = [];
    this.cargarDesdeStorage();
  }

  agregarProducto(producto) {
    const itemExistente = this.items.find(
      (item) => item.producto.id === producto.id
    );

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.items.push(new ItemCarrito(producto));
    }

    this.guardarEnStorage();
  }

  eliminarProducto(id) {
    this.items = this.items.filter((item) => item.producto.id !== id);
    this.guardarEnStorage();
  }

  vaciarCarrito() {
    this.items = [];
    this.guardarEnStorage();
  }

  aumentarCantidad(id) {
    const item = this.items.find((item) => item.producto.id === id);
    if (item) {
      item.cantidad++;
      this.guardarEnStorage();
    }
  }

  disminuirCantidad(id) {
    const item = this.items.find((item) => item.producto.id === id);
    if (item && item.cantidad > 1) {
      item.cantidad--;
      this.guardarEnStorage();
    } else if (item && item.cantidad === 1) {
      this.eliminarProducto(id);
    }
  }

  calcularTotal() {
    return this.items.reduce(
      (total, item) => total + item.obtenerSubtotal(),
      0
    );
  }

  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  guardarEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(this.items));
  }

  cargarDesdeStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      try {
        const itemsParseados = JSON.parse(carritoGuardado);
        this.items = itemsParseados.map((item) => {
          const producto = {
            id: item.producto.id,
            nombre: item.producto.nombre,
            precio: item.producto.precio,
            imagen: item.producto.imagen,
            descripcion: item.producto.descripcion,
            categoria: item.producto.categoria,
          };
          return new ItemCarrito(producto, item.cantidad);
        });
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage:", error);
        this.items = [];
      }
    }
  }
}

function generarHTMLCarrito() {
  return carrito.items
    .map(
      (item) => `
          <div class="carrito-item">
              <img src="${item.producto.imagen}" alt="${
        item.producto.nombre
      }" width="50">
              <div class="carrito-item-info">
                  <h4>${item.producto.nombre}</h4>
                  <p>$${item.producto.precio} x ${
        item.cantidad
      } = $${item.obtenerSubtotal()}</p>
                  <div class="carrito-item-controles">
                      <button class="btn-cantidad" onclick="disminuirCantidad(${
                        item.producto.id
                      })">-</button>
                      <span>${item.cantidad}</span>
                      <button class="btn-cantidad" onclick="aumentarCantidad(${
                        item.producto.id
                      })">+</button>
                      <button class="btn-eliminar" onclick="eliminarDelCarrito(${
                        item.producto.id
                      })">Eliminar</button>
                  </div>
              </div>
          </div>
        `
    )
    .join("");
}

function mostrarCarrito() {
  if (carrito.items.length === 0) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "Carrito vacío",
        text: "No hay productos en el carrito",
        icon: "info",
        confirmButtonText: "Aceptar",
      });
    } else {
      alert("Carrito vacío. No hay productos en el carrito.");
    }
    return;
  }

  const productosHTML = generarHTMLCarrito();

  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: "Tu Carrito",
      html: `
          <div class="carrito-contenido">
              ${productosHTML}
              <div class="carrito-total">
                  <strong>Total: $${carrito.calcularTotal()}</strong>
              </div>
              <div class="carrito-acciones">
                  <button class="btn-vaciar" onclick="vaciarCarrito()">Vaciar Carrito</button>
              </div>
          </div>
        `,
      confirmButtonText: "Proceder al Checkout",
      showCancelButton: true,
      cancelButtonText: "Seguir Comprando",
      width: 600,
      didOpen: () => {
        window.aumentarCantidad = (id) => {
          carrito.aumentarCantidad(id);
          actualizarContadorCarrito();
          mostrarCarrito();
        };

        window.disminuirCantidad = (id) => {
          carrito.disminuirCantidad(id);
          actualizarContadorCarrito();
          mostrarCarrito();
        };

        window.eliminarDelCarrito = (id) => {
          carrito.eliminarProducto(id);
          actualizarContadorCarrito();
          mostrarCarrito();
        };

        window.vaciarCarrito = () => {
          carrito.vaciarCarrito();
          actualizarContadorCarrito();
          Swal.close();
          Swal.fire({
            title: "Carrito vaciado",
            text: "Se han eliminado todos los productos del carrito",
            icon: "info",
            confirmButtonText: "Aceptar",
          });
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        mostrarFormularioCheckout();
      }
    });
  } else {
    alert(
      "Carrito contents:\n" +
        productosHTML +
        "\nTotal: $" +
        carrito.calcularTotal()
    );
  }
}

function mostrarFormularioCheckout() {
  Swal.fire({
    title: "Datos de Envío",
    html: `
        <form id="checkoutForm" class="checkout-form">
          <div class="form-group">
            <label for="checkout-nombre">Nombre completo:</label>
            <input type="text" id="checkout-nombre" class="swal2-input" required>
          </div>
          <div class="form-group">
            <label for="checkout-email">Email:</label>
            <input type="email" id="checkout-email" class="swal2-input" required>
          </div>
          <div class="form-group">
            <label for="checkout-telefono">Teléfono:</label>
            <input type="tel" id="checkout-telefono" class="swal2-input" required>
          </div>
          <div class="form-group">
            <label for="checkout-direccion">Dirección:</label>
            <input type="text" id="checkout-direccion" class="swal2-input" required>
          </div>
          <div class="form-group">
            <label for="checkout-ciudad">Ciudad:</label>
            <input type="text" id="checkout-ciudad" class="swal2-input" required>
          </div>
          <div class="form-group">
            <label for="checkout-codigo-postal">Código Postal:</label>
            <input type="text" id="checkout-codigo-postal" class="swal2-input" required>
          </div>
        </form>
      `,
    confirmButtonText: "Continuar al Pago",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    width: 600,
    preConfirm: () => {
      const form = document.getElementById("checkoutForm");
      if (!form.checkValidity()) {
        form.reportValidity();
        return false;
      }

      return {
        nombre: document.getElementById("checkout-nombre").value,
        email: document.getElementById("checkout-email").value,
        telefono: document.getElementById("checkout-telefono").value,
        direccion: document.getElementById("checkout-direccion").value,
        ciudad: document.getElementById("checkout-ciudad").value,
        codigoPostal: document.getElementById("checkout-codigo-postal").value,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const datosEnvio = result.value;
      mostrarFormularioPago(datosEnvio);
    }
  });
}

function mostrarFormularioPago(datosEnvio) {
  Swal.fire({
    title: "Método de Pago",
    html: `
        <form id="pagoForm" class="pago-form">
          <div class="form-group">
            <label>Seleccione método de pago:</label> 
            <div class="metodos-pago">
              <div class="metodo-pago">
                <input type="radio" id="tarjeta" name="metodo-pago" value="tarjeta" checked>
                <label for="tarjeta">Tarjeta de Crédito/Débito</label> 
              </div>
              <div class="metodo-pago">
                <input type="radio" id="transferencia" name="metodo-pago" value="transferencia">
                <label for="transferencia">Transferencia Bancaria</label> 
              </div>
              <div class="metodo-pago">
                <input type="radio" id="efectivo" name="metodo-pago" value="efectivo">
                <label for="efectivo">Efectivo en Entrega</label> 
              </div>
            </div>
          </div>
          
          <div id="datos-tarjeta" class="datos-pago">
            <div class="form-group">
              <label for="numero-tarjeta">Número de Tarjeta:</label> 
              <input type="text" id="numero-tarjeta" class="swal2-input" placeholder="XXXX XXXX XXXX XXXX"> 
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="fecha-vencimiento">Fecha de Vencimiento:</label>
                <input type="text" id="fecha-vencimiento" class="swal2-input" placeholder="MM/AA"> 
              </div>
              <div class="form-group">
                <label for="cvv">CVV:</label> 
                <input type="text" id="cvv" class="swal2-input" placeholder="123"> 
              </div>
            </div>
            <div class="form-group">
              <label for="titular">Titular de la Tarjeta:</label> 
              <input type="text" id="titular" class="swal2-input"> 
            </div>
          </div>
        </form>
      `,
    confirmButtonText: "Finalizar Compra",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    width: 600,
    didOpen: () => {
      const radios = document.querySelectorAll('input[name="metodo-pago"]');
      const datosTarjeta = document.getElementById("datos-tarjeta");

      radios.forEach((radio) => {
        radio.addEventListener("change", () => {
          if (radio.value === "tarjeta") {
            datosTarjeta.style.display = "block";
          } else {
            datosTarjeta.style.display = "none";
          }
        });
      });
    },
    preConfirm: () => {
      const metodoPago = document.querySelector(
        'input[name="metodo-pago"]:checked'
      ).value;

      if (metodoPago === "tarjeta") {
        const numeroTarjeta = document.getElementById("numero-tarjeta").value;
        const fechaVencimiento =
          document.getElementById("fecha-vencimiento").value;
        const cvv = document.getElementById("cvv").value;
        const titular = document.getElementById("titular").value;

        if (!numeroTarjeta || !fechaVencimiento || !cvv || !titular) {
          Swal.showValidationMessage(
            "Por favor complete todos los campos de la tarjeta"
          );
          return false;
        }
      }

      return {
        metodoPago,
        datosPago:
          metodoPago === "tarjeta"
            ? {
                numeroTarjeta: document.getElementById("numero-tarjeta").value,
                fechaVencimiento:
                  document.getElementById("fecha-vencimiento").value,
                cvv: document.getElementById("cvv").value,
                titular: document.getElementById("titular").value,
              }
            : {},
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const datosPago = result.value;
      finalizarCompra(datosEnvio, datosPago);
    }
  });
}

function finalizarCompra(datosEnvio, datosPago) {
  const numeroOrden = Math.floor(100000 + Math.random() * 900000);
  const fecha = new Date().toLocaleDateString();

  const itemsCompra = carrito.items
    .map((item) => {
      return `
        <tr>
          <td>${item.producto.nombre}</td> 
          <td>${item.cantidad}</td> 
          <td>$${item.producto.precio}</td> 
          <td>$${item.obtenerSubtotal()}</td> 
        </tr>
      `;
    })
    .join("");

  const metodoPagoTexto = {
    tarjeta: "Tarjeta de Crédito/Débito",
    transferencia: "Transferencia Bancaria",
    efectivo: "Efectivo en Entrega",
  };

  Swal.fire({
    title: "¡Compra Realizada con Éxito!",
    html: `
        <div class="comprobante"> 
          <div class="comprobante-header"> 
            <h3>Comprobante de Compra</h3>
            <p><strong>Orden #:</strong> ${numeroOrden}</p> 
            <p><strong>Fecha:</strong> ${fecha}</p>
          </div>
          
          <div class="comprobante-cliente"> 
            <h4>Datos del Cliente</h4> 
            <p><strong>Nombre:</strong> ${datosEnvio.nombre}</p>
            <p><strong>Email:</strong> ${datosEnvio.email}</p> 
            <p><strong>Teléfono:</strong> ${datosEnvio.telefono}</p> 
            <p><strong>Dirección:</strong> ${datosEnvio.direccion}, ${
      datosEnvio.ciudad
    }, CP: ${datosEnvio.codigoPostal}</p>
          </div>
          
          <div class="comprobante-productos"> 
            <h4>Productos Adquiridos</h4> 
            <table class="tabla-productos"> 
              <thead>
                <tr>
                  <th>Producto</th> 
                  <th>Cantidad</th> 
                  <th>Precio Unit.</th> 
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsCompra}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Total</strong></td> 
                  <td><strong>$${carrito.calcularTotal()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="comprobante-pago"> 
            <h4>Método de Pago</h4> 
            <p>${metodoPagoTexto[datosPago.metodoPago]}</p> 
          </div>
          
          <div class="comprobante-footer"> 
            <p>¡Gracias por tu compra! Recibirás un email con los detalles de tu pedido.</p> 
          </div>
        </div>
      `,
    icon: "success",
    confirmButtonText: "Finalizar",
    width: 800,
  }).then(() => {
    carrito.vaciarCarrito();
    actualizarContadorCarrito();
  });
}

function inicializarBotonCarrito() {
  if (!window.carrito) {
    window.carrito = new Carrito();
    carrito = window.carrito;
  }

  const btnVerCarrito = document.createElement("button");
  btnVerCarrito.textContent = "Ver Carrito";
  btnVerCarrito.className = "btn-carrito";
  btnVerCarrito.addEventListener("click", mostrarCarrito);

  const header = document.querySelector("header");
  if (header) {
    const existingButton = header.querySelector(".btn-carrito");
    if (existingButton) {
      return;
    }

    const contadorCarrito = document.createElement("span");
    contadorCarrito.id = "carrito-contador";
    contadorCarrito.textContent = carrito.obtenerCantidadTotal();
    contadorCarrito.className = "carrito-contador";

    btnVerCarrito.appendChild(contadorCarrito);
    header.appendChild(btnVerCarrito);
  }
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  if (contador && carrito) {
    contador.textContent = carrito.obtenerCantidadTotal();
  }
}

window.carrito = carrito;
window.mostrarCarrito = mostrarCarrito;
window.inicializarBotonCarrito = inicializarBotonCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;
