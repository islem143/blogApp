let currentPage = 0;
let csrfToken = document.querySelector("[name=_csrf]").value;
let firstBtn = document.querySelector(".first");
let lastBtn = document.querySelector(".last");
function createLinks(index) {
  const linksCon = document.querySelector(".links");
  let li = document.createElement("li");
  li.classList.add("page-item");
  let btn = document.createElement("button");
  btn.classList.add("page-link");
  btn.value = index;
  btn.textContent = index;
  li.append(btn);
  linksCon.append(li);
}
function changePagination(linksEnd) {
  let links = document.querySelectorAll(".links li ");
  if (links) {
    links.forEach((l) => {
      l.remove();
    });
  }
  if (linksEnd >= 5) {
    for (let i = linksEnd - 4; i <= linksEnd; i++) {
      createLinks(i);
    }
  } else if (linksEnd < 5) {
    for (let i = 1; i <= linksEnd; i++) {
      createLinks(i);
    }
  } else if (linksEnd == 0) {
    return 0;
  }
  addListener();
}

function renderArticles(articles) {
  const body = document.querySelector(".row");
  body.innerHTML = "";
  for (article of articles) {
    const articleDiv = document.createElement("div");
    articleDiv.classList.add("col-sm-6", "mb-5");
    articleDiv.innerHTML = `
  <div class="card">
  <div class="card-body">
    <h3> ${article.title}</h3>
    <p class="card-text" style="font-size: 17px;">
      ${article.description} 
    </p>
  </div>
  <a href="/Article/${article.id}" class="btn btn-primary">Read</a>
  </div>`;
    body.appendChild(articleDiv);
  }
}

async function getArticles(e) {
  let page;
  let nbrLinks;
  if (!e.target) {
    page = e || 1;
  } else {
    page = parseInt(e.target.value) || 1;
  }
  if (page == currentPage) {
    return;
  }
  if (currentPage == 1) {
    firstBtn.setAttribute("disabled", "true");
    lastBtn.removeAttribute("disabled");
  } else if (currentPage == nbrLinks) {
    firstBtn.setAttribute("disabled", "true");
    firstBtn.removeAttribute("disabled");
  } else {
    lastBtn.removeAttribute("disabled");
    firstBtn.removeAttribute("disabled");
  }
  currentPage = page;
  let info = { page };
  try {
    let response = await fetch(`/Articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify(info),
    });
    if (response.ok) {
      result = await response.json();
      changePagination(result.linksEnd);
      nbrLinks = result.nbrLinks;
    }
    if (result.articles.lenght == 0) {
      return;
    }
    renderArticles(result.articles);
  } catch (err) {
    throw new Error(err);
  }
}
function addListener() {
  const pageLinks = document.querySelectorAll(".page-link");
  pageLinks.forEach((pageLink) => {
    pageLink.addEventListener("click", getArticles);
  });
}

getArticles(1);
