// app.js

// ===============================
// 💾 DATA
// ===============================

let data = JSON.parse(
  localStorage.getItem("data")
) || {

  productos: [],

  ventas: []
};

// ===============================
// 🚀 INICIO
// ===============================

init();

function init() {

  render();
}

// ===============================
// 📦 AGREGAR PRODUCTO
// ===============================

function agregarProducto() {

  const nombre =
    document.getElementById("nombre")
      .value
      .trim();

  const precio =
    parseFloat(
      document.getElementById("precio").value
    );

  const costo =
    parseFloat(
      document.getElementById("costo").value
    );

  const stock =
    parseInt(
      document.getElementById("stock").value
    );

  if (!nombre) {
    return mensaje("Escribe un nombre");
  }

  if (
    isNaN(precio) ||
    isNaN(costo) ||
    isNaN(stock)
  ) {
    return mensaje("Completa todo");
  }

  data.productos.push({

    id: Date.now(),

    nombre,

    precio,

    costo,

    stock,

    vendidos: 0
  });

  guardar();

  limpiarInputs();

  render();

  mensaje("Producto agregado");
}

// ===============================
// 🛒 VENDER
// ===============================

function venderProducto(id) {

  const p =
    data.productos.find(
      x => x.id === id
    );

  if (!p) return;

  if (p.stock <= 0) {
    return mensaje("Sin stock");
  }

  const metodo =
    document.getElementById("metodo")
      .value;

  const ganancia =
    p.precio - p.costo;

  data.ventas.push({

    id: Date.now(),

    producto: p.nombre,

    monto: p.precio,

    ganancia,

    metodo,

    fecha:
      new Date().toLocaleTimeString()
  });

  p.stock--;

  p.vendidos++;

  guardar();

  render();

  vibrar();

  mensaje("Venta registrada");
}

// ===============================
// ⚡ VENTA RÁPIDA
// ===============================

function ventaRapida(monto) {

  const metodo =
    document.getElementById("metodo")
      .value;

  data.ventas.push({

    id: Date.now(),

    producto: "Venta rápida",

    monto,

    ganancia: monto,

    metodo,

    fecha:
      new Date().toLocaleTimeString()
  });

  guardar();

  render();

  vibrar();

  mensaje("Venta agregada");
}

// ===============================
// ✏️ EDITAR
// ===============================

function editarProducto(id) {

  const p =
    data.productos.find(
      x => x.id === id
    );

  if (!p) return;

  const nombre =
    prompt(
      "Nombre",
      p.nombre
    );

  if (!nombre) return;

  const precio =
    parseFloat(
      prompt(
        "Precio",
        p.precio
      )
    );

  const costo =
    parseFloat(
      prompt(
        "Costo",
        p.costo
      )
    );

  const stock =
    parseInt(
      prompt(
        "Stock",
        p.stock
      )
    );

  p.nombre = nombre;
  p.precio = precio;
  p.costo = costo;
  p.stock = stock;

  guardar();

  render();

  mensaje("Producto actualizado");
}

// ===============================
// 🗑 ELIMINAR
// ===============================

function eliminarProducto(id) {

  const ok =
    confirm(
      "¿Eliminar producto?"
    );

  if (!ok) return;

  data.productos =
    data.productos.filter(
      p => p.id !== id
    );

  guardar();

  render();

  mensaje("Producto eliminado");
}

// ===============================
// 📊 RENDER
// ===============================

function render() {

  renderResumen();

  renderProductos();

  renderHistorial();

  renderDashboard();
}

// ===============================
// 📊 RESUMEN
// ===============================

function renderResumen() {

  let total = 0;

  let ganancia = 0;

  data.ventas.forEach(v => {

    total += v.monto;

    ganancia += v.ganancia;
  });

  document.getElementById("ventas")
    .innerText =
      "S/ " + total;

  document.getElementById("ganancia")
    .innerText =
      "S/ " + ganancia;

  document.getElementById("transacciones")
    .innerText =
      data.ventas.length;

  const estado =
    document.getElementById("estado");

  if (ganancia > 200) {
    estado.innerText =
      "Excelente día 🚀";
  }

  else if (ganancia > 50) {
    estado.innerText =
      "Buen día 🟢";
  }

  else {
    estado.innerText =
      "Día tranquilo 🟡";
  }
}

// ===============================
// 📦 PRODUCTOS
// ===============================

