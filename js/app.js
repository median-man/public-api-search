async function fetchEntries() {
  const url = new URL(
    "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"
  );
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(response.status, response.statusText);
      return false;
    }
    // result is markdown for readme of the public-apis GitHub project
    const result = await response.text();

    // convert readme to html to easily parse out the rows of data from the numerous markdown tables
    const page = document.createElement("div");
    const md = new remarkable.Remarkable();
    page.innerHTML = md.render(result);
    const rows = page.querySelectorAll("tbody tr");
    const entries = Array.from(rows).map((row) => {
      const tds = row.children;
      const entry = {
        title: tds[0].textContent,
        url: tds[0].firstElementChild.getAttribute("href"),
        description: tds[1].textContent,
        auth: tds[2].textContent,
        https: tds[3].textContent,
        cors: tds[4].textContent,
        row,
      };
      return entry;
    });
    return entries;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function renderTable(entries) {
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
  document.getElementById("table-view").append(table);
}

async function main() {
  const entries = await fetchEntries();
  if (entries) {
    const corsAndHttpsEntries = entries.filter(
      (entry) => entry.cors === "Yes" && entry.https === "Yes"
    );
    renderTable(corsAndHttpsEntries);
  } else {
    document.getElementById("error-view").classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", main);
