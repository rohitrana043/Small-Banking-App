'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollToFeature = document.querySelector('.btn--scroll-to-feature');
const btnScrollToConversion = document.querySelector('.btn--scroll-to-conversion');
const section1 = document.querySelector('#section--1');
const sectionConversion = document.querySelector('#section--conversion');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnConvert = document.querySelector('#btn-convert');

// Modal window

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

// Button scrolling
btnScrollToFeature.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

btnScrollToConversion.addEventListener('click', function (e) {
  sectionConversion.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


// API Handler 
class CurrencyAPI {
  baseUrl = 'https://api.currencyapi.com/v3/';

  constructor(apiKey = '') {
    this.headers = {
        apikey: apiKey
    };
    console.log('constructor called', this.headers);
  }

  call (endpoint, params = {}) {
    const paramString = new URLSearchParams({
        ...params
    }).toString();
    console.log('call called', paramString);

    return fetch(`${this.baseUrl}${endpoint}?base_currency=CAD${paramString}`, { headers: this.headers })
        .then(response => response.json())
        .then(data => {
            return data;
        });
  }

  status () {
    console.log('status called');
    return this.call('status');
  }

  currencies (params) {
    console.log('currencies called');
    return this.call('currencies', params);
  }

  latest (params) {
    console.log('latest called');
    return this.call('latest', params);
  }

  historical (params) {
    console.log('historical called');
    return this.call('historical', params);
  }

  range (params) {
    console.log('range called');
    return this.call('range', params);
  }

  convert (params) {
    console.log('convert called');
    return this.call('convert', params);
  }
}

var response = '{"meta":{"last_updated_at":"2023-03-23T23:59:59Z"},"data":{"ADA":{"code":"ADA","value":1.956709},"AED":{"code":"AED","value":2.676895},"AFN":{"code":"AFN","value":63.296707},"ALL":{"code":"ALL","value":76.5212},"AMD":{"code":"AMD","value":283.054822},"ANG":{"code":"ANG","value":1.312188},"AOA":{"code":"AOA","value":367.950807},"ARS":{"code":"ARS","value":149.954998},"AUD":{"code":"AUD","value":1.091036},"AVAX":{"code":"AVAX","value":0.041436},"AWG":{"code":"AWG","value":1.312026},"AZN":{"code":"AZN","value":1.239135},"BAM":{"code":"BAM","value":1.309249},"BBD":{"code":"BBD","value":1.458729},"BDT":{"code":"BDT","value":76.520473},"BGN":{"code":"BGN","value":1.316085},"BHD":{"code":"BHD","value":0.274946},"BIF":{"code":"BIF","value":1514.434855},"BMD":{"code":"BMD","value":0.728902},"BNB":{"code":"BNB","value":0.002202},"BND":{"code":"BND","value":0.965895},"BOB":{"code":"BOB","value":5.034831},"BRL":{"code":"BRL","value":3.861874},"BSD":{"code":"BSD","value":0.72806},"BTC":{"code":"BTC","value":0.000026},"BTN":{"code":"BTN","value":59.862428},"BWP":{"code":"BWP","value":9.56781},"BYN":{"code":"BYN","value":1.838072},"BYR":{"code":"BYR","value":14286.474426},"BZD":{"code":"BZD","value":1.45972},"CAD":{"code":"CAD","value":1},"CDF":{"code":"CDF","value":1495.709216},"CHF":{"code":"CHF","value":0.668196},"CLF":{"code":"CLF","value":0.021325},"CLP":{"code":"CLP","value":588.44323},"CNY":{"code":"CNY","value":4.971047},"COP":{"code":"COP","value":3467.025712},"CRC":{"code":"CRC","value":392.963152},"CUC":{"code":"CUC","value":0.732513},"CUP":{"code":"CUP","value":17.472993},"CVE":{"code":"CVE","value":73.809377},"CZK":{"code":"CZK","value":15.89198},"DJF":{"code":"DJF","value":129.540589},"DKK":{"code":"DKK","value":5.011423},"DOP":{"code":"DOP","value":39.88668},"DOT":{"code":"DOT","value":0.114731},"DZD":{"code":"DZD","value":99.0237},"EGP":{"code":"EGP","value":22.559684},"ERN":{"code":"ERN","value":10.933541},"ETB":{"code":"ETB","value":39.215049},"ETH":{"code":"ETH","value":0.0004},"EUR":{"code":"EUR","value":0.672719},"FJD":{"code":"FJD","value":1.61124},"FKP":{"code":"FKP","value":0.593515},"GBP":{"code":"GBP","value":0.593502},"GEL":{"code":"GEL","value":1.876925},"GGP":{"code":"GGP","value":0.593515},"GHS":{"code":"GHS","value":8.991877},"GIP":{"code":"GIP","value":0.593515},"GMD":{"code":"GMD","value":44.827512},"GNF":{"code":"GNF","value":6264.360609},"GTQ":{"code":"GTQ","value":5.678605},"GYD":{"code":"GYD","value":153.632265},"HKD":{"code":"HKD","value":5.721557},"HNL":{"code":"HNL","value":17.957376},"HRK":{"code":"HRK","value":5.068599},"HTG":{"code":"HTG","value":112.856211},"HUF":{"code":"HUF","value":258.177422},"IDR":{"code":"IDR","value":10994.408208},"ILS":{"code":"ILS","value":2.587034},"IMP":{"code":"IMP","value":0.593515},"INR":{"code":"INR","value":59.963619},"IQD":{"code":"IQD","value":1062.625134},"IRR":{"code":"IRR","value":30796.142279},"ISK":{"code":"ISK","value":100.843759},"JEP":{"code":"JEP","value":0.593515},"JMD":{"code":"JMD","value":109.9921},"JOD":{"code":"JOD","value":0.517084},"JPY":{"code":"JPY","value":95.342646},"KES":{"code":"KES","value":95.704952},"KGS":{"code":"KGS","value":63.720713},"KHR":{"code":"KHR","value":2958.13182},"KMF":{"code":"KMF","value":336.563564},"KPW":{"code":"KPW","value":656.028329},"KRW":{"code":"KRW","value":937.835587},"KWD":{"code":"KWD","value":0.223052},"KYD":{"code":"KYD","value":0.606791},"KZT":{"code":"KZT","value":338.233777},"LAK":{"code":"LAK","value":12284.11874},"LBP":{"code":"LBP","value":10929.038797},"LKR":{"code":"LKR","value":232.988927},"LRD":{"code":"LRD","value":117.389747},"LSL":{"code":"LSL","value":13.426396},"LTC":{"code":"LTC","value":0.007755},"LTL":{"code":"LTL","value":2.152257},"LVL":{"code":"LVL","value":0.440905},"LYD":{"code":"LYD","value":3.489682},"MAD":{"code":"MAD","value":7.443995},"MATIC":{"code":"MATIC","value":0.641134},"MDL":{"code":"MDL","value":13.497388},"MGA":{"code":"MGA","value":3179.343586},"MKD":{"code":"MKD","value":41.462869},"MMK":{"code":"MMK","value":1529.028292},"MNT":{"code":"MNT","value":2571.267341},"MOP":{"code":"MOP","value":5.887286},"MRO":{"code":"MRO","value":260.217802},"MUR":{"code":"MUR","value":33.937715},"MVR":{"code":"MVR","value":11.2251},"MWK":{"code":"MWK","value":747.875774},"MXN":{"code":"MXN","value":13.547018},"MYR":{"code":"MYR","value":3.220294},"MZN":{"code":"MZN","value":45.993747},"NAD":{"code":"NAD","value":13.426389},"NGN":{"code":"NGN","value":335.645041},"NIO":{"code":"NIO","value":26.629211},"NOK":{"code":"NOK","value":7.583919},"NPR":{"code":"NPR","value":95.776983},"NZD":{"code":"NZD","value":1.167002},"OMR":{"code":"OMR","value":0.280609},"PAB":{"code":"PAB","value":0.728093},"PEN":{"code":"PEN","value":2.746699},"PGK":{"code":"PGK","value":2.565339},"PHP":{"code":"PHP","value":39.572125},"PKR":{"code":"PKR","value":205.949858},"PLN":{"code":"PLN","value":3.150615},"PYG":{"code":"PYG","value":5231.697238},"QAR":{"code":"QAR","value":2.653936},"RON":{"code":"RON","value":3.31299},"RSD":{"code":"RSD","value":78.932993},"RUB":{"code":"RUB","value":55.396612},"RWF":{"code":"RWF","value":799.526387},"SAR":{"code":"SAR","value":2.738066},"SBD":{"code":"SBD","value":5.977125},"SCR":{"code":"SCR","value":9.763775},"SDG":{"code":"SDG","value":432.603637},"SEK":{"code":"SEK","value":7.532808},"SGD":{"code":"SGD","value":0.967983},"SHP":{"code":"SHP","value":0.886892},"SLL":{"code":"SLL","value":14395.830871},"SOL":{"code":"SOL","value":0.032852},"SOS":{"code":"SOS","value":415.110114},"SRD":{"code":"SRD","value":25.365831},"STD":{"code":"STD","value":15086.794711},"SVC":{"code":"SVC","value":6.370125},"SYP":{"code":"SYP","value":1831.033847},"SZL":{"code":"SZL","value":13.212301},"THB":{"code":"THB","value":24.819146},"TJS":{"code":"TJS","value":7.961254},"TMT":{"code":"TMT","value":2.551161},"TND":{"code":"TND","value":2.280737},"TOP":{"code":"TOP","value":1.715362},"TRY":{"code":"TRY","value":13.894779},"TTD":{"code":"TTD","value":4.951199},"TWD":{"code":"TWD","value":21.973137},"TZS":{"code":"TZS","value":1699.801198},"UAH":{"code":"UAH","value":26.758607},"UGX":{"code":"UGX","value":2747.962246},"USD":{"code":"USD","value":0.728902},"UYU":{"code":"UYU","value":28.348629},"UZS":{"code":"UZS","value":8293.34734},"VEF":{"code":"VEF","value":1760257.252602},"VND":{"code":"VND","value":17129.223405},"VUV":{"code":"VUV","value":86.931134},"WST":{"code":"WST","value":1.984477},"XAF":{"code":"XAF","value":439.134214},"XAG":{"code":"XAG","value":0.031623},"XAU":{"code":"XAU","value":0.000366},"XCD":{"code":"XCD","value":1.969897},"XDR":{"code":"XDR","value":0.545504},"XOF":{"code":"XOF","value":439.134388},"XPF":{"code":"XPF","value":81.819305},"XRP":{"code":"XRP","value":1.630551},"YER":{"code":"YER","value":182.444302},"ZAR":{"code":"ZAR","value":13.206568},"ZMK":{"code":"ZMK","value":6560.99049},"ZMW":{"code":"ZMW","value":15.390462},"ZWL":{"code":"ZWL","value":234.706068}}}';

window.onload = function(e){
  console.log("test onload");
};

btnConvert.addEventListener('click', function (e) {
  e.preventDefault();
  const currencyApi = new CurrencyAPI('Your_API_Key'); //c6P1ZZBwJDlaFI96JowcuxDkYYNo9QT7iKJuIGDm
  currencyApi.latest();
});