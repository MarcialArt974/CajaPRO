// app.js

// =========================
// SUPABASE
// =========================

const SUPABASE_URL =
  "https://sbwgirntoljbyuvswlmf.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_woa_hPslMEH9HszPgNe3sA_0L6fAYpy";

const supabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
let data = JSON.parse(
  localStorage.getItem("data")
) || {

  productos: [],
  ventas: []
};

let editandoId = null;

init();

/* =========================
   🚀 INIT
========================= */

function init() {

  render();
}

/* =========================
   🔻 TABS
========================= */

function cambiarTab(tab) {

  document
    .querySelectorAll(".pantalla")
    .forEach(p =>
      p.classList.remove("activa")
    );

  document
    .getElementById(tab)
    .classList.add("activa");
}

/* =========================
   ✨ MODAL
========================= */

function abrirModalNuevo() {

  editandoId = null;

  limpiarModal();

  document
    .getElementById("modal")
    .classList.add("show");
}

function abrirModalEditar(id) {

  editandoId = id;

  const p =
    data.productos.find(
      x => x.id === id
    );

  if (!p) return;

  document.getElementById(
    "mNombre"
  ).value = p.nombre;

  document.getElementById(
    "mCategoria"
  ).value = p.categoria;

  document.getElementById(
    "mPrecio"
  ).value = p.precio;

  document.getElementById(
    "mCosto"
  ).value = p.costo;

  document.getElementById(
    "mStock"
  ).value = p.stock;

  document
    .getElementById("modal")
    .classList.add("show");
}

function cerrarModal() {

  document
    .getElementById("modal")
    .classList.remove("show");
}

function limpiarModal() {

  [
    "mNombre",
    "mCategoria",
    "mPrecio",
    "mCosto",
    "mStock",
    "mAgregarStock"
  ].forEach(id => {

    document.getElementById(id)
      .value = "";
  });
}

/* =========================
   💾 PRODUCTO
========================= */

function guardarProductoModal() {

  const nombre =
    document.getElementById(
      "mNombre"
    ).value.trim();

  const categoria =
    document.getElementById(
      "mCategoria"
    ).value.trim();

  const precio =
    parseFloat(
      document.getElementById(
        "mPrecio"
      ).value
    );

  const costo =
    parseFloat(
      document.getElementById(
        "mCosto"
      ).value
    );

  const stock =
    parseInt(
      document.getElementById(
        "mStock"
      ).value
    );

  const agregar =
    parseInt(
      document.getElementById(
        "mAgregarStock"
      ).value
    ) || 0;

  if (!nombre) {

    return mensaje(
      "Nombre requerido"
    );
  }

  if (
    isNaN(precio) ||
    isNaN(costo) ||
    isNaN(stock)
  ) {

    return mensaje(
      "Completa todos los datos"
    );
  }

  if (editandoId) {

    const p =
      data.productos.find(
        x => x.id === editandoId
      );

    if (!p) return;

    p.nombre = nombre;
    p.categoria = categoria;
    p.precio = precio;
    p.costo = costo;
    p.stock = stock + agregar;
  }

  else {

    data.productos.push({

      id: Date.now(),

      nombre,
      categoria,
      precio,
      costo,
      stock,

      vendidos: 0
    });
  }

  guardar();

  cerrarModal();

  render();

  mensaje("Producto guardado");
}

/* =========================
   🛒 VENDER
========================= */

function venderProducto(id) {

  const p =
    data.productos.find(
      x => x.id === id
    );

  if (!p) return;

  if (p.stock <= 0) {

    return mensaje(
      "Sin stock"
    );
  }

  const metodo =
    document.getElementById(
      "metodo"
    ).value;

  const ganancia =
    p.precio - p.costo;

  data.ventas.push({

    id: Date.now(),

    producto: p.nombre,

    monto: p.precio,

    ganancia,

    metodo,

    fecha:
      new Date()
      .toLocaleString(),

    anulada: false
  });

  p.stock--;
  p.vendidos++;

  guardar();

  render();

  mensaje(
    "Venta registrada"
  );
}

/* =========================
   ⚡ VENTA RÁPIDA
========================= */

function ventaRapida(monto) {

  const metodo =
    document.getElementById(
      "metodo"
    ).value;

  data.ventas.push({

    id: Date.now(),

    producto:
      "Venta rápida",

    monto,

    ganancia: monto,

    metodo,

    fecha:
      new Date()
      .toLocaleString(),

    anulada: false
  });

  guardar();

  render();

  mensaje(
    "Venta rápida registrada"
  );
}

/* =========================
   🗑 ELIMINAR PRODUCTO
========================= */

function eliminarProducto(id) {

  const ok = confirm(
    "¿Eliminar producto?"
  );

  if (!ok) return;

  data.productos =
    data.productos.filter(
      p => p.id !== id
    );

  guardar();

  render();

  mensaje(
    "Producto eliminado"
  );
}

/* =========================
   ↩️ ANULAR VENTA
========================= */

