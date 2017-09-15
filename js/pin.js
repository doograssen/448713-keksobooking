'use strict';

(function () {
  var ENTER_KEYCODE = 13; // ----------- Код клавиши ENTER----------------
  var activePin; // ----------- Активный Пин ------------

  // ------------------------ Функция, которая делает пин активным ---------------------------
  function makeActivePin(targetPin) {
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
    targetPin.classList.add('pin--active');
    activePin = targetPin;
  }

  // ----------------------- Функция-оберка возращает функцию обработчик щелчка на пине-------
  function takePinInfoByIndex(ownerInfo) {
    return function (evt) {
      makeActivePin(evt.currentTarget);
      window.showCard(ownerInfo);
    };
  }

  // ------------------------- События на конкретном маркере  --------------------------------
  function addCurrentPinListeners(element, ownerInfo) {
    element.addEventListener('click', takePinInfoByIndex(ownerInfo));
    element.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        (takePinInfoByIndex(ownerInfo))(evt);
      }
    });
  }
  // -------------------------- Описание DOM очередного пина ----------------------------------
  function createPinDomElement(oneOfOwners) {
    var pinElement = document.createElement('div');
    pinElement.className = 'pin';
    pinElement.innerHTML = '<img class="rounded" width="40" height="40">';
    pinElement.style.left = oneOfOwners.location.x - 28 + 'px';
    pinElement.style.top = oneOfOwners.location.y - 75 + 'px';
    pinElement.querySelector('.rounded').src = oneOfOwners.author.avatar;
    pinElement.tabIndex = 0;
    return pinElement;
  }
  // --------------- Экспортируемые функции модуля---------------------------------------------
  window.pin = {
    disactivatePin: function () {
      activePin.classList.remove('pin--active');
    },
    // -------------- Расстановка элементов пинов на карте--------------------------------------
    setPinArrayOnMap: function (ownersInfo) {
      var defaultPin = document.querySelector('.pin__main');
      var fragment = document.createDocumentFragment();
      var currentPin;
      ownersInfo.forEach(function (ownerInfo) {
        currentPin = createPinDomElement(ownerInfo);
        fragment.appendChild(currentPin);
        addCurrentPinListeners(currentPin, ownerInfo);
      });

      document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
    }
  };
})();
