require('./index.scss');

import Model from './lib/na-model';
import View from './lib/na-view';

class Hoge extends Model {
}

var hoge = new Hoge({});
hoge.addObserver(this, function (sender, event, prop, newValue, oldValue) {
  console.log(sender);
  console.log(event);
  console.log(prop);
  console.log(newValue);
  console.log(oldValue);
})

console.log(hoge);

hoge.name = "AAAA";
hoge.desc = "AAAA";

import hogeHtml from './views/test.html';

class HogeView extends View {
  template() {
    return hogeHtml;
  }
}

var container = document.querySelector('.container');
var hogeView = new HogeView(container);
hogeView.bind(hoge);


import NAArray from './lib/na-array.js';

console.log('Array-----');
var arr = new NAArray(10,9,8,7,6,5,4,3,2,1);
console.log(arr);

arr.addObserver(this, function (sender, event, prop, newValue, oldValue) {
  console.log(sender);
  console.log(event);
  console.log(prop);
  console.log(newValue);
  console.log(oldValue);
})

arr.push(4);
arr[0] = -1;

console.log('splice -----');
arr.splice(2, 0, 100);
console.log('---------- sort');
console.log(_.concat([], arr, []));

arr.sort(function (a1, a2) {
  return a2 - a1;
});

console.log(arr);
