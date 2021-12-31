import assert from 'power-assert';
import { NAObject } from '../nvc';
import { NAView } from '../nvc';
import { NABinder } from '../nvc';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const HTML = `
<html>
  <head></head>
  <body>
    <div id="view">
      <h1 na-view-property="textH1"></h1>
      <p na-view-property="textP"></p>

      <input type="text" na-view-property="inputText"></h1>

      <select na-view-property="select">
        <option value="opt1">OPT1</option>
        <option value="opt2">OPT2</option>
      </select>

      <textarea na-view-property="textArea"></textarea>
    </div>
  </body>
</html>
`;

describe("binder", () => {
  function triggerChange(element) {
    var event = window.document.createEvent("HTMLEvents");
    event.initEvent('change', false, true);
    element.dispatchEvent(event);
  }

  let object

  beforeEach(() => {
    let dom = new JSDOM(HTML);
    global.window = dom.window;

    object = new NAObject({
      textH1: 'H1',
      textP: 'P',
      inputText: 'INPUT',
      child: {
        select: "opt1",
        textArea: "TEXTAREA",
      },
    });
  });

  it("bind attribute value", () => {
    let view = new NAView(window.document.querySelector('#view'));
    let binder = new NABinder(object).bind({to: view.textH1, keyPath: 'textH1'})
      .bind({to: view.textP, keyPath: 'textP'})
      .bind({to: view.inputText, keyPath: 'inputText'})
      .bind({to: view.select, keyPath: 'child.select'})
      .bind({to: view.textArea, keyPath: 'child.textArea'})

    assert(view.textH1.innerText == 'H1');
    assert(view.textP.innerText == 'P');
    assert(view.inputText.value == 'INPUT');
    assert(view.select.value == 'opt1');
    assert(view.textArea.value == 'TEXTAREA');

    object.textH1 = 'H1##';
    object.textP = 'P##';
    object.inputText = 'INPUT##';
    object.child.select = 'opt2';
    object.child.textArea = 'TEXTAREA##';

    assert(view.textH1.innerText == 'H1##');
    assert(view.textP.innerText == 'P##');
    assert(view.inputText.value == 'INPUT##');
    assert(view.select.value == 'opt2');
    assert(view.textArea.value == 'TEXTAREA##');
  });

  it("unbind attribute value", () => {
    let view = new NAView(window.document.querySelector('#view'));
    let binder = new NABinder(object).bind({to: view.textH1, keyPath: 'textH1'});

    assert(view.textH1.innerText == 'H1');
    binder.unbind();
    object.textH1 = 'H1##';
    assert(view.textH1.innerText == 'H1');
  });

  it("reflect element change", () => {
    let view = new NAView(window.document.querySelector('#view'));
    let binder = new NABinder(object).bind({to: view.inputText, keyPath: 'inputText'})
      .bind({to: view.select, keyPath: 'child.select'})
      .bind({to: view.textArea, keyPath: 'child.textArea'});

    view.inputText.value = "HOGE";
    view.select.value = "opt2";
    view.textArea.value = "AAAA";

    triggerChange(view.inputText);
    triggerChange(view.select);
    triggerChange(view.textArea);

    assert(object.inputText == 'HOGE');
    assert(object.child.select == 'opt2');
    assert(object.child.textArea == 'AAAA');
  });

  it("unbind reflect element change", () => {
    let view = new NAView(window.document.querySelector('#view'));
    let binder = new NABinder(object).bind({to: view.inputText, keyPath: 'inputText'});

    view.inputText.value = "HOGE";
    triggerChange(view.inputText);

    assert(object.inputText == 'HOGE');

    binder.unbind();

    view.inputText.value = "HOGEEE";
    triggerChange(view.inputText);

    assert(object.inputText == 'HOGE');
  });

  it("one way binding", () => {
    let view = new NAView(window.document.querySelector('#view'));
    let binder = new NABinder(object).bind({to: view.inputText, keyPath: 'inputText', oneway: true});

    assert(view.inputText.value == 'INPUT');

    view.inputText.value = "HOGE";
    triggerChange(view.inputText);
    assert(object.inputText == 'INPUT');

    object.inputText = "HOGEEE";
    assert(view.inputText.value == 'HOGEEE');
  });
});
