import { fetchApiCollection } from "./api_collection.js";
import { debounce, prefersDarkTheme } from "./util.js";
import {
  enableTableControls,
  getTableState,
  initTable,
  setTableEntries,
  showTable,
} from "./table.js";

async function main() {
  const errorView = document.querySelector("#error-view");
  const loader = document.querySelector("#loader");
  const topButton = document.querySelector("#top-button");

  const updateTopButton = () => {
    if (window.scrollY > window.innerHeight * 1.3) {
      topButton.style.opacity = 0.8;
    } else {
      topButton.style.opacity = 0;
    }
  };

  if (prefersDarkTheme) {
    document.body.classList.add("bg-dark", "text-light");
    document.querySelectorAll(".btn-outline-primary").forEach((btn) => {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-outline-info");
    });
  }

  document.addEventListener("scroll", debounce(updateTopButton, 50));

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

    const handleFavoriteChange = (entryTitle) => {
      collection.toggleFavorite(entryTitle);
      filterEntries();
    };

    initTable({
      entries,
      onChange: debounce(filterEntries, 120),
      onFavoriteChange: handleFavoriteChange,
    });
    enableTableControls();
    showTable();
    loader.classList.add("d-none");
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
