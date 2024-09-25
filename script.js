const navBTN = document.querySelector('#menu-btn');
const menu = document.querySelector('.menu');

navBTN.addEventListener('click', () => {
 menu.classList.toggle('active');
 navBTN.firstElementChild.children[0].attributes[2].value = menu.classList.contains('active') 
 ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5';
 
});