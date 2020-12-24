import { fetchApiCollection } from "./api_collection.js";
import { biStar, biStarFill } from "./icons.js";

function renderTable({ entries, tableView }) {
  const table = document.createElement("table");
  table.classList.add("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>API</th>
        <th>Category</th>
        <th>Description</th>
        <th>Auth</th>
        <th>HTTPS</th>
        <th>CORS</th>
      </tr>
    </thead>`;

  const tbody = document.createElement("tbody");
  const rows = entries.map((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span data-entryTitle="${entry.title}" class="favorite">
          ${entry.isFavorite ? biStarFill() : biStar()}
        </span>
      </td>
      <td><a href="${entry.url}">${entry.title}</a></td>
      <td>${entry.category}</td>
      <td>${entry.description}</td>
      <td>${entry.auth}</td>
      <td>${entry.https}</td>
      <td>${entry.cors}</td>
    `;
    return tr;
  });
  tbody.append(...rows);
  table.append(tbody);
  tableView.innerHTML = "";
  tableView.append(table);
}

async function main() {
  const pageLoadAt = Date.now();
  const corsToggle = document.querySelector("#cors-toggle");
  const errorView = document.querySelector("#error-view");
  const httpsToggle = document.querySelector("#https-toggle");
  const loader = document.querySelector("#loader");
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
  const collection = await fetchApiCollection();
  if (collection) {
    const entries = collection.all();
    renderTable({ tableView, entries });

    // use timeout to prevent flash of loader which appears as a bug to the
    // observant user
    const MIN_LOADER_TIME = 800;
    setTimeout(() => {
      tableView.classList.remove("d-none");
      loader.classList.add("d-none");
      corsToggle.disabled = false;
      httpsToggle.disabled = false;
      searchInput.disabled = false;
      // use parens due to 1000 - Date.now() producing unsafe number
    }, MIN_LOADER_TIME - (Date.now() - pageLoadAt));

    tableButtons.addEventListener("change", () => {
      renderTable({ tableView, entries: filterEntries() });
    });
    searchInput.addEventListener("input", () => {
      renderTable({ tableView, entries: filterEntries() });
    });

    const handleToggleFavorite = (event) => {
      const favoriteStar = event.target.closest(".favorite");
      if (favoriteStar) {
        const entryTitle = favoriteStar.getAttribute("data-entryTitle");
        collection.toggleFavorite(entryTitle);
        renderTable({ tableView, entries: filterEntries() });
      }
    };
    document.addEventListener("click", handleToggleFavorite);
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
