import { fetchApiCollection } from "./api_collection.js";
import { debounce } from "./util.js";
import {
  enableTableControls,
  getTableState,
  initTable,
  setTableEntries,
  showTable,
} from "./table.js";
import PageState from "./page_state.js";

async function main() {
  const pageLoadAt = Date.now();
  const errorView = document.querySelector("#error-view");
  const loader = document.querySelector("#loader");
  const topButton = document.querySelector("#top-button");
  const collectionPromise = fetchApiCollection();

  const updateTopButton = () => {
    if (window.scrollY > window.innerHeight * 1.3) {
      topButton.style.opacity = 0.8;
    } else {
      topButton.style.opacity = 0;
    }
  };

  document.addEventListener("scroll", debounce(updateTopButton, 50));

  const collection = await collectionPromise;

  const filterEntries = () => {
    const { cors, favorites, https, search } = PageState.getState();
    const entries = collection.find({
      cors,
      https,
      isFavorite: favorites,
      search,
    });
    return entries;
  };

  if (collection) {
    // use timeout to prevent flash of loader which appears as a bug to the
    // observant user
    const MIN_LOADER_TIME = 500;
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

    const handleTableChange = debounce(() => {
      PageState.updateState(getTableState());
      setTableEntries(filterEntries());
    }, 120);

    initTable({
      initialState: PageState.getState(),
      entries: filterEntries(),
      onChange: handleTableChange,
      onFavoriteChange: handleFavoriteChange,
    });
  } else {
    errorView.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
