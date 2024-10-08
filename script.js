const navBTN = document.querySelector("#menu-btn");
const menu = document.querySelector(".menu");
const menuListItem = document.querySelector("#menu__list-item");
const menuList = document.querySelector("#menu__list");
let iframeSeaction = document.querySelector("#videoPleer");
let wrapPleer = document.querySelector(".wrap");
const loader = document.querySelector(".loader");
const rundomFilms = document.querySelector("#rundomFilms");
const btnToHome = document.querySelector("#btnToHome");
const MenuBtnToHome = document.querySelector("#MenuBtnToHome");
const Strimlists = document.querySelector("#listStrimes");
// Тв программы
const catalogLinks = [
  {
    id: 1,
    name: "Regby",
    link: "https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f",
    // link: '2',
  },
  {
    id: 2,
    name: "Hockey",
    link: "https://rutube.ru/play/embed/7a485ef5da9fe50ba939f36ca3e6ed96",
    // link: '1',
  },
  {
    id: 3,
    name: "NBA",
    link: "https://rutube.ru/play/embed/876cf3628c698e956de40c1c911b0c5f",
    // link: '1',
  },
  {
    id: 3,
    name: "Football Premier League",
    link: "https://rutube.ru/play/embed/e6fa77441a3b019526498775c5a5b9dc",
    // link: '1',
  },
];
// Фильмы
const randomFilms = [
  {
    id: 1,
    name: "Битлджус Битлджус | Beetlejuice Beetlejuice (2024)",
    link: "https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8",
    // link: '2',
  },
  {
    id: 2,
    name: "Чужой: Ромул / Alien: Romulus (2024)",
    link: "https://rutube.ru/play/embed/edf4662bfdf97433ced02ab6154313c4",
    // link: '1',
  },
  {
    id: 3,
    name: "Дэдпул и Росомаха (2024)",
    link: "https://rutube.ru/play/embed/f893c0764662db0b17b277d15d6e0871",
    // link: '1',
  },
  {
    id: 4,
    name: "Джокер (2019)",
    link: "https://rutube.ru/play/embed/81e784b6eba4c9d3d0539536d7e58243",
    // link: '1',
  },
  {
    id: 5,
    name: "Криминальное чтиво (1994)",
    link: "https://rutube.ru/play/embed/b655f8af33deef0514481b2bb39b90e2",
    // link: '1',
  },
  {
    id: 6,
    name: "Оппенгеймер (2023)",
    link: "https://rutube.ru/play/embed/ffe77a61fb1ab119c33638900d8a77e4",
    // link: '1',
  },
  {
    id: 7,
    name: "Дом у дороги (2024)",
    link: "https://rutube.ru/play/embed/22bd521930719eedd02383e9c81b16e2",
    // link: '1',
  },
  {
    id: 8,
    name: "Меч короля Артура (2017)",
    link: "https://rutube.ru/play/embed/129b5b143a47f3d208b5aa151c72780b",
    // link: '1',
  },
];
// Трансляции которые будут
let transLinks = [
  {
    id: 1,
    name: "test - 0",
    link: "https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f",
    data: "2024.10.08",
    time: "07:00",
    img: "",
    premium: false,
    active: 0,
  },
  {
    id: 2,
    name: "Test - 1",
    link: "https://video.matchtv.ru/iframe/feed/start/free_37fc60729a6fd4121ca228ebec12913d/1211989/59c2de9e6c20ce36f025a28e7eb41844/2208978000?sr=14&type_id=&width=100%25&height=100%25&lang=ru&skin_name=matchtv",
    data: "2024.10.08",
    time: "19:00",
    img: "",
    premium: false,
    active: 0,
  },
  {
    id: 3,
    name: "test - 2",
    link: "https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f",
    data: "2024.10.08",
    time: "13:10",
    img: "",
    premium: false,
    active: 0,
  },
  {
    id: 4,
    name: "test - 3",
    link: "https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f",
    data: "2024.10.08",
    time: "12:30",
    img: "",
    premium: false,
    active: 0,
  },
];

// if (
//   window.innerWidth < 900 &&
//   window.userAgentData.mobile
// ) {

