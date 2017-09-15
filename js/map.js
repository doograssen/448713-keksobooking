'use strict';

(function () {
  /* размещение DOM-элементов на странице */
  var defaultPin = document.querySelector('.pin__main');
  var pinMap = document.querySelector('.tokyo__pin-map');
  var pinMain = pinMap.querySelector('.pin__main');
  var defPinHeight = defaultPin.clientHeight;
  var halfPin = Math.floor(defaultPin.clientWidth / 2);
  var topBorder = 200 - defPinHeight;
  var bottomBorder = 650 - defPinHeight;
  var mapWidth = document.querySelector('.tokyo').clientWidth - halfPin;
  var addressInput = document.querySelector('#address');
  /* dom объекты фильтров*/
  var housingFeatures = document.querySelectorAll('#housing_features input[type = "checkbox"]');
  var housingPrice = document.querySelector('#housing_price');
  var housingType = document.querySelector('#housing_type');
  var housingRoomNumber = document.querySelector('#housing_room-number');
  var housingQuestsNumber = document.querySelector('#housing_guests-number');
  /* переменныее для работы с фильтрами*/
  var appartmentFeatures = [];
  var selectFilterCheck = {
    'type': true,
    'price': {
      'low': [0, 10000],
      'middle': [10000, 50000],
      'high': [50000, 1000000]
    },
    'rooms': true,
    'quests': true};
  /* Изменение размера окна */
  function resizeMapWidth() {
    mapWidth = document.querySelector('.tokyo').clientWidth - halfPin;
  }
  window.addEventListener('resize', resizeMapWidth);
  /* функция debounce */
  var timeOut;

  function debounce(func) {
    if (timeOut) {
      window.clearTimeout(timeOut);
      timeOut = null;
    }
    timeOut = window.setTimeout(func, 500);
  }

  /* ------------ События на  элементах фильтра --------------------*/
  housingFeatures.forEach(function (element) {
    element.addEventListener('change', function () {
      var featureValue = element.value;
      if (element.checked) {
        appartmentFeatures.push(featureValue);
      } else {
        var featureIndex = appartmentFeatures.indexOf(featureValue);
        appartmentFeatures.splice(featureIndex, 1);
      }
      debounce(resetPinsOnMap);
    });
  });

  function setSelectListener(element, offerProp) {
    element.addEventListener('change', function () {
      selectFilterCheck[offerProp] = element.value === 'any' ? true : element.value;
      debounce(resetPinsOnMap);
    });
  }

  setSelectListener(housingType, 'type');
  setSelectListener(housingRoomNumber, 'rooms');
  setSelectListener(housingQuestsNumber, 'quests');

  housingPrice.addEventListener('change', function () {
    debounce(resetPinsOnMap);
  });

  /* -----------------------Проверка соответствия ---------------------------------------- */

  function compareFeatures(ownerInfo) {
    return appartmentFeatures.every(function (current) {
      return ~ownerInfo.offer.features.indexOf(current);
    });
  }

  function comparePrice(ownerInfo) {
    return housingPrice.value === 'any' ?
      true : (ownerInfo.offer.price >= selectFilterCheck.price[housingPrice.value][0] && selectFilterCheck.price[housingPrice.value][1]);
  }

  function compareSelectVal(ownerInfo, offerProp) {
    return selectFilterCheck[offerProp] === true || selectFilterCheck[offerProp] === ownerInfo.offer[offerProp].toString();
  }


  function checkByFilters(ownerInfo) {
    return compareFeatures(ownerInfo) && comparePrice(ownerInfo) && compareSelectVal(ownerInfo, 'type')
      && compareSelectVal(ownerInfo, 'rooms') && compareSelectVal(ownerInfo, 'quests');
  }


  /* расстановка пинов по фильтру */

  function resetPinsOnMap() {
    var resetPinArray = ownersInfo.filter(checkByFilters);
    pinMain = pinMap.querySelector('.pin__main');
    pinMap.innerHTML = '';
    pinMap.appendChild(pinMain);
    window.pin.setPinArrayOnMap(resetPinArray);
  }
  /* -------------------------------------------------------------------------------------------------------------
  ----------------------XHR -----------------------------------------------------------------------------------------*/
  var ownersInfo;
  /* --- функция обратного вызова при успешном выполнении запроса ---------------------------*/
  var successXHRExecution = function (response) {
    ownersInfo = response;
    window.pin.setPinArrayOnMap(ownersInfo);
  };


  /* -----запрос загрузки данных-------------------------------------------------------------*/
  window.backend.load(successXHRExecution, window.backend.serverError);
  window.card.addDialogListener();
  /* --------------------------------------------------------------------------------------------------------------------
 *   Перемещение пина по карте
 * -------------------------------------------------------------------------------------------------------------------*/
  /* --------------------- Слушатель нажатия кнопки мыши ------------------------------------*/
  defaultPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var pinLeftBorder = defaultPin.offsetLeft;
    var pinTopBorder = defaultPin.offsetTop;
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    /* -------------функция при перемещение мыши --------------------------------------------*/
    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      pinLeftBorder = defaultPin.offsetLeft;
      pinTopBorder = defaultPin.offsetTop;
      defaultPin.style.top = (pinTopBorder - shift.y) + 'px';
      defaultPin.style.left = (pinLeftBorder - shift.x) + 'px';
    };
    /* -------------функция при отпускании кнопки мыши  -------------------------------------*/
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (pinLeftBorder < -halfPin) {
        pinLeftBorder = -halfPin;
      } else if (pinLeftBorder > mapWidth) {
        pinLeftBorder = mapWidth;
      }
      if (pinTopBorder < topBorder) {
        pinTopBorder = topBorder;
      } else if (pinTopBorder > bottomBorder) {
        pinTopBorder = bottomBorder;
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      defaultPin.style.left = pinLeftBorder + 'px';
      defaultPin.style.top = pinTopBorder + 'px';
      addressInput.value = 'x: ' + (pinLeftBorder + halfPin) + ', y: ' + (pinTopBorder + defPinHeight);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
