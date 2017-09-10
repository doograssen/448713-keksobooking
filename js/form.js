'use strict';

(function () {
  /* --------------------------------Валидация формы -------------------------------------------------------------------*/

  /* элементы  формы */
  var offerForm = document.querySelector('.form__content');
  var offerTitle = offerForm.querySelector('#title');
  var offerAddress = offerForm.querySelector('#address');
  var offerType = offerForm.querySelector('#type');
  var offerPrice = offerForm.querySelector('#price');
  var offerRoom = offerForm.querySelector('#room_number');
  var offerCapacity = offerForm.querySelector('#capacity');
  var offerTimeIn = offerForm.querySelector('#timein');
  var offerTimeOut = offerForm.querySelector('#timeout');
  /* ассоциативный массив  стоимости и типа жилья */
  var offerMinPrice = {'bungalo': 0, 'flat': 1000, 'house': 5000, 'palace': 10000};

  /* функция валидация input[type = 'text'] */
  function validateInput(min, max, numeric) {
    return function (evt) {
      var target = evt.target;
      var inputValue = numeric ? parseFloat(target.value) : target.value.length;
      var messageText = '';
      if (min > 0 && inputValue <= min) {
        messageText = numeric ? 'Значение в поле должно быть больше ' + min : 'Минимальная длина содержимого поля - ' + min;
      } else if (max > min && inputValue >= max) {
        messageText = numeric ? 'Значение в поле должно быть меньше ' + max : 'Максимальная длина содержимого поля ' + max + ' символов';
      }
      target.setCustomValidity(messageText);
    };
  }

  /* события ввода */
  offerTitle.addEventListener('input', validateInput(30, 100, false));
  offerAddress.addEventListener('input', validateInput(0, 0, false));
  offerPrice.addEventListener('input', validateInput(offerPrice.min, offerPrice.max, true));

  /* синхронизация  времени въезда и выезда */
  function synchronizeTime(source, dest) {
    dest.selectedIndex = source.selectedIndex;
  }

  function synchronizePrice(source, dest) {
    var minPriceValue = offerMinPrice[source.value];
    dest.min = minPriceValue;
    if (dest.value < minPriceValue) {
      dest.value = minPriceValue;
    }
  }

  function validateRoomSelect(source, dest) {
    var capacityLength = dest.options.length;
    var roomValue = parseInt(source.value, 10);
    var currentCapacity = parseInt(dest.value, 10);
    for (var i = 0; i < capacityLength; i++) {
      var capacityVal = parseInt(dest.options[i].value, 10);
      dest.options[i].disabled = (capacityVal > roomValue) || (roomValue !== 100 && capacityVal === 0) || (capacityVal > 0 && roomValue === 100);
      if (!dest.options[i].disabled && (roomValue < currentCapacity || capacityVal === 0 || currentCapacity === 0)) {
        dest.options[i].selected = true;
      }
    }
  }
  /* offerTimeIn.addEventListener('change', function () {
    synchronizeTime(offerTimeIn, offerTimeOut);
  });

  offerTimeOut.addEventListener('change', function () {
    synchronizeTime(offerTimeOut, offerTimeIn);
  });*/
  window.synchronizeFields(offerTimeOut, offerTimeIn, synchronizeTime);
  window.synchronizeFields(offerTimeIn, offerTimeOut, synchronizeTime);
  /* стоимость и тип жилья */
  window.synchronizeFields(offerType, offerPrice, synchronizePrice);
  window.synchronizeFields(offerRoom, offerCapacity, validateRoomSelect);
  /* offerType.addEventListener('change', function () {
    var minPriceValue = offerMinPrice[offerType.value];
    offerPrice.min = minPriceValue;
    if (offerPrice.value < minPriceValue) {
      offerPrice.value = minPriceValue;
    }
  }); */

  /* количество комнат  и гостей*/
  /* function validateRoomSelect() {
    var capacityLength = offerCapacity.options.length;
    var roomValue = parseInt(offerRoom.value, 10);
    var currentCapacity = parseInt(offerCapacity.value, 10);
    for (var i = 0; i < capacityLength; i++) {
      var capacityVal = parseInt(offerCapacity.options[i].value, 10);
      offerCapacity.options[i].disabled = (capacityVal > roomValue) || (roomValue !== 100 && capacityVal === 0) || (capacityVal > 0 && roomValue === 100);
      if (!offerCapacity.options[i].disabled && (roomValue < currentCapacity || capacityVal === 0 || currentCapacity === 0)) {
        offerCapacity.options[i].selected = true;
      }
    }
  }*/

 /* offerForm.querySelector('#room_number').addEventListener('change', function () {
    validateRoomSelect();
  });
*/
  window.onload = function () {
    validateRoomSelect(offerRoom, offerCapacity);
  };
})();

