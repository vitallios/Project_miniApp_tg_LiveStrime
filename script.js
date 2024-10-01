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
];
// Трансляции которые будут
const transLinks = [
  {
    id: 1,
    name: "Трансляция1 ",
    link: "https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8",
    data: "2024.10.01",
    time: "18:00",
    img: "",
  },
  {
    id: 2,
    name: "Трансляция2 ",
    link: "https://rutube.ru/play/embed/edf4662bfdf97433ced02ab6154313c4",
    data: "2024.10.01",
    time: "15:45",
    img: "",
  },
  {
    id: 3,
    name: "Трансляция3 ",
    link: "https://rutube.ru/play/embed/f893c0764662db0b17b277d15d6e0871",
    data: "2024.10.02",
    time: "10:50",
    img: "",
  },
  {
    id: 4,
    name: "Трансляция4 ",
    link: "https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8",
    data: "2024.10.01",
    time: "11:50",
    img: "",
  },
];

function burgerSvg() {
  menu.classList.toggle("active");
  navBTN.firstElementChild.children[0].attributes[2].value =
    menu.classList.contains("active")
      ? "M6 18L18 6M6 6l12 12"
      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
}
function openVideoIFrame(linkVideo) {
  wrapPleer.innerHTML = `<iframe id="videoPleer" src="${linkVideo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

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

let Data = new Date();
const hours = Data.getHours();
const minutes = Data.getMinutes();

// формат отображения времени для сравнения с временем показа
const time = `${hours}:${minutes}`;
// Формат отображения даты для сравнения с датой показа
const day = `${Data.getUTCFullYear()}.${
  Data.getUTCMonth() + 1 > 9
    ? Data.getUTCMonth() + 1
    : "0" + (Data.getUTCMonth() + 1)
    }.${Data.getDay() - 1 > 9
      ? Data.getDay() - 1
      : "0" + (Data.getDay() - 1)}`;

// при нажатии, открывается home страница
btnToHome.addEventListener("click", () => {
  document.querySelector(".wrap__pages").classList.add("info__none");
});

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

// HomeScreen
const slides = document.querySelector(".slides");
const leftArrow = document.querySelector(".slider-arrow.left");
const rightArrow = document.querySelector(".slider-arrow.right");
const sliderNavs = document.querySelector(".slider-nav");
let currentSlide = 0;

transLinks.forEach((link, index) => {
  const button = document.createElement("button");
  const h3 = document.createElement("h3");
  const span = document.createElement("span");

  h3.textContent = link.name;
  //
  span.textContent = `${link.data}` === `${day}`
  ? `Сегодня в ${link.time}`
  : `${link.data} - ${link.time}`;
  // проверка есть ли картинка для слайда
  button.style.backgroundImage = `${link.img}`
  ? `url('${link.img}')`
  : `linear-gradient(rgba(0, 0, 0, 0.5), rgb(21 254 255 / 40%))`;
  //
  button.appendChild(h3);
  button.appendChild(span);
  button.classList.add("slide");
  button.setAttribute("data-slide-to", index);
  button.setAttribute("id", index);
  button.setAttribute("data-time", link.time);
  button.setAttribute("data-link", link.link);
  button.setAttribute("data-data", link.data);
  //
  slides.appendChild(button);

  const spanNav = document.createElement("span");
  spanNav.classList.add("slider-dot");

  spanNav.setAttribute("data-slide-to", index);
  sliderNavs.appendChild(spanNav);

  spanNav.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

function showSlide(slideIndex) {
  slides.style.transform = `translateX(${slideIndex * -100}%)`;
  const dots = document.querySelectorAll(".slider-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === slideIndex);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % transLinks.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + transLinks.length) % transLinks.length;
  showSlide(currentSlide);
}

leftArrow.addEventListener("click", prevSlide);
rightArrow.addEventListener("click", nextSlide);

// });

const sliderItem = document.querySelectorAll(".slide");

sliderItem.forEach((item) => {
  const sliderItemData = item.getAttribute("data-data");
  const sliderItemTime = item.getAttribute("data-time");
  const sliderItemLink = item.getAttribute("data-link");
  const sliderItemId = item.getAttribute("data-id");
  // проверка совподает ли дата
  if (`${sliderItemData}` <= `${day}`) {
    // console.log('0k');
    const listItem = document.createElement("li");
    const listLink = document.createElement("button");
    const listP = document.createElement("p");
    const listSpan = document.createElement("span");
    listItem.classList.add("listStrimes__item");
    listLink.setAttribute("data-link", sliderItemLink);
    listLink.setAttribute("data-time", sliderItemTime);
    listLink.setAttribute("data-data", sliderItemData);
    listLink.setAttribute("data-id", sliderItemId);
    listLink.classList.add("slider__item-link");
    listP.textContent = `${item.children[0].textContent}`;
    listSpan.textContent = `${sliderItemData} : ${sliderItemTime}`;
    listP.appendChild(listSpan);
    listLink.appendChild(listP);
    listItem.appendChild(listLink);
    Strimlists.appendChild(listItem);    //
    // проверка совпадает ли время
    if (`${sliderItemTime}` <= `${time}` ) {
      item.children[1].textContent = "Трансляция началась";
      item.children[1].classList.add("activeVideo");
      item.addEventListener("click", () => {
      let link = sliderItemLink;
        openVideoIFrame(link);
      });
      // если трансляция сегодня, - подсвечивает текст и даем ссылки на трансляцию
      const listStrimesItem = document.querySelectorAll(".listStrimes__item");
      listStrimesItem.forEach((item) => {


        if (item.firstChild.attributes[2].value === `${day}`) {
          //
          item.children[0].style.fontWeight =  item.children[0].attributes[1].value >= `${time}`
          ? "bold"
          : "normal";
          //
          item.children[0].style.color = item.children[0].attributes[1].value >= `${time}`
          ? "#15feff"
          : "#D3D3D3FF";
          //
          item.children[0] = item.children[0].attributes[1].value >= `${time}`
          ? `Сегодня в ${item.children[0].textContent}`
          : `${item.children[0].attributes[2].value} - ${item.children[0].textContent}`;
          //

          item.children[0].style.opacity = `${Number(item.children[0].attributes[1].value.split(":")[0]) + 2}` <= `${time}`
          ?  "0.5"
          :  "1";
          //
          console.dir(item.children[0].children[0].textContent.split(" ")[0]);
          if (`${Number(item.children[0].attributes[1].value.split(":")[0])}` >= `${time}`)
          {
            console.log('Еще не началась');
          }
          else if(`${Number(item.children[0].attributes[1].value.split(":")[0]) + 2}` < `${time}`)
          {
            console.log('Закончилась');
            item.children[0].children[0].children[0].textContent = "Трансляция закончилась";
          }
          else
          {
            console.log('Уже идёт');
            item.children[0].children[0].children[0].textContent = "Трансляция уже идёт";
            item.children[0].addEventListener("click", () => {
              openVideoIFrame(item.children[0].attributes[0].value);
            })

          }

        }
      });
    }
  }
  // console.log(`${sliderItemTime} === ${time}`);
  // console.log(`${sliderItemData} === ${day}`);
});




// if (window.innerWidth < 900 && window.userAgentData.mobile) {
// console.dir('ok');
// console.dir(window.userAgentData.mobile);

// } else {
//   alert('Сори, только для мобильных устройств');
//   window.location.reload();
// }
