let input = document.querySelector(".input");
let body = document.querySelector("body");
let autoc = document.querySelector(".autocomplete");
let repositories = document.querySelector(".repositories");
let battons = document.querySelectorAll("button");

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
  if (!value) {
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
        autoc.addEventListener("click", (e) => {
          arr.forEach((item) => {
            if (item.name === e.target.textContent) {
              const repoList = document.createElement("div");
              const wrapInfo = document.createElement("div");
              const clsBtn = document.createElement("button");
              clsBtn.classList.add("remove");
              removeItem(clsBtn);
              clsBtn.textContent = "X";
              wrapInfo.innerText = `Название: ${item.name}
               Владелец: ${item.owner.login}
               Звезды: ${item.stargazers_count}`;
              repoList.appendChild(wrapInfo);
              repoList.appendChild(clsBtn);
              repositories.appendChild(repoList);
            }
          });
          input.value = null;
          clearValue(autoc);
        });
      })
      .catch((err) => console.log(err));
  }
}

input.addEventListener("keyup", debounce(getRepo, 500));

function removeItem(block) {
  block.addEventListener("click", function (e) {
    this.parentNode.remove();
  });
}
