'use strict';

(function () {
  /* размещение DOM-элементов на странице */

  var defaultPin = document.querySelector('.pin__main');
  var defPinHeight = defaultPin.clientHeight;
  var halfPin = Math.floor(defaultPin.clientWidth / 2);
  var topBorder = 200 - defPinHeight;
  var bottomBorder = 650 - defPinHeight;
  var mapWidth = document.querySelector('.tokyo').clientWidth - halfPin;
  var addressInput = document.querySelector('#address');
  /* Изменение размера окна */
  function resizeMapWidth() {
    mapWidth = document.querySelector('.tokyo').clientWidth - halfPin;
  }
  window.addEventListener('resize', resizeMapWidth);
  /* --------------------------------------------------------------------------------------------------------------------
 *   Размещение пинов на карте
 * -------------------------------------------------------------------------------------------------------------------*/
 /* -------------------------------------------------------------------------------------------------------------
  ----------------------XHR --------------------------------------------------------------------------------*/
  var ownersInfo;
  var successHandler = function (response) {
    ownersInfo = response;
    window.pin.setPinArrayOnMap(ownersInfo);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  window.backend.load(successHandler, errorHandler);
  window.card.addDialogListener();

  /* --------------------------------------------------------------------------------------------------------------------
 *   Перемещение пина по карте
 * -------------------------------------------------------------------------------------------------------------------*/
  /* Слушатель нажатия кнопки мыши */
  defaultPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var pinLeftBorder = defaultPin.offsetLeft;
    var pinTopBorder = defaultPin.offsetTop;
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
      pinLeftBorder = defaultPin.offsetLeft;
      pinTopBorder = defaultPin.offsetTop;
      defaultPin.style.top = (pinTopBorder - shift.y) + 'px';
      defaultPin.style.left = (pinLeftBorder - shift.x) + 'px';
    };
    /* функция при отпускании кнопки мыши */
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