function anularVenta(id) {

  const venta =
    data.ventas.find(
      v => v.id === id
    );

  if (!venta) return;

  venta.anulada = true;

  guardar();

  render();

  mensaje(
    "Venta anulada"
  );
}

/* =========================
   🔄 REINICIAR CAJA
========================= */

function reiniciarCaja() {

  const ok = confirm(
    "¿Reiniciar caja?"
  );

  if (!ok) return;

  data.ventas = [];

  guardar();

  render();

  mensaje(
    "Caja reiniciada"
  );
}

/* =========================
   📄 EXPORTAR PDF
========================= */

async function exportar() {

  const { jsPDF } =
    window.jspdf;

  const doc =
    new jsPDF();

  let y = 20;

  // HEADER

  doc.setFillColor(
    39,
    174,
    96
  );

  doc.rect(
    0,
    0,
    220,
    35,
    "F"
  );

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFontSize(22);

  doc.text(
    "CajaPRO",
    14,
    18
  );

  doc.setFontSize(11);

  doc.text(
    "Reporte de ventas",
    14,
    27
  );

  // FECHA

  doc.setTextColor(
    80,
    80,
    80
  );

  y = 48;

  const fecha =
    new Date()
    .toLocaleString();

  doc.text(
    `Fecha: ${fecha}`,
    14,
    y
  );

  // TOTALES

  y += 18;

  let ventasTotal = 0;
  let gananciasTotal = 0;

  data.ventas.forEach(v => {

    if (!v.anulada) {

      ventasTotal +=
        v.monto;

      gananciasTotal +=
        v.ganancia;
    }
  });

  doc.setFillColor(
    245,
    245,
    245
  );

  doc.roundedRect(
    14,
    y,
    180,
    28,
    4,
    4,
    "F"
  );

  doc.setTextColor(
    40,
    40,
    40
  );

  doc.setFontSize(12);

  doc.text(
    `Ventas Totales: S/ ${ventasTotal}`,
    20,
    y + 10
  );

  doc.text(
    `Ganancia Total: S/ ${gananciasTotal}`,
    20,
    y + 20
  );

  // TABLA

  y += 45;

  doc.setFontSize(14);

  doc.setTextColor(
    39,
    174,
    96
  );

  doc.text(
    "Historial de ventas",
    14,
    y
  );

  y += 10;

  doc.setFillColor(
    39,
    174,
    96
  );

  doc.rect(
    14,
    y,
    180,
    10,
    "F"
  );

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFontSize(10);

  doc.text(
    "Producto",
    18,
    y + 7
  );

  doc.text(
    "Monto",
    90,
    y + 7
  );

  doc.text(
    "Pago",
    125,
    y + 7
  );

  doc.text(
    "Estado",
    160,
    y + 7
  );

  y += 15;

  data.ventas.forEach(v => {

    if (y > 270) {

      doc.addPage();

      y = 20;
    }

    doc.setTextColor(
      40,
      40,
      40
    );

    doc.text(
      String(v.producto),
      18,
      y
    );

    doc.text(
      `S/ ${v.monto}`,
      90,
      y
    );

    doc.text(
      String(v.metodo),
      125,
      y
    );

    doc.text(
      v.anulada
        ? "ANULADA"
        : "OK",
      160,
      y
    );

    y += 10;
  });

  y += 15;

  doc.setFontSize(10);

  doc.setTextColor(
    120,
    120,
    120
  );

  doc.text(
    "Generado automáticamente por CajaPRO",
    14,
    y
  );

  doc.save(
    "Reporte-CajaPRO.pdf"
  );

  mensaje(
    "PDF descargado"
  );
}

/* =========================
   📊 RENDER
========================= */

function render() {

  renderResumen();

  renderProductos();

  renderHistorial();

  renderDashboard();

  renderTopProducto();
}

/* =========================
   📈 RESUMEN
========================= */

function renderResumen() {

  let total = 0;
  let ganancia = 0;

  data.ventas.forEach(v => {

    if (!v.anulada) {

      total += v.monto;

      ganancia +=
        v.ganancia;
    }
  });

  const transacciones =
    data.ventas.filter(
      v => !v.anulada
    ).length;

  document.getElementById(
    "ventas"
  ).innerText =
    "S/ " + total;

  document.getElementById(
    "ganancia"
  ).innerText =
    "S/ " + ganancia;

  document.getElementById(
    "transacciones"
  ).innerText =
    transacciones;

  // ESTADO

  let estado = "";

  if (total === 0) {

    estado =
      "🟢 Empecemos el día";
  }

  else if (total < 50) {

    estado =
      "😴 Día tranquilo";
  }

  else if (total < 150) {

    estado =
      "🙂 Día normal";
  }

  else if (total < 300) {

    estado =
      "🔥 Buen día";
  }

  else {

    estado =
      "🚀 Excelente día";
  }

  document.getElementById(
    "estado"
  ).innerText = estado;
}

/* =========================
   🔥 TOP PRODUCTO
========================= */

