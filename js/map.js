'use strict';

(function () {
  /* --------------------------------------------------------------------------------------------------------------------
  *   Вызов функци-сеятеля пинов
  * -------------------------------------------------------------------------------------------------------------------*/
  /* размещение DOM-элементов на странице */
  var fragment = document.createDocumentFragment();
  var ownersAmount = window.pin.ownersInfoArray.length;
  var defaultPin = document.querySelector('.pin__main');
  var DEF_PIN_HEIGHT = defaultPin.clientHeight;
  var halfPin = defaultPin.clientWidth / 2;
  var topBorder = 200 - DEF_PIN_HEIGHT;
  var bottomBorder = 650 - DEF_PIN_HEIGHT;
  var addressInput = document.querySelector('#address');
  for (var i = 0; i < ownersAmount; i++) {
    fragment.appendChild(window.pin.createPinDomElement(window.pin.ownersInfoArray[i], i));
  }

  document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
  window.pin.addAllPinListeners();
  window.card.addDialogListener();
  defaultPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
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

      defaultPin.style.top = (defaultPin.offsetTop - shift.y) + 'px';
      defaultPin.style.left = (defaultPin.offsetLeft - shift.x) + 'px';
    };
    var onMouseUp = function (upEvt) {
      var pinLeftBorder = parseInt(defaultPin.style.left, 10);
      var pinTopBorder = parseInt(defaultPin.style.top, 10);
      upEvt.preventDefault();
      var mapWidth = document.querySelector('.tokyo').clientWidth;
      if (pinLeftBorder < 0) {
        pinLeftBorder = -halfPin;
        defaultPin.style.left = pinLeftBorder + 'px';
      }
      if (pinLeftBorder > mapWidth) {
        pinLeftBorder = mapWidth - halfPin;
        defaultPin.style.left = pinLeftBorder + 'px';
      }
      if (pinTopBorder < topBorder) {
        pinTopBorder = topBorder;
        defaultPin.style.top = topBorder + 'px';
      }
      if (pinTopBorder > bottomBorder) {
        pinTopBorder = bottomBorder;
        defaultPin.style.top = bottomBorder + 'px';
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      addressInput.value = 'x: ' + (pinLeftBorder + halfPin) + ', y: ' + (pinTopBorder + DEF_PIN_HEIGHT);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
