const resultado = document.getElementById('resultado');
const grafico = document.getElementById('graficoYoung').getContext('2d');
let chart;

document.getElementById('young-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const F = parseFloat(document.getElementById('fuerza').value);
  const L = parseFloat(document.getElementById('longitud').value);
  const deltaLmm = parseFloat(document.getElementById('alargamiento').value);
  const diametroMm = parseFloat(document.getElementById('diametro').value);

  const deltaL = deltaLmm / 1000;
  const d = diametroMm / 1000;
  const r = d / 2;
  const A = Math.PI * Math.pow(r, 2);
  const E = (F * L) / (A * deltaL);

  let output = `
    <div class="paso">
      <h3>📘 Paso 1: Datos ingresados</h3>
      <p>Fuerza (F): ${F} N</p>
      <p>Longitud (L): ${L} m</p>
      <p>Alargamiento (ΔL): ${deltaLmm} mm = ${deltaL} m</p>
      <p>Diámetro: ${diametroMm} mm = ${d} m</p>
      <p>Radio: ${r.toFixed(6)} m</p>
    </div>
    <div class="paso">
      <h3>📘 Paso 2: Calcular el área de la sección</h3>
      <p>A = π · r² = π · (${r.toFixed(6)})² = ${A.toExponential(6)} m²</p>
    </div>
    <div class="paso">
      <h3>📘 Paso 3: Aplicar la fórmula del módulo de Young</h3>
      <p>E = (F · L) / (A · ΔL)</p>
      <p>E = (${F} · ${L}) / (${A.toExponential(6)} · ${deltaL})</p>
      <p>E ≈ <strong>${E.toExponential(3)} Pa</strong></p>
    </div>
    <div class="resultado-final">
      <h3>🎯 Resultado final:</h3>
      <p><strong>Módulo de Young ≈ ${E.toExponential(3)} Pascales</strong></p>
    </div>
  `;

  resultado.innerHTML = output;

  // Preparamos datos para la animación
  const puntos = 50;
  const dataX = [];
  const dataY = [];

  // Calculamos puntos para el gráfico fuerza vs alargamiento (lineal)
  for (let i = 0; i <= puntos; i++) {
    let fuerzaPunto = (F / puntos) * i;
    let alargamientoPunto = (deltaL / F) * fuerzaPunto;
    dataX.push(fuerzaPunto.toFixed(3));
    dataY.push(alargamientoPunto.toFixed(6));
  }

  if (chart) chart.destroy();

  // Inicializamos gráfica vacía para animar después
  chart = new Chart(grafico, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Alargamiento (m) vs Fuerza (N)',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
      }]
    },
    options: {
      responsive: true,
      animation: false, // animamos manualmente
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fuerza (N)'
          },
          beginAtZero: true
        },
        y: {
          title: {
            display: true,
            text: 'Alargamiento (m)'
          },
          beginAtZero: true
        }
      }
    }
  });

  // Animación: vamos añadiendo punto a punto
  let index = 0;
  const interval = setInterval(() => {
    if (index > puntos) {
      clearInterval(interval);
      return;
    }
    chart.data.labels.push(dataX[index]);
    chart.data.datasets[0].data.push(dataY[index]);
    chart.update();
    index++;
  }, 40);

});

// AYUDA
document.getElementById("ayudaBtn").addEventListener("click", () => {
  document.getElementById("modalAyuda").classList.remove("oculto");
});
function cerrarModal() {
  document.getElementById("modalAyuda").classList.add("oculto");
}

// MODO OSCURO
document.getElementById("modoToggle").addEventListener("change", function () {
  document.body.classList.toggle("oscuro", this.checked);
  document.body.classList.toggle("claro", !this.checked);
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
  window.location.href = "../index.html";
}
function cancelarVolver() {
  document.getElementById("alertaVolver").classList.add("oculto");
}
