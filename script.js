function showProject(id) {
  document.querySelectorAll('.project-section').forEach(section => {
    section.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
}

// Project 1 - Convert Matrix to Sparse
function generateMatrixTable() {
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
      input.value = "0";
      input.classList.add("matrix-input");
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.appendChild(table);
}

function convertToSparse() {
  const container = document.getElementById("matrixContainer");
  const table = container.querySelector("table");
  const sparseMatrix = [];

  if (!table) return;

  const rows = table.rows.length;
  const cols = table.rows[0].cells.length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const value = parseFloat(table.rows[i].cells[j].firstChild.value);
      if (value !== 0) {
        sparseMatrix.push([i, j, value]);
      }
    }
  }

  displaySparseMatrix(sparseMatrix);
}

function displaySparseMatrix(sparseMatrix) {
  const outputTable = document.getElementById("sparseOutputTable");
  outputTable.innerHTML = "";

  if (sparseMatrix.length === 0) {
    outputTable.innerHTML = "<tr><td>No non-zero elements found.</td></tr>";
    return;
  }

  const header = outputTable.insertRow();
  ["Row", "Column", "Value"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    header.appendChild(th);
  });

  sparseMatrix.forEach(([i, j, value]) => {
    const row = outputTable.insertRow();
    [i, j, value].forEach(item => {
      const cell = row.insertCell();
      cell.textContent = item;
    });
  });
}

// Project 2 - Transpose Sparse Matrix
function generateSparseInputTable() {
  const numRows = parseInt(document.getElementById("sparseRows").value);
  const container = document.getElementById("sparseInputContainer");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("matrix-table");

  const headerRow = document.createElement("tr");
  ["Row", "Column", "Value"].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = 0; i < numRows; i++) {
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

function transposeFromTable() {
  const table = document.querySelector("#sparseInputContainer table");
  const outputTable = document.getElementById("transposedSparseTable");
  outputTable.innerHTML = "";

  if (!table || table.rows.length < 2) return;

  const transposed = [];

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const r = parseInt(row.cells[0].firstChild.value);
    const c = parseInt(row.cells[1].firstChild.value);
    const v = parseFloat(row.cells[2].firstChild.value);

    if (!isNaN(r) && !isNaN(c) && !isNaN(v) && v !== 0) {
      transposed.push([c, r, v]);
    }
  }

  transposed.sort((a, b) => a[0] - b[0]);

  if (transposed.length === 0) {
    outputTable.innerHTML = "<tr><td>No valid non-zero entries to transpose.</td></tr>";
    return;
  }

  const headerRow = outputTable.insertRow();
  ["Row", "Column", "Value"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });

  transposed.forEach(([r, c, v]) => {
    const tr = outputTable.insertRow();
    [r, c, v].forEach(val => {
      const td = tr.insertCell();
      td.textContent = val;
    });
  });
}

// Project 3 - Add Two Sparse Matrices
function generateMatrixInput(matrixId) {
  const count = parseInt(document.getElementById(`rows${matrixId}`).value);
  const container = document.getElementById(`matrix${matrixId}Container`);
  container.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("matrix-table");

  const header = document.createElement("tr");
  ["Row", "Column", "Value"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });
  table.appendChild(header);

  for (let i = 0; i < count; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.value = 0;
      input.classList.add("matrix-input");
      td.appendChild(input);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  container.appendChild(table);
}

function readSparseMatrix(containerId) {
  const table = document.querySelector(`#${containerId} table`);
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

function addSparseMatrices() {
  const A = readSparseMatrix("matrixAContainer");
  const B = readSparseMatrix("matrixBContainer");

  const combined = [...A];

  for (const [r, c, v] of B) {
    const index = combined.findIndex(([ra, ca]) => ra === r && ca === c);
    if (index !== -1) {
      combined[index][2] += v;
    } else {
      combined.push([r, c, v]);
    }
  }

  const result = combined.filter(([_, __, value]) => value !== 0);
  result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  displayResultMatrix(result);
}

function displayResultMatrix(matrix) {
  const table = document.getElementById("resultMatrixTable");
  table.innerHTML = "";

  if (matrix.length === 0) {
    table.innerHTML = "<tr><td>No non-zero elements in the result.</td></tr>";
    return;
  }

  const header = table.insertRow();
  ["Row", "Column", "Value"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });

  for (const [r, c, v] of matrix) {
    const tr = table.insertRow();
    [r, c, v].forEach(val => {
      const td = tr.insertCell();
      td.textContent = val;
    });
  }
}
