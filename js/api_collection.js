const createEntryFromRowEl = (row) => {
  const tds = row.children;
  const entry = {};

  entry.auth = tds[2].textContent;
  entry.cors = tds[4].textContent;
  entry.description = tds[1].textContent;
  entry.https = tds[3].textContent;
  entry.row = row;
  entry.title = tds[0].textContent;
  entry.url = tds[0].firstElementChild.getAttribute("href");

  // add category td cell after parsing data to avoid shifting the indexes.
  const categoryTd = document.createElement("td");
  entry.category = row.closest("table").previousElementSibling.textContent;
  categoryTd.textContent = entry.category;
  row.insertBefore(categoryTd, tds[1]);
  return entry;
};

const createApiCollection = (entries) => {
  const searchEntry = (search) => (entry) => {
    return Object.entries(entry)
      .filter(([key]) => key !== "row" && key !== "url")
      .map(([, value]) => value.toLowerCase())
      .some((value) => value.includes(search));
  };
  const find = ({ cors, https, search }) => {
    let result = entries.filter((entry) => {
      if (cors && entry.cors !== "Yes") return false;
      if (https && entry.https !== "Yes") return false;
      return true;
    });
    if (search) {
      result = result.filter(searchEntry(search));
    }
    return result;
  };
  return {
    all: () => [...entries],
    find,
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
