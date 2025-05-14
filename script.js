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
//console.log(time); // текущее время

const day = `${Data.getUTCFullYear()}.${
  Data.getUTCMonth() + 1 > 9
    ? Data.getUTCMonth() + 1
    : "0" + (Data.getUTCMonth() + 1)
}.${
  Data.getUTCDate() > 9 ? Data.getUTCDate() : "0" + Number(Data.getUTCDate())
}`; // текущая дата
//console.log(day);

// кнопка перехода на главную
btnToHome.addEventListener("click", () => {
  document.querySelector(".wrap__pages").classList.add("info__none");
});

// кнопка перехода на главную
MenuBtnToHome.addEventListener("click", () => {
  window.location.reload();
});

// кнопка рандомных фильмов
rundomFilms.addEventListener("click", () => {
  const randomLink =
    randomFilms[Math.floor(Math.random() * randomFilms.length)];
  openVideoIFrame(randomLink.link);
  burgerSvg();
});

// кнопка меню
navBTN.addEventListener("click", () => {
  burgerSvg();
});

// каталог || лист трансляции
catalogLinks.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("menu__list-item");
  li.innerHTML = `<button class="menu__list-link" id="${item.id}" name="${item.name}"> <img src="${item.img}" alt="${item.name}">   ${item.name}</button>`;
  menuList.appendChild(li);

  li.firstChild.addEventListener("click", () => {
    openVideoIFrame(item.link);
    burgerSvg();
  });
});


// list LiveStrime
transLinks.forEach((item, index) => {

  // console.dir(item);
  

  const li = document.createElement("li");

  const srcValue = item.link.split('src=')[1].split('"')[1].trim();
  

  li.classList.add("list__strim-item");
  li.dataset.data = item.data;
  li.dataset.id = index;
  li.dataset.time = item.time;
  li.dataset.premium = item.premium;
  li.dataset.img = item.img;
  li.dataset.href = item.link === `<iframe src="${srcValue}" width="640" height="360" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>` ? item.link : `<iframe src="${srcValue}" width="640" height="360" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  li.dataset.active = item.active;
  li.dataset.category = item.category;

  // console.dir(item.link);
  

  // console.dir(li.dataset.data ? li.dataset.data : ' ');
  

  const categories = ['хоккей', 'футбол', 'баскетбол', 'регби', 'другое'];

  if (categories.includes(li.dataset.category)) {
    // 
    const hockey = []
    const regby = []
    const footbol = []
    const basketbol = []
    const other = []

    transLinks.forEach((item) => {
      switch (item.category) {
        case 'хоккей':
          hockey.push(item);
          break;
        case 'регби':
          regby.push(item);
          break;
        case 'футбол':
          footbol.push(item);
          break;
        case 'баскетбол':
          basketbol.push(item);
          break;
        case 'другое':
          other.push(item);
          break;
        default:
          // other.push(item);
          break;
      }
    });
  console.log(li);
  

    li.innerHTML = `
      <button class="list__strim-link" id="${index}" name="${item.name}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" style="flex: 1; height: 10vh; border-radius: 10px;">` : ""}
        <h3>${item.name}</h3>
        <span>Начало в - ${item.time}</span>
        ${item.premium === "Premium" ? `<span class="list__strim-premium">Premium</span>` : ""}
      </button>
    `.trim();
    // 
  }

// https://srrb.ru/category/translyacii-sportivnyx-sobytij



  if (li.dataset.data === day) {
    const timeStart = `${Number(li.dataset.time.split(":")[0])}:${
      li.dataset.time.split(":")[1]
    }`;

    //console.log(timeStart); // время начала трансляции

    // вариант 1
    // const timeFinish = li.dataset.premium
    //   ? `${Number(li.dataset.time.split(":")[0]) + 8}:${li.dataset.time.split(":")[1]}`
    //   : `${Number(li.dataset.time.split(":")[0]) + 3}:${li.dataset.time.split(":")[1]}`;

    // вариант 2
    const timeFinish =
      li.dataset.premium === "Premium"
        ? (() => {
            const endHour = Number(li.dataset.time.split(":")[0]) + 8;
            const newTime =
              endHour < 24
                ? `${endHour}:${li.dataset.time.split(":")[1]}`
                : `${endHour - 24}:${li.dataset.time.split(":")[1]}`;
            li.dataset.nextDay = endHour >= 24 ? "true" : "false";
            return newTime;
          })()
        : (() => {
            const endHour = Number(li.dataset.time.split(":")[0]) + 3;
            return `${endHour}:${li.dataset.time.split(":")[1]}`;
          })();
    //console.log(timeFinish); // время конца трансляции

    if (Number(timeFinish.split(":")[0]) > Number(time.split(":")[0])) {
      li.dataset.active = 1;
    }
    //console.log(li.dataset.active); // активна ли трансляция

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

    const [timeStartHour, timeFinishHour, timeHour] = [
      Number(timeStart.split(":")[0]),
      Number(timeFinish.split(":")[0]),
      Number(time.split(":")[0]),
    ];

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
      // console.dir(error + " - " + li.dataset.name);
    }


    //сортируем список трансляций по времени
    //сортируем список трансляций по времени
    //если трансляция активна, то сортируем список по времени
    //если трансляция неактивна, то добавляем ее в конец списка
    const sortListStrime = (itemListActive) => {
      const sortByTime = (a, b) => Number(a.dataset.time.split(":")[0]) - Number(b.dataset.time.split(":")[0]);

      const insertElement = itemListActive != "1" ? Strimlists.lastChild : Strimlists.firstChild;

      const sortedChildren = [...Strimlists.children].sort(sortByTime);

      const insertBeforeElement = sortedChildren.find(
        (item) => Number(item.dataset.time.split(":")[0]) > Number(li.dataset.time.split(":")[0])
      ) || insertElement;

      Strimlists.insertBefore(li, insertBeforeElement);
      
    };
    sortListStrime(li.dataset.active);
  }
});
