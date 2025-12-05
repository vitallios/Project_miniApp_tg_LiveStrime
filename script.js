import {
  catalogLinks
} from "./live_failse/liveTv.js";
import {
  randomFilms
} from "./live_failse/liveFilms.js";
import {
  transLinks
} from "./live_failse/liveTranslation.js";

// DOM элементы
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

// Текущая дата и время
let currentDate = new Date();
let currentHours = currentDate.getHours().toString().padStart(2, '0');
let currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
let currentTime = `${currentHours}:${currentMinutes}`;
let currentDay = `${currentDate.getUTCFullYear()}.${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${currentDate.getUTCDate().toString().padStart(2, '0')}`;

// Константы
const HIDE_AFTER_MINUTES = 10; // Скрывать через 10 минут после окончания
const TIME_CONFIG = {
  ALL_DAY_DURATION: 10 * 60, // 10 часов в минутах
  REGULAR_DURATION: 3 * 60   // 3 часа в минутах
};

const TEXT = {
  PREMIUM: 'Premium',
  ALL_DAY: 'Весь день',
  ACTIVE_NOW: 'Активные сейчас',
  SCHEDULED: 'Запланированные',
  TRANSMISSION_ENDED: 'Трансляция завершена',
  TRANSMISSION_ACTIVE: 'Идет трансляция',
  TRANSMISSION_SCHEDULED: 'Запланирована на'
};

// Валидация и нормализация данных трансляций
const validatedTransLinks = transLinks.map(item => ({
  ...item,
  time: item.time && /^\d{1,2}:\d{2}$/.test(item.time) ? item.time : '00:00',
  data: item.data && /^\d{4}\.\d{2}\.\d{2}$/.test(item.data) ? item.data : currentDay,
  category: item.category || 'другое',
  premium: item.premium === "premium" ? "premium" : ""
}));

// Фильтрация
let currentFilter = 'all';
const categories = [...new Set(validatedTransLinks.map(item => item.category))];
const hasPremiumTransmissions = validatedTransLinks.some(item => item.premium === "premium");

// Хранилище для таймеров
const timerIntervals = new Set();

/**
 * Преобразует строку времени в минуты
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;

  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  } catch (e) {
    console.error('Ошибка преобразования времени:', timeStr);
    return 0;
  }
};

/**
 * Преобразует дату и время в объект Date
 */
const parseDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  
  try {
    const [year, month, day] = dateStr.split('.').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Создаем дату в локальном времени
    return new Date(year, month - 1, day, hours, minutes);
  } catch (e) {
    console.error('Ошибка преобразования даты и времени:', dateStr, timeStr);
    return null;
  }
};

/**
 * Проверяет, прошла ли указанная дата
 */
const isDatePassed = (date) => {
  if (!date) return false;
  return date < currentDay;
};

/**
 * Проверяет, завершилась ли трансляция более N минут назад
 */
const isTransmissionEndedLongAgo = (endDate, endTime, minutesThreshold = HIDE_AFTER_MINUTES) => {
  if (!endDate || !endTime) return false;
  
  const endDateTime = parseDateTime(endDate, endTime);
  if (!endDateTime) return false;
  
  const now = new Date();
  const timeDifference = now.getTime() - endDateTime.getTime();
  const minutesDifference = timeDifference / (1000 * 60);
  
  return minutesDifference > minutesThreshold;
};

/**
 * Форматирование даты
 */
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('.');
  return `${day}.${month}.${year}`;
};

/**
 * Переключает состояние бургер-меню
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
 * Открывает видео в iframe
 */
const openVideoIFrame = (videoHTML) => {
  if (!videoHTML) return;
  wrapPleer.innerHTML = videoHTML;
};

/**
 * Создает безопасный iframe из HTML-строки
 */