// Открытие и закрытие меню
const burgerSvg = () => {
  menu.classList.toggle("active");
  navBTN.firstElementChild.children[0].attributes[2].value =
    menu.classList.contains("active")
      ? "M6 18L18 6M6 6l12 12"
      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
};
// Прием ссылки и запуск плеера
const openVideoIFrame = (linkVideo) => {
  wrapPleer.innerHTML = `<iframe id="videoPleer" src="${linkVideo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};
// загрузка контента
// document.addEventListener("DOMContentLoaded", () => {
window.addEventListener("load", () => {
  document.querySelector(".content").style.opacity = "0";

  if (!window.onload) {
    setTimeout(() => {
      loader.style.display = "none";
      document.querySelector(".content").style.opacity = "1";
    }, 3000);
  }
});

// Получение текужего времени и даты
let Data = new Date();
const hours = Data.getHours() > 9 ? Data.getHours() : "0" + Data.getHours();
const minutes =
  Data.getMinutes() > 9 ? Data.getMinutes() : "0" + Data.getMinutes();

// формат отображения времени для сравнения с временем показа
const time = `${hours}:${minutes}`;
// Формат отображения даты для сравнения с датой показа
const day = `${Data.getUTCFullYear()}.${
  Data.getUTCMonth() + 1 > 9
    ? Data.getUTCMonth() + 1
    : "0" + (Data.getUTCMonth() + 1)
}.${
  Data.getUTCDate() > 9 ? Data.getUTCDate() : "0" + Number(Data.getUTCDate())
}`;

// console.log(link.data);

// при нажатии, открывается home страница
btnToHome.addEventListener("click", () => {
  document.querySelector(".wrap__pages").classList.add("info__none");
});

// Обновление и возврат на страницу Info
MenuBtnToHome.addEventListener("click", () => {
  window.location.reload();
});

// при нажатии, запускается рандомный фильм из списка
rundomFilms.addEventListener("click", () => {
  const randomLink =
    randomFilms[Math.floor(Math.random() * randomFilms.length)];
  openVideoIFrame(randomLink.link);
  burgerSvg();
});

// при нажатии, открывается меню
navBTN.addEventListener("click", () => {
  burgerSvg();
});

// в открытом меню формируется список ссылок
catalogLinks.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("menu__list-item");
  li.innerHTML = `<button class="menu__list-link" id="${item.id}" name="${item.name}">${item.name}</butt>`;
  menuList.appendChild(li);

  li.firstChild.addEventListener("click", () => {
    openVideoIFrame(item.link);
    burgerSvg();
  });
});

// ListStrime
transLinks.forEach((item) => {
  const li = document.createElement("li");
//
  li.classList.add("list__strim-item");
  li.setAttribute("data", item.data);
  li.setAttribute("time", item.time);
  li.setAttribute("premium", item.premium);
  li.setAttribute("img", item.img);
  li.setAttribute("href", item.link);
  li.setAttribute("active", item.active);

  li.innerHTML = `<button
  class="list__strim-link"
  id="${item.id}"
  name="${item.name}">
  <h3>
  ${item.name}
  </h3>
  <span>
  </span>
  </butt>`;





  // выводим сегоднишние трансляции
  const itemAtrinut = li.attributes;
  // все сегодняшние трансляции
  if (itemAtrinut.data.value === day) {
    // время старта трансляции
    const timeStart = `${
      Number(itemAtrinut.time.value.split(":")[0]) +
      ":" +
      Number(itemAtrinut.time.value.split(":")[1])
    }`;
    // время окончания трансляции
    const timeFinish = `${
      Number(itemAtrinut.time.value.split(":")[0]) +
      2 +
      ":" +
      Number(itemAtrinut.time.value.split(":")[1])
    }`;


    if(Number(timeFinish.split(':')[0]) > Number(time.split(":")[0])){
      li.children[0].children[1].textContent = `Начало в - ${item.time}`;
      itemAtrinut.active.value = 1;
    }

    // проверка старта и окончания трансляции
    if (timeStart <= time && timeFinish >= time) {
      li.children[0].classList.add("active");
      li.children[0].children[1].textContent = `Трансляция началась`;
      itemAtrinut.active.value = 2;
      li.addEventListener("click", () => {
        openVideoIFrame(itemAtrinut.href.value);
      });
    }
    if(Number(timeFinish.split(':')[0]) < Number(time.split(":")[0])){
      li.children[0].children[1].textContent = `Трансляция закончилась`;
      itemAtrinut.active.value = 0;
      li.children[0].style.color = 'var(--disableGraay)'
      li.children[0].setAttribute('disabled', true)
    }

    if(li.attributes.active.value == '0'){
      Strimlists.insertBefore(li, Strimlists.children[0])
    }
    if (li.attributes.active.value == '2') {
    Strimlists.insertBefore(li, Strimlists.children[0])
    } else {
      Strimlists.insertBefore(li, Strimlists.lastChild)
    }


  }
});
// console.log(Strimlists.children);





// const tt = [1,5,2,9,6]

// tt.sort((a, b) => {
//   return a - b
// })



// console.dir('ok');
// console.dir(window.userAgentData.mobile);

// } else {
//   document.querySelector(".container").innerHTML = `<h1>Сори, только для мобильных устройств</h1>`;
//   setTimeout(() => {
//       window.location.reload();
//   }, 5000);
// }
