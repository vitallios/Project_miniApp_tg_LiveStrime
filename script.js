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
const filterButtons = document.querySelector(".filter-buttons");

// Текущие дата и время
const currentDate = new Date();
const currentHours = currentDate.getHours().toString().padStart(2, '0');
const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
const currentTime = `${currentHours}:${currentMinutes}`;
const currentDay = `${currentDate.getUTCFullYear()}.${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${currentDate.getUTCDate().toString().padStart(2, '0')}`;

// Переменные для фильтрации
let currentFilter = 'all';
const categories = [...new Set(transLinks.map(item => item.category || 'другое'))];

/**
 * Преобразует время в формате HH:MM в минуты с начала дня
 * @param {string} timeStr - Время в формате HH:MM
 * @returns {number} Количество минут с начала дня
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Проверяет, прошла ли указанная дата по сравнению с текущей датой
 * @param {string} date - Дата в формате YYYY.MM.DD
 * @returns {boolean} Возвращает true, если переданная дата раньше текущей
 */
const isDatePassed = (date) => {
  if (!date) return false;
  return date < currentDay;
};

/**
 * Переключает состояние бургер-меню (открыто/закрыто) и меняет иконку гамбургера на крестик
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
 * Открывает видео в плеере, вставляя HTML iframe
 * @param {string} videoHTML - HTML-код iframe с видео
 */
const openVideoIFrame = (videoHTML) => {
  wrapPleer.innerHTML = videoHTML;
};

/**
 * Создает безопасный iframe из HTML-строки, проверяя наличие src
 * @param {string} html - HTML-код iframe
 * @returns {string} Безопасный iframe или пустая строка, если src отсутствует
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
 * Проверяет, активна ли трансляция в текущий момент времени
 * @param {string} startTime - Время начала в формате HH:MM
 * @param {string} endTime - Время окончания в формате HH:MM
 * @param {string} [date=currentDay] - Дата трансляции в формате YYYY.MM.DD
 * @returns {boolean} Возвращает true, если трансляция активна сейчас
 */
const isTransmissionActive = (startTime, endTime, date = currentDay) => {
  if (date !== currentDay) return false;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const nowMinutes = timeToMinutes(currentTime);

  // Если трансляция переходит через полночь (например, 22:00-01:00)
  if (endMinutes < startMinutes) {
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }

  // Обычный случай (например, 10:00-13:00)
  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
};

/**
 * Рассчитывает время окончания трансляции на основе времени начала и типа (Premium/обычная)
 * @param {string} startTime - Время начала в формате HH:MM
 * @param {string} premium - Строка "Premium" для премиум-трансляций
 * @returns {Object} Объект с временем начала, окончания и датой окончания
 */
const calculateTransmissionTime = (startTime, premium) => {
  const startMinutes = timeToMinutes(startTime);
  const durationMinutes = premium === "Premium" ? 8 * 60 : 3 * 60;
  const endMinutes = startMinutes + durationMinutes;

  let endDay = currentDay;
  
  // Если трансляция переходит на следующий день
  if (endMinutes >= 1440) { // 1440 минут = 24 часа
    endDay = new Date(currentDate);
    endDay.setDate(endDay.getDate() + 1);
    endDay = `${endDay.getUTCFullYear()}.${(endDay.getUTCMonth() + 1).toString().padStart(2, '0')}.${endDay.getUTCDate().toString().padStart(2, '0')}`;
  }

  const endHour = Math.floor((endMinutes % 1440) / 60);
  const endMinute = endMinutes % 60;

  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    startTime: startTime,
    endTime: formatTime(endHour, endMinute),
    endDay: endDay
  };
};

/**
 * Проверяет, завершена ли трансляция
 * @param {Object} item - Объект трансляции
 * @returns {boolean} Возвращает true, если трансляция завершена
 */
const isTransmissionPast = (item) => {
  // Если дата трансляции уже прошла
  if (isDatePassed(item.data)) return true;
  
  const { endTime, endDay } = calculateTransmissionTime(item.time, item.premium);
  
  // Если трансляция переходит на следующий день
  if (endDay !== currentDay) {
    // Проверяем, не прошла ли дата окончания
    if (isDatePassed(endDay)) return true;
    
    // Если дата окончания сегодня, проверяем время
    if (endDay === currentDay) {
      return timeToMinutes(currentTime) > timeToMinutes(endTime);
    }
    return false;
  }
  
  // Для трансляций в пределах одного дня
  return timeToMinutes(currentTime) > timeToMinutes(endTime);
};

