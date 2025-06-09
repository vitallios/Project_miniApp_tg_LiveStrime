import { catalogLinks } from "./live_failse/liveTv.js";
import { randomFilms } from "./live_failse/liveFilms.js";
import { transLinks } from "./live_failse/liveTranslation.js";

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

<<<<<<< HEAD
// Текущая дата и время
=======
// Текущие дата и время
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
let currentDate = new Date();
let currentHours = currentDate.getHours().toString().padStart(2, '0');
let currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
let currentTime = `${currentHours}:${currentMinutes}`;
let currentDay = `${currentDate.getUTCFullYear()}.${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}.${currentDate.getUTCDate().toString().padStart(2, '0')}`;

// Фильтрация
let currentFilter = 'all';
const categories = [...new Set(transLinks.map(item => item.category || 'другое'))];
const hasPremiumTransmissions = transLinks.some(item => item.premium === "premium");

<<<<<<< HEAD
// Форматирование даты
=======
// Функция форматирования даты для отображения
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('.');
  return `${day}.${month}.${year}`;
};

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

const calculateTransmissionTime = (startTime, allDay) => {
  const startMinutes = timeToMinutes(startTime);
  const durationMinutes = allDay === "all day" ? 8 * 60 : 3 * 60;
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
    startTime: startTime,
    endTime: formatTime(endHour, endMinute),
    endDay: endDay
  };
};

const getTransmissionStatus = (item) => {
  const transmissionDate = item.data || currentDay;
  const { startTime, endTime, endDay } = calculateTransmissionTime(item.time, item.allDay);
  const nowMinutes = timeToMinutes(currentTime);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

<<<<<<< HEAD
=======
  // Если дата трансляции уже прошла
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
  if (isDatePassed(transmissionDate)) {
    return { 
      status: 'past',
      displayText: 'Трансляция завершена',
      startTime,
      endTime,
      transmissionDate
    };
  }

<<<<<<< HEAD
=======
  // Если дата трансляции еще не наступила
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
  if (transmissionDate > currentDay) {
    return {
      status: 'future',
      displayText: `Запланирована на ${formatDisplayDate(transmissionDate)} в ${startTime}`,
      startTime,
      endTime,
      transmissionDate
    };
  }

<<<<<<< HEAD
  if (endMinutes < startMinutes) {
=======
  // Если дата сегодняшняя
  // Проверяем активна ли трансляция
  if (endMinutes < startMinutes) {
    // Трансляция переходит через полночь
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
    if (nowMinutes >= startMinutes || nowMinutes <= endMinutes) {
      return { 
        status: 'active',
        displayText: item.allDay === "all day" ? "Трансляция весь день" : `Идет трансляция (до ${endTime})`,
        startTime,
        endTime,
        transmissionDate
      };
    }
  } else {
<<<<<<< HEAD
=======
    // Обычная трансляция
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      return { 
        status: 'active',
        displayText: item.allDay === "all day" ? "Трансляция весь день" : `Идет трансляция (до ${endTime})`,
        startTime,
        endTime,
        transmissionDate
      };
    }
  }

<<<<<<< HEAD
=======
  // Если трансляция сегодня, но еще не началась
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
  if (nowMinutes < startMinutes) {
    return {
      status: 'future',
      displayText: `Запланирована на ${startTime}`,
      startTime,
      endTime,
      transmissionDate
    };
  }

<<<<<<< HEAD
=======
  // Если трансляция сегодня, но уже закончилась
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
  return {
    status: 'past',
    displayText: 'Трансляция завершена',
    startTime,
    endTime,
    transmissionDate
  };
};

