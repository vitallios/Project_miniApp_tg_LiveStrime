// Трансляции которые будут
// Premium - трансляция целый день
// 0 - трансляция закончилась
// 1 - трансляция началась
// 2 - трансляция в процессе
export const transLinks = [
 {
   id: 0,
   name: `Про Д2. Мон-де-Марсан - Гренобль.`,
   link: `<iframe src="https://vkvideo.ru/video_ext.php?oid=-200149158&id=456276088&hash=0c24eb3e92e798c6" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
   data: "2024.12.06",
   time: "21:00",
   img: "",
   premium: false,
   active: 0,
 },
 {
   id: 1,
   name: `Про Д2. Монтобан - Ангулем.`,
   link: `<iframe src="https://vkvideo.ru/video_ext.php?oid=-200149158&id=456276089&hash=78a10590ad7bda0e" width="640" height="360" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
   data: "2024.12.06",
   time: "21:30",
   img: "",
   premium: false,
   active: 0,
 },
 {
   id: 2,
   name: `Про Д2. Дакс - Биарриц.`,
   link: `<iframe src="https://vkvideo.ru/video_ext.php?oid=-200149158&id=456276090&hash=1764e5af8c3c325b" width="640" height="360" frameborder="0" allowfullscreen="1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
   data: "2024.12.06",
   time: "23:00",
   img: "",
   premium: "",
   active: 0,
 },
//  test
{
  id: 0,
  name: `Test`,
  link: `
      
      <iframe
        width="720"
        height="405"
        src="https://rutube.ru/play/embed/9ffbd10ab46c9a3a39dba7fc17694410"
        frameBorder="0"
        allow="clipboard-write; autoplay"
        webkitAllowFullScreen
        mozallowfullscreen
        allowFullScreen
      ></iframe>
    
    `,
  data: "2024.12.06",
  time: "11:25",
  img: "",
  premium: "Premium",
  active: 0,
},
//  test
];
