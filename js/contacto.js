function manejarEnvioFormulario() {
  const formulario = document.getElementById("contactForm");

  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value;
      const email = document.getElementById("email").value;
      const mensaje = document.getElementById("mensaje").value;
      const telefono = document.getElementById("telefono")?.value || "";
      const asunto = document.getElementById("asunto")?.value || "";

      const datosFormulario = {
        nombre,
        email,
        telefono,
        asunto,
        mensaje,
      };

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosFormulario),
          }
        );

        if (!response.ok) {
          throw new Error("Error al enviar el formulario");
        }

        const data = await response.json();
        console.log("Respuesta:", data);

        Swal.fire({
          title: "¡Mensaje enviado!",
          text: "Gracias por contactarnos. Te responderemos pronto.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        formulario.reset();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo enviar el formulario. Intente nuevamente más tarde.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    });
  }
}
