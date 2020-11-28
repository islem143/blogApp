const form = document.querySelector("form");
const userName = document.querySelector("#userName");
const password = document.querySelector("#Password");
const errorFeild = document.querySelector(".error");

const userCheck = /^[a-z]([0-9][0-9]+[a-z]*|[a-z]+\d*)$/;
const passwordCheck = /^[A-Z](?=.{6,})(?=.*\d+)(?=\w*[a-zA-z]+)/;

const errorMessages = [];

function validateInput(e) {
  errorFeild.textContent = "";
  if (!userCheck.test(userName.value)||userName.value=="") {
    errorMessages.push(
      "username should be a least 2 char of alphabet! and containes numbers at the end!"
    );
  }
  if (!passwordCheck.test(password.value)|| password.value=="") {
    errorMessages.push(
      "password should start With Cap letter and containes a least 6 characters of numbers and alphabet "
    );
  }
  if (errorMessages.length > 0) {
    e.preventDefault();
    errorFeild.classList.add("alert", "alert-danger");
    for (let message of errorMessages) {
      let p = document.createElement("p");
      p.textContent = "<img src";
      errorFeild.appendChild(p);
    }

    errorMessages.splice(0, errorMessages.length);
  }
}

form.addEventListener("submit", validateInput);
