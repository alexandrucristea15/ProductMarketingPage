'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sections = document.querySelectorAll('.section');
const images = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const section1 = document.getElementById('section--1');
const section2 = document.getElementById('section--2');
const section3 = document.getElementById('section--3');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const scrollToHandlerS1 = () => {
  section1.scrollIntoView({
    behavior: 'smooth',
  });
};

btnScrollTo.addEventListener('click', scrollToHandlerS1);
////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(link =>
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     const elementToScrollTo = document.querySelector(id);
//     elementToScrollTo.scrollIntoView({
//       behavior: 'smooth',
//     });
//     console.log(id);
//   })
// );

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    const id = e.target.getAttribute('href');
    const elementToScrollTo = document.querySelector(id);
    elementToScrollTo.scrollIntoView({
      behavior: 'smooth',
    });
  }
});

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//Menu fade animations

const fadeHandler = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', e => {
  fadeHandler(e, 0.5);
});

nav.addEventListener('mouseout', e => {
  fadeHandler(e, 1);
});
// Sticky navigation

const navCoords = nav.getBoundingClientRect();

const stickyNav = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navCoords.height}px`,
});
headerObserver.observe(header);

const showSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const showImage = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(showImage, {
  root: null,
  threshold: 0,
});
images.forEach(img => {
  imageObserver.observe(img);
  img.classList.add('lazy-img');
});

const slider = () => {
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  createDots();

  const dots = document.querySelectorAll('.dots__dot');

  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    dots[slide].classList.add('dots__dot--active');
  };

  goToSlide(0);

  let currSlide = 0;
  const maxSlide = slides.length - 1;

  const nextSlide = () => {
    if (currSlide === maxSlide) currSlide = 0;
    else currSlide++;

    goToSlide(currSlide);
  };
  const prevSlide = () => {
    if (currSlide === 0) currSlide = maxSlide;
    else currSlide--;

    goToSlide(currSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();
// dots.forEach((dot, i) => {
//   dot.addEventListener('click', () => {
//     goToSlide(i);
//   });
// });
// Revealing elements

// // selecting child elements

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);

///////////////////////////////////////////////////////////////////

// const onMouseEnterH1Handler = e => {
//   console.log('test');
//   h1.removeEventListener('mouseenter', onMouseEnterH1Handler);
// };

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', onMouseEnterH1Handler);

// rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML = `We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Close</button>`;

// header.append(message);
// const btnCloseCookie = document.querySelector('.btn--close-cookie');
// btnCloseCookie.addEventListener('click', () => {
//   message.remove();
// });

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.alt = 'Nice logo';
// console.log(logo.alt);
// logo.setAttribute('company', 'bankist');
// console.log(logo.getAttribute('company'));
// console.log(logo.dataset.versionNumber);
