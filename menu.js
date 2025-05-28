document.addEventListener("DOMContentLoaded", () => {
  const modoToggle = document.getElementById("modoToggle");
  const ayudaBtn = document.getElementById("ayudaBtn");

  // Cambiar modo oscuro/claro
  modoToggle.addEventListener("change", () => {
    document.body.classList.toggle("oscuro", modoToggle.checked);
    document.body.classList.toggle("claro", !modoToggle.checked);
  });

  // Mostrar ayuda
  ayudaBtn.addEventListener("click", () => {
    document.getElementById("modalAyuda").classList.remove("oculto");
  });

  // Cerrar modal
  window.cerrarModal = () => {
    document.getElementById("modalAyuda").classList.add("oculto");
  };
});
