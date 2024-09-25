const navBTN = document.querySelector('#menu-btn');
const menu = document.querySelector('.menu');
const menuListItem = document.querySelector('#menu__list-item');
const menuList = document.querySelector('#menu__list');


const catalogLinks = [
 {
  Id: 1,
  name: 'video1',
  link: '#video1',
 },
 {
  id: 2,
  name: 'video2',
  link: '#video2',
 },
 {
  id: 3,
  name: 'video3',
  link: '#video3',
 },
 {
  id: 4,
  name: 'video4',
  link: '#video4',
 },
]




navBTN.addEventListener('click', () => {
 menu.classList.toggle('active');
 navBTN.firstElementChild.children[0].attributes[2].value = menu.classList.contains('active')
 ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';
});

catalogLinks.forEach(item => {
 const li = document.createElement('li');
 li.classList.add('menu__list-item');
 li.innerHTML = `<a class="menu__list-link" href="${item.link}" name="${item.name}">${item.name}</a>`;
 menuList.appendChild(li);
});