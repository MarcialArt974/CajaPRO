// ===============================
// 💾 BASE DE DATOS LOCAL
// ===============================

let data = JSON.parse(localStorage.getItem("data")) || {
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
// 🔻 CAMBIAR PANTALLAS
// ===============================

function cambiarTab(tab) {

  document.querySelectorAll(".pantalla")
    .forEach(p =>
      p.classList.remove("activa")
    );

  document.getElementById(tab)
    .classList.add("activa");
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

  // VALIDACIONES

  if (!nombre) {
    return mensaje("Escribe un nombre");
  }

  if (
    isNaN(precio) ||
    isNaN(costo) ||
    isNaN(stock)
  ) {
    return mensaje(
      "Completa todos los campos"
    );
  }

  if (precio <= costo) {
    return mensaje(
      "El precio debe ser mayor al costo"
    );
  }

  // CREAR PRODUCTO

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
// 🛒 VENDER PRODUCTO
// ===============================

function venderProducto(id) {

  const producto =
    data.productos.find(
      p => p.id === id
    );

  if (!producto) return;

  // STOCK

  if (producto.stock <= 0) {
    return mensaje("Sin stock");
  }

  const metodo =
    document.getElementById("metodo")
      .value;

  const ganancia =
    producto.precio - producto.costo;

  // REGISTRAR VENTA

  data.ventas.push({

    id: Date.now(),

    producto: producto.nombre,

    monto: producto.precio,

    ganancia,

    metodo,

    fecha:
      new Date().toLocaleTimeString(),

    dia:
      new Date().toLocaleDateString()
  });

  // ACTUALIZAR PRODUCTO

  producto.stock--;

  producto.vendidos++;

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
      new Date().toLocaleTimeString(),

    dia:
      new Date().toLocaleDateString()
  });

  guardar();

  render();

  vibrar();

  mensaje(`+ S/${monto}`);
}

// ===============================
// ✏️ EDITAR PRODUCTO
// ===============================

function editarProducto(id) {

  const p =
    data.productos.find(
      x => x.id === id
    );

  if (!p) return;

  const nuevoNombre =
    prompt(
      "Nombre",
      p.nombre
    );

  if (!nuevoNombre) return;

  const nuevoPrecio =
    parseFloat(
      prompt(
        "Precio",
        p.precio
      )
    );

  const nuevoCosto =
    parseFloat(
      prompt(
        "Costo",
        p.costo
      )
    );

  const nuevoStock =
    parseInt(
      prompt(
        "Stock",
        p.stock
      )
    );

  if (
    isNaN(nuevoPrecio) ||
    isNaN(nuevoCosto) ||
    isNaN(nuevoStock)
  ) {
    return mensaje(
      "Datos inválidos"
    );
  }

  p.nombre = nuevoNombre;
  p.precio = nuevoPrecio;
  p.costo = nuevoCosto;
  p.stock = nuevoStock;

  guardar();

  render();

  mensaje("Producto actualizado");
}

// ===============================
// 🗑 ELIMINAR PRODUCTO
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
// 📊 RENDER GENERAL
// ===============================

function render() {

  renderResumen();

  renderProductos();

  renderHistorial();

  renderTop();

  renderDashboardPro();
}

// ===============================
// 📊 RESUMEN PRINCIPAL
// ===============================

function renderResumen() {

  let totalVentas = 0;

  let totalGanancia = 0;

  data.ventas.forEach(v => {

    totalVentas += v.monto;

    totalGanancia += v.ganancia;
  });

  document.getElementById("ventas")
    .innerText =
      "S/ " + totalVentas;

  document.getElementById("ganancia")
    .innerText =
      "S/ " + totalGanancia;

  document.getElementById("transacciones")
    .innerText =
      data.ventas.length;

  estadoDia(totalGanancia);
}

// ===============================
// 🧠 ESTADO DEL DÍA
// ===============================

function estadoDia(g) {

  const estado =
    document.getElementById("estado");

  if (g > 200) {

    estado.innerText =
      "Excelente día 🚀";
  }

  else if (g > 100) {

    estado.innerText =
      "Buen día 🟢";
  }

  else if (g > 50) {

    estado.innerText =
      "Normal 🟡";
  }

  else {

    estado.innerText =
      "Bajo 🔴";
  }
}

// ===============================
// 📦 PRODUCTOS
// ===============================

function renderProductos() {

  const cont =
    document.getElementById("productos");

  cont.innerHTML = "";

  data.productos
    .sort((a, b) =>
      b.vendidos - a.vendidos
    )
    .forEach(p => {

      const margen =
        (
          (p.precio - p.costo)
          / p.precio
        ) * 100;

      cont.innerHTML += `

        <div class="producto">

          <b>${p.nombre}</b><br><br>

          💰 Precio:
          S/${p.precio}<br>

          📈 Ganancia:
          S/${p.precio - p.costo}
          (${margen.toFixed(0)}%)<br>

          📦 Stock:
          ${p.stock}
          ${p.stock < 3 ? "⚠️ Bajo" : ""}<br>

          🔥 Vendidos:
          ${p.vendidos}<br><br>

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

      `;
    });
}

