'use strict';

(function () {
  window.synchronizeFields = function (sourceElement, destElement, synchronizeFunction) {
    if (synchronizeFunction && typeof synchronizeFunction === 'function') {
      sourceElement.addEventListener('change', function () {
        synchronizeFunction(sourceElement, destElement);
      });
    }
  };
})();