const getSafeIframe = (html) => {
  if (!html) return '';

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
 * Рассчитывает время трансляции
 */
const calculateTransmissionTime = (startTime, allDays, transmissionDate = currentDay) => {
  const safeStartTime = startTime && /^\d{1,2}:\d{2}$/.test(startTime) ? startTime : '00:00';
  const startMinutes = timeToMinutes(safeStartTime);
  const durationMinutes = allDays === "all day" ? TIME_CONFIG.ALL_DAY_DURATION : TIME_CONFIG.REGULAR_DURATION;
  const endMinutes = startMinutes + durationMinutes;

  let endDay = transmissionDate;

  if (endMinutes >= 1440) {
    // Если трансляция переходит на следующий день
    const [year, month, day] = transmissionDate.split('.').map(Number);
    const nextDay = new Date(year, month - 1, day + 1);
    endDay = `${nextDay.getFullYear()}.${(nextDay.getMonth() + 1).toString().padStart(2, '0')}.${nextDay.getDate().toString().padStart(2, '0')}`;
  }

  const endHour = Math.floor((endMinutes % 1440) / 60);
  const endMinute = endMinutes % 60;

  const formatTime = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return {
    startTime: safeStartTime,
    endTime: formatTime(endHour, endMinute),
    endDay: endDay
  };
};

/**
 * Форматирует время в формате "ЧЧ:ММ:СС"
 */
const formatCountdownTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Создает таймер обратного отсчета или отображает дату
 */
const createCountdownTimer = (element, startTime, date) => {
  const now = new Date();
  const today = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;

  const timerElement = document.createElement('div');
  timerElement.className = 'countdown-timer';
  
  // Если трансляция не сегодня, показываем дату
  if (date !== today) {
    const formattedDate = formatDisplayDate(date);
    timerElement.textContent = `${formattedDate} в ${startTime}`;
    timerElement.classList.add('date-display');
    element.appendChild(timerElement);
    return;
  }

  // Если трансляция сегодня, создаем обратный отсчет
  const [hours, minutes] = startTime.split(':').map(Number);
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);

  // Если время уже прошло, не показываем таймер
  if (targetTime <= now) return;

  element.appendChild(timerElement);

  const updateTimer = () => {
    const now = new Date();
    const diff = Math.floor((targetTime - now) / 1000);

    if (diff <= 0) {
      timerElement.textContent = '00:00:00';
      clearInterval(timerInterval);
      return;
    }

    timerElement.textContent = formatCountdownTime(diff);
  };

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
  timerIntervals.add(timerInterval);

  return timerInterval;
};

/**
 * Определяет статус трансляции
 */
const getTransmissionStatus = (item) => {
  const transmissionDate = item.data || currentDay;
  const {
    startTime,
    endTime,
    endDay
  } = calculateTransmissionTime(item.time, item.allDays, transmissionDate);

  if (!startTime || !endTime) {
    return {
      status: 'past',
      displayText: TEXT.TRANSMISSION_ENDED,
      startTime: '00:00',
      endTime: '00:00',
      transmissionDate,
      endDay: transmissionDate,
      shouldHide: false
    };
  }

  const now = new Date();
  const nowMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // Проверяем, нужно ли скрыть трансляцию (завершилась более 10 минут назад)
  const shouldHide = isTransmissionEndedLongAgo(endDay, endTime, HIDE_AFTER_MINUTES);

  // Если дата трансляции уже прошла ИЛИ нужно скрыть
  if (isDatePassed(transmissionDate) || shouldHide) {
    return {
      status: 'past',
      displayText: TEXT.TRANSMISSION_ENDED,
      startTime,
      endTime,
      transmissionDate,
      endDay,
      shouldHide
    };
  }

  // Если трансляция запланирована на будущую дату
  if (transmissionDate > currentDay) {
    const displayText = item.allDays === "all day" ? 
      `${TEXT.TRANSMISSION_SCHEDULED} ${formatDisplayDate(transmissionDate)} (весь день)` : 
      `${TEXT.TRANSMISSION_SCHEDULED} ${formatDisplayDate(transmissionDate)} в ${startTime}`;
    
    return {
      status: 'future',
      displayText: displayText,
      startTime,
      endTime,
      transmissionDate,
      endDay,
      shouldHide: false
    };
  }

  // Проверяем активные трансляции (сегодняшние)
  const isActive = (() => {
    if (endMinutes < startMinutes) {
      // Трансляция переходит через полночь
      return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
    } else {
      // Обычная трансляция в пределах одного дня
      return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    }
  })();

  if (isActive) {
    const displayText = item.allDays === "all day" ? 
      "Трансляция весь день (10 часов)" : 
      `${TEXT.TRANSMISSION_ACTIVE} (до ${endTime})`;
    
    return {
      status: 'active',
      displayText: displayText,
      startTime,
      endTime,
      transmissionDate,
      endDay,
      shouldHide: false
    };
  }

  // Если трансляция еще не началась сегодня
  if (nowMinutes < startMinutes) {
    const displayText = item.allDays === "all day" ? 
      `${TEXT.TRANSMISSION_SCHEDULED} ${formatDisplayDate(transmissionDate)} (весь день)` : 
      `${TEXT.TRANSMISSION_SCHEDULED} ${startTime}`;
    
    return {
      status: 'future',
      displayText: displayText,
      startTime,
      endTime,
      transmissionDate,
      endDay,
      shouldHide: false
    };
  }

  // Если трансляция завершилась недавно (менее 10 минут назад)
  const recentlyEnded = !isTransmissionEndedLongAgo(endDay, endTime, HIDE_AFTER_MINUTES);
  
  return {
    status: 'past',
    displayText: TEXT.TRANSMISSION_ENDED,
    startTime,
    endTime,
    transmissionDate,
    endDay,
    shouldHide: !recentlyEnded
  };
};

