import {
  catalogLinks
} from "./live_failse/liveTv.js";
import {
  randomFilms
} from "./live_failse/liveFilms.js";
import {
  transLinks
} from "./live_failse/liveTranslation.js";

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
 * Проверяет, прошла ли дата трансляции
 * @param {string} date - Дата трансляции (YYYY.MM.DD)
 * @returns {boolean} true если дата прошла
 */
const isDatePassed = (date) => {
  if (!date) return false;
  return date < currentDay;
};

/**
 * Переключает состояние бургер-меню и меняет иконку
 */
const toggleBurgerMenu = () => {
  navBTN.classList.toggle("active");
  menu.classList.toggle("active");

  const svgPath = navBTN.firstElementChild.children[0];
  svgPath.setAttribute(
    'd',
    menu.classList.contains("active") ?
    "M6 18L18 6M6 6l12 12" :
    "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
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
 * @param {string} [date=currentDay] - Дата трансляции (YYYY.MM.DD)
 * @returns {boolean} true если трансляция активна
 */
const isTransmissionActive = (startTime, endTime, date = currentDay) => {
  if (date !== currentDay) return false;

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return {
      hours,
      minutes
    };
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const now = parseTime(currentTime);

  const startTotal = start.hours * 60 + start.minutes;
  const endTotal = end.hours * 60 + end.minutes;
  const nowTotal = now.hours * 60 + now.minutes;

  if (endTotal < startTotal) {
    return nowTotal >= startTotal || nowTotal <= endTotal;
  }

  return nowTotal >= startTotal && nowTotal <= endTotal;
};

/**
 * Рассчитывает время окончания трансляции
 * @param {string} startTime - Время начала (HH:MM)
 * @param {string} premium - Premium статус ("Premium" или любое другое значение)
 * @returns {Object} {startTime, endTime} - Форматированное время начала и окончания
 */
const calculateTransmissionTime = (startTime, premium) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const durationHours = premium === "Premium" ? 8 : 3;

  let endHour = hours + durationHours;
  let endDay = currentDay;

  if (endHour >= 24) {
    endHour -= 24;
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    endDay = `${nextDate.getUTCFullYear()}.${(nextDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${nextDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    startTime: formatTime(hours, minutes),
    endTime: formatTime(endHour, minutes),
    endDay
  };
};

/**
 * Обновленная функция рендеринга трансляций
 */
const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  transLinks.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const { startTime, endTime, endDay } = calculateTransmissionTime(item.time, item.premium);
    const isActive = isTransmissionActive(startTime, endTime, item.data);
    const isPast = isDatePassed(item.data) || 
                  (item.data === currentDay && currentTime > endTime);

    let timeInfo;
    if (isPast) {
      timeInfo = "Завершено";
    } else if (isActive) {
      timeInfo = item.premium === "Premium" 
        ? "Трансляция весь день" 
        : `Идет трансляция (до ${endTime})`;
    } else {
      if (item.data === currentDay) {
        timeInfo = `Начало в ${startTime}`;
      } else {
        timeInfo = `Запланировано на ${item.data} в ${startTime}`;
      }
    }

    const li = document.createElement('li');
    li.className = `list__strim-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`;
    li.dataset.id = `transmission-${index}`;
    li.dataset.time = item.time;
    li.dataset.premium = item.premium || '';
    li.dataset.data = item.data || '';
    li.dataset.img = item.img || '';
    li.dataset.href = iframeHTML;
    li.dataset.active = isActive ? '1' : '0';
    li.dataset.category = item.category || 'другое';

    li.innerHTML = `
      <button class="list__strim-link ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}" 
              id="${item.id}" 
              ${isPast ? 'disabled' : ''}
              dataTransmissionIndex="${item.data}"  
              startTransmissionTime="${startTime}" 
              endTime="${endTime}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
        <h3>${item.name}</h3>
        <span>${timeInfo}</span>
        ${item.premium === "Premium" ? `<span class="list__strim-premium">Premium</span>` : ""}
      </button>
    `;

    if (isActive && !isPast) {
      li.addEventListener('click', () => openVideoIFrame(iframeHTML));
    }

    Strimlists.appendChild(li);
  });

  sortTransmissions();
};

/**
 * Сортирует трансляции: активные > сегодняшние > будущие
 */
const sortTransmissions = () => {
  const items = Array.from(Strimlists.children);

  items.sort((a, b) => {
    const aActive = a.dataset.active === '1';
    const bActive = b.dataset.active === '1';
    const aDate = a.dataset.data;
    const bDate = b.dataset.data;
    const aTime = a.dataset.time.split(':').map(Number);
    const bTime = b.dataset.time.split(':').map(Number);
    const aPast = a.classList.contains('past');
    const bPast = b.classList.contains('past');

    // Активные трансляции в начало
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // Затем сегодняшние трансляции
    if (aDate === currentDay && bDate !== currentDay) return -1;
    if (aDate !== currentDay && bDate === currentDay) return 1;

    // Затем завершенные в конец
    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;

    // Затем сортируем по времени
    return (aTime[0] * 60 + aTime[1]) - (bTime[0] * 60 + bTime[1]);
  });

  // Очищаем список и добавляем элементы в новом порядке
  Strimlists.innerHTML = '';
  items.forEach(item => Strimlists.appendChild(item));
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
  document.querySelector('.content').style.opacity = '0';

  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.content').style.opacity = '1';
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