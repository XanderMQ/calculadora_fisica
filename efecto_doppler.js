document.addEventListener("DOMContentLoaded", () => {
  const escenario = document.getElementById("escenario");
  const campos = document.getElementById("campos-dinamicos");
  const form = document.getElementById("doppler-form");
  const resultado = document.getElementById("resultado");
  const volverBtn = document.getElementById("volverBtn");
  const modoToggle = document.getElementById("modoToggle");
  const ayudaBtn = document.getElementById("ayudaBtn");

  let chart; // Chart.js instancia
  let animOffset = 0; // desplazamiento animado de onda

  // === CAMBIAR MODO CLARO/OSCURO ===
  modoToggle.addEventListener("change", () => {
    document.body.classList.toggle("oscuro", modoToggle.checked);
    document.body.classList.toggle("claro", !modoToggle.checked);
    if (chart) actualizarColoresGrafico();
  });

  // === MODAL AYUDA ===
  ayudaBtn.addEventListener("click", () => {
    document.getElementById("modalAyuda").classList.remove("oculto");
  });
  window.cerrarModal = () => {
    document.getElementById("modalAyuda").classList.add("oculto");
  };

  // === VOLVER ===
  let timeoutVolver;
  volverBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("alertaVolver").classList.remove("oculto");
    timeoutVolver = setTimeout(() => confirmarVolver(), 10000);
  });
  window.confirmarVolver = () => location.href = "index.html";
  window.cancelarVolver = () => {
    clearTimeout(timeoutVolver);
    document.getElementById("alertaVolver").classList.add("oculto");
  };

  // === CAMPOS DINÁMICOS SEGÚN ESCENARIO ===
  escenario.addEventListener("change", () => {
    const tipo = escenario.value;
    let html = `
      <label for="f">Frecuencia fuente (Hz):</label>
      <input type="number" id="f" required />
      <label for="v">Velocidad del sonido (m/s):</label>
      <input type="number" id="v" required />
    `;

    if (tipo === "oyente" || tipo === "ambos") {
      html += `
        <label for="vo">Velocidad del oyente (m/s):</label>
        <input type="number" id="vo" required />
        <label for="movOyente">Movimiento del oyente:</label>
        <select id="movOyente">
          <option value="acerca">Se acerca</option>
          <option value="aleja">Se aleja</option>
        </select>
      `;
    }

    if (tipo === "fuente" || tipo === "ambos") {
      html += `
        <label for="vs">Velocidad de la fuente (m/s):</label>
        <input type="number" id="vs" required />
        <label for="movFuente">Movimiento de la fuente:</label>
        <select id="movFuente">
          <option value="acerca">Se acerca</option>
          <option value="aleja">Se aleja</option>
        </select>
      `;
    }

    campos.innerHTML = html;
  });

  // === SUBMIT FORMULARIO ===
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipo = escenario.value;
    const f = parseFloat(document.getElementById("f").value);
    const v = parseFloat(document.getElementById("v").value);

    let vo = 0, vs = 0;
    let movOyente = "", movFuente = "";
    if (tipo === "oyente" || tipo === "ambos") {
      vo = parseFloat(document.getElementById("vo").value);
      movOyente = document.getElementById("movOyente").value;
    }
    if (tipo === "fuente" || tipo === "ambos") {
      vs = parseFloat(document.getElementById("vs").value);
      movFuente = document.getElementById("movFuente").value;
    }

    let frecuenciaPercibida;
    if (tipo === "oyente") {
      const signo = movOyente === "acerca" ? 1 : -1;
      frecuenciaPercibida = f * (v + signo * vo) / v;
    } else if (tipo === "fuente") {
      const signo = movFuente === "acerca" ? -1 : 1;
      frecuenciaPercibida = f * v / (v + signo * vs);
    } else if (tipo === "ambos") {
      const signoOyente = movOyente === "acerca" ? 1 : -1;
      const signoFuente = movFuente === "acerca" ? -1 : 1;
      frecuenciaPercibida = f * (v + signoOyente * vo) / (v + signoFuente * vs);
    }

   // === Mostrar cálculo paso a paso ===
let formula = "", sustitucion = "";

if (tipo === "oyente") {
  const signo = movOyente === "acerca" ? "+" : "-";
  formula = `f' = f × (v ${signo} vo) / v`;
  sustitucion = `f' = ${f} × (${v} ${signo} ${vo}) / ${v}`;
} else if (tipo === "fuente") {
  const signo = movFuente === "acerca" ? "-" : "+";
  formula = `f' = f × v / (v ${signo} vs)`;
  sustitucion = `f' = ${f} × ${v} / (${v} ${signo} ${vs})`;
} else if (tipo === "ambos") {
  const signoOyente = movOyente === "acerca" ? "+" : "-";
  const signoFuente = movFuente === "acerca" ? "-" : "+";
  formula = `f' = f × (v ${signoOyente} vo) / (v ${signoFuente} vs)`;
  sustitucion = `f' = ${f} × (${v} ${signoOyente} ${vo}) / (${v} ${signoFuente} ${vs})`;
}

