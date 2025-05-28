const formulario = document.getElementById("elasticidad-form");
const resultadoDiv = document.getElementById("resultado");
const volverBtn = document.getElementById("volverBtn");
const alertaVolver = document.getElementById("alertaVolver");
const ayudaBtn = document.getElementById("ayudaBtn");
const modalAyuda = document.getElementById("modalAyuda");
const modoToggle = document.getElementById("modoToggle");
const body = document.body;

let grafico = null;
let intervaloAnimacion = null;

// Cambiar entre modo claro y oscuro
modoToggle.addEventListener("change", () => {
  body.classList.toggle("oscuro");
  body.classList.toggle("claro");
});

// Botón ayuda
ayudaBtn.addEventListener("click", () => {
  modalAyuda.classList.remove("oculto");
});
function cerrarModal() {
  modalAyuda.classList.add("oculto");
}
 // VOLVER AL MENÚ
document.getElementById("volverBtn").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("alertaVolver").classList.remove("oculto");
  setTimeout(() => {
    document.getElementById("alertaVolver").classList.add("oculto");
  }, 10000);
});

  
function confirmarVolver() {
  window.location.href = "index.html"; // o la ruta correcta a tu menú principal
}



  function cancelarVolver() {
    alertaVolver.classList.add("oculto");
    clearTimeout(volverTimeout);
  }
// Formulario
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  resultadoDiv.innerHTML = "";

  const masa1 = parseFloat(document.getElementById("masa1").value);
  const masa2 = parseFloat(document.getElementById("masa2").value || 0);
  const estiramiento = parseFloat(document.getElementById("estiramiento").value);

  const g = 9.8;
  const masaTotal = masa1 + masa2;

  const x = estiramiento / 100; // Convertir cm a m
  const F = masa1 * g;
  const k = F / x;

  const Ftotal = masaTotal * g;
  const xTotal = Ftotal / k;
  const adicional = xTotal - x;

  const pasosHTML = `
    <div class="paso">
      <h3> Paso 1: Datos ingresados</h3>
      <p>Masa 1: ${masa1} kg<br>
      Masa 2: ${masa2} kg<br>
      Estiramiento: ${estiramiento} cm = ${(x).toFixed(3)} m</p>
    </div>

    <div class="paso">
      <h3> Paso 2: Constante del resorte</h3>
      <p>F = m · g = ${F.toFixed(2)} N<br>
      k = F / x = ${F.toFixed(2)} / ${x.toFixed(3)} = <strong>${k.toFixed(2)} N/m</strong></p>
    </div>

    <div class="paso">
      <h3> Paso 3: Estiramiento con ambas masas</h3>
      <p>Ftotal = ${Ftotal.toFixed(2)} N<br>
      xTotal = ${xTotal.toFixed(3)} m<br>
      Estiramiento adicional = ${adicional.toFixed(3)} m</p>
    </div>

    <div class="resultado-final">
      <h3> Resultado final:</h3>
      <p>Constante k = <strong>${k.toFixed(2)} N/m</strong></p>
    </div>
  `;
  resultadoDiv.innerHTML = pasosHTML;

  generarGraficoAnimado(k);
});

// Generar gráfica animada
function generarGraficoAnimado(k) {
  if (grafico) {
    grafico.destroy();
    clearInterval(intervaloAnimacion);
  }

  const ctx = document.getElementById("graficoElasticidad").getContext("2d");

  let tiempo = 0;
  const A = 0.05; // Amplitud 5 cm
  const w = Math.sqrt(k / 1); // ω = √(k/m) suponiendo m = 1 kg

  const data = {
    labels: [],
    datasets: [{
      label: "Movimiento oscilatorio (m)",
      data: [],
      fill: false,
      borderColor: "#007bff",
      tension: 0.3
    }]
  };

  const config = {
    type: "line",
    data,
    options: {
      animation: false,
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Tiempo (s)"
          }
        },
        y: {
          title: {
            display: true,
            text: "Estiramiento (m)"
          },
          min: -A,
          max: A
        }
      }
    }
  };

  grafico = new Chart(ctx, config);

  // Simulación de animación en tiempo real
  intervaloAnimacion = setInterval(() => {
    const y = A * Math.sin(w * tiempo);
    data.labels.push(tiempo.toFixed(1));
    data.datasets[0].data.push(y.toFixed(4));

    if (data.labels.length > 50) {
      data.labels.shift();
      data.datasets[0].data.shift();
    }

    grafico.update();
    tiempo += 0.1;
  }, 100);
}
