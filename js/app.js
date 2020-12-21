import { fetchApiCollection } from "./api_collection.js";

function renderTable(entries) {
  const table = document.createElement("table");
  table.classList.add("table");
  table.innerHTML = `
      <thead>
        <tr>
          <th>API</th>
          <th>Description</th>
          <th>Auth</th>
          <th>HTTPS</th>
          <th>CORS</th>
        </tr>
      </thead>`;

  const tbody = document.createElement("tbody");
  tbody.append(...entries.map((entry) => entry.row));
  table.append(tbody);
  document.getElementById("table-view").append(table);
}

async function main() {
  const collection = await fetchApiCollection();
  if (collection) {
    const entries = collection.all();
    renderTable(entries);
  } else {
    document.getElementById("error-view").classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
