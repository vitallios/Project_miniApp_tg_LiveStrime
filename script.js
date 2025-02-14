import { catalogLinks } from "./live_failse/liveTv.js";
import { randomFilms } from "./live_failse/liveFilms.js";
import { transLinks } from "./live_failse/liveTranslation.js";

const navBTN = document.querySelector("#menu-btn");
const menu = document.querySelector(".menu");
const menuList = document.querySelector("#menu__list");
let wrapPleer = document.querySelector(".wrap");
const loader = document.querySelector(".loader");
const rundomFilms = document.querySelector("#rundomFilms");
const btnToHome = document.querySelector("#btnToHome");
const MenuBtnToHome = document.querySelector("#MenuBtnToHome");
const Strimlists = document.querySelector("#listStrimes");

const burgerSvg = () => {
  navBTN.classList.toggle("active");
  menu.classList.toggle("active");
  navBTN.firstElementChild.children[0].attributes[2].value =
    menu.classList.contains("active")
      ? "M6 18L18 6M6 6l12 12"
      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
};

const openVideoIFrame = (linkVideo) => {
  wrapPleer.innerHTML = linkVideo;
};

window.addEventListener("load", () => {
  document.querySelector(".content").style.opacity = "0";

  if (!window.onload) {
    setTimeout(() => {
      loader.style.display = "none";
      document.querySelector(".content").style.opacity = "1";
    }, 3000);
  }
});

let Data = new Date();
const hours = Data.getHours() > 9 ? Data.getHours() : "0" + Data.getHours();
const minutes =
  Data.getMinutes() > 9 ? Data.getMinutes() : "0" + Data.getMinutes();

const time = `${hours}:${minutes}`;
const day = `${Data.getUTCFullYear()}.${
  Data.getUTCMonth() + 1 > 9
    ? Data.getUTCMonth() + 1
    : "0" + (Data.getUTCMonth() + 1)
}.${
  Data.getUTCDate() > 9 ? Data.getUTCDate() : "0" + Number(Data.getUTCDate())
}`;

btnToHome.addEventListener("click", () => {
  document.querySelector(".wrap__pages").classList.add("info__none");
});

MenuBtnToHome.addEventListener("click", () => {
  window.location.reload();
});

rundomFilms.addEventListener("click", () => {
  const randomLink =
    randomFilms[Math.floor(Math.random() * randomFilms.length)];
  openVideoIFrame(randomLink.link);
  burgerSvg();
});

navBTN.addEventListener("click", () => {
  burgerSvg();
});

catalogLinks.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("menu__list-item");
  li.innerHTML = `<button class="menu__list-link" id="${item.id}" name="${item.name}">${item.name}</button>`;
  menuList.appendChild(li);

  li.firstChild.addEventListener("click", () => {
    openVideoIFrame(item.link);
    burgerSvg();
  });
});

transLinks.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("list__strim-item");
  li.dataset.data = item.data;
  li.dataset.id = item.id;
  li.dataset.time = item.time;
  li.dataset.premium = item.premium;
  li.dataset.img = item.img;
  li.dataset.href = item.link;
  li.dataset.active = item.active;

  li.innerHTML = `<button class="list__strim-link" id="${item.id}" name="${
    item.name
  }">
    ${
      item.img
        ? `<img src="${item.img}" alt="${item.name}" style="flex: 1; height: 3rem; border-radius: 10px;">`
        : ""
    }
    <h3>${item.name}</h3>
    <span>Начало в - ${item.time}</span>
  </button>`;

  if (li.dataset.data === day) {
    const timeStart = `${Number(li.dataset.time.split(":")[0])}:${
      li.dataset.time.split(":")[1]
    }`;
    const timeFinish = `${Number(li.dataset.time.split(":")[0]) + 3}:${
      li.dataset.time.split(":")[1]
    }`;

    if (Number(timeFinish.split(":")[0]) > Number(time.split(":")[0])) {
      li.dataset.active = 1;
    }

    const item = li.querySelector(".list__strim-link");

    const startLiveStrime = () => {
      item.classList.add("active");
      li.dataset.active = 1;
      li.addEventListener("click", () => openVideoIFrame(li.dataset.href));
    };
    const endLiveStrime = () => {
      item.classList.remove("active");
      li.dataset.active = 0;
      item.style.color = "var(--disableGraay)";
      item.setAttribute("disabled", true);
    };

    const timeStartHour = Number(timeStart.split(":")[0]);
    const timeFinishHour = Number(timeFinish.split(":")[0]);
    const timeHour = Number(time.split(":")[0]);

    try {
      if (timeStartHour <= timeHour && timeFinishHour >= timeHour) {
        if (li.dataset.premium === "Premium") {
          li.querySelector("span").textContent = "Трансляция целый день";
        } else {
          li.querySelector("span").textContent = "Трансляция началась";
        }
        li.classList.add("active");
        startLiveStrime();
      } else if (timeStartHour > timeHour) {
        li.querySelector("span").textContent =
          "Трансляция начнется в - " + timeStart;
        li.dataset.active = 0;
      } else if (timeFinishHour <= timeHour) {
        li.querySelector("span").textContent = "Трансляция закончилась";
        endLiveStrime();
        li.dataset.active = 0;
      }
    } catch (error) {
      console.dir(error);
    }

    Strimlists.insertBefore(li, Strimlists.lastChild);
  }
});
