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
const fromSelect = document.querySelector('#from');
const toSelect = document.querySelector('#to');
const amount = document.querySelector('#amount');
const convertedAmount = document.querySelector('#converted__amount');
const convertedAmountLabel = document.querySelector('#converted__amount__label');

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
  }

  call (endpoint, params = {}) {
    const paramString = new URLSearchParams({
        ...params
    }).toString();

    return fetch(`${this.baseUrl}${endpoint}?base_currency=CAD${paramString}`, { headers: this.headers })
        .then(response => response.json())
        .then(data => {
            return data;
        });
  }

  status () {
    return this.call('status');
  }

  currencies (params) {
    return this.call('currencies', params);
  }

  latest (params) {
    return this.call('latest', params);
  }

  historical (params) {
    return this.call('historical', params);
  }

  range (params) {
    return this.call('range', params);
  }

  convert (params) {
    return this.call('convert', params);
  }
}

var currenciesResp = '{"data":{"AED":{"symbol":"AED","name":"United Arab Emirates Dirham","symbol_native":"د.إ","decimal_digits":2,"rounding":0,"code":"AED","name_plural":"UAE dirhams"},"AFN":{"symbol":"Af","name":"Afghan Afghani","symbol_native":"؋","decimal_digits":0,"rounding":0,"code":"AFN","name_plural":"Afghan Afghanis"},"ALL":{"symbol":"ALL","name":"Albanian Lek","symbol_native":"Lek","decimal_digits":0,"rounding":0,"code":"ALL","name_plural":"Albanian lekë"},"AMD":{"symbol":"AMD","name":"Armenian Dram","symbol_native":"դր.","decimal_digits":0,"rounding":0,"code":"AMD","name_plural":"Armenian drams"},"ANG":{"symbol":"ƒ","name":"NL Antillean Guilder","symbol_native":"NAƒ","decimal_digits":2,"rounding":0,"code":"ANG","icon_name":"ang","name_plural":"NL Antillean Guilders"},"AOA":{"symbol":"Kz","name":"Angolan Kwanza","symbol_native":"Kz","decimal_digits":2,"rounding":0,"code":"AOA","icon_name":"aoa","name_plural":"Angolan Kwanza"},"ARS":{"symbol":"AR$","name":"Argentine Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"ARS","name_plural":"Argentine pesos"},"AUD":{"symbol":"AU$","name":"Australian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"AUD","name_plural":"Australian dollars"},"AWG":{"symbol":"Afl.","name":"Aruban Florin","symbol_native":"Afl.","decimal_digits":2,"rounding":0,"code":"AWG","icon_name":"awg","name_plural":"Aruban Florin"},"AZN":{"symbol":"man.","name":"Azerbaijani Manat","symbol_native":"ман.","decimal_digits":2,"rounding":0,"code":"AZN","name_plural":"Azerbaijani manats"},"BAM":{"symbol":"KM","name":"Bosnia-Herzegovina Convertible Mark","symbol_native":"KM","decimal_digits":2,"rounding":0,"code":"BAM","name_plural":"Bosnia-Herzegovina convertible marks"},"BBD":{"symbol":"Bds$","name":"Barbadian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BBD","icon_name":"bbd","name_plural":"Barbadian Dollars"},"BDT":{"symbol":"Tk","name":"Bangladeshi Taka","symbol_native":"৳","decimal_digits":2,"rounding":0,"code":"BDT","name_plural":"Bangladeshi takas"},"BGN":{"symbol":"BGN","name":"Bulgarian Lev","symbol_native":"лв.","decimal_digits":2,"rounding":0,"code":"BGN","name_plural":"Bulgarian leva"},"BHD":{"symbol":"BD","name":"Bahraini Dinar","symbol_native":"د.ب.‏","decimal_digits":3,"rounding":0,"code":"BHD","name_plural":"Bahraini dinars"},"BIF":{"symbol":"FBu","name":"Burundian Franc","symbol_native":"FBu","decimal_digits":0,"rounding":0,"code":"BIF","name_plural":"Burundian francs"},"BMD":{"symbol":"BD$","name":"Bermudan Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BMD","icon_name":"bmd","name_plural":"Bermudan Dollars"},"BND":{"symbol":"BN$","name":"Brunei Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BND","name_plural":"Brunei dollars"},"BOB":{"symbol":"Bs","name":"Bolivian Boliviano","symbol_native":"Bs","decimal_digits":2,"rounding":0,"code":"BOB","name_plural":"Bolivian bolivianos"},"BRL":{"symbol":"R$","name":"Brazilian Real","symbol_native":"R$","decimal_digits":2,"rounding":0,"code":"BRL","name_plural":"Brazilian reals"},"BSD":{"symbol":"B$","name":"Bahamian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BSD","icon_name":"bsd","name_plural":"Bahamian Dollars"},"BTN":{"symbol":"Nu.","name":"Bhutanese Ngultrum","symbol_native":"Nu.","decimal_digits":2,"rounding":0,"code":"BTN","icon_name":"btn","name_plural":"Bhutanese Ngultrum"},"BWP":{"symbol":"BWP","name":"Botswanan Pula","symbol_native":"P","decimal_digits":2,"rounding":0,"code":"BWP","name_plural":"Botswanan pulas"},"BYN":{"symbol":"Br","name":"Belarusian ruble","symbol_native":"Br","decimal_digits":2,"rounding":0,"code":"BYN","name_plural":"Belarusian rubles"},"BYR":{"symbol":"BYR","name":"Belarusian Ruble","symbol_native":"BYR","decimal_digits":0,"rounding":0,"code":"BYR","name_plural":"Belarusian rubles"},"BZD":{"symbol":"BZ$","name":"Belize Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"BZD","name_plural":"Belize dollars"},"CAD":{"symbol":"CA$","name":"Canadian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CAD","name_plural":"Canadian dollars"},"CDF":{"symbol":"CDF","name":"Congolese Franc","symbol_native":"FrCD","decimal_digits":2,"rounding":0,"code":"CDF","name_plural":"Congolese francs"},"CHF":{"symbol":"CHF","name":"Swiss Franc","symbol_native":"CHF","decimal_digits":2,"rounding":0,"code":"CHF","name_plural":"Swiss francs"},"CLF":{"symbol":"UF","name":"Unidad de Fomento","symbol_native":"UF","decimal_digits":2,"rounding":0,"code":"CLF","name_plural":"Unidad de Fomentos"},"CLP":{"symbol":"CL$","name":"Chilean Peso","symbol_native":"$","decimal_digits":0,"rounding":0,"code":"CLP","name_plural":"Chilean pesos"},"CNY":{"symbol":"CN¥","name":"Chinese Yuan","symbol_native":"CN¥","decimal_digits":2,"rounding":0,"code":"CNY","name_plural":"Chinese yuan"},"COP":{"symbol":"CO$","name":"Coombian Peso","symbol_native":"$","decimal_digits":0,"rounding":0,"code":"COP","name_plural":"Colombian pesos"},"CRC":{"symbol":"₡","name":"Costa Rican Colón","symbol_native":"₡","decimal_digits":0,"rounding":0,"code":"CRC","name_plural":"Costa Rican colóns"},"CUC":{"symbol":"CUC$","name":"Cuban Convertible Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CUC","icon_name":"cuc","name_plural":"Cuban Convertible Peso"},"CUP":{"symbol":"$MN","name":"Cuban Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"CUP","icon_name":"cup","name_plural":"Cuban Peso"},"CVE":{"symbol":"CV$","name":"Cape Verdean Escudo","symbol_native":"CV$","decimal_digits":2,"rounding":0,"code":"CVE","name_plural":"Cape Verdean escudos"},"CZK":{"symbol":"Kč","name":"Czech Republic Koruna","symbol_native":"Kč","decimal_digits":2,"rounding":0,"code":"CZK","name_plural":"Czech Republic korunas"},"DJF":{"symbol":"Fdj","name":"Djiboutian Franc","symbol_native":"Fdj","decimal_digits":0,"rounding":0,"code":"DJF","name_plural":"Djiboutian francs"},"DKK":{"symbol":"Dkr","name":"Danish Krone","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"DKK","name_plural":"Danish kroner"},"DOP":{"symbol":"RD$","name":"Dominican Peso","symbol_native":"RD$","decimal_digits":2,"rounding":0,"code":"DOP","name_plural":"Dominican pesos"},"DZD":{"symbol":"DA","name":"Algerian Dinar","symbol_native":"د.ج.‏","decimal_digits":2,"rounding":0,"code":"DZD","name_plural":"Algerian dinars"},"EGP":{"symbol":"EGP","name":"Egyptian Pound","symbol_native":"ج.م.‏","decimal_digits":2,"rounding":0,"code":"EGP","name_plural":"Egyptian pounds"},"ERN":{"symbol":"Nfk","name":"Eritrean Nakfa","symbol_native":"Nfk","decimal_digits":2,"rounding":0,"code":"ERN","name_plural":"Eritrean nakfas"},"ETB":{"symbol":"Br","name":"Ethiopian Birr","symbol_native":"Br","decimal_digits":2,"rounding":0,"code":"ETB","name_plural":"Ethiopian birrs"},"EUR":{"symbol":"€","name":"Euro","symbol_native":"€","decimal_digits":2,"rounding":0,"code":"EUR","name_plural":"Euros"},"FJD":{"symbol":"FJ$","name":"Fijian Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"FJD","icon_name":"fjd","name_plural":"Fijian Dollar"},"FKP":{"symbol":"FK£","name":"Falkland Islands Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"FKP","icon_name":"fkp","name_plural":"Falkland Islands Pound"},"GBP":{"symbol":"£","name":"British Pound Sterling","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GBP","name_plural":"British pounds sterling"},"GEL":{"symbol":"GEL","name":"Georgian Lari","symbol_native":"GEL","decimal_digits":2,"rounding":0,"code":"GEL","name_plural":"Georgian laris"},"GGP":{"symbol":"£","name":"Guernsey pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GGP","name_plural":"Guernsey pounds"},"GHS":{"symbol":"GH₵","name":"Ghanaian Cedi","symbol_native":"GH₵","decimal_digits":2,"rounding":0,"code":"GHS","name_plural":"Ghanaian cedis"},"GIP":{"symbol":"£","name":"Gibraltar Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"GIP","icon_name":"gip","name_plural":"Gibraltar Pounds"},"GMD":{"symbol":"D","name":"Gambian Dalasi","symbol_native":"D","decimal_digits":2,"rounding":0,"code":"GMD","icon_name":"gmd","name_plural":"Gambian Dalasi"},"GNF":{"symbol":"FG","name":"Guinean Franc","symbol_native":"FG","decimal_digits":0,"rounding":0,"code":"GNF","name_plural":"Guinean francs"},"GTQ":{"symbol":"GTQ","name":"Guatemalan Quetzal","symbol_native":"Q","decimal_digits":2,"rounding":0,"code":"GTQ","name_plural":"Guatemalan quetzals"},"GYD":{"symbol":"G$","name":"Guyanaese Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"GYD","icon_name":"gyd","name_plural":"Guyanaese Dollar"},"HKD":{"symbol":"HK$","name":"Hong Kong Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"HKD","name_plural":"Hong Kong dollars"},"HNL":{"symbol":"HNL","name":"Honduran Lempira","symbol_native":"L","decimal_digits":2,"rounding":0,"code":"HNL","name_plural":"Honduran lempiras"},"HRK":{"symbol":"kn","name":"Croatian Kuna","symbol_native":"kn","decimal_digits":2,"rounding":0,"code":"HRK","name_plural":"Croatian kunas"},"HTG":{"symbol":"G","name":"Haitian Gourde","symbol_native":"G","decimal_digits":2,"rounding":0,"code":"HTG","icon_name":"htg","name_plural":"Haitian Gourde"},"HUF":{"symbol":"Ft","name":"Hungarian Forint","symbol_native":"Ft","decimal_digits":0,"rounding":0,"code":"HUF","name_plural":"Hungarian forints"},"IDR":{"symbol":"Rp","name":"Indonesian Rupiah","symbol_native":"Rp","decimal_digits":0,"rounding":0,"code":"IDR","name_plural":"Indonesian rupiahs"},"ILS":{"symbol":"₪","name":"Israeli New Sheqel","symbol_native":"₪","decimal_digits":2,"rounding":0,"code":"ILS","name_plural":"Israeli new sheqels"},"IMP":{"symbol":"£","name":"Manx pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"IMP","name_plural":"Manx pounds"},"INR":{"symbol":"Rs","name":"Indian Rupee","symbol_native":"টকা","decimal_digits":2,"rounding":0,"code":"INR","name_plural":"Indian rupees"},"IQD":{"symbol":"IQD","name":"Iraqi Dinar","symbol_native":"د.ع.‏","decimal_digits":0,"rounding":0,"code":"IQD","name_plural":"Iraqi dinars"},"IRR":{"symbol":"IRR","name":"Iranian Rial","symbol_native":"﷼","decimal_digits":0,"rounding":0,"code":"IRR","name_plural":"Iranian rials"},"ISK":{"symbol":"Ikr","name":"Icelandic Króna","symbol_native":"kr","decimal_digits":0,"rounding":0,"code":"ISK","name_plural":"Icelandic krónur"},"JEP":{"symbol":"£","name":"Jersey pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"JEP","name_plural":"Jersey pound"},"JMD":{"symbol":"J$","name":"Jamaican Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"JMD","name_plural":"Jamaican dollars"},"JOD":{"symbol":"JD","name":"Jordanian Dinar","symbol_native":"د.أ.‏","decimal_digits":3,"rounding":0,"code":"JOD","name_plural":"Jordanian dinars"},"JPY":{"symbol":"¥","name":"Japanese Yen","symbol_native":"￥","decimal_digits":0,"rounding":0,"code":"JPY","name_plural":"Japanese yen"},"KES":{"symbol":"Ksh","name":"Kenyan Shilling","symbol_native":"Ksh","decimal_digits":2,"rounding":0,"code":"KES","name_plural":"Kenyan shillings"},"KGS":{"symbol":"KGS","name":"Kyrgystani Som","symbol_native":"KGS","decimal_digits":2,"rounding":0,"code":"KGS","icon_name":"kgs","name_plural":"Kyrgystani Som"},"KHR":{"symbol":"KHR","name":"Cambodian Riel","symbol_native":"៛","decimal_digits":2,"rounding":0,"code":"KHR","name_plural":"Cambodian riels"},"KMF":{"symbol":"CF","name":"Comorian Franc","symbol_native":"FC","decimal_digits":0,"rounding":0,"code":"KMF","name_plural":"Comorian francs"},"KPW":{"symbol":"₩","name":"North Korean Won","symbol_native":"₩","decimal_digits":2,"rounding":0,"code":"KPW","icon_name":"kpw","name_plural":"North Korean Won"},"KRW":{"symbol":"₩","name":"South Korean Won","symbol_native":"₩","decimal_digits":0,"rounding":0,"code":"KRW","name_plural":"South Korean won"},"KWD":{"symbol":"KD","name":"Kuwaiti Dinar","symbol_native":"د.ك.‏","decimal_digits":3,"rounding":0,"code":"KWD","name_plural":"Kuwaiti dinars"},"KYD":{"symbol":"CI$","name":"Cayman Islands Dollar","symbol_native":"$‏","decimal_digits":2,"rounding":0,"code":"KYD","icon_name":"kyd","name_plural":"Cayman Islands Dollar"},"KZT":{"symbol":"KZT","name":"Kazakhstani Tenge","symbol_native":"тңг.","decimal_digits":2,"rounding":0,"code":"KZT","name_plural":"Kazakhstani tenges"},"LAK":{"symbol":"₭N","name":"Laotian Kip","symbol_native":"₭‏‏","decimal_digits":0,"rounding":0,"code":"LAK","name_plural":"Laotian Kip"},"LBP":{"symbol":"LB£","name":"Lebanese Pound","symbol_native":"ل.ل.‏","decimal_digits":0,"rounding":0,"code":"LBP","name_plural":"Lebanese pounds"},"LKR":{"symbol":"SLRs","name":"Sri Lankan Rupee","symbol_native":"SL Re","decimal_digits":2,"rounding":0,"code":"LKR","name_plural":"Sri Lankan rupees"},"LRD":{"symbol":"LD$","name":"Liberian Dollar","symbol_native":"L$","decimal_digits":2,"rounding":0,"code":"LRD","icon_name":"lrd","name_plural":"Liberian Dollar"},"LSL":{"symbol":"L","name":"Lesotho Loti","symbol_native":"M","decimal_digits":2,"rounding":0,"code":"LSL","icon_name":"lsl","name_plural":"Lesotho Loti"},"LTL":{"symbol":"Lt","name":"Lithuanian Litas","symbol_native":"Lt","decimal_digits":2,"rounding":0,"code":"LTL","name_plural":"Lithuanian litai"},"LVL":{"symbol":"Ls","name":"Latvian Lats","symbol_native":"Ls","decimal_digits":2,"rounding":0,"code":"LVL","name_plural":"Latvian lati"},"LYD":{"symbol":"LD","name":"Libyan Dinar","symbol_native":"د.ل.‏","decimal_digits":3,"rounding":0,"code":"LYD","name_plural":"Libyan dinars"},"MAD":{"symbol":"MAD","name":"Moroccan Dirham","symbol_native":"د.م.‏","decimal_digits":2,"rounding":0,"code":"MAD","name_plural":"Moroccan dirhams"},"MDL":{"symbol":"MDL","name":"Moldovan Leu","symbol_native":"MDL","decimal_digits":2,"rounding":0,"code":"MDL","name_plural":"Moldovan lei"},"MGA":{"symbol":"MGA","name":"Malagasy Ariary","symbol_native":"MGA","decimal_digits":0,"rounding":0,"code":"MGA","name_plural":"Malagasy Ariaries"},"MKD":{"symbol":"MKD","name":"Macedonian Denar","symbol_native":"MKD","decimal_digits":2,"rounding":0,"code":"MKD","name_plural":"Macedonian denari"},"MMK":{"symbol":"MMK","name":"Myanma Kyat","symbol_native":"K","decimal_digits":0,"rounding":0,"code":"MMK","name_plural":"Myanma kyats"},"MNT":{"symbol":"₮","name":"Mongolian Tugrik","symbol_native":"₮","decimal_digits":2,"rounding":0,"code":"MNT","icon_name":"mnt","name_plural":"Mongolian Tugrik"},"MOP":{"symbol":"MOP$","name":"Macanese Pataca","symbol_native":"MOP$","decimal_digits":2,"rounding":0,"code":"MOP","name_plural":"Macanese patacas"},"MRO":{"symbol":"UM","name":"Mauritanian ouguiya","symbol_native":"UM","decimal_digits":2,"rounding":0,"code":"MRO","name_plural":"Mauritanian ouguiyas"},"MUR":{"symbol":"MURs","name":"Mauritian Rupee","symbol_native":"MURs","decimal_digits":0,"rounding":0,"code":"MUR","name_plural":"Mauritian rupees"},"MVR":{"symbol":"MRf","name":"Maldivian Rufiyaa","symbol_native":"Rf","decimal_digits":2,"rounding":0,"code":"MVR","name_plural":"Maldivian Rufiyaa"},"MWK":{"symbol":"MK","name":"Malawian Kwacha","symbol_native":"MK","decimal_digits":2,"rounding":0,"code":"MWK","icon_name":"mwk","name_plural":"Malawian Kwacha"},"MXN":{"symbol":"MX$","name":"Mexican Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"MXN","name_plural":"Mexican pesos"},"MYR":{"symbol":"RM","name":"Malaysian Ringgit","symbol_native":"RM","decimal_digits":2,"rounding":0,"code":"MYR","name_plural":"Malaysian ringgits"},"MZN":{"symbol":"MTn","name":"Mozambican Metical","symbol_native":"MTn","decimal_digits":2,"rounding":0,"code":"MZN","name_plural":"Mozambican meticals"},"NAD":{"symbol":"N$","name":"Namibian Dollar","symbol_native":"N$","decimal_digits":2,"rounding":0,"code":"NAD","name_plural":"Namibian dollars"},"NGN":{"symbol":"₦","name":"Nigerian Naira","symbol_native":"₦","decimal_digits":2,"rounding":0,"code":"NGN","name_plural":"Nigerian nairas"},"NIO":{"symbol":"C$","name":"Nicaraguan Córdoba","symbol_native":"C$","decimal_digits":2,"rounding":0,"code":"NIO","name_plural":"Nicaraguan córdobas"},"NOK":{"symbol":"Nkr","name":"Norwegian Krone","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"NOK","name_plural":"Norwegian kroner"},"NPR":{"symbol":"NPRs","name":"Nepalese Rupee","symbol_native":"नेरू","decimal_digits":2,"rounding":0,"code":"NPR","name_plural":"Nepalese rupees"},"NZD":{"symbol":"NZ$","name":"New Zealand Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"NZD","name_plural":"New Zealand dollars"},"OMR":{"symbol":"OMR","name":"Omani Rial","symbol_native":"ر.ع.‏","decimal_digits":3,"rounding":0,"code":"OMR","name_plural":"Omani rials"},"PAB":{"symbol":"B/.","name":"Panamanian Balboa","symbol_native":"B/.","decimal_digits":2,"rounding":0,"code":"PAB","name_plural":"Panamanian balboas"},"PEN":{"symbol":"S/.","name":"Peruvian Nuevo Sol","symbol_native":"S/.","decimal_digits":2,"rounding":0,"code":"PEN","name_plural":"Peruvian nuevos soles"},"PGK":{"symbol":"K","name":"Papua New Guinean Kina","symbol_native":"K","decimal_digits":2,"rounding":0,"code":"PGK","icon_name":"pgk","name_plural":"Papua New Guinean Kina"},"PHP":{"symbol":"₱","name":"Philippine Peso","symbol_native":"₱","decimal_digits":2,"rounding":0,"code":"PHP","name_plural":"Philippine pesos"},"PKR":{"symbol":"PKRs","name":"Pakistani Rupee","symbol_native":"₨","decimal_digits":0,"rounding":0,"code":"PKR","name_plural":"Pakistani rupees"},"PLN":{"symbol":"zł","name":"Polish Zloty","symbol_native":"zł","decimal_digits":2,"rounding":0,"code":"PLN","name_plural":"Polish zlotys"},"PYG":{"symbol":"₲","name":"Paraguayan Guarani","symbol_native":"₲","decimal_digits":0,"rounding":0,"code":"PYG","name_plural":"Paraguayan guaranis"},"QAR":{"symbol":"QR","name":"Qatari Rial","symbol_native":"ر.ق.‏","decimal_digits":2,"rounding":0,"code":"QAR","name_plural":"Qatari rials"},"RON":{"symbol":"RON","name":"Romanian Leu","symbol_native":"RON","decimal_digits":2,"rounding":0,"code":"RON","name_plural":"Romanian lei"},"RSD":{"symbol":"din.","name":"Serbian Dinar","symbol_native":"дин.","decimal_digits":0,"rounding":0,"code":"RSD","name_plural":"Serbian dinars"},"RUB":{"symbol":"RUB","name":"Russian Ruble","symbol_native":"руб.","decimal_digits":2,"rounding":0,"code":"RUB","name_plural":"Russian rubles"},"RWF":{"symbol":"RWF","name":"Rwandan Franc","symbol_native":"FR","decimal_digits":0,"rounding":0,"code":"RWF","name_plural":"Rwandan francs"},"SAR":{"symbol":"SR","name":"Saudi Riyal","symbol_native":"ر.س.‏","decimal_digits":2,"rounding":0,"code":"SAR","name_plural":"Saudi riyals"},"SBD":{"symbol":"SI$","name":"Solomon Islands Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SBD","icon_name":"sbd","name_plural":"Solomon Islands Dollars"},"SCR":{"symbol":"SRe","name":"Seychellois Rupee","symbol_native":"SR","decimal_digits":2,"rounding":0,"code":"SCR","icon_name":"scr","name_plural":"Seychellois Rupees"},"SDG":{"symbol":"SDG","name":"Sudanese Pound","symbol_native":"SDG","decimal_digits":2,"rounding":0,"code":"SDG","name_plural":"Sudanese pounds"},"SEK":{"symbol":"Skr","name":"Swedish Krona","symbol_native":"kr","decimal_digits":2,"rounding":0,"code":"SEK","name_plural":"Swedish kronor"},"SGD":{"symbol":"S$","name":"Singapore Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SGD","name_plural":"Singapore dollars"},"SHP":{"symbol":"£","name":"Saint Helena Pound","symbol_native":"£","decimal_digits":2,"rounding":0,"code":"SHP","icon_name":"shp","name_plural":"Saint Helena Pounds"},"SLL":{"symbol":"Le","name":"Sierra Leonean Leone","symbol_native":"Le","decimal_digits":2,"rounding":0,"code":"SLL","icon_name":"sll","name_plural":"Sierra Leonean Leone"},"SOS":{"symbol":"Ssh","name":"Somali Shilling","symbol_native":"Ssh","decimal_digits":0,"rounding":0,"code":"SOS","name_plural":"Somali shillings"},"SRD":{"symbol":"$","name":"Surinamese Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"SRD","icon_name":"srd","name_plural":"Surinamese Dollar"},"STD":{"symbol":"Db","name":"São Tomé and Príncipe dobra","symbol_native":"Db","decimal_digits":2,"rounding":0,"code":"STD","name_plural":"São Tomé and Príncipe dobras"},"SVC":{"symbol":"₡","name":"Salvadoran Colón","symbol_native":"₡","decimal_digits":2,"rounding":0,"code":"SVC","icon_name":"svc","name_plural":"Salvadoran Colón"},"SYP":{"symbol":"SY£","name":"Syrian Pound","symbol_native":"ل.س.‏","decimal_digits":0,"rounding":0,"code":"SYP","name_plural":"Syrian pounds"},"SZL":{"symbol":"L","name":"Swazi Lilangeni","symbol_native":"E‏","decimal_digits":2,"rounding":0,"code":"SZL","icon_name":"szl","name_plural":"Swazi Lilangeni"},"THB":{"symbol":"฿","name":"Thai Baht","symbol_native":"฿","decimal_digits":2,"rounding":0,"code":"THB","name_plural":"Thai baht"},"TJS":{"symbol":"TJS","name":"Tajikistani Somoni","symbol_native":"TJS","decimal_digits":2,"rounding":0,"code":"TJS","icon_name":"tjs","name_plural":"Tajikistani Somoni"},"TMT":{"symbol":"T","name":"Turkmenistani Manat","symbol_native":"T‏","decimal_digits":2,"rounding":0,"code":"TMT","icon_name":"tmt","name_plural":"Turkmenistani Manat"},"TND":{"symbol":"DT","name":"Tunisian Dinar","symbol_native":"د.ت.‏","decimal_digits":3,"rounding":0,"code":"TND","name_plural":"Tunisian dinars"},"TOP":{"symbol":"T$","name":"Tongan Paʻanga","symbol_native":"T$","decimal_digits":2,"rounding":0,"code":"TOP","name_plural":"Tongan paʻanga"},"TRY":{"symbol":"TL","name":"Turkish Lira","symbol_native":"TL","decimal_digits":2,"rounding":0,"code":"TRY","name_plural":"Turkish Lira"},"TTD":{"symbol":"TT$","name":"Trinidad and Tobago Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"TTD","name_plural":"Trinidad and Tobago dollars"},"TWD":{"symbol":"NT$","name":"New Taiwan Dollar","symbol_native":"NT$","decimal_digits":2,"rounding":0,"code":"TWD","name_plural":"New Taiwan dollars"},"TZS":{"symbol":"TSh","name":"Tanzanian Shilling","symbol_native":"TSh","decimal_digits":0,"rounding":0,"code":"TZS","name_plural":"Tanzanian shillings"},"UAH":{"symbol":"₴","name":"Ukrainian Hryvnia","symbol_native":"₴","decimal_digits":2,"rounding":0,"code":"UAH","name_plural":"Ukrainian hryvnias"},"UGX":{"symbol":"USh","name":"Ugandan Shilling","symbol_native":"USh","decimal_digits":0,"rounding":0,"code":"UGX","name_plural":"Ugandan shillings"},"USD":{"symbol":"$","name":"US Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"USD","name_plural":"US dollars"},"UYU":{"symbol":"$U","name":"Uruguayan Peso","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"UYU","name_plural":"Uruguayan pesos"},"UZS":{"symbol":"UZS","name":"Uzbekistan Som","symbol_native":"UZS","decimal_digits":0,"rounding":0,"code":"UZS","name_plural":"Uzbekistan som"},"VEF":{"symbol":"Bs.F.","name":"Venezuelan Bolívar","symbol_native":"Bs.F.","decimal_digits":2,"rounding":0,"code":"VEF","name_plural":"Venezuelan bolívars"},"VND":{"symbol":"₫","name":"Vietnamese Dong","symbol_native":"₫","decimal_digits":0,"rounding":0,"code":"VND","name_plural":"Vietnamese dong"},"VUV":{"symbol":"VUV","name":"Vanuatu Vatu","symbol_native":"VT","decimal_digits":0,"rounding":0,"code":"VUV","icon_name":"vuv","name_plural":"Vanuatu Vatu"},"WST":{"symbol":"WS$","name":"Samoan Tala","symbol_native":"T","decimal_digits":2,"rounding":0,"code":"WST","icon_name":"wst","name_plural":"Samoan Tala"},"XAF":{"symbol":"FCFA","name":"CFA Franc BEAC","symbol_native":"FCFA","decimal_digits":0,"rounding":0,"code":"XAF","name_plural":"CFA francs BEAC"},"XAG":{"symbol":"XAG","name":"Silver Ounce","symbol_native":"XAG","decimal_digits":2,"rounding":0,"code":"XAG","name_plural":"Silver Ounces"},"XAU":{"symbol":"XAU","name":"Gold Ounce","symbol_native":"XAU","decimal_digits":2,"rounding":0,"code":"XAU","name_plural":"Gold Ounces"},"XCD":{"symbol":"EC$","name":"East Caribbean Dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"XCD","icon_name":"xcd","name_plural":"East Caribbean Dollars"},"XDR":{"symbol":"SDR","name":"Special drawing rights","symbol_native":"SDR","decimal_digits":2,"rounding":0,"code":"XDR","name_plural":"Special drawing rights"},"XOF":{"symbol":"CFA","name":"CFA Franc BCEAO","symbol_native":"CFA","decimal_digits":0,"rounding":0,"code":"XOF","name_plural":"CFA francs BCEAO"},"XPF":{"symbol":"CFP","name":"CFP Franc","symbol_native":"CFP","decimal_digits":0,"rounding":0,"code":"XPF","icon_name":"xpf","name_plural":"CFP francs"},"YER":{"symbol":"YR","name":"Yemeni Rial","symbol_native":"ر.ي.‏","decimal_digits":0,"rounding":0,"code":"YER","name_plural":"Yemeni rials"},"ZAR":{"symbol":"R","name":"South African Rand","symbol_native":"R","decimal_digits":2,"rounding":0,"code":"ZAR","name_plural":"South African rand"},"ZMK":{"symbol":"ZK","name":"Zambian Kwacha","symbol_native":"ZK","decimal_digits":0,"rounding":0,"code":"ZMK","name_plural":"Zambian kwachas"},"ZMW":{"symbol":"ZK","name":"Zambian Kwacha","symbol_native":"ZK","decimal_digits":0,"rounding":0,"code":"ZMW","name_plural":"Zambian kwachas"},"ZWL":{"symbol":"ZWL","name":"Zimbabwean dollar","symbol_native":"$","decimal_digits":2,"rounding":0,"code":"ZWL","name_plural":"Zimbabwean dollars"},"BTC":{"symbol":"₿","name":"Bitcoin","symbol_native":"₿","decimal_digits":8,"rounding":0,"code":"BTC","name_plural":"Bitcoins"},"ETH":{"symbol":"Ξ","name":"Ethereum","symbol_native":"Ξ","decimal_digits":18,"rounding":0,"code":"ETH","name_plural":"Ethereum"},"BNB":{"symbol":"BNB","name":"Binance","symbol_native":"BNB","decimal_digits":8,"rounding":0,"code":"BNB","name_plural":"Binance"},"XRP":{"symbol":"XRP","name":"Ripple","symbol_native":"XRP","decimal_digits":6,"rounding":0,"code":"XRP","name_plural":"Ripple"},"SOL":{"symbol":"SOL","name":"Solana","symbol_native":"SOL","decimal_digits":9,"rounding":0,"code":"SOL","name_plural":"Solana"},"DOT":{"symbol":"DOT","name":"Polkadot","symbol_native":"DOT","decimal_digits":10,"rounding":0,"code":"DOT","name_plural":"Polkadot"},"AVAX":{"symbol":"AVAX","name":"Avalanche","symbol_native":"AVAX","decimal_digits":18,"rounding":0,"code":"AVAX","name_plural":"Avalanche"},"MATIC":{"symbol":"MATIC","name":"Matic Token","symbol_native":"MATIC","decimal_digits":18,"rounding":0,"code":"MATIC","name_plural":"Matic Tokens"},"LTC":{"symbol":"Ł","name":"Litecoin","symbol_native":"Ł","decimal_digits":8,"rounding":0,"code":"LTC","name_plural":"Litecoins"},"ADA":{"symbol":"ADA","name":"Cardano","symbol_native":"ADA","decimal_digits":6,"rounding":0,"code":"ADA","name_plural":"Cardanos"}}}';
currenciesResp = JSON.parse(currenciesResp);
currenciesResp = currenciesResp.data;

