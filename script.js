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
 * Переключает состояние бургер-меню и меняет иконку
 */
const toggleBurgerMenu = () => {
  navBTN.classList.toggle("active");
  menu.classList.toggle("active");

  // Меняем иконку меню (гамбургер/крестик)
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
 * @param {string} [date=currentDay] - Дата трансляции (YYYY.MM.DD)
 * @returns {boolean} true если трансляция активна
 */
const isTransmissionActive = (startTime, endTime, date = currentDay) => {
  // Если дата не совпадает с текущей - трансляция неактивна
  if (date !== currentDay) return false;

  // Разбираем время на часы и минуты
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

  // Конвертируем время в минуты с начала суток
  const startTotal = start.hours * 60 + start.minutes;
  const endTotal = end.hours * 60 + end.minutes;
  const nowTotal = now.hours * 60 + now.minutes;

  // Обрабатываем случай, когда трансляция переходит через полночь
  if (endTotal < startTotal) {
    return nowTotal >= startTotal || nowTotal <= endTotal;
  }

  return nowTotal >= startTotal && nowTotal <= endTotal;
};

/**
 * Проверяет, завершилась ли трансляция
 * @param {string} endTime - Время окончания (HH:MM)
 * @param {string} [date=currentDay] - Дата трансляции (YYYY.MM.DD)
 * @returns {boolean} true если трансляция завершена
 */
const isTransmissionFinished = (endTime, date = currentDay) => {
  // Если дата не совпадает с текущей - трансляция неактивна
  if (date !== currentDay) return false;

  // Разбираем время на часы и минуты
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return {
      hours,
      minutes
    };
  };

  const end = parseTime(endTime);
  const now = parseTime(currentTime);

  // Конвертируем время в минуты с начала суток
  const endTotal = end.hours * 60 + end.minutes;
  const nowTotal = now.hours * 60 + now.minutes;

  return nowTotal > endTotal;
};

/**
 * Рассчитывает время окончания трансляции
 * @param {string} startTime - Время начала (HH:MM)
 * @param {string} premium - Premium статус ("Premium" или любое другое значение)
 * @returns {Object} {startTime, endTime} - Форматированное время начала и окончания
 */
const calculateTransmissionTime = (startTime, premium) => {
  const [hours, minutes] = startTime.split(':').map(Number);

  // Определяем длительность трансляции в часах
  const durationHours = premium === "Premium" ? 8 : 3;

  // Рассчитываем время окончания
  let endHour = hours + durationHours;
  let endDay = currentDay;

  // Если трансляция переходит на следующий день
  if (endHour >= 24) {
    endHour -= 24;
    // Обновляем дату окончания (упрощенная логика, без учета месяца/года)
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    endDay = `${nextDate.getUTCFullYear()}.${(nextDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${nextDate.getUTCDate().toString().padStart(2, '0')}`;
  }

  // Форматируем время с ведущими нулями
  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    startTime: formatTime(hours, minutes),
    endTime: formatTime(endHour, minutes),
    endDay // Добавляем дату окончания для случаев перехода через полночь
  };
};

/**
 * Создает HTML-код для элемента трансляции
 * @param {Object} item - Объект трансляции
 * @param {boolean} isActive - Активна ли трансляция
 * @param {boolean} isFinished - Завершена ли трансляция
 * @returns {string} HTML-код элемента
 */
const createTransmissionHTML = (item, isActive, isFinished) => {
  const timeInfo = isActive ?
    (item.premium === "Premium" ? "Трансляция целый день" : "Трансляция началась") :
    (isFinished ? "Трансляция завершена" : `Начало в - ${item.time}`);

  return `
    <button class="list__strim-link ${isActive ? 'active' : ''} ${isFinished ? 'finished' : ''}" id="${item.id}" name="${item.name}">
      ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
      <h3>${item.name}</h3>
      <span>${timeInfo}</span>
      ${item.premium === "Premium" ? `<span class="list__strim-premium">Premium</span>` : ""}
    </button>
  `;
};

/**
 * Обновленная функция рендеринга трансляций с учетом улучшенных временных функций
 */
