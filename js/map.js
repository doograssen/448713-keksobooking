'use strict';

/* --------------------------------------------------------------------------------------------------------------------
*   Вызов функци-сеятеля пинов
* -------------------------------------------------------------------------------------------------------------------*/
/* размещение DOM-элементов на странице */
var fragment = document.createDocumentFragment();
var ownersAmount = window.pin.ownersInfoArray.length;
for (var i = 0; i < ownersAmount; i++) {
  fragment.appendChild(window.pin.createPinDomElement(window.pin.ownersInfoArray[i], i));
}
var defaultPin = document.querySelector('.pin__main');
document.querySelector('.tokyo__pin-map').insertBefore(fragment, defaultPin);
window.pin.addAllPinListeners();
window.card.addDialogListener();


