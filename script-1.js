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

// Форматирование даты
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('.');
  return `${day}.${month}.${year}`;
};

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
 * Проверяет, прошла ли указанная дата
 */
const isDatePassed = (date) => {
  if (!date) return false;
  return date < currentDay;
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
const calculateTransmissionTime = (startTime, allDays) => {
  const safeStartTime = startTime && /^\d{1,2}:\d{2}$/.test(startTime) ? startTime : '00:00';
  const startMinutes = timeToMinutes(safeStartTime);
  const durationMinutes = allDays === "all day" ? 12 * 60 : 3 * 60; // 12 часов для all day
  const endMinutes = startMinutes + durationMinutes;

  let endDay = currentDay;

  if (endMinutes >= 1440) {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    endDay = `${nextDay.getUTCFullYear()}.${(nextDay.getUTCMonth() + 1).toString().padStart(2, '0')}.${nextDay.getUTCDate().toString().padStart(2, '0')}`;
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
  const today = `${now.getUTCFullYear()}.${(now.getUTCMonth() + 1).toString().padStart(2, '0')}.${now.getUTCDate().toString().padStart(2, '0')}`;

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
  } = calculateTransmissionTime(item.time, item.allDays);

  if (!startTime || !endTime) {
    return {
      status: 'past',
      displayText: 'Неверное время трансляции',
      startTime: '00:00',
      endTime: '00:00',
      transmissionDate
    };
  }

  const nowMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (isDatePassed(transmissionDate)) {
    return {
      status: 'past',
      displayText: 'Трансляция завершена',
      startTime,
      endTime,
      transmissionDate
    };
  }

  if (transmissionDate > currentDay) {
    console.log(item);
    
    const displayText = item.allDays === "all day" ? 
      `Запланирована на ${formatDisplayDate(transmissionDate)} (весь день)` : 
      `Запланирована на ${formatDisplayDate(transmissionDate)} в ${startTime}`;
    
    return {
      status: 'future',
      displayText: displayText,
      startTime,
      endTime,
      transmissionDate
    };
  }

  if (endMinutes < startMinutes) {
    if (nowMinutes >= startMinutes || nowMinutes <= endMinutes) {
      const displayText = item.allDays === "all day" ? 
        "Трансляция весь день (10 часов)" : 
        `Идет трансляция (до ${endTime})`;
      
      return {
        status: 'active',
        displayText: displayText,
        startTime,
        endTime,
        transmissionDate
      };
    }
  } else {
    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      const displayText = item.allDays === "all day" ? 
        "Трансляция весь день (10 часов)" : 
        `Идет трансляция (до ${endTime})`;
      
      return {
        status: 'active',
        displayText: displayText,
        startTime,
        endTime,
        transmissionDate
      };
    }
  }

  if (nowMinutes < startMinutes) {
    const displayText = item.allDays === "all day" ? 
      `Запланирована на ${formatDisplayDate(transmissionDate)} (весь день)` : 
      `Запланирована на ${startTime}`;
    
    return {
      status: 'future',
      displayText: displayText,
      startTime,
      endTime,
      transmissionDate
    };
  }

  return {
    status: 'past',
    displayText: 'Трансляция завершена',
    startTime,
    endTime,
    transmissionDate
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

  sortedTransmissions.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const { status, displayText, startTime, transmissionDate } = getTransmissionStatus(item);
    const isPremium = item.premium === "premium";
    const isToday = transmissionDate === currentDay;
    const isAllDay = item.allDays === "all day";

    if (currentFilter === 'active' && status !== 'active') return;
    if (currentFilter === 'planned' && status !== 'future') return;
    if (currentFilter === 'premium' && !isPremium) return;
    if (currentFilter !== 'all' && currentFilter !== 'active' &&
        currentFilter !== 'planned' && currentFilter !== 'premium' &&
        item.category !== currentFilter) return;

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

// Стили для таймера
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
  `;
  document.head.appendChild(style);
};

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
        currentDay = `${now.getUTCFullYear()}.${(now.getUTCMonth() + 1).toString().padStart(2, '0')}.${now.getUTCDate().toString().padStart(2, '0')}`;
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