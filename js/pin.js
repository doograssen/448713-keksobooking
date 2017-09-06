'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var dialog = document.querySelector('.dialog');
  var ownersInfo = window.data.getApartments();// глобальный массив с объктами
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

  // функция, которая делает пин активным
  function makeActivePin(targetPin) {
    if (window.data.activePin) {
      window.data.activePin.classList.remove('pin--active');
    }
    targetPin.classList.add('pin--active');
    window.data.activePin = targetPin;
  }

  // функция-оберка возращает функцию обработчик щелчка на пине с учетом индекса
  function takePinInfoByIndex(index) {
    return function (evt) {
      makeActivePin(evt.currentTarget);
      window.card.createDescription(ownersInfo[index]);
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

  window.pin = {
  /* размещение DOM-элементов на странице */
    setMarketInfoList: function () {
      var fragment = document.createDocumentFragment();
      var ownersAmount = ownersInfo.length;
      for (var i = 0; i < ownersAmount; i++) {
        fragment.appendChild(createPinDomElement(ownersInfo[i], i));
      }
      var defaultPin = document.querySelector('.pin__main');
      document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
      addAllPinListeners();
      window.card.addDialogListener();
    }
  };
})();
