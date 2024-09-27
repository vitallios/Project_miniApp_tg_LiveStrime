const navBTN = document.querySelector('#menu-btn');
const menu = document.querySelector('.menu');
const menuListItem = document.querySelector('#menu__list-item');
const menuList = document.querySelector('#menu__list');
let iframeSeaction = document.querySelector('#videoPleer');
let wrapPleer = document.querySelector('.wrap');
const key = '04cf7fba122224318f217fe6344845db'
const url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/7.json?`
const loader = document.querySelector('.loader');
const rundomFilms = document.querySelector('#rundomFilms');

window.addEventListener('load', () => {
 document.querySelector('.content').style.opacity = '0';

 if(!window.onload) {
  setTimeout(() => {
   loader.style.display = 'none';
 document.querySelector('.content').style.opacity = '1';

  }, 3000);
 }
});


// if (window.innerWidth < 900 && window.userAgentData.mobile) {
// console.dir('ok');
// console.dir(window.userAgentData.mobile);

  const myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", `${key}`);
  myHeaders.append("x-rapidapi-host", "v1.rugby.api-sports.io");

  // let requestOptions = {
  //   method: 'GET',
  //   headers: myHeaders,
  //   redirect: 'follow'
  // };

  const catalogLinks = [
  {
    id: 1,
    name: 'Regby',
    link: 'https://rutube.ru/play/embed/0369d61bfb8ce126d15fada863cfd08f',
    // link: '2',
  },
  {
    id: 2,
    name: 'Hockey',
    link: 'https://rutube.ru/play/embed/7a485ef5da9fe50ba939f36ca3e6ed96',
    // link: '1',
  },
  {
    id: 3,
    name: 'NBA',
    link: 'https://rutube.ru/play/embed/876cf3628c698e956de40c1c911b0c5f',
    // link: '1',
  },
  ]




  const randomFilms = [
  {
    id: 1,
    name: 'Битлджус Битлджус | Beetlejuice Beetlejuice (2024)',
    link: 'https://rutube.ru/play/embed/0b87b1557018d8ff86c86cf3492ad5a8',
    // link: '2',
  },
  {
    id: 2,
    name: 'Чужой: Ромул / Alien: Romulus (2024)',
    link: 'https://rutube.ru/play/embed/edf4662bfdf97433ced02ab6154313c4',
    // link: '1',
  },
  {
    id: 3,
    name: 'Дэдпул и Росомаха (2024)',
    link: 'https://rutube.ru/play/embed/f893c0764662db0b17b277d15d6e0871',
    // link: '1',
  },
  ]


  rundomFilms.addEventListener('click', () => {
    const randomLink = randomFilms[Math.floor(Math.random() * randomFilms.length)];
    // wrapPleer.innerHTML = `<iframe src="${randomLink.link}" frameborder="0" allowfullscreen></iframe>`;
    wrapPleer.innerHTML = `<iframe id="videoPleer" src="${randomLink.link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    menu.classList.toggle('active');
    navBTN.firstElementChild.children[0].attributes[2].value = menu.classList.contains('active')
  ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';

  });








  // fetch(`https://v1.${sport}api-sports.io/`, requestOptions)
  //   .then(response => {
  //    console.dir(response);
  //    if (response.status == 200) {
  //     response.json()
  //     .then(data => {
  //      console.dir(data);
  //       data.response.forEach(item => {
  //       console.dir(item.seasons);
  //       const li = document.createElement('li');
  //       li.classList.add('menu__list-item');
  //       li.innerHTML = `<a class="menu__list-link" id="${item.id}" href="${item.link}" name="${item.name}">${item.name}</a>`;
  //       menuList.appendChild(li);
  //       }
  //       );
  //     })
  //    }
  //   }  )
  //   .catch(error => console.log('error', error));



  navBTN.addEventListener('click', () => {
  menu.classList.toggle('active');
  navBTN.firstElementChild.children[0].attributes[2].value = menu.classList.contains('active')
  ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';
  });

  catalogLinks.forEach(item => {
  const li = document.createElement('li');
  li.classList.add('menu__list-item');
  li.innerHTML = `<button class="menu__list-link" id="${item.id}" name="${item.name}">${item.name}</butt>`;
  menuList.appendChild(li);

  li.firstChild.addEventListener('click', () => {
    wrapPleer.innerHTML = `<iframe id="videoPleer" src="${item.link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    menu.classList.toggle('active');
    navBTN.firstElementChild.children[0].attributes[2].value = menu.classList.contains('active')
  ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';
  });

  })

// } else {
//   alert('Сори, только для мобильных устройств');
//   window.location.reload();
// }
