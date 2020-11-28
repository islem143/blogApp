let deleteButtons = document.querySelectorAll(".deleteBtn");
let csrfToken = document.querySelector("[name=_csrf]").value;

deleteButtons.forEach((button) => {
  button.addEventListener("click", deleteArticle);
});

async function deleteArticle() {
  try {
    let articleId = this.previousElementSibling.value;
    let response = await fetch("/Admin/DeleteArticle/" + articleId.toString(), {
      method: "DELETE",
      headers: {
        "CSRF-Token": csrfToken,
      },
    });

    if (response.ok) {
      let article = this.parentNode.parentNode.parentNode;
      article.remove();
    } else {
      console.log("http Error");
    }
  } catch (err) {
    console.log(err);
  }
}
