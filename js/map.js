'use strict';
/*  ------------------------- Массивы констант ------------------------------------------------------------------------
* OFFER_TITLES - описание помещения;
* OFFER_OPTION - удобства квартиры
* OFFER_TYPE - тип помещения
* OFFER_CHECKIN_CHECKOUT -  время заезда , выезда
* --------------------------------------------------------------------------------------------------------------------*/
var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var OFFER_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_TYPE = ['flat', 'house', 'bungalo'];
var OFFFER_CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
/* -------------------------------------------------------------------------------------------------------------------
*   Вспомогательные функции генерации массивов случайных значений
* ------------------------------------------------------------------------------------------------------------------*/
/* функция перетасовки значений в массиве */
function shuffle(array) {
  array.sort(function () {
    return Math.random() - 0.5;
  }
  );
  return array;
}

/* генерация массива чисел величиной  amount  и его перетасовка*/
function createArr(amount) {
  var arr = [];
  for (var i = 0; i < amount; i++) {
    arr[i] = i;
  }
  return shuffle(arr);
}

/* -------------------------------------------------------------------------------------------------------------------
*    Функции заполнение массива объектов
* -------------------------------------------------------------------------------------------------------------------*/
/* случайное значение в диапазоне от min до max */
function getRandomFromRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

/* получаем объект с атрибутом с ссылкой на картинку */
function getAvatar(currentAuthor) {
  return {avatar: 'img/avatars/user0' + currentAuthor + '.png'};
}

/* получаем объект с атрибутами x y (случайно сгенерированные координаты)  */
function getLocation() {
  return {
    x: getRandomFromRange(300, 900),
    y: getRandomFromRange(200, 600)
  };
}

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

/* функция возращающая объект offer - описание помещения */
function setOffer(currentAuthor, locationCoordinate) {
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

/* Заполняем объявление одного из владельцев */
function getApartmentInfo(index, authorArray) {
  var apartmentLocation = getLocation();// получаем координаты помещения на карте
  return {
    author: getAvatar(index + 1),
    offer: setOffer(authorArray[index], apartmentLocation),
    location: apartmentLocation
  };
}

/* массив объектов  с описание помещений от владельцев */
function getApartments() {
  var amount = 8; // кол-во объявлений
  var ownerGroup = []; // массив объектов с описанием помещений
  var ownersApartments = createArr(amount); // массив связывающий случайно владельца и помещение
  for (var i = 0; i < amount; i++) {
    ownerGroup[i] = getApartmentInfo(i, ownersApartments);
  }
  return ownerGroup;
}

/* -------------------------------------------------------------------------------------------------------------------
*    функции создания DOM  элементов
* -------------------------------------------------------------------------------------------------------------------*/

/* описание элемента пина на карте */
function createPinDomElement(oneOfOwners, ind) {
  var pinElement = document.createElement('div');
  pinElement.className = 'pin';
  pinElement.innerHTML = '<img class="rounded" width="40" height="40">';
  pinElement.style.left = oneOfOwners.location.x - 28 + 'px';
  pinElement.style.top = oneOfOwners.location.y - 75 + 'px';
  pinElement.setAttribute('data-index', ind);
  pinElement.querySelector('.rounded').src = oneOfOwners.author.avatar;
  pinElement.tabIndex = ind + 1;
  return pinElement;
}

/* тип помещения */
function getType(type) {
  switch (type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
  }
  return false;
}

/* элементы-значки удобств */
function getFeatures(featuresList) {
  var listLength = featuresList.length;
  var featureString = '';
  for (var i = 0; i < listLength; i++) {
    featureString += '<span class="feature__image feature__image--' + featuresList[i] + '"></span>';
  }
  return featureString;
}

/* блок с описанием помещения */
function createDescription(description) {
  var replacedElem = document.querySelector('.dialog__panel');
  var template = document.querySelector('#lodge-template');
  var element = template.content.querySelector('.dialog__panel').cloneNode(true);
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
  replacedElem.parentNode.replaceChild(element, replacedElem); // заменяем описание по умолчанию на описание первого объявления
  document.querySelector('.dialog__title img').src = description.author.avatar;
}

/* -------- функции-слушатели событий  ----------------------------*/

var dialog = document.querySelector('.dialog');

// функция, которая делает пин активным
function makeActivePin(e) {
  var activePin = document.querySelector('.pin--active');
  if (activePin) {
    activePin.classList.remove('pin--active');
  }
  if (e.target.nodeName === 'IMG') {
    e.target.parentNode.classList.add('pin--active');
  } else {
    e.target.classList.add('pin--active');
  }
}

// функция-оберка возращает функцию обработчик щелчка на пине с учетом индекса
function closurePinIndex(index) {
  return function (evt) {
    if ((evt.type === 'keydown') && (evt.keyCode !== ENTER_KEYCODE)) {
      return;
    }
    makeActivePin(evt);
    createDescription(ownersInfo[index]);
    dialog.classList.remove('hidden');
  };
}

// функция создаия слушателей событий на пинах
function addPinListeners() {
  var pinElements = document.querySelectorAll('.pin');
  var pinAmount = pinElements.length;
  for (var i = 0; i < pinAmount; i++) {
    var setEvent = closurePinIndex(i);
    pinElements[i].addEventListener('click', setEvent);
    pinElements[i].addEventListener('keydown', setEvent);
  }
}

// нажатие ESC
var onDialogEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeDialog();
  }
};

// закрытие окна диалога  с описание  помещения
function closeDialog() {
  dialog.classList.add('hidden');
  dialog.removeEventListener('click', onDialogEscPress);
  document.querySelector('.pin--active').classList.remove('pin--active');
}

// функция добавления  слушателей событий  в диалоге
function addDialogListener() {
  var closeDialogElem = document.querySelector('.dialog__close');
  closeDialogElem.addEventListener('click', closeDialog);
  document.addEventListener('keydown', onDialogEscPress);
}
// --------------------------------------------------------------------------------------------------------------------

var ownersInfo = getApartments();// глобальный массив с объктами

/* размещение DOM-элементов на странице */
function setMarketInfoList() {
  var fragment = document.createDocumentFragment();
  var ownersAmount = ownersInfo.length;
  for (var i = 0; i < ownersAmount; i++) {
    fragment.appendChild(createPinDomElement(ownersInfo[i], i));
  }
  var defaultPin = document.querySelector('.pin__main');
  document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
  addPinListeners();
  addDialogListener();
}

/* --------------------------------------------------------------------------------------------------------------------
*   Вызов функци-сеятеля пинов
* -------------------------------------------------------------------------------------------------------------------*/
setMarketInfoList();
