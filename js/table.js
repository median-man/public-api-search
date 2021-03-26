import { biStar, biStarFill } from "./icons.js";
import { prefersDarkTheme } from "./util.js";

let corsToggle;
let favoritesToggle;
let httpsToggle;
let searchInput;
let tableButtons;
let tableView;

const headerHTML = () => {
  return `
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
};

const rowHTML = (entry) => {
  return `
    <tr>
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
    </tr>
  `;
};

const bodyHTML = (entries) => `<tbody>${entries.map(rowHTML).join("")}</tbody>`;

const renderTable = ({ entries, tableView }) => {
  const table = document.createElement("table");
  table.classList.add("table");
  if (prefersDarkTheme) {
    table.classList.add("table-dark");
  }
  table.innerHTML = headerHTML() + bodyHTML(entries);
  tableView.innerHTML = "";
  tableView.append(table);
};

const getTableState = () => ({
  cors: corsToggle.checked,
  favorites: favoritesToggle.checked,
  https: httpsToggle.checked,
  search: searchInput.value.trim(),
});

const initTable = ({ entries, onFavoriteChange, onChange }) => {
  corsToggle = document.querySelector("#cors-toggle");
  favoritesToggle = document.querySelector("#favorites-toggle");
  httpsToggle = document.querySelector("#https-toggle");
  searchInput = document.querySelector("#search-input");
  tableButtons = document.querySelector("#table-buttons");
  tableView = document.getElementById("table-view");

  tableButtons.addEventListener("change", onChange);
  searchInput.addEventListener("input", onChange);
  document.addEventListener("click", (event) => {
    const favoriteStar = event.target.closest(".favorite");
    if (favoriteStar) {
      const entryTitle = favoriteStar.getAttribute("data-entryTitle");
      onFavoriteChange(entryTitle);
    }
  });
  renderTable({ tableView, entries });
};

const setTableEntries = (entries) => {
  renderTable({ tableView, entries });
};

const enableTableControls = () => {
  corsToggle.disabled = false;
  favoritesToggle.disabled = false;
  httpsToggle.disabled = false;
  searchInput.disabled = false;
};

const showTable = () => tableView.classList.remove("d-none");

export {
  initTable,
  setTableEntries,
  getTableState,
  enableTableControls,
  showTable,
};
