// Helper Functions
function createInputTable(containerId, rowCount, withHeader = true) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const table = document.createElement("table");
  table.classList.add("matrix-table");

  if (withHeader) {
    const header = document.createElement("tr");
    ["Row", "Column", "Value"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      header.appendChild(th);
    });
    table.appendChild(header);
  }

  for (let i = 0; i < rowCount; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.classList.add("matrix-input");
      input.value = 0;
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
}

function readMatrixFromTable(tableSelector) {
  const table = document.querySelector(tableSelector);
  const matrix = [];
  if (!table || table.rows.length < 2) return matrix;
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const r = parseInt(row.cells[0].firstChild.value);
    const c = parseInt(row.cells[1].firstChild.value);
    const v = parseFloat(row.cells[2].firstChild.value);
    if (!isNaN(r) && !isNaN(c) && !isNaN(v) && v !== 0) {
      matrix.push([r, c, v]);
    }
  }
  return matrix;
}

function renderResultTable(tableId, matrix, headerLabels = ["Row", "Column", "Value"]) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";
  if (matrix.length === 0) {
    table.innerHTML = "<tr><td>No data found.</td></tr>";
    return;
  }
  const header = table.insertRow();
  headerLabels.forEach(label => {
    const th = document.createElement("th");
    th.textContent = label;
    header.appendChild(th);
  });
  matrix.forEach(row => {
    const tr = table.insertRow();
    row.forEach(val => {
      const td = tr.insertCell();
      td.textContent = val;
    });
  });
}

function showProject(id) {
  document.querySelectorAll('.project-section').forEach(section => section.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// Project 1
const Project1 = {
  generateDenseMatrixInput: function () {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const container = document.getElementById("matrixContainer");
    container.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("matrix-table");
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.classList.add("matrix-input");
        input.value = 0;
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    container.appendChild(table);
  },
  convertToSparse: function () {
    const table = document.querySelector("#matrixContainer table");
    const sparse = [];
    if (!table) return;
    const rows = table.rows.length;
    const cols = table.rows[0].cells.length;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const value = parseFloat(table.rows[i].cells[j].firstChild.value);
        if (value !== 0) sparse.push([i, j, value]);
      }
    }
    renderResultTable("sparseOutputTable", sparse);
  }
};

// Project 2
const Project2 = {
  generateInput: function () {
    const n = parseInt(document.getElementById("sparseRows").value);
    createInputTable("sparseInputContainer", n);
  },
  transposeMatrix: function () {
    const matrix = readMatrixFromTable("#sparseInputContainer table");
    const transposed = matrix.map(([r, c, v]) => [c, r, v]);
    transposed.sort((a, b) => a[0] - b[0]);
    renderResultTable("transposedSparseTable", transposed);
  }
};

// Project 3
const Project3 = {
  generateMatrixA: function () {
    const n = parseInt(document.getElementById("rowsA").value);
    createInputTable("matrixAContainer", n);
  },
  generateMatrixB: function () {
    const n = parseInt(document.getElementById("rowsB").value);
    createInputTable("matrixBContainer", n);
  },
  addMatrices: function () {
    const A = readMatrixFromTable("#matrixAContainer table");
    const B = readMatrixFromTable("#matrixBContainer table");
    const map = new Map();
    [...A, ...B].forEach(([r, c, v]) => {
      const key = `${r},${c}`;
      map.set(key, (map.get(key) || 0) + v);
    });
    const result = Array.from(map.entries())
      .map(([key, v]) => [...key.split(',').map(Number), v])
      .filter(([_, __, val]) => val !== 0)
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    renderResultTable("resultMatrixTable", result);
  }
};