resultado.innerHTML = `
  <div class="paso">
    <h3>Paso 1: Datos ingresados</h3>
    <p>Frecuencia fuente: ${f} Hz</p>
    <p>Velocidad del sonido: ${v} m/s</p>
    ${tipo === "oyente" || tipo === "ambos" ? `
      <p>Velocidad del oyente: ${vo} m/s</p>
      <p>Movimiento del oyente: ${movOyente === "acerca" ? "Se acerca" : "Se aleja"}</p>
    ` : ""}
    ${tipo === "fuente" || tipo === "ambos" ? `
      <p>Velocidad de la fuente: ${vs} m/s</p>
      <p>Movimiento de la fuente: ${movFuente === "acerca" ? "Se acerca" : "Se aleja"}</p>
    ` : ""}
  </div>

  <div class="paso">
    <h3>Paso 2: Cálculo de frecuencia percibida</h3>
    ${
      tipo === "oyente" ? `
        <p>f' = f × (v ± vo) / v</p>
        <p>f' = ${f} × (${v} ${movOyente === "acerca" ? "+" : "-"} ${vo}) / ${v}</p>
      ` : tipo === "fuente" ? `
        <p>f' = f × v / (v ± vs)</p>
        <p>f' = ${f} × ${v} / (${v} ${movFuente === "acerca" ? "-" : "+"} ${vs})</p>
      ` : `
        <p>f' = f × (v ± vo) / (v ± vs)</p>
        <p>f' = ${f} × (${v} ${movOyente === "acerca" ? "+" : "-"} ${vo}) / (${v} ${movFuente === "acerca" ? "-" : "+"} ${vs})</p>
      `
    }
  </div>

  <div class="paso">
    <h3>Paso 3: Resultado numérico</h3>
    <p>Frecuencia percibida: <strong>${frecuenciaPercibida.toFixed(2)} Hz</strong></p>
  </div>

  <div id="resultado-final">
    <strong>Resultado final:</strong><br>
    f' = ${frecuenciaPercibida.toFixed(2)} Hz
  </div>
`;

    mostrarGrafica(f, frecuenciaPercibida);
  });

  // === GRAFICA CON CHART.JS ===
  function mostrarGrafica(fOriginal, fPercibida) {
    const ctx = document.getElementById("graficoDoppler").getContext("2d");

    if (chart) chart.destroy();

    const tiempo = Array.from({ length: 100 }, (_, i) => i / 100);

    function generarOnda(freq, offset = 0) {
      return tiempo.map(t => Math.sin(2 * Math.PI * freq * (t + offset)));
    }

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: tiempo,
        datasets: [
          {
            label: "Onda original",
            data: generarOnda(fOriginal),
            borderColor: "#007bff",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Onda percibida",
            data: generarOnda(fPercibida),
            borderColor: "#28a745",
            borderWidth: 2,
            fill: false,
          }
        ]
      },
      options: {
        animation: false,
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getColorTexto()
            }
          }
        },
        scales: {
          x: {
            ticks: { color: getColorTexto() },
            title: { display: true, text: "Tiempo", color: getColorTexto() }
          },
          y: {
            ticks: { color: getColorTexto() },
            title: { display: true, text: "Amplitud", color: getColorTexto() },
            min: -1,
            max: 1
          }
        }
      }
    });

    // Animar desplazamiento
    function animar() {
      if (!chart) return;
      animOffset += 0.01;
      chart.data.datasets[0].data = tiempo.map(t => Math.sin(2 * Math.PI * fOriginal * (t + animOffset)));
      chart.data.datasets[1].data = tiempo.map(t => Math.sin(2 * Math.PI * fPercibida * (t + animOffset)));
      chart.update();
      requestAnimationFrame(animar);
    }

    animar();
  }

  function getColorTexto() {
    return document.body.classList.contains("oscuro") ? "#fff" : "#000";
  }

  function actualizarColoresGrafico() {
    if (!chart) return;
    const colorTexto = getColorTexto();
    chart.options.plugins.legend.labels.color = colorTexto;
    chart.options.scales.x.ticks.color = colorTexto;
    chart.options.scales.x.title.color = colorTexto;
    chart.options.scales.y.ticks.color = colorTexto;
    chart.options.scales.y.title.color = colorTexto;
    chart.update();
  }
});