function renderTopProducto() {

  if (
    !data.productos.length
  ) {

    document.getElementById(
      "topProducto"
    ).innerText =
      "Agrega productos";

    return;
  }

  let top =
    [...data.productos]
    .sort(
      (a,b) =>
        b.vendidos -
        a.vendidos
    )[0];

  document.getElementById(
    "topProducto"
  ).innerText =
    `🔥 Más vendido: ${top.nombre}`;
}

/* =========================
   📦 PRODUCTOS
========================= */

function renderProductos() {

  const cont =
    document.getElementById(
      "productos"
    );

  cont.innerHTML = "";

  data.productos.forEach(p => {

    cont.innerHTML += `

      <div class="producto">

        <div class="producto-top">

          <b>
            ${p.nombre}
          </b>

          <div class="badge">
            ${p.stock} stock
          </div>

        </div>

        🏷 ${p.categoria}<br>
        💰 Precio: S/${p.precio}<br>
        📈 Ganancia: S/${p.precio - p.costo}<br>
        🔥 Vendidos: ${p.vendidos}

        <div class="producto-buttons">

          <button
            onclick="venderProducto(${p.id})"
          >
            Vender
          </button>

          <button
            onclick="abrirModalEditar(${p.id})"
          >
            Editar
          </button>

          <button
            onclick="eliminarProducto(${p.id})"
          >
            Eliminar
          </button>

        </div>

      </div>

    `;
  });
}

/* =========================
   📜 HISTORIAL
========================= */

function renderHistorial() {

  const cont =
    document.getElementById(
      "historial"
    );

  cont.innerHTML = "";

  data.ventas
    .slice()
    .reverse()
    .forEach(v => {

      cont.innerHTML += `

        <div class="historial-item">

          <div class="historial-top">

            <b>
              ${v.producto}
            </b>

            <span>
              S/${v.monto}
            </span>

          </div>

          <div class="historial-info">

            ${v.metodo}
            • ${v.fecha}

          </div>

          ${
            v.anulada

            ? `
              <div class="anulada">
                ANULADA
              </div>
            `

            : `
              <button
                class="btn-eliminar"
                onclick="anularVenta(${v.id})"
              >
                Anular venta
              </button>
            `
          }

        </div>

      `;
    });
}

/* =========================
   📊 DASHBOARD
========================= */

function renderDashboard() {

  let efectivo = 0;
  let yape = 0;
  let plin = 0;

  let stockBajo = [];

  data.ventas.forEach(v => {

    if (v.anulada) return;

    if (
      v.metodo ===
      "efectivo"
    ) {
      efectivo += v.monto;
    }

    if (
      v.metodo ===
      "yape"
    ) {
      yape += v.monto;
    }

    if (
      v.metodo ===
      "plin"
    ) {
      plin += v.monto;
    }
  });

  data.productos.forEach(p => {

    if (p.stock <= 2) {

      stockBajo.push(
        p.nombre
      );
    }
  });

  const total =
    efectivo + yape + plin || 1;

  document.getElementById(
    "dashboardPro"
  ).innerHTML = `

    <div class="dashboard-card">

      <h3>
        📊 Métodos de pago
      </h3>

      <div class="stats-grid">

        <div class="stat-box">

          <small>
            Productos
          </small>

          <b>
            ${data.productos.length}
          </b>

        </div>

        <div class="stat-box">

          <small>
            Ventas
          </small>

          <b>
            ${
              data.ventas.filter(
                v => !v.anulada
              ).length
            }
          </b>

        </div>

      </div>

      ${barra(
        "💵 Efectivo",
        efectivo,
        total,
        "efectivo"
      )}

      ${barra(
        "📱 Yape",
        yape,
        total,
        "yape"
      )}

      ${barra(
        "📲 Plin",
        plin,
        total,
        "plin"
      )}

    </div>

    <div class="
      dashboard-card
      alerta-card
    ">

      <h3>
        ⚠️ Stock bajo
      </h3>

      ${
        stockBajo.length

        ? stockBajo
            .map(p => `
              <div class="stock-bajo">
                📦 ${p}
              </div>
            `)
            .join("")

        : "Todo bien ✅"
      }

    </div>
  `;
}

/* =========================
   📊 BARRAS
========================= */

function barra(
  nombre,
  valor,
  total,
  clase
) {

  return `

    <div class="barra-container">

      <div class="barra-label">

        <span>
          ${nombre}
        </span>

        <span>
          S/${valor}
        </span>

      </div>

      <div class="barra">

        <div
          class="barra-fill ${clase}"
          style="
            width:${(valor / total) * 100}%
          "
        ></div>

      </div>

    </div>

  `;
}

/* =========================
   🧠 UTILIDADES
========================= */

function guardar() {

  localStorage.setItem(
    "data",
    JSON.stringify(data)
  );
}

function mensaje(txt) {

  const el =
    document.getElementById(
      "mensaje"
    );

  el.innerText = txt;

  el.classList.add("show");

  setTimeout(() => {

    el.classList.remove(
      "show"
    );

  }, 1600);
}
