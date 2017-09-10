'use strict';

(function () {
  var dialog = document.querySelector('.dialog');
  window.showCard = function (index) {
    window.card.createDescription(window.pin.ownersInfoArray[index]);
    dialog.classList.remove('hidden');
  };
})();
