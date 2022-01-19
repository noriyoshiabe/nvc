(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.NVC = {}));
})(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

    return _classApplyDescriptorGet(receiver, descriptor);
  }

  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to " + action + " private field on non-instance");
    }

    return privateMap.get(receiver);
  }

  function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
      return descriptor.get.call(receiver);
    }

    return descriptor.value;
  }

  function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }

    return fn;
  }

  function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }

  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);

    privateMap.set(obj, value);
  }

  function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);

    privateSet.add(obj);
  }

  var observers = Symbol('observers');

  var NAObject = /*#__PURE__*/function () {
    function NAObject(attrs) {
      _classCallCheck(this, NAObject);

      _defineProperty(this, observers, []);

      Object.assign(this, attrs);
    }

    _createClass(NAObject, [{
      key: "addObserver",
      value: function addObserver(observer) {
        this[observers].push(observer);
      }
    }, {
      key: "removeObserver",
      value: function removeObserver(observer) {
        for (var i = this[observers].length - 1; 0 <= i; --i) {
          if (this[observers][i] === observer) {
            this[observers].splice(i, 1);
          }
        }
      }
    }, {
      key: "notify",
      value: function notify(event) {
        var _this = this;

        for (var _len = arguments.length, vaArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          vaArgs[_key - 1] = arguments[_key];
        }

        this[observers].slice().forEach(function (observer) {
          return observer.onNotify.apply(observer, [_this, event].concat(vaArgs));
        });
      }
    }, {
      key: "triggerChange",
      value: function triggerChange() {
        for (var _len2 = arguments.length, vaArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          vaArgs[_key2] = arguments[_key2];
        }

        this.notify.apply(this, [NAObject.EventChange].concat(vaArgs));
      }
    }]);

    return NAObject;
  }();

  _defineProperty(NAObject, "EventChange", 'NAObject.EventChange');

  var _bindItems = /*#__PURE__*/new WeakMap();

  var _attachProperty = /*#__PURE__*/new WeakSet();

  var _elementFromSource = /*#__PURE__*/new WeakSet();

  var NAView = /*#__PURE__*/function (_NAObject) {
    _inherits(NAView, _NAObject);

    var _super = _createSuper(NAView);

    function NAView(_source) {
      var _this;

      _classCallCheck(this, NAView);

      _this = _super.call(this);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _elementFromSource);

      _classPrivateMethodInitSpec(_assertThisInitialized(_this), _attachProperty);

      _classPrivateFieldInitSpec(_assertThisInitialized(_this), _bindItems, {
        writable: true,
        value: new Map()
      });

      _this.element = _classPrivateMethodGet(_assertThisInitialized(_this), _elementFromSource, _elementFromSource2).call(_assertThisInitialized(_this), _source);

      _classPrivateMethodGet(_assertThisInitialized(_this), _attachProperty, _attachProperty2).call(_assertThisInitialized(_this), _assertThisInitialized(_this), _this.element);

      return _this;
    }

    _createClass(NAView, [{
      key: "destroy",
      value: function destroy() {
        if (this.element && this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
      }
    }, {
      key: "bind",
      value: function bind(propetyName, _ref) {
        var to = _ref.to,
            keyPath = _ref.keyPath,
            _ref$adapter = _ref.adapter,
            adapter = _ref$adapter === void 0 ? BindAdapter : _ref$adapter,
            _ref$oneway = _ref.oneway,
            oneway = _ref$oneway === void 0 ? false : _ref$oneway;
        this.unbind(propetyName);

        _classPrivateFieldGet(this, _bindItems).set(propetyName, new BindItem({
          node: this[propetyName],
          object: to,
          keyPath: keyPath,
          adapter: adapter,
          oneway: oneway
        }).bind());
      }
    }, {
      key: "unbind",
      value: function unbind(propetyName) {
        var _classPrivateFieldGet2;

        var item = (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _bindItems).get(propetyName)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.unbind();

        if (item) {
          _classPrivateFieldGet(this, _bindItems)["delete"](propetyName);
        }
      }
    }, {
      key: "unbindAll",
      value: function unbindAll() {
        _classPrivateFieldGet(this, _bindItems).forEach(function (bindItem, a, b) {
          return bindItem.unbind();
        });

        _classPrivateFieldGet(this, _bindItems).clear();
      }
    }]);

    return NAView;
  }(NAObject);

  function _attachProperty2(viewToAttach, parentElement) {
    for (var i = 0; i < parentElement.children.length; ++i) {
      var element = parentElement.children[i];

      if (element.hasAttribute("na-view-property")) {
        var propetyName = element.getAttribute('na-view-property');

        if (viewToAttach[propetyName]) {
          throw new Error("property name [".concat(propetyName, "] conflicts."));
        }

        viewToAttach[propetyName] = element;
      }

      if (element.hasAttribute("na-view")) {
        var viewName = element.getAttribute('na-view');

        if (viewToAttach[viewName]) {
          throw new Error("property name [".concat(viewName, "] conflicts."));
        }

        var subview = new NAView(element);
        viewToAttach[viewName] = subview;
        continue;
      }

      _classPrivateMethodGet(this, _attachProperty, _attachProperty2).call(this, viewToAttach, element);
    }
  }

  function _elementFromSource2(source) {
    switch (_typeof(source)) {
      case 'string':
        var element = window.document.createElement('div');
        element.innerHTML = source;

        if (1 == element.children.length) {
          var firstChild = element.children[0];
          element.removeChild(firstChild);
          return firstChild;
        } else {
          return element;
        }

      case 'object':
        if (!(source instanceof window.Node)) {
          throw new Error('Unsupported source type');
        }

        switch (source.tagName) {
          case 'TEMPLATE':
            var documentFragemnt = window.document.importNode(source.content, true);

            if (1 == documentFragemnt.children.length) {
              return documentFragemnt.firstElementChild;
            } else {
              var _element = window.document.createElement('div');

              _element.appendChild(documentFragemnt);

              return _element;
            }

          default:
            return source;
        }

      default:
        throw new Error('Unsupported source type');
    }
  }

  var _subjectWithProperty = /*#__PURE__*/new WeakSet();

  var _changeListener = /*#__PURE__*/new WeakMap();

  var BindItem = /*#__PURE__*/function () {
    function BindItem(_ref2) {
      var _this2 = this;

      var node = _ref2.node,
          object = _ref2.object,
          keyPath = _ref2.keyPath,
          adapter = _ref2.adapter,
          oneway = _ref2.oneway;

      _classCallCheck(this, BindItem);

      _classPrivateMethodInitSpec(this, _subjectWithProperty);

      _classPrivateFieldInitSpec(this, _changeListener, {
        writable: true,
        value: function value(e) {
          var _classPrivateMethodGe = _classPrivateMethodGet(_this2, _subjectWithProperty, _subjectWithProperty2).call(_this2),
              subject = _classPrivateMethodGe.subject,
              property = _classPrivateMethodGe.property;

          subject[property] = _this2.adapter.valueFromNode(e.target);

          _this2.object.triggerChange(_this2, _this2.keyPath);
        }
      });

      this.node = node;
      this.object = object;
      this.keyPath = keyPath;
      this.keys = keyPath.split('.');
      this.adapter = adapter;
      this.oneway = oneway;
    }

    _createClass(BindItem, [{
      key: "bind",
      value: function bind() {
        var _classPrivateMethodGe2 = _classPrivateMethodGet(this, _subjectWithProperty, _subjectWithProperty2).call(this),
            subject = _classPrivateMethodGe2.subject,
            property = _classPrivateMethodGe2.property;

        this.adapter.setValueToNode(subject[property], this.node);
        this.object.addObserver(this);

        if (!this.oneway) {
          this.node.addEventListener('change', _classPrivateFieldGet(this, _changeListener));
        }

        return this;
      }
    }, {
      key: "unbind",
      value: function unbind() {
        this.object.removeObserver(this);

        if (!this.oneway) {
          this.node.removeEventListener('change', _classPrivateFieldGet(this, _changeListener));
        }

        return this;
      }
    }, {
      key: "onNotify",
      value: function onNotify(sender, event, maybeTriggeredBy, maybeKeyPath) {
        if (NAObject.EventChange != event) {
          return;
        }

        if (maybeTriggeredBy instanceof BindItem) {
          if (maybeTriggeredBy === this || maybeKeyPath != this.keyPath) {
            return;
          }
        }

        var _classPrivateMethodGe3 = _classPrivateMethodGet(this, _subjectWithProperty, _subjectWithProperty2).call(this),
            subject = _classPrivateMethodGe3.subject,
            property = _classPrivateMethodGe3.property;

        this.adapter.setValueToNode(subject[property], this.node);
      }
    }]);

    return BindItem;
  }();

  function _subjectWithProperty2() {
    var subject = this.object;

    for (var i = 0; i < this.keys.length; ++i) {
      var property = this.keys[i];

      if (i + 1 == this.keys.length) {
        return {
          subject: subject,
          property: property
        };
      } else {
        subject = subject[property];

        if (!subject) {
          throw new Error("property of \"".concat(property, "\" in \"").concat(this.keyPath, "\" not exists."));
        }
      }
    }
  }

  var BindAdapter = {
    valueFromNode: function valueFromNode(node) {
      switch (node.tagName) {
        case 'INPUT':
          switch (node.type.toUpperCase()) {
            case 'RADIO':
            case 'CHECKBOX':
              return node.checked ? node.value : null;

            default:
              return node.value;
          }

          break;

        default:
          return node.value;
      }
    },
    setValueToNode: function setValueToNode(value, node) {
      switch (node.tagName) {
        case 'INPUT':
          switch (node.type.toUpperCase()) {
            case 'RADIO':
            case 'CHECKBOX':
              node.checked = value == node.value;
              break;

            default:
              node.value = value;
              break;
          }

          break;

        case 'SELECT':
        case 'TEXTAREA':
          node.value = value;
          break;

        default:
          node.innerText = value;
          break;
      }
    }
  };

  var NAViewController = /*#__PURE__*/function (_NAObject) {
    _inherits(NAViewController, _NAObject);

    var _super = _createSuper(NAViewController);

    function NAViewController(view) {
      var _this;

      _classCallCheck(this, NAViewController);

      _this = _super.call(this);
      _this.view = view;
      return _this;
    }

    _createClass(NAViewController, [{
      key: "destroy",
      value: function destroy() {
        var _this$view, _this$view$destroy;

        (_this$view = this.view) === null || _this$view === void 0 ? void 0 : (_this$view$destroy = _this$view.destroy) === null || _this$view$destroy === void 0 ? void 0 : _this$view$destroy.call(_this$view);
      }
    }]);

    return NAViewController;
  }(NAObject);

  exports.NAObject = NAObject;
  exports.NAView = NAView;
  exports.NAViewController = NAViewController;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
