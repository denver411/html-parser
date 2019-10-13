import parser from './js/parse_main';

// const testData =
//   '<html class="super-class" lang="ru"><head><title>Document</title></head><body><div class="container"><section class="section"><header class="section__header"><span class="section__description">What I do</span><h2 class="title section__title">My Services</h2></header><div class="section__body"><article class="post"><div class="post__content"><h3 class="title post__name">Wedding Photography</h3></div></article><article class="post"><div class="post__content"><h3 class="title post__name">Portrait Photography</h3></div></article><article class="post"><div class="post__content"><h3 class="title post__name">Families Photography</h3></div></article><article class="post"><div class="post__content"><h3 class="title post__name">Children Photography</h3></div></article></div></section>  </div></body></html>';
const testData =
  '<html lang="en"><head><title>HTML parser v.0.0.1</title></head><body style="background-color:dimgray" class="body-class"></body></html>';
const res = parser(testData);
console.log(res);
// console.log(res.getElementsByClassName('title'));
