declare module "nvc" {
  declare namespace NAObject {
    interface Observer {
      onNotify(sender: NAObject, event: string, ...vaArgs: any[]);
    }
  }

  class NAObject {
    static EventChange: string;
    [property: string]: any

    constructor(attrs?: {[property: string]: any});

    addObserver(observer: NAObject.Observer);
    notify(event: string, ...vaArgs: any[]);
    triggerChange(...vaArgs: any[]);
  };

  declare namespace NAView {
    interface BindAdapter {
      valueFromNode(node: HTMLElement): any;
      setValueToNode(value: any, node: HTMLElement);
    }
  }

  class NAView extends NAObject {
    element: HTMLElement | any;
    [property: string]: HTMLElement | NAView | any;

    constructor(source: string | HTMLElement);

    destroy();
    bind(viewName: string, params: {to: NAObject, keyPath: string, adapter?: NAView.BindAdapter, oneway?: boolean})
    unbind(viewName: string);
    unbindAll();
  }

  class NAViewController extends NAObject {
    constructor(view: NAView);
    destroy();
  }
}
