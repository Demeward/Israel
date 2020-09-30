
'use strict';

(function () {

  if ('NodeList' in window && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  var getToAnchor = function (event, anchor) {
    event.preventDefault();

    var blockID = anchor.getAttribute('href').substr(1);

    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  var anchors = document.querySelectorAll('a[href*="#"]');


  for (var i = 0; i < anchors.length; i++) {
    (function () {
      var anchor = anchors[i];
      anchor.addEventListener('click', function () {
        getToAnchor(event, anchor);
      });
    })();
  }

  window.addEventListener('DOMContentLoaded', function () {
    function setCursorPosition(pos, elem) {
      elem.focus();
      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }

    function mask(input) {
      var matrix = '+7 (___) ___-__-__';
      var m = 0;
      var def = matrix.replace(/\D/g, '');
      var val = input.value.replace(/\D/g, '');
      if (def.length >= val.length) {
        val = def;
      }
      input.value = matrix.replace(/./g, function (a) {

        if (/[_\d]/.test(a) && m < val.length) {
          return val.charAt(m++);
        } else if (m >= val.length) {
          return '';
        } else {
          return a;
        }
      });
      if (event.type === 'blur') {
        if (input.value.length === 2) {
          input.value = '';
        }
      } else {
        setCursorPosition(input.value.length, input);
      }
    }

    var inputs = document.querySelectorAll('[type="tel"]');
    for (var j = 0; j < inputs.length; j++) {
      (function () {
        var input = inputs[j];
        input.addEventListener('input', function () {
          mask(input);
        });
        input.addEventListener('focus', function () {
          mask(input);
        });
        input.addEventListener('blur', function () {
          mask(input);
        });
      })();
    }
  });

  var overlay = document.querySelector('.modal-overlay');
  var modal = document.querySelector('.modal');
  var modalSuccess = document.querySelector('.modal-success');
  var closeModal = modal.querySelector('.modal__close');
  var closeModalSuccess = modalSuccess.querySelector('.modal-success__close');
  var okModalSuccess = modalSuccess.querySelector('.modal-success__ok');
  var modalBtn = document.querySelector('.main-nav__call-back');
  var modalForm = modal.querySelector('form');
  var modalInner = modal.querySelector('.modal__form-inner');
  var nameInput = modal.querySelector('[type="text"]');
  var telephoneInput = modal.querySelector('[type="tel"]');
  var callBackForm = document.querySelector('.call-back__form-inner form');
  var callBackInner = document.querySelector('.call-back__form-inner');
  var callBackInput = callBackForm.querySelector('input[type="tel"]');
  var contactForm = document.querySelector('.info__form-inner form');
  var contactInner = document.querySelector('.info__form-inner');
  var contactInput = contactForm.querySelector('input[type="tel"]');

  closeModal.addEventListener('click', function (evt) {
    evt.preventDefault();
    modal.classList.remove('modal--show');
    overlay.classList.remove('modal-overlay--show');
    document.body.style.position = '';
    document.body.style.width = 'initial';
  });

  closeModalSuccess.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalSuccess.classList.remove('modal-success--show');
    overlay.classList.remove('modal-overlay--show');
    document.body.style.position = '';
    document.body.style.width = 'initial';
  });

  okModalSuccess.addEventListener('click', function (evt) {
    evt.preventDefault();
    modalSuccess.classList.remove('modal-success--show');
    overlay.classList.remove('modal-overlay--show');
    document.body.style.position = '';
    document.body.style.width = 'initial';
  });

  overlay.addEventListener('click', function () {
    modal.classList.remove('modal--show');
    modalSuccess.classList.remove('modal-success--show');
    overlay.classList.remove('modal-overlay--show');
    document.body.style.position = '';
    document.body.style.width = 'initial';
  });

  window.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      if (modal.classList.contains('modal--show') || modalSuccess.classList.contains('modal-success--show')) {
        modal.classList.remove('modal--show');
        modalSuccess.classList.remove('modal-success--show');
        overlay.classList.remove('modal-overlay--show');
        document.body.style.position = '';
        document.body.style.width = 'initial';
      }
    }
  });

  var isStorageSupport = true;
  var telephoneStorage = '';
  var nameStorage = '';

  try {
    telephoneStorage = localStorage.getItem('telephone');
  } catch (err) {
    isStorageSupport = false;
  }

  try {
    nameStorage = localStorage.getItem('name');
  } catch (err) {
    isStorageSupport = false;
  }

  modalBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    modal.classList.add('modal--show');
    overlay.classList.add('modal-overlay--show');
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    if (telephoneStorage) {
      telephoneInput.value = telephoneStorage;
    }
    if (nameStorage) {
      nameInput.value = nameStorage;
    }
    nameInput.focus();
  });

  var checkTelephoneValidity = function (telephone) {
    var telephoneNumber = /^\+7\s?\(\d{3}\)\s?\d{3}(-\d{2}){2}$/;

    var check = telephoneNumber.test(telephone.value);

    return check;
  };

  var sendForm = function (form) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://echo.htmlacademy.ru');
    xhr.send(form);
  };

  callBackForm.addEventListener('submit', function (evt) {

    var valid = checkTelephoneValidity(callBackInput);
    if (valid === false) {
      callBackInner.classList.add('call-back__form-inner--invalid');
      evt.preventDefault();
    } else {
      callBackInner.classList.remove('call-back__form-inner--invalid');
      sendForm(new FormData(callBackForm));
      evt.preventDefault();
      modalSuccess.classList.add('modal-success--show');
      overlay.classList.add('modal-overlay--show');
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  });

  callBackInput.addEventListener('focus', function () {
    callBackInner.classList.remove('call-back__form-inner--invalid');
  });

  callBackInput.addEventListener('blur', function () {
    callBackInner.classList.remove('call-back__form-inner--invalid');
  });

  contactForm.addEventListener('submit', function (evt) {

    var valid = checkTelephoneValidity(contactInput);
    if (valid === false) {
      contactInner.classList.add('info__form-inner--invalid');
      evt.preventDefault();
    } else {
      contactInner.classList.remove('info__form-inner--invalid');
      sendForm(new FormData(contactForm));
      evt.preventDefault();
      modalSuccess.classList.add('modal-success--show');
      overlay.classList.add('modal-overlay--show');
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  });

  contactInput.addEventListener('focus', function () {
    contactInner.classList.remove('info__form-inner--invalid');
  });

  contactInput.addEventListener('blur', function () {
    contactInner.classList.remove('info__form-inner--invalid');
  });

  modalForm.addEventListener('submit', function (evt) {

    var valid = checkTelephoneValidity(telephoneInput);
    if (valid === false) {
      modalInner.classList.add('modal__form-inner--invalid');
      evt.preventDefault();
    } else {
      if (isStorageSupport) {
        localStorage.setItem('telephone', telephoneInput.value);
        localStorage.setItem('name', nameInput.value);
      }
      modalInner.classList.remove('modal__form-inner--invalid');
      sendForm(new FormData(modalForm));
      evt.preventDefault();
      modal.classList.remove('modal--show');
      modalSuccess.classList.add('modal-success--show');
      overlay.classList.add('modal-overlay--show');
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }
  });

  telephoneInput.addEventListener('focus', function () {
    modalInner.classList.remove('modal__form-inner--invalid');
  });

  telephoneInput.addEventListener('blur', function () {
    modalInner.classList.remove('modal__form-inner--invalid');
  });

  var toggleTab = document.querySelectorAll('.programs__tab-switch');
  var activeTab = document.querySelectorAll('.programs__tab');
  var showTab = document.querySelectorAll('.programs__item');

  function setCurrentTab(index) {
    for (var k = 0; k < showTab.length; k++) {
      showTab[k].classList.remove('programs__item--active');
    }
    for (var t = 0; t < activeTab.length; t++) {
      activeTab[t].classList.remove('programs__tab--active');
    }
    activeTab[index - 1].classList.add('programs__tab--active');
    showTab[index - 1].classList.add('programs__item--active');
  }
  toggleTab.forEach(function (item, index) {
    item.addEventListener('click', function () {
      setCurrentTab(index + 1);
    });
  });

  var accordeonButtons = document.querySelectorAll('.faq__show');
  var accordeonItems = document.querySelectorAll('.faq__item');


  accordeonButtons.forEach(function (item, index) {
    item.addEventListener('click', function () {
      accordeonItems[index].classList.toggle('faq__item--opened');
    });
  });

  var reviewLeft = document.querySelector('.reviews__prev');
  var reviewRight = document.querySelector('.reviews__next');
  var reviewSlides = document.querySelectorAll('.reviews__item');
  var reviewPage = document.querySelector('.reviews__pagination span');
  var n = 2;

  function prevSlide() {
    reviewSlides[n].classList.remove('reviews__item--active');
    n--;
    var prevPage = n + 1;
    reviewPage.innerHTML = prevPage + ' / 6';
    if (n === 0) {
      reviewLeft.disabled = true;
    }
    reviewSlides[n].classList.add('reviews__item--active');
  }

  function nextSlide() {
    reviewSlides[n].classList.remove('reviews__item--active');
    n++;
    var nextPage = n + 1;
    reviewPage.innerHTML = nextPage + ' / 6';
    if (n === 5) {
      reviewRight.disabled = true;
    }
    reviewSlides[n].classList.add('reviews__item--active');
  }

  reviewLeft.addEventListener('click', function () {
    prevSlide();
    reviewRight.disabled = false;
  });

  reviewRight.addEventListener('click', function () {
    nextSlide();
    reviewLeft.disabled = false;
  });

})();
