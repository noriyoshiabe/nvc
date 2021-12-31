const makeObservable = (target, {parent, property, event} = {}) => {
  if (!target.__observableContext) {
    let __observableContext = {
      proxy: new Proxy(target, {
        set: function(target, property, value, receiver) {
          let oldValue;

          if (property === "length" && target instanceof Array) {
            oldValue = target.__observableContext().length;
            target.__observableContext().length = value;
          } else {
            oldValue = Reflect.get(target, property, receiver);
          }

          let success = Reflect.set(target, property, value, receiver);

          if (success) {
            if (oldValue !== value) {
              target.notify(event, {sender: receiver, keyPath: property, value, oldValue, forwarded: new Set([receiver])});

              if (oldValue?.__observableContext) {
                oldValue.__observableContext().parents = oldValue.__observableContext().parents.filter(p => p.parent !== target || p.property !== property);
              }

              if (value?.__observableContext) {
                value.addObserver(target, target.__observableContext().descendantsHandler)
                value.__observableContext().parents.push({parent: target, property});
              }
            }
          }

          return success;
        },
        deleteProperty: function(target, property) {
          let oldValue = target[property];
          let success = Reflect.deleteProperty(target, property);
          let receiver = target.__observableContext().proxy;

          if (success) {
            target.notify(event, {sender: receiver, keyPath: property, value: undefined, oldValue, forwarded: new Set([receiver])});

            if (oldValue?.__observableContext) {
              oldValue.__observableContext().parents = oldValue.__observableContext().parents.filter(p => p.parent !== target || p.property !== property);
            }
          }

          return success;
        },
      }),
      observers: [],
      length: target.length,
      parents: [],
      descendantsHandler: function (event, params) {
        let receiver = target.__observableContext().proxy;

        if (params.forwarded.has(target)) {
          console.warn(`Recived observable \`${event}\` event that is notified by itself.`);
          console.warn(params.forwarded);
        } else {
          params.forwarded.add(target);
          params.sender.__observableContext().parents.forEach(parent => {
            target.notify(event, Object.assign(params, {sender: receiver, keyPath: parent.property + '.' + params.keyPath}));
          });
        }
      },
    };

    Object.assign(target, {
      __observableContext: function () {
        return __observableContext;
      },

      addObserver: function (receiver, callback) {
        this.__observableContext().observers.push({receiver: receiver, callback: callback})
      },

      removeObserver: function (receiver) {
        for (let i = this.__observableContext().observers.length - 1; 0 <= i; --i) {
          if (this.__observableContext().observers[i].receiver === receiver) {
            this.__observableContext().observers.splice(i, 1);
          }
        }
      },

      notify: function (event, vaArgs) {
        this.__observableContext().observers.slice().forEach(observer => observer.callback.apply(observer.receiver, arguments));
      },
    })
  }

  Object.keys(target).forEach(property => {
    if (typeof target[property] === "object") {
      target[property] = makeObservable(target[property], {parent: target, property, event});
      target[property].addObserver(target, target.__observableContext().descendantsHandler);
    }
  });

  if (parent && property) {
    target.__observableContext().parents.push({parent, property});
  }

  return target.__observableContext().proxy;
}

export {
  makeObservable
};
