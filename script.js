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

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const isDatePassed = (date) => {
  if (!date) return false;
  return date < currentDay;
};

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

const openVideoIFrame = (videoHTML) => {
  wrapPleer.innerHTML = videoHTML;
};

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

const isTransmissionActive = (startTime, endTime, date = currentDay) => {
  if (date !== currentDay) return false;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const nowMinutes = timeToMinutes(currentTime);

  if (endMinutes < startMinutes) {
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }

  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
};

const calculateTransmissionTime = (startTime, allDay) => {
  const startMinutes = timeToMinutes(startTime);
  const durationMinutes = allDay === "all day" ? 8 * 60 : 3 * 60;
  const endMinutes = startMinutes + durationMinutes;

  let endDay = currentDay;
  
  if (endMinutes >= 1440) {
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

const isTransmissionPast = (item) => {
  if (isDatePassed(item.data)) return true;
  
  const { endTime, endDay } = calculateTransmissionTime(item.time, item.allDay);
  
  if (endDay !== currentDay) {
    if (isDatePassed(endDay)) return true;
    
    if (endDay === currentDay) {
      return timeToMinutes(currentTime) > timeToMinutes(endTime);
    }
    return false;
  }
  
  return timeToMinutes(currentTime) > timeToMinutes(endTime);
};

const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  // Сортируем: премиум сначала, затем активные, затем по дате
  const sortedTransmissions = [...transLinks].sort((a, b) => {
    const aIsPremium = a.premium === "premium";
    const bIsPremium = b.premium === "premium";
    const aActive = isTransmissionActive(
      calculateTransmissionTime(a.time, a.allDay).startTime,
      calculateTransmissionTime(a.time, a.allDay).endTime,
      a.data
    );
    const bActive = isTransmissionActive(
      calculateTransmissionTime(b.time, b.allDay).startTime,
      calculateTransmissionTime(b.time, b.allDay).endTime,
      b.data
    );

    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });

  sortedTransmissions.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const { startTime, endTime, endDay } = calculateTransmissionTime(item.time, item.allDay);
    const isActive = isTransmissionActive(startTime, endTime, item.data);
    const isPast = isTransmissionPast(item);
    const isFuture = item.data === currentDay && timeToMinutes(currentTime) < timeToMinutes(startTime);
    const isPremium = item.premium === "premium";
    
    // Фильтрация в зависимости от выбранного фильтра
    if (currentFilter === 'active' && !isActive) return;
    if (currentFilter === 'planned' && (isActive || isPast)) return;
    if (currentFilter === 'premium' && !isPremium) return; // Добавлена проверка для премиум фильтра
    if (currentFilter !== 'all' && currentFilter !== 'active' && currentFilter !== 'planned' && 
    currentFilter !== 'premium' && item.category !== currentFilter) return;

    let timeInfo;
    if (isPast) {
      timeInfo = "Завершено";
    } else if (isActive) {
      timeInfo = item.allDay === "all day" 
        ? "Трансляция весь день" 
        : `Идет трансляция (до ${endTime})`;
    } else if (isFuture) {
      timeInfo = `Начнётся в ${startTime}`;
    } else {
      timeInfo = `Запланировано на ${item.data} в ${startTime}`;
    }

    const li = document.createElement('li');
    li.className = `list__strim-item ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''} ${isPremium ? 'premium' : ''}`;
    li.dataset.id = `transmission-${index}`;
    li.dataset.time = item.time;
    li.dataset.allDay = item.allDay || '';
    li.dataset.data = item.data || '';
    li.dataset.img = item.img || '';
    li.dataset.href = iframeHTML;
    li.dataset.active = isActive ? '1' : '0';
    li.dataset.category = item.category || 'другое';
    li.dataset.premium = isPremium ? '1' : '0';

    li.innerHTML = `
      <button class="list__strim-link ${isActive ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}" 
              id="${item.id}" 
              ${isPast ? 'disabled' : ''}
              dataTransmissionIndex="${item.data}"  
              startTransmissionTime="${startTime}" 
              endTime="${endTime}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
        <div class="transmission-header">
          <h3>${item.name}</h3>
          ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
          ${item.allDay === "all day" ? '<span class="list__strim-allDay">all day</span>' : ''}
        </div>
        <span>${timeInfo}</span>
      </button>
    `;

    if (isActive && !isPast) {
      li.addEventListener('click', () => openVideoIFrame(iframeHTML));
    }

    Strimlists.appendChild(li);
  });

  sortTransmissions();
};

const sortTransmissions = () => {
  const items = Array.from(Strimlists.children);

  items.sort((a, b) => {
    const aPremium = a.dataset.premium === '1';
    const bPremium = b.dataset.premium === '1';
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

    // 1. Премиум трансляции в начало
    if (aPremium && !bPremium) return -1;
    if (!aPremium && bPremium) return 1;

    // 2. Активные трансляции
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // 3. Будущие трансляции сегодня
    if (aFuture && bFuture && aDate === currentDay && bDate === currentDay) {
      return aTime - bTime;
    }
    if (aFuture && !bFuture && aDate === currentDay) return -1;
    if (!aFuture && bFuture && bDate === currentDay) return 1;

    // 4. Сегодняшние трансляции
    if (aDate === currentDay && bDate !== currentDay) return -1;
    if (aDate !== currentDay && bDate === currentDay) return 1;

    // 5. Завершенные в конец
    if (aPast && !bPast) return 1;
    if (!aPast && bPast) return -1;

    // 6. Сортировка по дате и времени
    if (aDate !== bDate) return aDate.localeCompare(bDate);
    return aTime - bTime;
  });

  Strimlists.innerHTML = '';
  items.forEach(item => Strimlists.appendChild(item));
};

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

const createFilterButtons = () => {
  const buttonsHTML = `
    <button class="filter-btn active" data-filter="all">Все трансляции</button>
    <button class="filter-btn" data-filter="active">Активные сейчас</button>
    <button class="filter-btn" data-filter="planned">Запланированные</button>
    ${categories.map(category => 
      `<button class="filter-btn" data-filter="${category}">${category}</button>`
    ).join('')}
    <button class="filter-btn" data-filter="premium">Только Premium</button>
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