const renderTransmissions = () => {
  Strimlists.innerHTML = '';

  const sortedTransmissions = [...transLinks].sort((a, b) => {
    const aStatus = getTransmissionStatus(a);
    const bStatus = getTransmissionStatus(b);
    const aIsPremium = a.premium === "premium";
    const bIsPremium = b.premium === "premium";

    // Завершенные трансляции (включая Premium) в конец
    if (aStatus.status === 'past' && bStatus.status !== 'past') return 1;
    if (aStatus.status !== 'past' && bStatus.status === 'past') return -1;
    if (aStatus.status === 'past' && bStatus.status === 'past') {
      const aDate = a.data || currentDay;
      const bDate = b.data || currentDay;
      return bDate.localeCompare(aDate);
    }

    // Для активных/будущих: Premium сначала
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;

<<<<<<< HEAD
    // Активные перед будущими
    if (aStatus.status === 'active' && bStatus.status !== 'active') return -1;
    if (aStatus.status !== 'active' && bStatus.status === 'active') return 1;

    // Сортировка по времени
    return timeToMinutes(a.time) - timeToMinutes(b.time);
=======
    if (aStatus.status === 'active' && bStatus.status !== 'active') return -1;
    if (aStatus.status !== 'active' && bStatus.status === 'active') return 1;

    if (aStatus.status === 'future' && bStatus.status === 'past') return -1;
    if (aStatus.status === 'past' && bStatus.status === 'future') return 1;

    if (aStatus.status === 'active' || aStatus.status === 'future') {
      const aTime = timeToMinutes(a.time);
      const bTime = timeToMinutes(b.time);
      return aTime - bTime;
    }

    const aDate = a.data || currentDay;
    const bDate = b.data || currentDay;
    if (aDate !== bDate) return bDate.localeCompare(aDate);
    
    return timeToMinutes(b.time) - timeToMinutes(a.time);
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
  });

  sortedTransmissions.forEach((item, index) => {
    const iframeHTML = getSafeIframe(item.link);
    if (!iframeHTML) return;

    const { status, displayText, transmissionDate } = getTransmissionStatus(item);
    const isPremium = item.premium === "premium";
    const isDifferentDate = transmissionDate !== currentDay;

<<<<<<< HEAD
=======
    // Фильтрация
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
    if (currentFilter === 'active' && status !== 'active') return;
    if (currentFilter === 'planned' && status !== 'future') return;
    if (currentFilter === 'premium' && !isPremium) return;
    if (currentFilter !== 'all' && currentFilter !== 'active' && 
        currentFilter !== 'planned' && currentFilter !== 'premium' && 
        item.category !== currentFilter) return;

    const li = document.createElement('li');
    li.className = `list__strim-item ${status} ${isPremium ? 'premium' : ''}`;
    li.dataset.id = `transmission-${index}`;

    li.innerHTML = `
      <button class="list__strim-link ${status}" 
              ${status === 'past' ? 'disabled' : ''}
              data-iframe="${encodeURIComponent(iframeHTML)}">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" class="transmission-image">` : ""}
        <div class="transmission-header">
          <h3>${item.name}</h3>
          ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
          ${item.allDay === "all day" ? '<span class="list__strim-allDay">all day</span>' : ''}
        </div>
        <div class="transmission-info">
<<<<<<< HEAD

=======
          ${isDifferentDate && status === 'future' ? `<span class="transmission-date">${formatDisplayDate(transmissionDate)}</span>` : ''}
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
          <span class="time-info">${displayText}</span>
        </div>
      </button>
    `;

    if (status === 'active') {
      li.querySelector('button').addEventListener('click', () => {
        openVideoIFrame(iframeHTML);
      });
    }

    Strimlists.appendChild(li);
  });
};

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

// Инициализация при загрузке
window.addEventListener('load', () => {
  document.querySelector('.content').style.opacity = '0';

  setTimeout(() => {
    loader.style.display = 'none';
    document.querySelector('.content').style.opacity = '1';
    initCatalogMenu();
    createFilterButtons();
    renderTransmissions();
    
<<<<<<< HEAD
=======
    // Обновляем каждую минуту
>>>>>>> 599d8e5a2347b89626da76290a5c5a41fa7cbf4e
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