/**
 * Отрисовывает список трансляций
 */
const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  const sortedTransmissions = [...validatedTransLinks].sort((a, b) => {
    const aStatus = getTransmissionStatus(a);
    const bStatus = getTransmissionStatus(b);
    const aIsPremium = a.premium === "premium";
    const bIsPremium = b.premium === "premium";
    const aIsToday = (a.data || currentDay) === currentDay;
    const bIsToday = (b.data || currentDay) === currentDay;

    // Сначала сортируем по дате: сегодняшние в начале
    if (aIsToday && !bIsToday) return -1;
    if (!aIsToday && bIsToday) return 1;

    // Затем по статусу
    if (aStatus.status === 'past' && bStatus.status !== 'past') return 1;
    if (aStatus.status !== 'past' && bStatus.status === 'past') return -1;
    if (aStatus.status === 'past' && bStatus.status === 'past') {
      const aDate = a.data || currentDay;
      const bDate = b.data || currentDay;
      return bDate.localeCompare(aDate);
    }

    // Premium контент выше обычного
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;

    // Активные трансляции выше запланированных
    if (aStatus.status === 'active' && bStatus.status !== 'active') return -1;
    if (aStatus.status !== 'active' && bStatus.status === 'active') return 1;

    // Сортировка по времени для трансляций на одну дату
    if (aIsToday && bIsToday) {
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    }

    // Для не сегодняшних трансляций сортируем по дате (ближайшие сначала)
    const aDate = a.data || currentDay;
    const bDate = b.data || currentDay;
    return aDate.localeCompare(bDate);
  });

  let visibleTransmissionsCount = 0;

  sortedTransmissions.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const transmissionStatus = getTransmissionStatus(item);
    const { status, displayText, startTime, transmissionDate, shouldHide } = transmissionStatus;
    const isPremium = item.premium === "premium";
    const isToday = transmissionDate === currentDay;
    const isAllDay = item.allDays === "all day";

    // Применяем фильтры
    if (currentFilter === 'active' && status !== 'active') return;
    if (currentFilter === 'planned' && status !== 'future') return;
    if (currentFilter === 'premium' && !isPremium) return;
    if (currentFilter !== 'all' && currentFilter !== 'active' &&
        currentFilter !== 'planned' && currentFilter !== 'premium' &&
        item.category !== currentFilter) return;

    // Скрываем завершенные более 10 минут назад трансляции
    if (shouldHide) {
      console.log(`Скрыта трансляция: ${item.name}`, {
        endDay: transmissionStatus.endDay,
        endTime: transmissionStatus.endTime,
        shouldHide
      });
      return;
    }

    visibleTransmissionsCount++;

    const li = document.createElement('li');
    li.className = `list__strim-item ${status} ${isPremium ? 'premium' : ''} ${isToday ? 'today' : 'future-day'} ${isAllDay ? 'all-day' : ''}`;
    li.dataset.id = `transmission-${index}`;

    const imageContainer = item.img ?
      `<div class="image-container">
        <img src="${item.img}" alt="${item.name}" class="transmission-image">
      </div>` : "";

    li.innerHTML = `
      <button class="list__strim-link ${status}" 
              ${status === 'past' ? 'disabled' : ''}
              data-iframe="${encodeURIComponent(iframeHTML)}">
        ${imageContainer}
        <div class="transmission-header">
          <h3>${item.name}</h3>
          ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
          ${isAllDay ? '<span class="all-day-badge">Весь день</span>' : ''}
        </div>
        <div class="transmission-info">
          <span class="time-info">${displayText}</span>
          ${status === 'past' ? `<small>Завершилась в ${transmissionStatus.endTime}</small>` : ''}
        </div>
      </button>
    `;

    if (status === 'active') {
      li.querySelector('button').addEventListener('click', () => {
        openVideoIFrame(iframeHTML);
      });
    }

    // Добавляем таймер для будущих трансляций сегодня или дату для других дней
    if (status === 'future' && item.img) {
      const imgContainer = li.querySelector('.image-container');
      if (imgContainer) {
        createCountdownTimer(imgContainer, startTime, transmissionDate);
      }
    }

    Strimlists.appendChild(li);
  });

  // Показываем сообщение, если нет видимых трансляций
  if (visibleTransmissionsCount === 0) {
    const noTransmissionsMessage = document.createElement('li');
    noTransmissionsMessage.className = 'no-transmissions-message';
    noTransmissionsMessage.innerHTML = `
      <div class="message-content">
        <h3>Нет доступных трансляций</h3>
        <p>В данный момент нет активных или запланированных трансляций.</p>
      </div>
    `;
    Strimlists.appendChild(noTransmissionsMessage);
  }

  console.log(`Отображено трансляций: ${visibleTransmissionsCount}`);
};