const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  transLinks.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    // Рассчитываем время трансляции
    const {
      startTime,
      endTime,
      endDay
    } = calculateTransmissionTime(item.time, item.premium);
    const isActive = isTransmissionActive(startTime, endTime, item.data);
    const isFinished = isTransmissionFinished(endTime, item.data);

    // Формируем информацию о времени
    let timeInfo;
    if (isActive) {
      timeInfo = item.premium === "Premium" ?
        "Трансляция весь день" :
        `Идет трансляция (до ${endTime})`;
    } else if (isFinished) {
      timeInfo = "Трансляция завершена";
    } else {
      if (item.data === currentDay) {
        timeInfo = `Начало в ${startTime}`;
      } else {
        timeInfo = `Запланировано на ${item.data}`;
      }
    }

    // Создаем элемент
    const li = document.createElement('li');
    li.className = `list__strim-item ${isActive ? 'active' : ''} ${isFinished ? 'finished' : ''}`;
    li.dataset.id = `transmission-${index}`;
    li.dataset.time = item.time;
    li.dataset.premium = item.premium || '';
    li.dataset.data = item.data || '';
    li.dataset.img = item.img || '';
    li.dataset.href = iframeHTML;
    li.dataset.active = isActive ? '1' : '0';
    li.dataset.finished = isFinished ? '1' : '0';
    li.dataset.category = item.category || 'другое';

    li.innerHTML = `
      <button class="list__strim-link ${isActive ? 'active' : ''} ${isFinished ? 'finished' : ''}" 
              id="${item.id}" 
              dataTransmissionIndex="${item.data}"  
              startTransmissionTime="${startTime}" 
              endTime="${endTime}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
        <h3>${item.name}</h3>
        <span>${timeInfo}</span>
        ${item.premium === "Premium" ? `<span class="list__strim-premium">Premium</span>` : ""}
      </button>
    `;

    if (isActive) {
      li.addEventListener('click', () => openVideoIFrame(iframeHTML));
    }

    Strimlists.appendChild(li);
  });

  sortTransmissions();
};

/**
 * Сортирует трансляции по времени начала
 */
const sortTransmissions = () => {
  const items = Array.from(Strimlists.children);

  items.sort((a, b) => {
    // Сначала сортируем по статусу (активные > запланированные > завершенные)
    const aActive = a.dataset.active === '1';
    const bActive = b.dataset.active === '1';
    const aFinished = a.dataset.finished === '1';
    const bFinished = b.dataset.finished === '1';

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    if (aFinished && !bFinished) return 1;
    if (!aFinished && bFinished) return -1;

    // Затем сортируем по времени начала
    const aTime = a.dataset.time.split(':').map(Number);
    const bTime = b.dataset.time.split(':').map(Number);
    return (aTime[0] * 60 + aTime[1]) - (bTime[0] * 60 + bTime[1]);
  });

  // Группируем элементы по статусам
  const activeItems = items.filter(item => item.dataset.active === '1');
  const upcomingItems = items.filter(item => 
    item.dataset.active === '0' && 
    item.dataset.finished === '0' && 
    (item.dataset.data === currentDay || item.dataset.data > currentDay)
  );
  const finishedItems = items.filter(item => item.dataset.finished === '1');

  // Очищаем список и добавляем элементы в правильном порядке
  Strimlists.innerHTML = '';
  Strimlists.append(...activeItems, ...upcomingItems, ...finishedItems);
};

/**
 * Инициализирует каталог трансляций в меню
 * 
 * @function initCatalogMenu
 * @description Создает пункты меню для каждого элемента из catalogLinks
 */
const initCatalogMenu = () => {
  // Создаем пункты меню для каждого элемента из catalogLinks
  catalogLinks.forEach(item => {
    const li = document.createElement('li');
    li.className = 'menu__list-item';

    // Создаем кнопку с текстом и изображением
    li.innerHTML = `
      <button class="menu__list-link" id="${item.id}" name="${item.name}">
        <img src="${item.img}" alt="${item.name}">
        ${item.name}
      </button>
    `;

    // Добавляем обработчик клика на кнопку
    li.querySelector('button').addEventListener('click', () => {
      openVideoIFrame(item.link);
      toggleBurgerMenu();
    });

    // Добавляем пункт меню в список
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
