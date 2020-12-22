import { fetchApiCollection } from "./api_collection.js";

function renderTable({ entries, tableView }) {
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
  tableView.innerHTML = "";
  tableView.append(table);
}

async function main() {
  const collection = await fetchApiCollection();
  const corsToggle = document.querySelector("#cors-toggle");
  const errorView = document.querySelector("#error-view");
  const httpsToggle = document.querySelector("#https-toggle");
  const searchInput = document.querySelector("#search-input");
  const tableButtons = document.querySelector("#table-buttons");
  const tableView = document.getElementById("table-view");
  const filterEntries = () => {
    return collection.find({
      cors: corsToggle.checked,
      https: httpsToggle.checked,
      search: searchInput.value.trim(),
    });
  };
  if (collection) {
    const entries = collection.all();
    renderTable({ tableView, entries });
    tableButtons.addEventListener("change", () => {
      renderTable({ tableView, entries: filterEntries() });
    });
    searchInput.addEventListener("input", () => {
      renderTable({ tableView, entries: filterEntries() });
    });
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
