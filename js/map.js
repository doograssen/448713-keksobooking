'use strict';

(function () {
  /* --------------------------------------------------------------------------------------------------------------------
  *   Размещение пинов на карте
  * -------------------------------------------------------------------------------------------------------------------*/
  /* размещение DOM-элементов на странице */
  var fragment = document.createDocumentFragment();
  var ownersAmount = window.pin.ownersInfoArray.length;
  var defaultPin = document.querySelector('.pin__main');
  var defPinHeight = defaultPin.clientHeight;
  var halfPin = Math.floor(defaultPin.clientWidth / 2);
  var topBorder = 200 - defPinHeight;
  var bottomBorder = 650 - defPinHeight;
  var mapWidth = document.querySelector('.tokyo').clientWidth;
  var addressInput = document.querySelector('#address');
  for (var i = 0; i < ownersAmount; i++) {
    fragment.appendChild(window.pin.createPinDomElement(window.pin.ownersInfoArray[i], i));
  }
  document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
  window.pin.addAllPinListeners();
  window.card.addDialogListener();
  /* --------------------------------------------------------------------------------------------------------------------
 *   Перемещение пина по карте
 * -------------------------------------------------------------------------------------------------------------------*/
  /* Слушатель нажатия кнопки мыши */
  defaultPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    /* функция при перемещение мыши */
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
    /* функция при отпускании кнопки мыши */
    var onMouseUp = function (upEvt) {
      var pinCenterBorder = parseInt(defaultPin.style.left, 10) + halfPin;
      var pinTopBorder = parseInt(defaultPin.style.top, 10);
      upEvt.preventDefault();
      if (pinCenterBorder < 0) {
        pinCenterBorder = 0;
        defaultPin.style.left = -halfPin + 'px';
      } else if (pinCenterBorder > mapWidth) {
        pinCenterBorder = mapWidth;
        defaultPin.style.left = mapWidth - halfPin + 'px';
      }
      if (pinTopBorder < topBorder) {
        pinTopBorder = topBorder;
        defaultPin.style.top = topBorder + 'px';
      } else if (pinTopBorder > bottomBorder) {
        pinTopBorder = bottomBorder;
        defaultPin.style.top = bottomBorder + 'px';
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      addressInput.value = 'x: ' + pinCenterBorder + ', y: ' + (pinTopBorder + defPinHeight);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
