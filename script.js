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
    link: `
      <iframe
        src="https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '2',
  },
  {
    id: 2,
    name: "Hockey",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/7a485ef5da9fe50ba939f36ca3e6ed96"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 3,
    name: "NBA",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/876cf3628c698e956de40c1c911b0c5f"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
];
// Фильмы
const randomFilms = [
  {
    id: 1,
    name: "Битлджус Битлджус | Beetlejuice Beetlejuice (2024)",
    link: `<iframe
    src="https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8"
    frameBorder="0"
    allow="clipboard-write; autoplay"
    webkitAllowFullScreen
    mozallowfullscreen
    allowFullScreen
  ></iframe>
`,
    // link: '2',
  },
  {
    id: 2,
    name: "Чужой: Ромул / Alien: Romulus (2024)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/edf4662bfdf97433ced02ab6154313c4"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 3,
    name: "Дэдпул и Росомаха (2024)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/f893c0764662db0b17b277d15d6e0871"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 4,
    name: "Джокер (2019)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/81e784b6eba4c9d3d0539536d7e58243"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 5,
    name: "Криминальное чтиво (1994)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/b655f8af33deef0514481b2bb39b90e2"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 6,
    name: "Оппенгеймер (2023)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/ffe77a61fb1ab119c33638900d8a77e4"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 7,
    name: "Дом у дороги (2024)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/22bd521930719eedd02383e9c81b16e2"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
  {
    id: 8,
    name: "Меч короля Артура (2017)",
    link: `
      <iframe
        src="https://rutube.ru/play/embed/129b5b143a47f3d208b5aa151c72780b"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    `,
    // link: '1',
  },
];

// Трансляции которые будут
// Premium - трансляция целый день
// 0 - трансляция закончилась
// 1 - трансляция началась
// 2 - трансляция в процессе
let transLinks = [
  {
    id: 0,
    name: `Финал Федеральной регбийной лиги «Трудовые резервы». Первый день`,
    link: `<iframe src="https://vk.com/video_ext.php?oid=-40984897&id=456243477&hash=a933f090a704084f" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
    data: "2024.11.23",
    time: "09:00",
    img: "",
    premium: 'Premium',
    active: "Premium",
  },
  {
    id: 1,
    name: `Финал Федеральной регбийной лиги «Трудовые резервы». Второй день`,
    link: `<iframe src="https://vk.com/video_ext.php?oid=-40984897&id=456243478&hash=b53d3841e325382c" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
    data: "2024.11.24",
    time: "09:00",
    img: "",
    premium: 'Premium',
    active: "Premium",
  },
  {
    id: 2,
    name: `Франция — Аргентина | Летние тесты | Комментор - Семён Крюков`,
    link: `<iframe src="https://vk.com/video_ext.php?oid=-15550428&id=456244601&hash=17e60939fc942151" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
    data: "2024.11.22",
    time: "22:00",
    img: "",
    premium: false,
    active: 0,
  },
];

// Открытие и закрытие меню
const burgerSvg = () => {
  navBTN.classList.toggle("active");
  menu.classList.toggle("active");
  navBTN.firstElementChild.children[0].attributes[2].value =
    menu.classList.contains("active")
      ? "M6 18L18 6M6 6l12 12"
      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
};

// Прием ссылки и запуск плеера
const openVideoIFrame = (linkVideo) => {
  wrapPleer.innerHTML = `${linkVideo}`;
  // document.querySelector("#videoPleer").play();
  // burgerSvg();
};
// загрузка контента
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
    console.log("11");
    openVideoIFrame(item.link);

    burgerSvg();
  });
});


// ListStrime
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

  li.innerHTML = `<button class="list__strim-link" id="${item.id}" name="${item.name}">
                    <h3>${item.name}</h3>
                    <span>Начало в - ${item.time}</span>
                  </button>`;

  if (li.dataset.data === day) {
    const timeStart = `${Number(li.dataset.time.split(":")[0])}:${li.dataset.time.split(":")[1]}`;
    const timeFinish = `${Number(li.dataset.time.split(":")[0]) + 2}:${li.dataset.time.split(":")[1]}`;

    if (Number(timeFinish.split(":")[0]) > Number(time.split(":")[0])) {
      li.dataset.active = 1;
    }

    if (timeStart <= time && timeFinish >= time) {
      li.querySelector('.list__strim-link').classList.add("active");
      li.querySelector('span').textContent = "Трансляция началась";
      li.dataset.active = 2;
      li.addEventListener("click", () => openVideoIFrame(li.dataset.href));
    }

    if (li.dataset.premium === "Premium" && Number(time.split(":")[0]) < 22) {
      li.querySelector('span').textContent = "Трансляция еще идёт";
      li.querySelector('.list__strim-link').classList.add("active");
      li.dataset.active = "Premium";
      li.addEventListener("click", () => openVideoIFrame(li.dataset.href));
    }

    if (li.dataset.premium == 0 && Number(timeFinish.split(":")[0]) <= Number(time.split(":")[0])) {
      li.querySelector('span').textContent = "Трансляция закончилась";
      li.dataset.active = 0;
      li.querySelector('.list__strim-link').style.color = "var(--disableGraay)";
      li.querySelector('.list__strim-link').setAttribute("disabled", true);
    }

    Strimlists.insertBefore(li, Strimlists.lastChild);
  }
});

