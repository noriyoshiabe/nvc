import assert from 'power-assert';
import NAView from '../src/na-view';
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
    assert(view.element instanceof window.DocumentFragment);
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
