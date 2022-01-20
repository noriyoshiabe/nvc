/**
 * @jest-environment jsdom
 */

import assert from 'assert';
import NAObject from '../src/NAObject';
import NAView from '../src/NAView';

const HTMLForSection = `
<section id="section">
  <h1 na-view-property="head"></h1>
  <p na-view-property="body"></p>
</section>
`;

const HTMLForTemplate = `
<template id="template">
  <section>
    <h1 na-view-property="head"></h1>
    <p na-view-property="body"></p>
  </section>
</template>
`;

const HTMLString = `
<section>
  <h1 na-view-property="head"></h1>
  <p na-view-property="body"></p>
</section>
`;

const HTMLNestView = `
<div id="view">
  <h1 na-view-property="name"></h1>
  <div na-view="childView1">
    <h1 na-view-property="name"></h1>
    <div na-view="childView2">
      <h1 na-view-property="name"></h1>
    </div>
  </div>
</div>
`;

const HTMLBinding = `
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

      <input na-view-property="radioA" type="radio" name="hoge" value="A">
      <input na-view-property="radioB" type="radio" name="hoge" value="B">

      <input na-view-property="check" type="checkbox" value="1">
    </div>
  </body>
</html>
`;


describe("From HTML element", () => {
  beforeEach(() => {
    document.body.innerHTML = HTMLForSection;
  });

  it("attatch property elements", () => {
    let view = new NAView(window.document.querySelector('#section'));
    assert(view.element.tagName == 'SECTION');
    assert(view.head.tagName == 'H1');
    assert(view.body.tagName == 'P');
  })

  it("destory", () => {
    let view = new NAView(window.document.querySelector('#section'));
    assert(window.document.querySelector('#section') instanceof window.HTMLElement);
    view.destroy();
    assert(window.document.querySelector('#section') == null);
  })
});

describe("From Template", () => {
  beforeEach(() => {
    document.body.innerHTML = HTMLForTemplate;
  });

  it("attatch property elements", () => {
    let view = new NAView(window.document.querySelector('#template'));
    assert(view.element instanceof window.HTMLElement);
    assert(view.head.tagName == 'H1');
    assert(view.body.tagName == 'P');
  })
});

describe("From String", () => {
  it("attatch property elements", () => {
    let view = new NAView(HTMLString);
    assert(view.element.tagName == 'SECTION');
    assert(view.head.tagName == 'H1');
    assert(view.body.tagName == 'P');
  })
});

describe("Nesting", () => {
  it("attatch nested view", () => {
    let view = new NAView(HTMLNestView);
    assert(view.element.tagName == 'DIV');
    assert(view.name.tagName == 'H1');
    assert(view.childView1.element.tagName == 'DIV');
    assert(view.childView1.name.tagName == 'H1');
    assert(view.childView1.childView2.element.tagName == 'DIV');
    assert(view.childView1.childView2.name.tagName == 'H1');
  })
});

describe("binder", () => {
  function triggerChange(element) {
    var event = window.document.createEvent("HTMLEvents");
    event.initEvent('change', false, true);
    element.dispatchEvent(event);
  }

  let object

  beforeEach(() => {
    document.body.innerHTML = HTMLBinding;

    object = new NAObject({
      textH1: 'H1',
      textP: 'P',
      inputText: 'INPUT',
      child: {
        select: "opt1",
        textArea: "TEXTAREA",
      },
      check: '1',
      radio: 'A',
    });
  });

  it("bind attribute value", () => {
    let view = new NAView(window.document.querySelector('#view'));
    view.bind('textH1', {to: object, keyPath: 'textH1'});
    view.bind('textP', {to: object, keyPath: 'textP'});
    view.bind('inputText', {to: object, keyPath: 'inputText'});
    view.bind('select', {to: object, keyPath: 'child.select'});
    view.bind('textArea', {to: object, keyPath: 'child.textArea'});
    view.bind('check', {to: object, keyPath: 'check'});
    view.bind('radioA', {to: object, keyPath: 'radio'});
    view.bind('radioB', {to: object, keyPath: 'radio'});

    assert(view.textH1.innerText == 'H1');
    assert(view.textP.innerText == 'P');
    assert(view.inputText.value == 'INPUT');
    assert(view.select.value == 'opt1');
    assert(view.textArea.value == 'TEXTAREA');
    assert(view.check.checked == true);
    assert(view.radioA.checked == true);
    assert(view.radioB.checked == false);

    object.textH1 = 'H1##';
    object.textP = 'P##';
    object.inputText = 'INPUT##';
    object.child.select = 'opt2';
    object.child.textArea = 'TEXTAREA##';
    object.check = null;
    object.radio = 'B';

    object.triggerChange();

    assert(view.textH1.innerText == 'H1##');
    assert(view.textP.innerText == 'P##');
    assert(view.inputText.value == 'INPUT##');
    assert(view.select.value == 'opt2');
    assert(view.textArea.value == 'TEXTAREA##');
    assert(view.check.checked == false);
    assert(view.radioA.checked == false);
    assert(view.radioB.checked == true);
  });

  it("unbind attribute value", () => {
    let view = new NAView(window.document.querySelector('#view'));
    view.bind('textH1', {to: object, keyPath: 'textH1'});

    assert(view.textH1.innerText == 'H1');
    view.unbind('textH1');
    object.textH1 = 'H1##';
    assert(view.textH1.innerText == 'H1');
  });

  it("reflect element change", () => {
    let view = new NAView(window.document.querySelector('#view'));
    view.bind('inputText', {to: object, keyPath: 'inputText'});
    view.bind('select', {to: object, keyPath: 'child.select'});
    view.bind('textArea', {to: object, keyPath: 'child.textArea'});
    view.bind('check', {to: object, keyPath: 'check'});
    view.bind('radioA', {to: object, keyPath: 'radio'});
    view.bind('radioB', {to: object, keyPath: 'radio'});

    view.inputText.value = "HOGE";
    view.select.value = "opt2";
    view.textArea.value = "AAAA";
    view.check.checked = false;
    view.radioB.checked = true;

    triggerChange(view.inputText);
    triggerChange(view.select);
    triggerChange(view.textArea);
    triggerChange(view.check);
    triggerChange(view.radioB);

    assert(object.inputText == 'HOGE');
    assert(object.child.select == 'opt2');
    assert(object.child.textArea == 'AAAA');
    assert(object.check == null);
    assert(object.radio == 'B');
  });

  it("unbind reflect element change", () => {
    let view = new NAView(window.document.querySelector('#view'));
    view.bind('inputText', {to: object, keyPath: 'inputText'});

    view.inputText.value = "HOGE";
    triggerChange(view.inputText);

    assert(object.inputText == 'HOGE');

    view.unbindAll();

    view.inputText.value = "HOGEEE";
    triggerChange(view.inputText);

    assert(object.inputText == 'HOGE');
  });

  it("one way binding", () => {
    let view = new NAView(window.document.querySelector('#view'));
    view.bind('inputText', {to: object, keyPath: 'inputText', oneway: true});

    assert(view.inputText.value == 'INPUT');

    view.inputText.value = "HOGE";
    triggerChange(view.inputText);
    assert(object.inputText == 'INPUT');

    object.inputText = "HOGEEE";
    object.triggerChange();
    assert(view.inputText.value == 'HOGEEE');
  });
});
