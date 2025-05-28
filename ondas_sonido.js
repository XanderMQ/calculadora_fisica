 const select = document.getElementById("calculo");
  const campos = document.getElementById("campos-dinamicos");
  const resultado = document.getElementById("resultado");
  const ctx = document.getElementById("graficoSonido").getContext("2d");
  let chart;
  let animationFrameId;
  let phase = 0;

  // Cambiar campos según opción
  select.addEventListener("change", () => {
    campos.innerHTML = "";
    resultado.innerHTML = "";
    if (chart) {
      chart.destroy();
      cancelAnimationFrame(animationFrameId);
    }

    if (select.value === "velocidad") {
      campos.innerHTML = `
        <label for="frecuencia">Frecuencia (Hz):</label>
        <input type="number" id="frecuencia" step="0.01" min="0" required>

        <label for="longitud">Longitud de onda (m):</label>
        <input type="number" id="longitud" step="0.01" min="0" required>
      `;
    } else if (select.value === "frecuencia") {
      campos.innerHTML = `
        <label for="velocidad">Velocidad (m/s):</label>
        <input type="number" id="velocidad" step="0.01" min="0" required>

        <label for="longitud">Longitud de onda (m):</label>
        <input type="number" id="longitud" step="0.01" min="0" required>
      `;
    } else if (select.value === "longitud") {
      campos.innerHTML = `
        <label for="velocidad">Velocidad (m/s):</label>
        <input type="number" id="velocidad" step="0.01" min="0" required>

        <label for="frecuencia">Frecuencia (Hz):</label>
        <input type="number" id="frecuencia" step="0.01" min="0" required>
      `;
    }
  });

  // Generar datos onda seno
  function generarDatosOnda(frecuencia, amplitud = 1, puntos = 100, fase = 0) {
    const datos = [];
    for (let i = 0; i < puntos; i++) {
      const x = i * (2 * Math.PI) / puntos;
      datos.push(amplitud * Math.sin(frecuencia * x + fase));
    }
    return datos;
  }

  // Animar onda
  function animarOnda(chart, frecuencia) {
    phase += 0.1;
    chart.data.datasets[0].data = generarDatosOnda(frecuencia, 1, 100, phase);
    chart.update();
    animationFrameId = requestAnimationFrame(() => animarOnda(chart, frecuencia));
  }

  // Form submit
  document.getElementById("sonido-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const tipo = select.value;
    const v = parseFloat(document.getElementById("velocidad")?.value);
    const f = parseFloat(document.getElementById("frecuencia")?.value);
    const l = parseFloat(document.getElementById("longitud")?.value);

    let output = "";
    let calculado;

    if (tipo === "velocidad") {
      calculado = f * l;
      output = `
        <div class="paso"><h3>📘 Paso 1: Datos ingresados</h3>
          <p>Frecuencia: ${f} Hz</p>
          <p>Longitud de onda: ${l} m</p>
        </div>
        <div class="paso"><h3>📘 Paso 2: Aplicar fórmula</h3>
          <p>v = f · λ = ${f} · ${l} = ${calculado.toFixed(2)} m/s</p>
        </div>
        <div class="resultado-final">
          <h3>🎯 Resultado:</h3>
          <p><strong>Velocidad del sonido ≈ ${calculado.toFixed(2)} m/s</strong></p>
        </div>
      `;
    } else if (tipo === "frecuencia") {
      calculado = v / l;
      output = `
        <div class="paso"><h3>📘 Paso 1: Datos ingresados</h3>
          <p>Velocidad: ${v} m/s</p>
          <p>Longitud de onda: ${l} m</p>
        </div>
        <div class="paso"><h3>📘 Paso 2: Aplicar fórmula</h3>
          <p>f = v / λ = ${v} / ${l} = ${calculado.toFixed(2)} Hz</p>
        </div>
        <div class="resultado-final">
          <h3>🎯 Resultado:</h3>
          <p><strong>Frecuencia ≈ ${calculado.toFixed(2)} Hz</strong></p>
        </div>
      `;
    } else if (tipo === "longitud") {
      calculado = v / f;
      output = `
        <div class="paso"><h3>📘 Paso 1: Datos ingresados</h3>
          <p>Velocidad: ${v} m/s</p>
          <p>Frecuencia: ${f} Hz</p>
        </div>
        <div class="paso"><h3>📘 Paso 2: Aplicar fórmula</h3>
          <p>λ = v / f = ${v} / ${f} = ${calculado.toFixed(3)} m</p>
        </div>
        <div class="resultado-final">
          <h3>🎯 Resultado:</h3>
          <p><strong>Longitud de onda ≈ ${calculado.toFixed(3)} m</strong></p>
        </div>
      `;
    } else {
      output = "<p>Por favor, selecciona una opción válida.</p>";
    }

    resultado.innerHTML = output;

    // Graficar onda animada
    if (chart) {
      chart.destroy();
      cancelAnimationFrame(animationFrameId);
    }

    // Para animar la onda, usa frecuencia calculada si existe y es válida, o valor predeterminado 2
    let freqParaAnimar;
    if (tipo === "frecuencia") freqParaAnimar = calculado;
    else if (tipo === "velocidad" && f) freqParaAnimar = f;
    else if (tipo === "longitud" && f) freqParaAnimar = f;
    else freqParaAnimar = 2;

    // Limitar frecuencia animación para que no sea muy rápida ni muy lenta
    freqParaAnimar = Math.min(Math.max(freqParaAnimar, 0.1), 10);

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i),
        datasets: [{
          label: 'Onda sonora',
          borderColor: '#007bff',
          borderWidth: 2,
          fill: false,
          data: generarDatosOnda(freqParaAnimar, 1, 100, phase)
        }]
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: { display: false },
          y: { min: -1, max: 1 }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });

    animarOnda(chart, freqParaAnimar);
  });

  // Modal ayuda
  document.getElementById("ayudaBtn").addEventListener("click", () => {
    document.getElementById("modalAyuda").classList.remove("oculto");
  });
  function cerrarModal() {
    document.getElementById("modalAyuda").classList.add("oculto");
  }

  // Modo oscuro/claro toggle
  const modoToggle = document.getElementById("modoToggle");
  modoToggle.addEventListener("change", () => {
    if (modoToggle.checked) {
      document.body.classList.remove("claro");
      document.body.classList.add("oscuro");
    } else {
      document.body.classList.remove("oscuro");
      document.body.classList.add("claro");
    }
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