'use strict';

(function () {
  var sendURL = 'https://1510.dump.academy/keksobooking';
  var dataURL = 'https://1510.dump.academy/keksobooking/data';
  var setupXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setupXHR(onLoad, onError);
      xhr.open('GET', dataURL);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = setupXHR(onLoad, onError);

      xhr.open('POST', sendURL);
      xhr.send(data);
    }
  };
})();
