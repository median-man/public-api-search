import { fetchApiCollection } from "./api_collection.js";
import { debounce } from "./util.js";
import {
  enableTableControls,
  getTableState,
  initTable,
  setTableEntries,
  showTable,
} from "./table.js";
import ThemeToggle from "./theme_toggle.js";

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

  const applyDarkTheme = () => {
    document.body.classList.add("bg-dark", "text-light");
    document.querySelectorAll(".btn-outline-primary").forEach((btn) => {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-outline-info");
    });
  };

  const applyLightTheme = () => {
    document.body.classList.remove("bg-dark", "text-light");
    document.querySelectorAll(".btn-outline-info").forEach((btn) => {
      btn.classList.add("btn-outline-primary");
      btn.classList.remove("btn-outline-info");
    });
  };

  const handleThemeChange = () =>
    ThemeToggle.isDark() ? applyDarkTheme() : applyLightTheme();

  ThemeToggle.init(document.querySelector("#wrapper"));
  ThemeToggle.subscribe(handleThemeChange);

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