// ===============================
// 🔥 PRODUCTO TOP
// ===============================

function renderTop() {

  const el =
    document.getElementById("topProducto");

  if (
    data.productos.length === 0
  ) {

    el.innerText = "";

    return;
  }

  const top =
    [...data.productos]
      .sort((a, b) =>
        b.vendidos - a.vendidos
      )[0];

  if (top.vendidos === 0) {

    el.innerText =
      "Aún no hay ventas";

    return;
  }

  el.innerText =
    `🔥 Más vendido: ${top.nombre}`;
}

// ===============================
// 📜 HISTORIAL
// ===============================

function renderHistorial() {

  const cont =
    document.getElementById("historial");

  cont.innerHTML = "";

  data.ventas
    .slice(-20)
    .reverse()
    .forEach(v => {

      const producto =
        v.producto || "Venta";

      const monto =
        v.monto || 0;

      const metodo =
        v.metodo || "efectivo";

      const fecha =
        v.fecha || "--:--";

      cont.innerHTML += `

        <div>

          <b>${producto}</b><br>

          💵 S/${monto}
          • ${metodo}<br>

          <small>${fecha}</small>

        </div>

      `;
    });
}

// ===============================
// 📊 DASHBOARD PROFESIONAL
// ===============================

function renderDashboardPro() {

  let efectivo = 0;
  let yape = 0;
  let plin = 0;

  let ventasHoy = 0;

  let stockBajo = [];

  // 📊 RECORRER VENTAS

  data.ventas.forEach(v => {

    ventasHoy += v.monto;

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

  // 📦 STOCK BAJO

  data.productos.forEach(p => {

    if (p.stock <= 2) {
      stockBajo.push(p.nombre);
    }
  });

  // 📈 PORCENTAJES

  const total =
    efectivo + yape + plin || 1;

  const efPorcentaje =
    (efectivo / total) * 100;

  const yapePorcentaje =
    (yape / total) * 100;

  const plinPorcentaje =
    (plin / total) * 100;

  // 🔥 PRODUCTO TOP

  let top =
    [...data.productos]
      .sort((a, b) =>
        b.vendidos - a.vendidos
      )[0];

  // 🧱 RENDER

  const dashboard =
    document.getElementById(
      "dashboardPro"
    );

  dashboard.innerHTML = `

    <!-- 💰 CAJA -->

    <div class="dashboard-card">

      <h3>💰 Caja del día</h3>

      <div class="stats-grid">

        <div class="stat-box">

          <small>Total vendido</small><br>

          <b>S/${ventasHoy}</b>

        </div>

        <div class="stat-box">

          <small>Ventas</small><br>

          <b>${data.ventas.length}</b>

        </div>

      </div>

    </div>

    <!-- 📊 PAGOS -->

    <div class="dashboard-card">

      <h3>📊 Métodos de pago</h3>

      <!-- EFECTIVO -->

      <div class="barra-container">

        <div class="barra-label">

          <span>💵 Efectivo</span>

          <span>S/${efectivo}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill efectivo"
            style="width:${efPorcentaje}%"
          ></div>

        </div>

      </div>

      <!-- YAPE -->

      <div class="barra-container">

        <div class="barra-label">

          <span>📱 Yape</span>

          <span>S/${yape}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill yape"
            style="width:${yapePorcentaje}%"
          ></div>

        </div>

      </div>

      <!-- PLIN -->

      <div class="barra-container">

        <div class="barra-label">

          <span>📲 Plin</span>

          <span>S/${plin}</span>

        </div>

        <div class="barra">

          <div
            class="barra-fill plin"
            style="width:${plinPorcentaje}%"
          ></div>

        </div>

      </div>

    </div>

    <!-- 🔥 PRODUCTO TOP -->

    <div class="dashboard-card">

      <h3>🔥 Producto estrella</h3>

      <p>
        ${
          top
          ? top.nombre
          : "Sin ventas"
        }
      </p>

    </div>

    <!-- ⚠️ ALERTAS -->

    <div class="dashboard-card alerta-card">

      <h3>⚠️ Alertas</h3>

      ${
        stockBajo.length > 0

        ? stockBajo
            .map(p => `
              <div class="stock-bajo">
                📦 ${p} con poco stock
              </div>
            `)
            .join("")

        : "<p>Todo bien ✅</p>"
      }

    </div>

  `;
}

// ===============================
// 📄 EXPORTAR RESUMEN
// ===============================

function exportar() {

  let texto =
`RESUMEN DEL DÍA\n\n`;

  let total = 0;

  let ganancia = 0;

  data.ventas.forEach(v => {

    texto +=
`${v.producto}
- S/${v.monto}
(${v.metodo})\n`;

    total += v.monto;

    ganancia += v.ganancia;
  });

  texto +=
`\n----------------`;

  texto +=
`\nTOTAL: S/${total}`;

  texto +=
`\nGANANCIA: S/${ganancia}`;

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
// 🧹 LIMPIAR INPUTS
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

  setTimeout(() => {

    el.innerText = "";

  }, 1500);
}