function renderProductos() {

  const cont =
    document.getElementById("productos");

  cont.innerHTML = "";

  data.productos.forEach(p => {

    cont.innerHTML += `

      <div class="producto">

        <div class="producto-top">

          <b>${p.nombre}</b>

          <div class="badge">
            ${p.stock} stock
          </div>

        </div>

        💰 Precio:
        S/${p.precio}<br>

        📈 Ganancia:
        S/${p.precio - p.costo}<br>

        🔥 Vendidos:
        ${p.vendidos}

        <div class="producto-buttons">

          <button onclick="venderProducto(${p.id})">
            Vender
          </button>

          <button onclick="editarProducto(${p.id})">
            Editar
          </button>

          <button onclick="eliminarProducto(${p.id})">
            Eliminar
          </button>

        </div>

      </div>

    `;
  });
}

// ===============================
// 📜 HISTORIAL
// ===============================

function renderHistorial() {

  const cont =
    document.getElementById("historial");

  cont.innerHTML = "";

  data.ventas
    .slice()
    .reverse()
    .forEach(v => {

      cont.innerHTML += `

        <div class="historial-item">

          <div class="historial-top">

            <b>${v.producto}</b>

            <span>
              S/${v.monto}
            </span>

          </div>

          ${v.metodo}
          • ${v.fecha}

        </div>

      `;
    });
}

// ===============================
// 📊 DASHBOARD
// ===============================

function renderDashboard() {

  let efectivo = 0;
  let yape = 0;
  let plin = 0;

  let stockBajo = [];

  data.ventas.forEach(v => {

    if (v.metodo === "efectivo") {
      efectivo += v.monto;
    }

    else if (v.metodo === "yape") {
      yape += v.monto;
    }

    else if (v.metodo === "plin") {
      plin += v.monto;
    }
  });

  data.productos.forEach(p => {

    if (p.stock <= 2) {
      stockBajo.push(p.nombre);
    }
  });

  const total =
    efectivo + yape + plin || 1;

  const dashboard =
    document.getElementById(
      "dashboardPro"
    );

  dashboard.innerHTML = `

    <div class="dashboard-card">

      <h3>
        📊 Métodos de pago
      </h3>

      <div class="barra-container">

        <div class="barra-label">

          <span>💵 Efectivo</span>

          <span>S/${efectivo}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill efectivo"
            style="
              width:${(efectivo / total) * 100}%
            "
          ></div>

        </div>

      </div>

      <div class="barra-container">

        <div class="barra-label">

          <span>📱 Yape</span>

          <span>S/${yape}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill yape"
            style="
              width:${(yape / total) * 100}%
            "
          ></div>

        </div>

      </div>

      <div class="barra-container">

        <div class="barra-label">

          <span>📲 Plin</span>

          <span>S/${plin}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill plin"
            style="
              width:${(plin / total) * 100}%
            "
          ></div>

        </div>

      </div>

    </div>

    <div class="
      dashboard-card
      alerta-card
    ">

      <h3>
        ⚠️ Alertas
      </h3>

      ${
        stockBajo.length > 0

        ? stockBajo
            .map(p => `
              <div class="stock-bajo">
                📦 ${p} con poco stock
              </div>
            `)
            .join("")

        : "Todo bien ✅"
      }

    </div>

  `;
}

// ===============================
// 📄 EXPORTAR
// ===============================

function exportar() {

  let texto =
`RESUMEN\n\n`;

  data.ventas.forEach(v => {

    texto +=
`${v.producto}
S/${v.monto}
${v.metodo}

`;
  });

  const blob =
    new Blob(
      [texto],
      { type: "text/plain" }
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "resumen.txt";

  link.click();
}

// ===============================
// 💾 GUARDAR
// ===============================

function guardar() {

  localStorage.setItem(
    "data",
    JSON.stringify(data)
  );
}

// ===============================
// 📳 VIBRAR
// ===============================

function vibrar() {

  if (navigator.vibrate) {

    navigator.vibrate(50);
  }
}

// ===============================
// 🧹 LIMPIAR
// ===============================

function limpiarInputs() {

  document.getElementById("nombre")
    .value = "";

  document.getElementById("precio")
    .value = "";

  document.getElementById("costo")
    .value = "";

  document.getElementById("stock")
    .value = "";
}

// ===============================
// 🔔 MENSAJES
// ===============================

function mensaje(txt) {

  const el =
    document.getElementById("mensaje");

  el.innerText = txt;

  el.classList.add("show");

  setTimeout(() => {

    el.classList.remove("show");

  }, 1500);
}
