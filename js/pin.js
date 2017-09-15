'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var activePin;

  // функция, которая делает пин активным
  function makeActivePin(targetPin) {
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
    targetPin.classList.add('pin--active');
    activePin = targetPin;
  }

  // функция-оберка возращает функцию обработчик щелчка на пине с учетом индекса
  function takePinInfoByIndex(ownerInfo) {
    return function (evt) {
      makeActivePin(evt.currentTarget);
      window.showCard(ownerInfo);
    };
  }

  // события на маркере с индексом index
  function addCurrentPinListeners(element, ownerInfo) {
    element.addEventListener('click', takePinInfoByIndex(ownerInfo));
    element.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        (takePinInfoByIndex(ownerInfo))(evt);
      }
    });
  }
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
  window.pin = {
    disactivatePin: function () {
      activePin.classList.remove('pin--active');
    },
    // расстановка элементов пинов на карте
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
    // функция создаия слушателей событий на пинах
    /* addAllPinListeners: function () {
      var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
      var pinAmount = pinElements.length;
      for (var i = 0; i < pinAmount; i++) {

      }
    } */
  };
})();
