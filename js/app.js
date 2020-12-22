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
};

async function main() {
  const collection = await fetchApiCollection();
  const corsToggle = document.querySelector("#cors-toggle");
  const errorView = document.querySelector("#error-view");
  const httpsToggle = document.querySelector("#https-toggle");
  const tableFilters = document.querySelector("#table-filters");
  const tableView = document.getElementById("table-view");
  if (collection) {
    const entries = collection.all();
    renderTable({ tableView, entries });
    tableFilters.addEventListener("change", () => {
      const filteredEntries = collection.find(entries, {
        cors: corsToggle.checked,
        https: httpsToggle.checked,
      });
      renderTable({tableView, entries: filteredEntries});
    });
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
