import assert from 'power-assert';
import { NAView, NAObject } from '../nvc';

import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const HTMLForSection = `
<html>
  <head></head>
  <body>
    <section id="section">
      <h1 na-view-property="head"></h1>
      <p na-view-property="body"></p>
    </section>
  </body>
</html>
`;

const HTMLForTemplate = `
<html>
  <head></head>
  <body>
    <template id="template">
      <section>
        <h1 na-view-property="head"></h1>
        <p na-view-property="body"></p>
      </section>
    </template>
  </body>
</html>
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
    </div>
  </body>
</html>
`;


describe("From HTML element", () => {
  beforeEach(() => {
    let dom = new JSDOM(HTMLForSection);
    global.window = dom.window;
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
    let dom = new JSDOM(HTMLForTemplate);
    global.window = dom.window;
  });

  it("attatch property elements", () => {
    let view = new NAView(window.document.querySelector('#template'));
    assert(view.element instanceof window.HTMLElement);
    assert(view.head.tagName == 'H1');
    assert(view.body.tagName == 'P');
  })
});

describe("From String", () => {
  beforeEach(() => {
    let dom = new JSDOM("<!DOCTYPE html>");
    global.window = dom.window;
  });

  it("attatch property elements", () => {
    let view = new NAView(HTMLString);
    assert(view.element.tagName == 'SECTION');
    assert(view.head.tagName == 'H1');
    assert(view.body.tagName == 'P');
  })
});

describe("Nesting", () => {
  beforeEach(() => {
    let dom = new JSDOM("<!DOCTYPE html>");
    global.window = dom.window;
  });

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
    let dom = new JSDOM(HTMLBinding);
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
    view.bind('textH1', {to: object, keyPath: 'textH1'});
    view.bind('textP', {to: object, keyPath: 'textP'});
    view.bind('inputText', {to: object, keyPath: 'inputText'});
    view.bind('select', {to: object, keyPath: 'child.select'});
    view.bind('textArea', {to: object, keyPath: 'child.textArea'});

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

    object.triggerChange();

    assert(view.textH1.innerText == 'H1##');
    assert(view.textP.innerText == 'P##');
    assert(view.inputText.value == 'INPUT##');
    assert(view.select.value == 'opt2');
    assert(view.textArea.value == 'TEXTAREA##');
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

    view.inputText.value = "HOGE";
    triggerChange(view.inputText);

    view.select.value = "opt2";
    triggerChange(view.select);

    view.textArea.value = "AAAA";
    triggerChange(view.textArea);

    assert(object.inputText == 'HOGE');
    assert(object.child.select == 'opt2');
    assert(object.child.textArea == 'AAAA');
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
