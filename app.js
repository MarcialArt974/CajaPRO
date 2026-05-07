// app.js

let data = JSON.parse(
  localStorage.getItem("data")
) || {

  productos: [],
  ventas: []
};

let editandoId = null;

init();

/* =========================
   🚀 INICIO
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

  document.getElementById(
    "modalTitulo"
  ).innerText =
    "Nuevo producto";

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
    "modalTitulo"
  ).innerText =
    "Editar producto";

  document.getElementById(
    "mNombre"
  ).value = p.nombre;

  document.getElementById(
    "mCategoria"
  ).value =
    p.categoria || "";

  document.getElementById(
    "mPrecio"
  ).value = p.precio;

  document.getElementById(
    "mCosto"
  ).value = p.costo;

  document.getElementById(
    "mStock"
  ).value = p.stock;

  document.getElementById(
    "mAgregarStock"
  ).value = "";

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
   💾 GUARDAR PRODUCTO
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

  const agregarStock =
    parseInt(
      document.getElementById(
        "mAgregarStock"
      ).value
    ) || 0;

  if (!nombre) {
    return mensaje("Escribe nombre");
  }

  if (isNaN(precio)) {
    return mensaje("Precio inválido");
  }

  if (editandoId) {

    const p =
      data.productos.find(
        x => x.id === editandoId
      );

    p.nombre = nombre;
    p.categoria = categoria;
    p.precio = precio;
    p.costo = costo;
    p.stock =
      stock + agregarStock;

    mensaje("Producto actualizado");
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

    mensaje("Producto agregado");
  }

  guardar();

  cerrarModal();

  render();
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
    return mensaje("Sin stock");
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
      new Date().toLocaleTimeString(),

    anulada: false
  });

  p.stock--;
  p.vendidos++;

  guardar();

  render();

  vibrar();

  mensaje("Venta registrada");
}

/* =========================
   ⚡ VENTA RAPIDA
========================= */

function ventaRapida(monto) {

  const metodo =
    document.getElementById(
      "metodo"
    ).value;

  data.ventas.push({

    id: Date.now(),

    producto: "Venta rápida",

    monto,

    ganancia: monto,

    metodo,

    fecha:
      new Date().toLocaleTimeString(),

    anulada: false
  });

  guardar();

  render();

  mensaje("Venta agregada");
}

/* =========================
   🗑 ELIMINAR PRODUCTO
========================= */

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

/* =========================
   ↩️ ANULAR
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

  mensaje("Venta anulada");
}

/* =========================
   🔄 REINICIAR
========================= */

function reiniciarCaja() {

  const ok =
    confirm(
      "¿Reiniciar caja?\n\nSe eliminarán las ventas actuales."
    );

  if (!ok) return;

  data.ventas = [];

  guardar();

  render();

  mensaje("Caja reiniciada");
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

      ganancia += v.ganancia;
    }
  });

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
    data.ventas.filter(
      v => !v.anulada
    ).length;

  const estado =
    document.getElementById(
      "estado"
    );

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

/* =========================
   🔥 TOP
========================= */

function renderTopProducto() {

  if (!data.productos.length) {

    document.getElementById(
      "topProducto"
    ).innerText =
      "Agrega productos para empezar";

    return;
  }

  let top =
    [...data.productos]
      .sort(
        (a,b) =>
          b.vendidos - a.vendidos
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

        🏷 ${p.categoria || "General"}<br>
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

      ${crearBarra(
        "💵 Efectivo",
        efectivo,
        total,
        "efectivo"
      )}

      ${crearBarra(
        "📱 Yape",
        yape,
        total,
        "yape"
      )}

      ${crearBarra(
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

function crearBarra(
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
   📄 EXPORTAR
========================= */

function exportar() {

  let texto =
`RESUMEN DEL DÍA\n\n`;

  data.ventas.forEach(v => {

    texto += `
${v.producto}
S/${v.monto}
${v.metodo}
${v.anulada ? "ANULADA" : ""}
----------------
`;
  });

  const blob =
    new Blob(
      [texto],
      {
        type: "text/plain"
      }
    );

  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "resumen.txt";

  link.click();
}

/* =========================
   🧠 UTIL
========================= */

function guardar() {

  localStorage.setItem(
    "data",
    JSON.stringify(data)
  );
}

function vibrar() {

  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function mensaje(txt) {

  const el =
    document.getElementById(
      "mensaje"
    );

  el.innerText = txt;

  el.classList.add("show");

  setTimeout(() => {

    el.classList.remove("show");

  }, 1500);
}