/**
 * Инициализирует меню каталога
 */
const initCatalogMenu = () => {
  catalogLinks.forEach(item => {
    const li = document.createElement('li');
    li.className = 'menu__list-item';

    li.innerHTML = `
      <button class="menu__list-link" data-iframe="${encodeURIComponent(item.link)}">
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
 * Создает кнопки фильтрации
 */
const createFilterButtons = () => {
  const buttonsHTML = `
    <button class="filter-btn active" data-filter="all">Все трансляции</button>
    <button class="filter-btn" data-filter="active">Активные сейчас</button>
    <button class="filter-btn" data-filter="planned">Запланированные</button>
    ${categories.map(category => 
      `<button class="filter-btn" data-filter="${category}">${category}</button>`
    ).join('')}
    ${hasPremiumTransmissions ? '<button class="filter-btn" data-filter="premium">Только Premium</button>' : ''}
  `;

  filterButtons.innerHTML = buttonsHTML;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTransmissions();
    });
  });
};

/**
 * Очистка всех таймеров
 */
const cleanupTimers = () => {
  timerIntervals.forEach(interval => clearInterval(interval));
  timerIntervals.clear();
};

// Стили для таймера и сообщений
const addCountdownStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .image-container {
      position: relative;
      width: 100%;
    }
    .countdown-timer {
      position: absolute;
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 0.5rem 1rem;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      text-align: center;
    }
    .countdown-timer.date-display {
      font-size: 1rem;
      line-height: 1.2;
      padding: 0.3rem 0.5rem;
    }
    .transmission-image {
      display: block;
      width: 100%;
      height: auto;
      position: relative;
      border-radius: 5px;
      object-fit: cover;
      max-height: 13em;
    }

    .list__strim-item.future-day {
      order: 1;
    }
    .list__strim-item.today {
      order: 0;
    }
    .all-day-badge {
      position: absolute;
      background-color: #006b6b;
      color: white;
      padding: 2px 8px;
      border-radius: 0 0 12px 0;
      font-size: 0.8rem;
      top: 0;
    }
    .premium-badge {
      background-color: #FFD700;
      color: black;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-left: 8px;
    }
    .list__strim-allDay {
      background-color: #2196F3;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-left: 8px;
    }
    .no-transmissions-message {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem 2rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin: 2rem 0;
    }
    .no-transmissions-message h3 {
      color: #6c757d;
      margin-bottom: 1rem;
    }
    .no-transmissions-message p {
      color: #868e96;
      margin: 0;
    }
    .message-content {
      max-width: 400px;
      margin: 0 auto;
    }
    .transmission-info small {
      display: block;
      margin-top: 0.5rem;
      color: #868e96;
      font-size: 0.8rem;
    }
  `;
  document.head.appendChild(style);
};

// Глобальный обработчик ошибок
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Обработчик перед закрытием страницы
window.addEventListener('beforeunload', cleanupTimers);

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
  document.querySelector('.content').style.opacity = '0';
  addCountdownStyles();

  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.content').style.opacity = '1';
    initCatalogMenu();
    createFilterButtons();
    renderTransmissions();

    // Обновление времени каждую минуту
    setInterval(() => {
      const now = new Date();
      if (now.getMinutes() !== currentDate.getMinutes()) {
        currentDate = now;
        currentHours = now.getHours().toString().padStart(2, '0');
        currentMinutes = now.getMinutes().toString().padStart(2, '0');
        currentTime = `${currentHours}:${currentMinutes}`;
        currentDay = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
        console.log('Обновление времени:', currentDay, currentTime);
        renderTransmissions();
      }
    }, 60000);
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













