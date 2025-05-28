const resultado = document.getElementById("resultado");
const graficoCanvas = document.getElementById("graficoMAS");
const ctx = graficoCanvas.getContext("2d");
let chart = null;
let animFrame = null;

document.getElementById("mas-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const m = parseFloat(document.getElementById("masa").value);
  const k = parseFloat(document.getElementById("k").value);
  let f = parseFloat(document.getElementById("frecuencia").value);
  let T = parseFloat(document.getElementById("periodo").value);

  resultado.innerHTML = "";
  const pasos = [];
  let w = null;
  let A = 1; // amplitud fija

  pasos.push(`<div class="paso"><strong>Datos ingresados:</strong><br>Masa: ${m || "No"} kg<br>Constante: ${k || "No"} N/m<br>Frecuencia: ${f || "No"} Hz<br>Período: ${T || "No"} s</div>`);

  if (isNaN(f) && isNaN(T) && !isNaN(m) && !isNaN(k)) {
    T = 2 * Math.PI * Math.sqrt(m / k);
    f = 1 / T;
    pasos.push(`<div class="paso"><strong>Cálculo:</strong><br>T = 2π√(m/k) = ${T.toFixed(4)} s<br>f = 1 / T = ${f.toFixed(4)} Hz</div>`);
  }

  if (!isNaN(f) && isNaN(T)) {
    T = 1 / f;
    pasos.push(`<div class="paso"><strong>Cálculo:</strong><br>T = 1 / f = ${T.toFixed(4)} s</div>`);
  }

  if (!isNaN(T) && isNaN(f)) {
    f = 1 / T;
    pasos.push(`<div class="paso"><strong>Cálculo:</strong><br>f = 1 / T = ${f.toFixed(4)} Hz</div>`);
  }

  if (!isNaN(f)) {
    w = 2 * Math.PI * f;
    pasos.push(`<div class="paso"><strong>Velocidad angular:</strong><br>ω = 2πf = ${w.toFixed(4)} rad/s</div>`);
  }

  resultado.innerHTML = pasos.join("") + `
    <div class="resultado-final">
      <h3>Resultado final</h3>
      ${T ? `<p>Período: ${T.toFixed(4)} s</p>` : ""}
      ${f ? `<p>Frecuencia: ${f.toFixed(4)} Hz</p>` : ""}
      ${w ? `<p>Velocidad angular: ${w.toFixed(4)} rad/s</p>` : ""}
    </div>`;

  if (!w) return;

  // Si hay una animación anterior, detenerla
  if (animFrame) cancelAnimationFrame(animFrame);

  // Preparar datos
  const tiempo = [];
  const posicion = [];
  const puntos = 100;
  const delta = (2 * Math.PI) / puntos;

  for (let i = 0; i <= puntos; i++) {
    tiempo.push(i * delta);
    posicion.push(0); // se actualiza dinámicamente
  }

  // Crear gráfico animado
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tiempo.map(t => t.toFixed(2)),
      datasets: [{
        label: 'y = A·sen(ωt)',
        data: posicion,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: {
          title: { display: true, text: 'Tiempo (s)' }
        },
        y: {
          min: -A,
          max: A,
          title: { display: true, text: 'Posición (m)' }
        }
      }
    }
  });

  // Animación en tiempo real
  let t = 0;
  function animarGrafico() {
    const nuevaPos = tiempo.map(x => A * Math.sin(w * x + t));
    chart.data.datasets[0].data = nuevaPos;
    chart.update();
    t += 0.05;
    animFrame = requestAnimationFrame(animarGrafico);
  }

  animarGrafico();
});

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

    // Modal de ayuda
    document.getElementById("ayudaBtn").addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("modalAyuda").classList.remove("oculto");
    });

    function cerrarModal() {
      document.getElementById("modalAyuda").classList.add("oculto");
    }

    // Modo claro/oscuro
    const toggle = document.getElementById("modoToggle");
    toggle.addEventListener("change", () => {
      document.body.classList.toggle("oscuro", toggle.checked);
      document.body.classList.toggle("claro", !toggle.checked);
    });
 