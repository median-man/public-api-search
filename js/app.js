import { fetchApiCollection } from "./api_collection.js";
import {
  enableTableControls,
  getTableState,
  initTable,
  setTableEntries,
  showTable,
} from "./table.js";

async function main() {
  const pageLoadAt = Date.now();
  const errorView = document.querySelector("#error-view");
  const loader = document.querySelector("#loader");

  const collection = await fetchApiCollection();

  const filterEntries = () => {
    const { cors, favorites, https, search } = getTableState();
    const entries = collection.find({
      cors,
      https,
      isFavorite: favorites,
      search,
    });
    setTableEntries(entries);
  };

  if (collection) {
    const entries = collection.all();

    // use timeout to prevent flash of loader which appears as a bug to the
    // observant user
    const MIN_LOADER_TIME = 800;
    setTimeout(() => {
      loader.classList.add("d-none");
      enableTableControls();
      showTable();
      // use parens due to MIN_LOADER_TIME - Date.now() producing unsafe number
    }, MIN_LOADER_TIME - (Date.now() - pageLoadAt));

    const handleFavoriteChange = (entryTitle) => {
      collection.toggleFavorite(entryTitle);
      filterEntries();
    };

    initTable({
      entries,
      onChange: filterEntries,
      onFavoriteChange: handleFavoriteChange,
    });
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