window.onload = function(e){

  
  const currencyApi = new CurrencyAPI('c6P1ZZBwJDlaFI96JowcuxDkYYNo9QT7iKJuIGDm'); //c6P1ZZBwJDlaFI96JowcuxDkYYNo9QT7iKJuIGDm
  currencyApi.latest().then(latestResponse =>{
    if(!latestResponse.data){
      latestResponse = '{"meta":{"last_updated_at":"2023-04-05T23:59:59Z"},"data":{"ADA":{"code":"ADA","value":2.54442},"AED":{"code":"AED","value":3.672905},"AFN":{"code":"AFN","value":86.500169},"ALL":{"code":"ALL","value":103.490198},"AMD":{"code":"AMD","value":388.320634},"ANG":{"code":"ANG","value":1.803448},"AOA":{"code":"AOA","value":507.00061},"ARS":{"code":"ARS","value":211.225324},"AUD":{"code":"AUD","value":1.488803},"AVAX":{"code":"AVAX","value":0.055448},"AWG":{"code":"AWG","value":1.800002},"AZN":{"code":"AZN","value":1.700003},"BAM":{"code":"BAM","value":1.788},"BBD":{"code":"BBD","value":2.020481},"BDT":{"code":"BDT","value":107.51948},"BGN":{"code":"BGN","value":1.791435},"BHD":{"code":"BHD","value":0.377013},"BIF":{"code":"BIF","value":2083.003057},"BMD":{"code":"BMD","value":1.000001},"BNB":{"code":"BNB","value":0.003165},"BND":{"code":"BND","value":1.326874},"BOB":{"code":"BOB","value":6.941053},"BRL":{"code":"BRL","value":5.034708},"BSD":{"code":"BSD","value":1.000687},"BTC":{"code":"BTC","value":0.000035},"BTN":{"code":"BTN","value":82.038212},"BWP":{"code":"BWP","value":13.063968},"BYN":{"code":"BYN","value":2.525762},"BYR":{"code":"BYR","value":19600},"BZD":{"code":"BZD","value":2.017008},"CAD":{"code":"CAD","value":1.345467},"CDF":{"code":"CDF","value":2050.003624},"CHF":{"code":"CHF","value":0.906371},"CLF":{"code":"CLF","value":0.029423},"CLP":{"code":"CLP","value":811.871064},"CNY":{"code":"CNY","value":6.879508},"COP":{"code":"COP","value":4585.00536},"CRC":{"code":"CRC","value":538.191342},"CUC":{"code":"CUC","value":1.004955},"CUP":{"code":"CUP","value":24.016121},"CVE":{"code":"CVE","value":101.470103},"CZK":{"code":"CZK","value":21.496424},"DJF":{"code":"DJF","value":177.72034},"DKK":{"code":"DKK","value":6.832743},"DOP":{"code":"DOP","value":54.750063},"DOT":{"code":"DOT","value":0.155296},"DZD":{"code":"DZD","value":135.370728},"EGP":{"code":"EGP","value":30.899441},"ERN":{"code":"ERN","value":15.000028},"ETB":{"code":"ETB","value":53.940074},"ETH":{"code":"ETH","value":0.000523},"EUR":{"code":"EUR","value":0.917091},"FJD":{"code":"FJD","value":2.200803},"FKP":{"code":"FKP","value":0.802367},"GBP":{"code":"GBP","value":0.802401},"GEL":{"code":"GEL","value":2.555003},"GGP":{"code":"GGP","value":0.802367},"GHS":{"code":"GHS","value":10.750015},"GIP":{"code":"GIP","value":0.802367},"GMD":{"code":"GMD","value":62.250118},"GNF":{"code":"GNF","value":8650.013383},"GTQ":{"code":"GTQ","value":7.802727},"GYD":{"code":"GYD","value":211.673994},"HKD":{"code":"HKD","value":7.849825},"HNL":{"code":"HNL","value":24.595048},"HRK":{"code":"HRK","value":6.909822},"HTG":{"code":"HTG","value":154.600937},"HUF":{"code":"HUF","value":345.660403},"IDR":{"code":"IDR","value":14965.528172},"ILS":{"code":"ILS","value":3.584665},"IMP":{"code":"IMP","value":0.802367},"INR":{"code":"INR","value":81.950382},"IQD":{"code":"IQD","value":1461.002755},"IRR":{"code":"IRR","value":42250.063034},"ISK":{"code":"ISK","value":137.120261},"JEP":{"code":"JEP","value":0.802367},"JMD":{"code":"JMD","value":152.214843},"JOD":{"code":"JOD","value":0.709401},"JPY":{"code":"JPY","value":130.932152},"KES":{"code":"KES","value":133.400218},"KGS":{"code":"KGS","value":87.420174},"KHR":{"code":"KHR","value":4059.007614},"KMF":{"code":"KMF","value":451.170459},"KPW":{"code":"KPW","value":899.980879},"KRW":{"code":"KRW","value":1317.211549},"KWD":{"code":"KWD","value":0.3068},"KYD":{"code":"KYD","value":0.833937},"KZT":{"code":"KZT","value":449.139084},"LAK":{"code":"LAK","value":17170.029646},"LBP":{"code":"LBP","value":15265.022246},"LKR":{"code":"LKR","value":322.607644},"LRD":{"code":"LRD","value":162.450174},"LSL":{"code":"LSL","value":17.990028},"LTC":{"code":"LTC","value":0.010746},"LTL":{"code":"LTL","value":2.95274},"LVL":{"code":"LVL","value":0.60489},"LYD":{"code":"LYD","value":4.755007},"MAD":{"code":"MAD","value":10.199514},"MATIC":{"code":"MATIC","value":0.875284},"MDL":{"code":"MDL","value":18.214925},"MGA":{"code":"MGA","value":4360.008462},"MKD":{"code":"MKD","value":56.490034},"MMK":{"code":"MMK","value":2101.388655},"MNT":{"code":"MNT","value":3524.268985},"MOP":{"code":"MOP","value":8.09189},"MRO":{"code":"MRO","value":356.999828},"MUR":{"code":"MUR","value":45.402953},"MVR":{"code":"MVR","value":15.370031},"MWK":{"code":"MWK","value":1022.501205},"MXN":{"code":"MXN","value":18.313672},"MYR":{"code":"MYR","value":4.398505},"MZN":{"code":"MZN","value":63.250116},"NAD":{"code":"NAD","value":17.990024},"NGN":{"code":"NGN","value":464.500859},"NIO":{"code":"NIO","value":36.550044},"NOK":{"code":"NOK","value":10.449024},"NPR":{"code":"NPR","value":131.239416},"NZD":{"code":"NZD","value":1.582643},"OMR":{"code":"OMR","value":0.384985},"PAB":{"code":"PAB","value":1.000687},"PEN":{"code":"PEN","value":3.769005},"PGK":{"code":"PGK","value":3.525006},"PHP":{"code":"PHP","value":54.523082},"PKR":{"code":"PKR","value":288.250535},"PLN":{"code":"PLN","value":4.299785},"PYG":{"code":"PYG","value":7167.355711},"QAR":{"code":"QAR","value":3.641004},"RON":{"code":"RON","value":4.524322},"RSD":{"code":"RSD","value":107.590179},"RUB":{"code":"RUB","value":80.200117},"RWF":{"code":"RWF","value":1107.001831},"SAR":{"code":"SAR","value":3.751517},"SBD":{"code":"SBD","value":8.287288},"SCR":{"code":"SCR","value":13.906941},"SDG":{"code":"SDG","value":600.000933},"SEK":{"code":"SEK","value":10.415165},"SGD":{"code":"SGD","value":1.328392},"SHP":{"code":"SHP","value":1.216752},"SLL":{"code":"SLL","value":19750.030331},"SOL":{"code":"SOL","value":0.047586},"SOS":{"code":"SOS","value":569.500629},"SRD":{"code":"SRD","value":36.471062},"STD":{"code":"STD","value":20697.981008},"SVC":{"code":"SVC","value":8.756237},"SYP":{"code":"SYP","value":2512.498594},"SZL":{"code":"SZL","value":17.990034},"THB":{"code":"THB","value":33.950047},"TJS":{"code":"TJS","value":10.939362},"TMT":{"code":"TMT","value":3.510007},"TND":{"code":"TND","value":3.042004},"TOP":{"code":"TOP","value":2.344003},"TRY":{"code":"TRY","value":19.255138},"TTD":{"code":"TTD","value":6.782475},"TWD":{"code":"TWD","value":30.466553},"TZS":{"code":"TZS","value":2332.002367},"UAH":{"code":"UAH","value":36.945724},"UGX":{"code":"UGX","value":3772.916409},"USD":{"code":"USD","value":1},"UYU":{"code":"UYU","value":38.606799},"UZS":{"code":"UZS","value":11375.020019},"VEF":{"code":"VEF","value":2438522.825934},"VND":{"code":"VND","value":23467.53394},"VUV":{"code":"VUV","value":118.542825},"WST":{"code":"WST","value":2.705435},"XAF":{"code":"XAF","value":599.717374},"XAG":{"code":"XAG","value":0.040101},"XAU":{"code":"XAU","value":0.000495},"XCD":{"code":"XCD","value":2.702553},"XDR":{"code":"XDR","value":0.743522},"XOF":{"code":"XOF","value":598.500695},"XPF":{"code":"XPF","value":109.750111},"XRP":{"code":"XRP","value":1.963601},"YER":{"code":"YER","value":250.350434},"ZAR":{"code":"ZAR","value":18.102132},"ZMK":{"code":"ZMK","value":9001.2},"ZMW":{"code":"ZMW","value":19.941685},"ZWL":{"code":"ZWL","value":321.999592}}}';
      latestResponse = JSON.parse(latestResponse);
      console.log('using mock response');
    }
    latestResponse = latestResponse.data;
    for (let data in latestResponse){
      var toOption = document.createElement('option');
      toOption.text = latestResponse[data].code + ' ' + currenciesResp[data].name;
      toOption.value = latestResponse[data].value;
      toSelect.add(toOption);

      var fromOption = document.createElement('option');
      fromOption.text = latestResponse[data].code + ' ' + currenciesResp[data].name;
      fromOption.value = latestResponse[data].value;
      fromSelect.add(fromOption);
      
    }
  });
};

btnConvert.addEventListener('click', function (e) {
  
  var amountValue = amount.value;
  var fromSelectValue = fromSelect.value;
  var toSelectValue = toSelect.value;

  if (fromSelectValue == '' || toSelectValue == '' || (amountValue < 0)) {
    convertedAmount.classList.add('hidden');
    convertedAmountLabel.classList.add('hidden');
    return false;
  }
  var convertedValue = (amountValue * (toSelectValue / fromSelectValue)).toFixed(2);
  convertedAmount.innerHTML = convertedValue;
  convertedAmount.classList.remove('hidden');
  convertedAmountLabel.classList.remove('hidden');


});