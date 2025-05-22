import { catalogLinks } from "./live_failse/liveTv.js";
import { randomFilms } from "./live_failse/liveFilms.js";
import { transLinks } from "./live_failse/liveTranslation.js";

// Получаем элементы DOM
const navBTN = document.querySelector("#menu-btn");
const menu = document.querySelector(".menu");
const menuList = document.querySelector("#menu__list");
let wrapPleer = document.querySelector(".wrap");
const loader = document.querySelector(".loader");
const rundomFilms = document.querySelector("#rundomFilms");
const btnToHome = document.querySelector("#btnToHome");
const MenuBtnToHome = document.querySelector("#MenuBtnToHome");
const Strimlists = document.querySelector("#listStrimes");

// Текущие дата и время
const currentDate = new Date();
const currentHours = currentDate.getHours().toString().padStart(2, '0');
const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
const currentTime = `${currentHours}:${currentMinutes}`;
const currentDay = `${currentDate.getUTCFullYear()}.${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${currentDate.getUTCDate().toString().padStart(2, '0')}`;

/**
 * Переключает состояние бургер-меню и меняет иконку
 */
const toggleBurgerMenu = () => {
  navBTN.classList.toggle("active");
  menu.classList.toggle("active");
  
  // Меняем иконку меню (гамбургер/крестик)
  const svgPath = navBTN.firstElementChild.children[0];
  svgPath.setAttribute(
    'd', 
    menu.classList.contains("active") 
      ? "M6 18L18 6M6 6l12 12" 
      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
  );
};

/**
 * Открывает видео в плеере
 * @param {string} videoHTML - HTML-код iframe с видео
 */
const openVideoIFrame = (videoHTML) => {
  wrapPleer.innerHTML = videoHTML;
};

/**
 * Создает безопасный iframe из HTML-строки
 * @param {string} html - HTML-код iframe
 * @returns {string} Безопасный iframe или пустая строка
 */
const getSafeIframe = (html) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const iframe = doc.querySelector('iframe');
    
    if (!iframe || !iframe.src) return '';
    
    // Создаем новый чистый iframe с минимальными атрибутами
    return `<iframe src="${iframe.src}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  } catch (error) {
    console.error('Ошибка разбора iframe:', error);
    return '';
  }
};

/**
 * Проверяет, активна ли трансляция в текущий момент
 * @param {string} startTime - Время начала (HH:MM)
 * @param {string} endTime - Время окончания (HH:MM)
 * @returns {boolean} true если трансляция активна
 */
const isTransmissionActive = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const [currentHour, currentMin] = currentTime.split(':').map(Number);
  
  const currentTotal = currentHour * 60 + currentMin;
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;
  
  return currentTotal >= startTotal && currentTotal <= endTotal;
};

/**
 * Рассчитывает время окончания трансляции
 * @param {string} startTime - Время начала (HH:MM)
 * @param {string} premium - Premium статус
 * @returns {Object} {startTime, endTime}
 */
const calculateTransmissionTime = (startTime, premium) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const durationHours = premium === "Premium" ? 8 : 3;
  let endHour = hours + durationHours;
  
  // Обработка перехода через полночь
  if (endHour >= 24) {
    endHour -= 24;
  }
  
  return {
    startTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    endTime: `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  };
};

/**
 * Создает HTML-код для элемента трансляции
 * @param {Object} item - Объект трансляции
 * @param {boolean} isActive - Активна ли трансляция
 * @returns {string} HTML-код элемента
 */
const createTransmissionHTML = (item, isActive) => {
  const timeInfo = isActive 
    ? (item.premium === "Premium" ? "Трансляция целый день" : "Трансляция началась")
    : `Начало в - ${item.time}`;
  
  return `
    <button class="list__strim-link ${isActive ? 'active' : ''}" id="${item.id}" name="${item.name}">
      ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
      <h3>${item.name}</h3>
      <span>${timeInfo}</span>
      ${item.premium === "Premium" ? `<span class="list__strim-premium">Premium</span>` : ""}
    </button>
  `;
};

/**
 * Обрабатывает и отображает список трансляций
 */
const renderTransmissions = () => {
  // Очищаем список перед обновлением
  Strimlists.innerHTML = '';
  
  // Фильтруем трансляции по дате
  const todayTransmissions = transLinks.filter(item => item.data === currentDay);
  
  // Обрабатываем каждую трансляцию
  todayTransmissions.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;
    
    const {startTime, endTime} = calculateTransmissionTime(item.time, item.premium);
    const isActive = isTransmissionActive(startTime, endTime);
    
    const li = document.createElement('li');
    li.className = `list__strim-item ${isActive ? 'active' : ''}`;
    li.dataset.id = index;
    li.dataset.time = item.time;
    li.dataset.premium = item.premium || '';
    li.dataset.img = item.img || '';
    li.dataset.href = iframeHTML;
    li.dataset.active = isActive ? '1' : '0';
    li.dataset.category = item.category || 'другое';
    
    li.innerHTML = createTransmissionHTML(item, isActive);
    
    if (isActive) {
      li.addEventListener('click', () => openVideoIFrame(iframeHTML));
    }
    
    Strimlists.appendChild(li);
  });
  
  // Сортируем трансляции по времени начала
  sortTransmissions();
};

/**
 * Сортирует трансляции по времени начала
 */
const sortTransmissions = () => {
  const items = Array.from(Strimlists.children);
  
  items.sort((a, b) => {
    const aTime = a.dataset.time.split(':').map(Number);
    const bTime = b.dataset.time.split(':').map(Number);
    return (aTime[0] * 60 + aTime[1]) - (bTime[0] * 60 + bTime[1]);
  });
  
  // Активные трансляции в начале списка
  const activeItems = items.filter(item => item.dataset.active === '1');
  const inactiveItems = items.filter(item => item.dataset.active === '0');
  
  Strimlists.innerHTML = '';
  Strimlists.append(...activeItems, ...inactiveItems);
};

/**
 * Инициализирует каталог трансляций в меню
 */
const initCatalogMenu = () => {
  catalogLinks.forEach(item => {
    const li = document.createElement('li');
    li.className = 'menu__list-item';
    li.innerHTML = `
      <button class="menu__list-link" id="${item.id}" name="${item.name}">
        <img src="${item.img}" alt="${item.name}">
        ${item.name}
      </button>
    `;
    
    li.querySelector('button').addEventListener('click', () => {
      openVideoIFrame(item.link);
      toggleBurgerMenu();
    });
    
    menuList.appendChild(li);
  });
};

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
  // Плавное появление контента после загрузки
  document.querySelector('.content').style.opacity = '0';
  
  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.content').style.opacity = '1';
    
    // Инициализируем компоненты
    initCatalogMenu();
    renderTransmissions();
  }, 1000);
});

// Обработчики событий
navBTN.addEventListener('click', toggleBurgerMenu);
btnToHome.addEventListener('click', () => {
  document.querySelector('.wrap__pages').classList.add('info__none');
});
MenuBtnToHome.addEventListener('click', () => window.location.reload());
rundomFilms.addEventListener('click', () => {
  const randomItem = randomFilms[Math.floor(Math.random() * randomFilms.length)];
  openVideoIFrame(randomItem.link);
  toggleBurgerMenu();
});