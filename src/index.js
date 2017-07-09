require('./index.scss');

var container = document.querySelector('.container');
container.innerHTML = require('./views/test.html');

setTimeout(function () {
  container.querySelector('.js-p').innerText = "Hi";
}, 2000);
