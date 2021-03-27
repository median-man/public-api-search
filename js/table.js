import { biStar, biStarFill } from "./icons.js";
import ThemeToggle from "./theme_toggle.js";

let corsToggle;
let favoritesToggle;
let httpsToggle;
let searchInput;
let tableButtons;
let tableView;
let table;

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

const applyTheme = () =>
  ThemeToggle.isDark()
    ? table.classList.add("table-dark")
    : table.classList.remove("table-dark");

const renderTable = ({ entries }) => {
  applyTheme();
  table.innerHTML = headerHTML() + bodyHTML(entries);
};

const getTableState = () => ({
  cors: corsToggle.checked,
  favorites: favoritesToggle.checked,
  https: httpsToggle.checked,
  search: searchInput.value.trim(),
});

const handleFavoriteClick = (onFavoriteChange) => (event) => {
  const favoriteStar = event.target.closest(".favorite");
  if (favoriteStar) {
    const entryTitle = favoriteStar.getAttribute("data-entryTitle");
    onFavoriteChange(entryTitle);
  }
};

const initTable = ({ entries, onFavoriteChange, onChange }) => {
  corsToggle = document.querySelector("#cors-toggle");
  favoritesToggle = document.querySelector("#favorites-toggle");
  httpsToggle = document.querySelector("#https-toggle");
  searchInput = document.querySelector("#search-input");
  tableButtons = document.querySelector("#table-buttons");
  tableView = document.getElementById("table-view");
  table = document.createElement("table");

  table.classList.add("table");
  tableView.append(table);

  tableButtons.addEventListener("change", onChange);
  searchInput.addEventListener("input", onChange);
  table.addEventListener("click", handleFavoriteClick(onFavoriteChange));
  ThemeToggle.subscribe(applyTheme);
  renderTable({ entries });
};

const setTableEntries = (entries) => renderTable({ entries });

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
