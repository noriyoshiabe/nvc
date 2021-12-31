import assert from 'power-assert';
import { NAView } from '../nvc';

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

  it("destroy child view from anyware", () => {
    let view = new NAView(HTMLNestView);
    assert(view.childView1.childView2.name.tagName == 'H1');
    assert(view.element.querySelectorAll('div[na-view="childView2"]').length == 1);

    view.childView1.childView2.destroy();
    assert(view.childView1.childView2 === undefined);
    assert(view.element.querySelectorAll('div[na-view="childView2"]').length == 0);
  })
});
