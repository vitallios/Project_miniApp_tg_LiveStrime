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
    name: "Трансляция1",
    link: "https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8",
    data: "2024.10.05",
    time: "14:00",
    img: "./img/im1.jpg",
  },
  {
    id: 2,
    name: "Трансляция2",
    link: "https://rutube.ru/play/embed/edf4662bfdf97433ced02ab6154313c4",
    data: "2024.10.06",
    time: "14:00",
    img: "./img/im2.jpg",
  },
  {
    id: 3,
    name: "Трансляция3",
    link: "https://rutube.ru/play/embed/f893c0764662db0b17b277d15d6e0871",
    data: "2024.10.01",
    time: "10:50",
    img: "./img/im3.jpg",
  },
  {
    id: 4,
    name: "Трансляция4",
    link: "https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8",
    data: "2024.10.05",
    time: "19:00",
    img: "./img/im4.jpg",
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
    span.textContent = `${link.data} - ${link.time}`;
    button.appendChild(h3);
    button.appendChild(span);
    button.classList.add("slide");
    button.setAttribute("data-slide-to", index);
    button.setAttribute("id", index);
    button.setAttribute("data-time", link.time);
    button.setAttribute("data-link", link.link);
    button.setAttribute("data-data", link.data);
    button.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgb(21 254 255 / 40%)),url('${link.img}')`;
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
      if (i === slideIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
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
  // console.dir(item.getAttribute("data-time"));
  // console.dir(item.getAttribute("data-data"));

  let Data = new Date;
  const hours = Data.getHours();
  const minutes = Data.getMinutes();
  const time = `${hours}:${minutes}`;

  // let newTime = item.getAttribute("data-time") === time ? time : '00:00'; 

  const day = `${Data.getUTCFullYear()}.${(Data.getUTCMonth() + 1) > 9 ? (Data.getUTCMonth() + 1) : '0' + (Data.getUTCMonth() + 1)}.${(Data.getDay() - 1) > 9 ? (Data.getDay() - 1) : '0' + (Data.getDay() - 1)}`


  if (`${item.getAttribute("data-time")}` >= `${time}`) {
    console.log('non');
  } else {
    item.children[1].textContent = "Трансляция началась ";
    item.children[1].style.background = "#008000a6";
    item.children[1].style.fontSize = "18px";
    item.children[1].style.fontWeight = "bold";
    item.children[1].style.padding = "5px 10px";
    item.children[1].style.borderRadius = "10px";
    item.children[1].style.marginTop = "10px";
    item.classList.add("active-baner");
    item.addEventListener("click", () => {
      const link = item.getAttribute("data-link");
      openVideoIFrame(link);
    });
    // item.classList.remove("active-baner");
  }


  console.log(`${item.getAttribute("data-time")} === ${time}`);
  console.log(`${item.getAttribute("data-data")} === ${day}`);




});

// if (window.innerWidth < 900 && window.userAgentData.mobile) {
// console.dir('ok');
// console.dir(window.userAgentData.mobile);

// } else {
//   alert('Сори, только для мобильных устройств');
//   window.location.reload();
// }
