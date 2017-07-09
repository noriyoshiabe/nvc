require('./index.scss');

import Model from './lib/na-model';
import View from './lib/na-view';

class Hoge extends Model {
  properties() {
    return ['name', 'desc'];
  }
}

var hoge = new Hoge({});
hoge.addObserver(this, function (sender, event, prop, newValue, oldValue) {
  console.log(sender);
  console.log(event);
  console.log(prop);
  console.log(newValue);
  console.log(oldValue);
})

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
