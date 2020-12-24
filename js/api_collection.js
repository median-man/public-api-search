const favoriteEntryTitles = new Set(
  JSON.parse(localStorage.getItem("favorites")) || []
);

const saveFavoriteTitles = () =>
  localStorage.setItem("favorites", JSON.stringify([...favoriteEntryTitles]));

const createEntryFromRowEl = (row) => {
  const tds = row.children;
  const entry = {};

  entry.auth = tds[2].textContent;
  entry.cors = tds[4].textContent;
  entry.description = tds[1].textContent;
  entry.https = tds[3].textContent;
  entry.title = tds[0].textContent;
  entry.url = tds[0].firstElementChild.getAttribute("href");
  entry.category = row.closest("table").previousElementSibling.textContent;
  entry.isFavorite = favoriteEntryTitles.has(entry.title);
  return entry;
};

const createApiCollection = (entries) => {
  const searchEntry = (search) => (entry) => {
    return Object.entries(entry)
      .filter(([, value]) => typeof value === "string")
      .map(([, value]) => value.toLowerCase())
      .some((value) => value.includes(search));
  };
  const find = ({ cors, https, isFavorite, search, title }) => {
    let result = entries.filter((entry) => {
      if (cors && entry.cors !== "Yes") return false;
      if (https && entry.https !== "Yes") return false;
      if (isFavorite && !entry.isFavorite) return false; 
      return true;
    });
    if (title) {
      result = entries.filter((entry) => entry.title === title);
    }
    if (search) {
      result = result.filter(searchEntry(search));
    }
    return result;
  };
  const toggleFavorite = (entryTitle) => {
    const [entry] = find({ title: entryTitle });
    entry.isFavorite = !entry.isFavorite;
    if (entry.isFavorite) {
      favoriteEntryTitles.add(entry.title);
    } else {
      favoriteEntryTitles.delete(entry.title);
    }
    saveFavoriteTitles();
    return entry.isFavorite;
  };
  return {
    all: () => [...entries],
    find,
    toggleFavorite,
  };
};

const parseMarkdown = (str) => {
  // create a div to query for rows and create entries from each row
  const page = document.createElement("div");
  const md = new remarkable.Remarkable();
  page.innerHTML = md.render(str);
  const rows = page.querySelectorAll("tbody tr");
  const entries = Array.from(rows).map(createEntryFromRowEl);
  return createApiCollection(entries);
};

export const fetchApiCollection = async () => {
  const url =
    "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(response.status, response.statusText);
      return false;
    }
    // result is markdown for readme of the public-apis GitHub project
    const mdText = await response.text();
    return parseMarkdown(mdText);
  } catch (error) {
    console.log(error);
    return false;
  }
};
