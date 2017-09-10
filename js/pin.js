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
  function takePinInfoByIndex(index) {
    return function (evt) {
      makeActivePin(evt.currentTarget);
      window.showCard(index);
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

  window.pin = {
    ownersInfoArray: window.data.getApartments(),
    disactivatePin: function () {
      activePin.classList.remove('pin--active');
    },
    // описание элемента пина на карте
    createPinDomElement: function (oneOfOwners, ind) {
      var pinElement = document.createElement('div');
      pinElement.className = 'pin';
      pinElement.innerHTML = '<img class="rounded" width="40" height="40">';
      pinElement.style.left = oneOfOwners.location.x - 28 + 'px';
      pinElement.style.top = oneOfOwners.location.y - 75 + 'px';
      pinElement.setAttribute('data-index', ind);
      pinElement.querySelector('.rounded').src = oneOfOwners.author.avatar;
      pinElement.tabIndex = ind + 1;
      return pinElement;
    },
    // функция создаия слушателей событий на пинах
    addAllPinListeners: function () {
      var pinElements = document.querySelectorAll('.pin:not(.pin__main)');
      var pinAmount = pinElements.length;
      for (var i = 0; i < pinAmount; i++) {
        addCurrentPinListeners(pinElements[i], i);
      }
    }
  };
})();
