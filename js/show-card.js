'use strict';

(function () {
  var dialog = document.querySelector('.dialog');
  window.showCard = function (ownerInfo) {
    window.card.createDescription(ownerInfo);
    dialog.classList.remove('hidden');
  };
})();
