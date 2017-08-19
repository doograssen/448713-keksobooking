'use strict';
/* массивы констант
* OFFER_TITLES - описание помещения;
* OFFER_OPTION - удобства квартиры
* OFFEr_TYPE - тип помещения
* OFFER_CHECKIN_CHECKOUT -  время заезда , выезда*/
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFFER_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];

/* Вспомогательные функции генерации массивов случайных значений
* ------------------------------------------------------------------------------------------------------------------*/
/* функция перетасовки значений в массиве */
function shuffle(array) {
  function compareRandom() {
    return Math.random() - 0.5;
  }
  array.sort(compareRandom);
  return array;
}

/* генерация массива чисел величиной  amount
* и его перетасовка*/
function createArr(amount) {
  var arr = [];
  for (var i = 0; i < amount; i++) {
    arr[i] = i;
  }
  return shuffle(arr);
}

/*  Функции заполнение массива объектов  *
* -------------------------------------------------------------------------------------------------------------------*/
/* случайное значение в диапазоне от min до max */
function getRandomFromRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

/* получаем объект с атрибутом с ссылкой на картинку */
function setAvatar(currentAuthor) {
  return {avatar: 'img/avatars/user0' + currentAuthor + '.png'};
}

/* получаем объект с атрибутами x y (случайно сгенерированные координаты)  */
function setLocation() {
  return {
    x: getRandomFromRange(300, 900),
    y: getRandomFromRange(100, 500)
  };
}

/* функция возращающая объект offer - описание помещения */
function setOffer(currentAuthor, locationCoordinate) {
  /* случайные удобства помещений */
  function setFeatureRange() {
    var optionLength = OFFER_OPTIONS.length;
    var featureAmount = getRandomFromRange(1, optionLength);
    var featureArray = createArr(optionLength);
    featureArray.length = featureAmount;
    for (var i = 0; i < featureAmount; i++) {
      featureArray[i] = OFFER_OPTIONS[featureArray[i]];
    }
    return featureArray;
  }
  /* возращаем объект*/
  return {
    title: OFFER_TITLES[currentAuthor],
    address: locationCoordinate.x + ', ' + locationCoordinate.y,
    price: getRandomFromRange(1, 1000) * 1000,
    type: OFFER_TYPE[getRandomFromRange(0, OFFER_TYPE.length - 1)],
    rooms: getRandomFromRange(1, 5),
    guests: getRandomFromRange(1, 10),
    checkin: OFFFER_CHECKIN_CHECKOUT[getRandomFromRange(0, OFFFER_CHECKIN_CHECKOUT.length - 1)],
    checkout: OFFFER_CHECKIN_CHECKOUT[getRandomFromRange(0, OFFFER_CHECKIN_CHECKOUT.length - 1)],
    features: setFeatureRange(),
    description: '',
    photos: []
  };
}

/* массив объектов  с описание помещений от владельцев */
function createArrOfObject(amount) {
  var ownerGroup = []; // массив объектов с описанием помещений
  var ownersApartments = createArr(amount); // массив связывающий случайно владельца и помещение
  var apartmentLocation;
  for (var i = 0; i < amount; i++) {
    apartmentLocation = setLocation();// получаем координаты помещения на карте
    ownerGroup[i] = {
      author: setAvatar(i + 1),
      offer: setOffer(ownersApartments[i], apartmentLocation),
      location: apartmentLocation
    };
  }
  return ownerGroup;
}

/*      функции создания DOM  элементов
* -------------------------------------------------------------------------------------------------------------------*/

/* описание элемента пина на карте */
function createPinDomElement(oneOfOwners) {
  var pinElement = document.createElement('div');
  pinElement.className = 'pin';
  pinElement.innerHTML = '<img class="rounded" width="40" height="40">';
  pinElement.style.left = oneOfOwners.location.x - 28 + 'px';
  pinElement.style.top = oneOfOwners.location.y - 75 + 'px';
  pinElement.querySelector('.rounded').src = oneOfOwners.author.avatar;
  return pinElement;
}

/* блок с описанием помещения */
function createDescriptionDom(apartmentTemplate, description) {
  /* тип помещения */
  function getType(type) {
    switch (type) {
      case 'flat': return 'Квартира';
      case 'bungalo': return 'Бунгало';
      case 'house': return 'Дом';
    }
    return false;
  }
  /* элементы-удобства */
  function getFeatures(featuresList) {
    var listLength = featuresList.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += '<span class="feature__image feature__image--' + featuresList[i] + '"></span>';
    }
    return featureString;
  }
  var element = apartmentTemplate.content.querySelector('.dialog__panel').cloneNode(true);
  element.querySelector('.lodge__title').textContent = description.offer.title;
  element.querySelector('.lodge__address').textContent = description.offer.address;
  element.querySelector('.lodge__price').innerHTML = description.offer.price + '&#x20bd;/ночь';
  element.querySelector('.lodge__type').textContent = getType(description.offer.type);
  element.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + description.offer.guests +
    ' гостей в ' + description.offer.rooms + ' комнатах';
  element.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + description.offer.checkin +
    ', выезд до ' + description.offer.checkout;
  element.querySelector('.lodge__features').innerHTML = getFeatures(description.offer.features);
  element.querySelector('.lodge__description').textContent = description.offer.description;
  document.querySelector('.dialog__title').src = description.author.avatar;
  return element;
}

/* размещение DOM-элементов на странице */
function setMarketInfoList() {
  var ownersInfo = createArrOfObject(8);
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#lodge-template');
  var ownersAmount = ownersInfo.length;
  var replacedElem = document.querySelector('.dialog__panel');
  for (var i = 1; i < ownersAmount; i++) {
    fragment.appendChild(createPinDomElement(ownersInfo[i]));
  }
  document.querySelector('.tokyo__pin-map').appendChild(fragment);
  replacedElem.parentNode.replaceChild(createDescriptionDom(template, ownersInfo[0]), replacedElem);
}

/* ----------------------------------------------------------------------------------------------------------------- */
/* вызов функци-сеятеля пинов */
setMarketInfoList();

