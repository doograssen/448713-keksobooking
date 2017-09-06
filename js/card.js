'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var dialog = document.querySelector('.dialog');
  /* тип помещения */
  function getType(type) {
    switch (type) {
      case 'flat': return 'Квартира';
      case 'bungalo': return 'Бунгало';
      case 'house': return 'Дом';
    }
    return false;
  }

  /* элементы-значки удобств */
  function getFeatures(featuresList) {
    var listLength = featuresList.length;
    var featureString = '';
    for (var i = 0; i < listLength; i++) {
      featureString += '<span class="feature__image feature__image--' + featuresList[i] + '"></span>';
    }
    return featureString;
  }

  // нажатие ESC
  var onDialogEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeDialog();
    }
  };

  // закрытие окна диалога  с описание  помещения
  function closeDialog() {
    dialog.classList.add('hidden');
    window.data.activePin.classList.remove('pin--active');
  }


  window.card = {
    /* блок с описанием помещения */
    createDescription: function (description) {
      var replacedElem = document.querySelector('.dialog__panel');
      var template = document.querySelector('#lodge-template');
      var element = template.content.querySelector('.dialog__panel').cloneNode(true);
      element.querySelector('.lodge__title').textContent = description.offer.title;
      element.querySelector('.lodge__address').textContent = description.offer.address;
      element.querySelector('.lodge__price').innerHTML = description.offer.price + '&#x20bd;/ночь';
      element.querySelector('.lodge__type').textContent = getType(description.offer.type);
      element.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + description.offer.guests +
        ' гостей в ' + description.offer.rooms + ' комнатах';
      element.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + description.offer.checkin +
        ', выезд до ' + description.offer.checkout;
      element.querySelector('.lodge__features').innerHTML = getFeatures(description.offer.features);
      element.querySelector('.lodge__description').textContent = description.offer.description;
      replacedElem.parentNode.replaceChild(element, replacedElem); // заменяем описание по умолчанию на описание первого объявления
      document.querySelector('.dialog__title img').src = description.author.avatar;
    },
    // функция добавления  слушателей событий  в диалоге
    addDialogListener: function () {
      var closeDialogElem = document.querySelector('.dialog__close');
      closeDialogElem.addEventListener('click', closeDialog);
      document.addEventListener('keydown', onDialogEscPress);
    }
  };
})();