/**
 * Рендерит список трансляций с учетом текущего фильтра
 */
const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  transLinks.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const { startTime, endTime, endDay } = calculateTransmissionTime(item.time, item.premium);
    const isActive = isTransmissionActive(startTime, endTime, item.data);
    const isPast = isTransmissionPast(item);
    const isFuture = item.data === currentDay && timeToMinutes(currentTime) < timeToMinutes(startTime);

    // Пропускаем элементы, которые не соответствуют текущему фильтру
    if (currentFilter === 'active' && !isActive) return;
    if (currentFilter === 'planned' && (isActive || isPast)) return;
    if (currentFilter !== 'all' && currentFilter !== 'active' && currentFilter !== 'planned' && 
        item.category !== currentFilter) return;

    let timeInfo;
    if (isPast) {
      timeInfo = "Завершено";
    } else if (isActive) {
      timeInfo = item.premium === "Premium" 
        ? "Трансляция весь день" 
        : `Идет трансляция (до ${endTime})`;
    } else if (isFuture) {
      timeInfo = `Начнётся в ${startTime}`;
    } else {
      timeInfo = `Запланировано на ${item.data} в ${startTime}`;
    }

    const li = document.createElement('li');
    li.className = `list__strim-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`;
    li.dataset.id = `transmission-${index}`;
    li.dataset.time = item.time;
    li.dataset.premium = item.premium || '';
    li.dataset.data = item.data || '';
    li.dataset.img = item.img || '';
    li.dataset.href = iframeHTML;
    li.dataset.active = isActive ? '1' : '0';
    li.dataset.category = item.category || 'другое';

    li.innerHTML = `
      <button class="list__strim-link ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}" 
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
 * Сортирует трансляции в порядке: активные > сегодняшние > будущие > завершенные
 */
const sortTransmissions = () => {
  const items = Array.from(Strimlists.children);

  items.sort((a, b) => {
    const aActive = a.dataset.active === '1';
    const bActive = b.dataset.active === '1';
    const aDate = a.dataset.data;
    const bDate = b.dataset.data;
    const aTime = timeToMinutes(a.dataset.time);
    const bTime = timeToMinutes(b.dataset.time);
    const aPast = a.classList.contains('past');
    const bPast = b.classList.contains('past');
    const aFuture = a.classList.contains('future');
    const bFuture = b.classList.contains('future');

    // 1. Активные трансляции в начало
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // 2. Будущие трансляции сегодня
    if (aFuture && bFuture && aDate === currentDay && bDate === currentDay) {
      return aTime - bTime;
    }
    if (aFuture && !bFuture && aDate === currentDay) return -1;
    if (!aFuture && bFuture && bDate === currentDay) return 1;

    // 3. Сегодняшние трансляции
    if (aDate === currentDay && bDate !== currentDay) return -1;
    if (aDate !== currentDay && bDate === currentDay) return 1;

    // 4. Завершенные в конец
    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;

    // 5. Сортировка по дате и времени
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    return aTime - bTime;
  });

  // Очищаем список и добавляем элементы в новом порядке
  Strimlists.innerHTML = '';
  items.forEach(item => Strimlists.appendChild(item));
};

/**
 * Инициализирует каталог трансляций в боковом меню
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

/**
 * Создает кнопки фильтрации трансляций
 */
const createFilterButtons = () => {
  const buttonsHTML = `
    <button class="filter-btn active" data-filter="all">Все трансляции</button>
    <button class="filter-btn" data-filter="active">Активные сейчас</button>
    <button class="filter-btn" data-filter="planned">Запланированные</button>
    ${categories.map(category => 
      `<button class="filter-btn" data-filter="${category}">${category}</button>`
    ).join('')}
  `;
  
  filterButtons.innerHTML = buttonsHTML;

  // Добавляем обработчики событий для кнопок фильтрации
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTransmissions();
    });
  });
};

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
  document.querySelector('.content').style.opacity = '0';

  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.content').style.opacity = '1';
    initCatalogMenu();
    createFilterButtons();
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