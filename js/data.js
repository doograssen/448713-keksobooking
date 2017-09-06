'use strict';

(function () {
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
  /* -------------------------------------------------------------------------------------------------------------------
*   Вспомогательные функции генерации массивов случайных значений
* ------------------------------------------------------------------------------------------------------------------*/

  /* функция перетасовки значений в массиве */
  function shuffle(array) {
    array.sort(function () {
      return Math.random() - 0.5;
    });
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


  window.data = {
    /* массив объектов  с описание помещений от владельцев */
    //dialog: document.querySelector('.dialog'),
    activePin: '',
    getApartments: function () {
      var amount = 8; // кол-во объявлений
      var ownerGroup = []; // массив объектов с описанием помещений
      var ownersApartments = createArr(amount); // массив связывающий случайно владельца и помещение
      for (var i = 0; i < amount; i++) {
        ownerGroup[i] = getApartmentInfo(i, ownersApartments);
      }
      return ownerGroup;
    }
  };
})();
