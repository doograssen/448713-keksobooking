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
var activePin;

// функция, которая делает пин активным
function makeActivePin(e) {
  if (activePin) {
    activePin.classList.remove('pin--active');
  }
  e.currentTarget.classList.add('pin--active');
  activePin = e.currentTarget;
}

// функция-оберка возращает функцию обработчик щелчка на пине с учетом индекса
function takePinInfoByIndex(index) {
  return function (evt) {
    makeActivePin(evt);
    createDescription(ownersInfo[index]);
    dialog.classList.remove('hidden');
  };
}

// события на маркере с индексом index
function addCurrentPinListeners(element, index) {
  element.addEventListener('click', takePinInfoByIndex(index));
  element.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      (takePinInfoByIndex(index))(evt);
    }
  });
}

// функция создаия слушателей событий на пинах
function addAllPinListeners() {
  var pinElements = document.querySelectorAll('.pin');
  var pinAmount = pinElements.length;
  for (var i = 0; i < pinAmount; i++) {
    addCurrentPinListeners(pinElements[i], i);
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
  activePin.classList.remove('pin--active');
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
  addAllPinListeners();
  addDialogListener();
}

/* --------------------------------------------------------------------------------------------------------------------
*   Вызов функци-сеятеля пинов
* -------------------------------------------------------------------------------------------------------------------*/
setMarketInfoList();

/* --------------------------------Валидация формы -------------------------------------------------------------------*/

/* элементы  формы */
var offerForm = document.querySelector('.form__content');
var offerTitle = offerForm.querySelector('#title');
var offerAddress = offerForm.querySelector('#address');
var offerPrice = offerForm.querySelector('#price');
var offerRoom = offerForm.querySelector('#room_number');
var offerCapacity = offerForm.querySelector('#capacity');
/* ассоциативный массив  стоимости и типа жилья */
var offerMinPrice = {'bungalo': '0', 'flat': '1000', 'house': '5000', 'palace': '10000'};

/* функция валидация input[type = 'text'] */
function validateInput(min, max, numeric) {
  return function (evt) {
    var target = evt.target;
    var inputValue = numeric ? parseFloat(target.value) : target.value.length;
    if (min > 0 && inputValue <= min) {
      target.setCustomValidity(numeric ? 'Значение в поле должно быть больше ' + min : 'Минимальная длина содержимого поля - ' + min);
    } else if (max > min && inputValue >= max) {
      target.setCustomValidity(numeric ? 'Значение в поле должно быть меньше ' + max : 'Максимальная длина содержимого поля ' + max + ' символов');
    } else {
      target.setCustomValidity('');
    }
  };
}

/* события ввода */
offerTitle.addEventListener('input', validateInput(30, 100, false));
offerAddress.addEventListener('input', validateInput(0, 0, false));
offerPrice.addEventListener('input', validateInput(offerPrice.attributes.min, offerPrice.attributes.max, true));

/* синхронизация  времени въезда и выезда */
offerForm.querySelector('#timein').addEventListener('change', function () {
  var timeinIndex = event.target.options.selectedIndex;
  offerForm.querySelector('#timeout').selectedIndex = timeinIndex;
});

offerForm.querySelector('#timeout').addEventListener('change', function () {
  var timeoutIndex = event.target.options.selectedIndex;
  offerForm.querySelector('#timein').selectedIndex = timeoutIndex;
});

/* стоимость и тип жилья */
offerForm.querySelector('#type').addEventListener('change', function () {
  var AppartmentTypes = event.target;
  var typeIndex = AppartmentTypes.options.selectedIndex;
  var typeValue = AppartmentTypes.options[typeIndex].value;
  offerPrice.setAttribute('min', offerMinPrice[typeValue]);
  offerPrice.value = offerMinPrice[typeValue];
});

/* количество комнат  и гостей*/
function validateRoomSelect() {
  var capacityLength = offerCapacity.options.length;
  var roomCountIndex = offerRoom.options.selectedIndex;
  var roomValue = parseInt(offerRoom.options[roomCountIndex].value, 10);
  var setDefault = false;
  for (var i = 0; i < capacityLength; i++) {
    var capacityVal = parseInt(offerCapacity.options[i].value, 10);
    if ((capacityVal > roomValue) || (roomValue !== 100 && capacityVal === 0) || (capacityVal > 0 && roomValue === 100)) {
      offerCapacity.options[i].disabled = true;
    } else {
      offerCapacity.options[i].disabled = false;
      if (!setDefault) {
        offerCapacity.options[i].selected = true;
        setDefault = !setDefault;
      }
    }
  }
}

offerForm.querySelector('#room_number').addEventListener('change', function () {
  validateRoomSelect();
});

window.onload = function () {
  validateRoomSelect();
};

