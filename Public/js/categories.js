let currentPage = 0;
let currentCat = "";
let previousCat = "";
let row = document.querySelector(".row");
let csrfToken = document.querySelector("[name=_csrf]").value;
let firstBtn = document.querySelector(".first");
let lastBtn = document.querySelector(".last");
firstBtn.value = "1";
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
  for (article of articles) {
    let div = document.createElement("div");
    div.classList.add("col-sm-6", "mb-5");

    div.innerHTML = `
<div class="card">
<div class="card-body">
<h3>${article.title}  </h3>
<p class="card-text" style="font-size: 17px;">
 ${article.description}   
</p>
</div>
<a href="/Article/${article.id}"  class="btn btn-primary">Read</a>
</div>
`;
    row.append(div);
  }
}
function setFirstLast(nbrLinks, currentPage) {
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
}
async function getArticles(e) {
  try {
    let page = parseInt(e.target.value) || 1;
    let response;
    let catName;
    if (e.target.classList[0].includes("badge")) {
      catName = e.target.id;
    } else {
      badges = document.querySelectorAll(".badge");
      badges.forEach((b) => {
        classList = b.classList;
        classList.forEach((c) => {
          if (c == "active") {
            catName = b.id;
          }
        });
      });

      page = parseInt(e.target.value);
    }
    if (page == currentPage && catName == currentCat) {
      return;
    }
    currentPage = page;
    currentCat = catName;
    console.log(catName, currentCat);
    console.log(page, currentPage);

    if (catName == "all") {
      row.innerHTML = "";

      response = await fetch("/Categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ page, catName }),
      });
      if (response.ok) {
        response = await response.json();
        document.querySelector("button[id=all]").classList.toggle("active");
        if (previousCat) {
          document
            .querySelector(`button[id=${previousCat}]`)
            .classList.toggle("active");
        }
        previousCat = "all";
      }
      if (response.articles.length == 0) {
        return;
      }
      setFirstLast(response.nbrLinks);
      lastBtn.value = response.nbrLinks;
      changePagination(response.linksEnd);
    } else if (catName != "all") {
      row.innerHTML = "";
      response = await fetch(`/Categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ page, catName }),
      });
      if (response.ok) {
        response = await response.json();
        document
          .querySelector(`button[id=${previousCat}]`)
          .classList.toggle("active");
        document
          .querySelector(`button[id=${catName}]`)
          .classList.toggle("active");
        previousCat = catName;
      }
      if (response.articles.length == 0) {
        return;
      }
      lastBtn.value = response.nbrLinks;
      changePagination(response.linksEnd);
    } else {
      return;
    }

    renderArticles(response.articles);
  } catch (err) {
    console.log(err);
  }
}

getArticles({
  target: {
    id: "all",
    classList: ["badge"],
  },
});

let categoriesButtons = document.querySelectorAll("button");
categoriesButtons.forEach((button) => {
  button.addEventListener("click", getArticles);
});

function addListener() {
  const pageLinks = document.querySelectorAll(".page-link");
  pageLinks.forEach((pageLink) => {
    pageLink.addEventListener("click", getArticles);
  });
}
