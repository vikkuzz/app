let input = document.querySelector(".input");
let value = input.value;
let body = document.querySelector("body");
let autoc = document.querySelector(".autocomplete");
let repositories = document.querySelector(".repositories");
let repo = document.querySelector(".repo");

const debounce = (fn, debounceTime) => {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

function clearValue(container) {
  container.innerHTML = "";
}

function getRepo() {
  let value = input.value;
  if (!input.value) {
    clearValue(autoc);
  } else {
    fetch(`https://api.github.com/search/repositories?q=${value}`)
      .then((response) => response.json())
      .then((obj) => {
        if (obj.items.length >= 5) {
          let arr = obj.items.slice(0, 5);
          return arr;
        } else if (obj.items.length > 0) {
          let arr = obj.items.slice(0, obj.items.length);
          return arr;
        }
      })
      .then((arr) => {
        clearValue(autoc);
        arr.forEach((item) => {
          const repo = document.createElement("div");
          repo.classList.add("repo");
          autoc.appendChild(repo);
          repo.textContent = item.name;
        });
      })
      .catch((err) => console.log(err));
  }
}

input.addEventListener("keyup", debounce(getRepo, 500));
repo.addEventListener("click", () => {
  repositories.appendChild("repo");
});
