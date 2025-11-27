/**
 * Swiper 11.2.6
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2025 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: March 19, 2025
 */

var Swiper = (function () {
  'use strict';

  /**
   * SSR Window 5.0.0
   * Better handling for window object in SSR environment
   * https://github.com/nolimits4web/ssr-window
   *
   * Copyright 2025, Vladimir Kharlampidi
   *
   * Licensed under MIT
   *
   * Released on: February 12, 2025
   */
  /* eslint-disable no-param-reassign */
  function isObject$1(obj) {
    return obj !== null && typeof obj === 'object' && 'constructor' in obj && obj.constructor === Object;
  }
  function extend$1(target, src) {
    if (target === void 0) {
      target = {};
    }
    if (src === void 0) {
      src = {};
    }
    const noExtend = ['__proto__', 'constructor', 'prototype'];
    Object.keys(src).filter(key => noExtend.indexOf(key) < 0).forEach(key => {
      if (typeof target[key] === 'undefined') target[key] = src[key];else if (isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0) {
        extend$1(target[key], src[key]);
      }
    });
  }
  const ssrDocument = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: {
      blur() {},
      nodeName: ''
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    createEvent() {
      return {
        initEvent() {}
      };
    },
    createElement() {
      return {
        children: [],
        childNodes: [],
        style: {},
        setAttribute() {},
        getElementsByTagName() {
          return [];
        }
      };
    },
    createElementNS() {
      return {};
    },
    importNode() {
      return null;
    },
    location: {
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: '',
      pathname: '',
      protocol: '',
      search: ''
    }
  };
  function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
  }
  const ssrWindow = {
    document: ssrDocument,
    navigator: {
      userAgent: ''
    },
    location: {
      hash: '',
      host: '',
      hostname: '',
      href: '',
      origin: '',
      pathname: '',
      protocol: '',
      search: ''
    },
    history: {
      replaceState() {},
      pushState() {},
      go() {},
      back() {}
    },
    CustomEvent: function CustomEvent() {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle() {
      return {
        getPropertyValue() {
          return '';
        }
      };
    },
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia() {
      return {};
    },
    requestAnimationFrame(callback) {
      if (typeof setTimeout === 'undefined') {
        callback();
        return null;
      }
      return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
      if (typeof setTimeout === 'undefined') {
        return;
      }
      clearTimeout(id);
    }
  };
  function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend$1(win, ssrWindow);
    return win;
  }

  function classesToTokens(classes) {
    if (classes === void 0) {
      classes = '';
    }
    return classes.trim().split(' ').filter(c => !!c.trim());
  }

  function deleteProps(obj) {
    const object = obj;
    Object.keys(object).forEach(key => {
      try {
        object[key] = null;
      } catch (e) {
        // no getter for object
      }
      try {
        delete object[key];
      } catch (e) {
        // something got wrong
      }
    });
  }
  function nextTick(callback, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return setTimeout(callback, delay);
  }
  function now() {
    return Date.now();
  }
  function getComputedStyle$1(el) {
    const window = getWindow();
    let style;
    if (window.getComputedStyle) {
      style = window.getComputedStyle(el, null);
    }
    if (!style && el.currentStyle) {
      style = el.currentStyle;
    }
    if (!style) {
      style = el.style;
    }
    return style;
  }
  function getTranslate(el, axis) {
    if (axis === void 0) {
      axis = 'x';
    }
    const window = getWindow();
    let matrix;
    let curTransform;
    let transformMatrix;
    const curStyle = getComputedStyle$1(el);
    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
      }
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
      transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }
    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
      // Normal Browsers
      else curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
      // Normal Browsers
      else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }
  function isObject(o) {
    return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
  }
  function isNode(node) {
    // eslint-disable-next-line
    if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
      return node instanceof HTMLElement;
    }
    return node && (node.nodeType === 1 || node.nodeType === 11);
  }
  function extend() {
    const to = Object(arguments.length <= 0 ? undefined : arguments[0]);
    const noExtend = ['__proto__', 'constructor', 'prototype'];
    for (let i = 1; i < arguments.length; i += 1) {
      const nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i];
      if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
        const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);
        for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
          const nextKey = keysArray[nextIndex];
          const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
              to[nextKey] = {};
              if (nextSource[nextKey].__swiper__) {
                to[nextKey] = nextSource[nextKey];
              } else {
                extend(to[nextKey], nextSource[nextKey]);
              }
            } else {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
    }
    return to;
  }
  function setCSSProperty(el, varName, varValue) {
    el.style.setProperty(varName, varValue);
  }
  function animateCSSModeScroll(_ref) {
    let {
      swiper,
      targetPosition,
      side
    } = _ref;
    const window = getWindow();
    const startPosition = -swiper.translate;
    let startTime = null;
    let time;
    const duration = swiper.params.speed;
    swiper.wrapperEl.style.scrollSnapType = 'none';
    window.cancelAnimationFrame(swiper.cssModeFrameID);
    const dir = targetPosition > startPosition ? 'next' : 'prev';
    const isOutOfBound = (current, target) => {
      return dir === 'next' && current >= target || dir === 'prev' && current <= target;
    };
    const animate = () => {
      time = new Date().getTime();
      if (startTime === null) {
        startTime = time;
      }
      const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
      const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
      let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
      if (isOutOfBound(currentPosition, targetPosition)) {
        currentPosition = targetPosition;
      }
      swiper.wrapperEl.scrollTo({
        [side]: currentPosition
      });
      if (isOutOfBound(currentPosition, targetPosition)) {
        swiper.wrapperEl.style.overflow = 'hidden';
        swiper.wrapperEl.style.scrollSnapType = '';
        setTimeout(() => {
          swiper.wrapperEl.style.overflow = '';
          swiper.wrapperEl.scrollTo({
            [side]: currentPosition
          });
        });
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        return;
      }
      swiper.cssModeFrameID = window.requestAnimationFrame(animate);
    };
    animate();
  }
  function getSlideTransformEl(slideEl) {
    return slideEl.querySelector('.swiper-slide-transform') || slideEl.shadowRoot && slideEl.shadowRoot.querySelector('.swiper-slide-transform') || slideEl;
  }
  function elementChildren(element, selector) {
    if (selector === void 0) {
      selector = '';
    }
    const window = getWindow();
    const children = [...element.children];
    if (window.HTMLSlotElement && element instanceof HTMLSlotElement) {
      children.push(...element.assignedElements());
    }
    if (!selector) {
      return children;
    }
    return children.filter(el => el.matches(selector));
  }
  function elementIsChildOfSlot(el, slot) {
    // Breadth-first search through all parent's children and assigned elements
    const elementsQueue = [slot];
    while (elementsQueue.length > 0) {
      const elementToCheck = elementsQueue.shift();
      if (el === elementToCheck) {
        return true;
      }
      elementsQueue.push(...elementToCheck.children, ...(elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : []), ...(elementToCheck.assignedElements ? elementToCheck.assignedElements() : []));
    }
  }
  function elementIsChildOf(el, parent) {
    const window = getWindow();
    let isChild = parent.contains(el);
    if (!isChild && window.HTMLSlotElement && parent instanceof HTMLSlotElement) {
      const children = [...parent.assignedElements()];
      isChild = children.includes(el);
      if (!isChild) {
        isChild = elementIsChildOfSlot(el, parent);
      }
    }
    return isChild;
  }
  function showWarning(text) {
    try {
      console.warn(text);
      return;
    } catch (err) {
      // err
    }
  }
  function createElement(tag, classes) {
    if (classes === void 0) {
      classes = [];
    }
    const el = document.createElement(tag);
    el.classList.add(...(Array.isArray(classes) ? classes : classesToTokens(classes)));
    return el;
  }
  function elementOffset(el) {
    const window = getWindow();
    const document = getDocument();
    const box = el.getBoundingClientRect();
    const body = document.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window ? window.scrollY : el.scrollTop;
    const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  function elementPrevAll(el, selector) {
    const prevEls = [];
    while (el.previousElementSibling) {
      const prev = el.previousElementSibling; // eslint-disable-line
      if (selector) {
        if (prev.matches(selector)) prevEls.push(prev);
      } else prevEls.push(prev);
      el = prev;
    }
    return prevEls;
  }
  function elementNextAll(el, selector) {
    const nextEls = [];
    while (el.nextElementSibling) {
      const next = el.nextElementSibling; // eslint-disable-line
      if (selector) {
        if (next.matches(selector)) nextEls.push(next);
      } else nextEls.push(next);
      el = next;
    }
    return nextEls;
  }
  function elementStyle(el, prop) {
    const window = getWindow();
    return window.getComputedStyle(el, null).getPropertyValue(prop);
  }
  function elementIndex(el) {
    let child = el;
    let i;
    if (child) {
      i = 0;
      // eslint-disable-next-line
      while ((child = child.previousSibling) !== null) {
        if (child.nodeType === 1) i += 1;
      }
      return i;
    }
    return undefined;
  }
  function elementParents(el, selector) {
    const parents = []; // eslint-disable-line
    let parent = el.parentElement; // eslint-disable-line
    while (parent) {
      if (selector) {
        if (parent.matches(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    return parents;
  }
  function elementTransitionEnd(el, callback) {
    function fireCallBack(e) {
      if (e.target !== el) return;
      callback.call(el, e);
      el.removeEventListener('transitionend', fireCallBack);
    }
    if (callback) {
      el.addEventListener('transitionend', fireCallBack);
    }
  }
  function elementOuterSize(el, size, includeMargins) {
    const window = getWindow();
    if (includeMargins) {
      return el[size === 'width' ? 'offsetWidth' : 'offsetHeight'] + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-right' : 'margin-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue(size === 'width' ? 'margin-left' : 'margin-bottom'));
    }
    return el.offsetWidth;
  }
  function makeElementsArray(el) {
    return (Array.isArray(el) ? el : [el]).filter(e => !!e);
  }
  function getRotateFix(swiper) {
    return v => {
      if (Math.abs(v) > 0 && swiper.browser && swiper.browser.need3dFix && Math.abs(v) % 90 === 0) {
        return v + 0.001;
      }
      return v;
    };
  }

  let support;
  function calcSupport() {
    const window = getWindow();
    const document = getDocument();
    return {
      smoothScroll: document.documentElement && document.documentElement.style && 'scrollBehavior' in document.documentElement.style,
      touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch)
    };
  }
  function getSupport() {
    if (!support) {
      support = calcSupport();
    }
    return support;
  }

  let deviceCached;
  function calcDevice(_temp) {
    let {
      userAgent
    } = _temp === void 0 ? {} : _temp;
    const support = getSupport();
    const window = getWindow();
    const platform = window.navigator.platform;
    const ua = userAgent || window.navigator.userAgent;
    const device = {
      ios: false,
      android: false
    };
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line
    let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
    const windows = platform === 'Win32';
    let macos = platform === 'MacIntel';

    // iPadOs 13 fix
    const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];
    if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
      ipad = ua.match(/(Version)\/([\d.]+)/);
      if (!ipad) ipad = [0, 1, '13_0_0'];
      macos = false;
    }

    // Android
    if (android && !windows) {
      device.os = 'android';
      device.android = true;
    }
    if (ipad || iphone || ipod) {
      device.os = 'ios';
      device.ios = true;
    }

    // Export object
    return device;
  }
  function getDevice(overrides) {
    if (overrides === void 0) {
      overrides = {};
    }
    if (!deviceCached) {
      deviceCached = calcDevice(overrides);
    }
    return deviceCached;
  }

  let browser;
  function calcBrowser() {
    const window = getWindow();
    const device = getDevice();
    let needPerspectiveFix = false;
    function isSafari() {
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
    }
    if (isSafari()) {
      const ua = String(window.navigator.userAgent);
      if (ua.includes('Version/')) {
        const [major, minor] = ua.split('Version/')[1].split(' ')[0].split('.').map(num => Number(num));
        needPerspectiveFix = major < 16 || major === 16 && minor < 2;
      }
    }
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent);
    const isSafariBrowser = isSafari();
    const need3dFix = isSafariBrowser || isWebView && device.ios;
    return {
      isSafari: needPerspectiveFix || isSafariBrowser,
      needPerspectiveFix,
      need3dFix,
      isWebView
    };
  }
  function getBrowser() {
    if (!browser) {
      browser = calcBrowser();
    }
    return browser;
  }

  function Resize(_ref) {
    let {
      swiper,
      on,
      emit
    } = _ref;
    const window = getWindow();
    let observer = null;
    let animationFrame = null;
    const resizeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit('beforeResize');
      emit('resize');
    };
    const createObserver = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      observer = new ResizeObserver(entries => {
        animationFrame = window.requestAnimationFrame(() => {
          const {
            width,
            height
          } = swiper;
          let newWidth = width;
          let newHeight = height;
          entries.forEach(_ref2 => {
            let {
              contentBoxSize,
              contentRect,
              target
            } = _ref2;
            if (target && target !== swiper.el) return;
            newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
            newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
          });
          if (newWidth !== width || newHeight !== height) {
            resizeHandler();
          }
        });
      });
      observer.observe(swiper.el);
    };
    const removeObserver = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      if (observer && observer.unobserve && swiper.el) {
        observer.unobserve(swiper.el);
        observer = null;
      }
    };
    const orientationChangeHandler = () => {
      if (!swiper || swiper.destroyed || !swiper.initialized) return;
      emit('orientationchange');
    };
    on('init', () => {
      if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
        createObserver();
        return;
      }
      window.addEventListener('resize', resizeHandler);
      window.addEventListener('orientationchange', orientationChangeHandler);
    });
    on('destroy', () => {
      removeObserver();
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('orientationchange', orientationChangeHandler);
    });
  }

  function Observer(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const observers = [];
    const window = getWindow();
    const attach = function (target, options) {
      if (options === void 0) {
        options = {};
      }
      const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
      const observer = new ObserverFunc(mutations => {
        // The observerUpdate event should only be triggered
        // once despite the number of mutations.  Additional
        // triggers are redundant and are very costly
        if (swiper.__preventObserver__) return;
        if (mutations.length === 1) {
          emit('observerUpdate', mutations[0]);
          return;
        }
        const observerUpdate = function observerUpdate() {
          emit('observerUpdate', mutations[0]);
        };
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(observerUpdate);
        } else {
          window.setTimeout(observerUpdate, 0);
        }
      });
      observer.observe(target, {
        attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
        childList: swiper.isElement || (typeof options.childList === 'undefined' ? true : options).childList,
        characterData: typeof options.characterData === 'undefined' ? true : options.characterData
      });
      observers.push(observer);
    };
    const init = () => {
      if (!swiper.params.observer) return;
      if (swiper.params.observeParents) {
        const containerParents = elementParents(swiper.hostEl);
        for (let i = 0; i < containerParents.length; i += 1) {
          attach(containerParents[i]);
        }
      }
      // Observe container
      attach(swiper.hostEl, {
        childList: swiper.params.observeSlideChildren
      });

      // Observe wrapper
      attach(swiper.wrapperEl, {
        attributes: false
      });
    };
    const destroy = () => {
      observers.forEach(observer => {
        observer.disconnect();
      });
      observers.splice(0, observers.length);
    };
    extendParams({
      observer: false,
      observeParents: false,
      observeSlideChildren: false
    });
    on('init', init);
    on('destroy', destroy);
  }

  /* eslint-disable no-underscore-dangle */

  var eventsEmitter = {
    on(events, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';
      events.split(' ').forEach(event => {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event][method](handler);
      });
      return self;
    },
    once(events, handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== 'function') return self;
      function onceHandler() {
        self.off(events, onceHandler);
        if (onceHandler.__emitterProxy) {
          delete onceHandler.__emitterProxy;
        }
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        handler.apply(self, args);
      }
      onceHandler.__emitterProxy = handler;
      return self.on(events, onceHandler, priority);
    },
    onAny(handler, priority) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (typeof handler !== 'function') return self;
      const method = priority ? 'unshift' : 'push';
      if (self.eventsAnyListeners.indexOf(handler) < 0) {
        self.eventsAnyListeners[method](handler);
      }
      return self;
    },
    offAny(handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsAnyListeners) return self;
      const index = self.eventsAnyListeners.indexOf(handler);
      if (index >= 0) {
        self.eventsAnyListeners.splice(index, 1);
      }
      return self;
    },
    off(events, handler) {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsListeners) return self;
      events.split(' ').forEach(event => {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event]) {
          self.eventsListeners[event].forEach((eventHandler, index) => {
            if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
      return self;
    },
    emit() {
      const self = this;
      if (!self.eventsListeners || self.destroyed) return self;
      if (!self.eventsListeners) return self;
      let events;
      let data;
      let context;
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }
      data.unshift(context);
      const eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach(event => {
        if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
          self.eventsAnyListeners.forEach(eventHandler => {
            eventHandler.apply(context, [event, ...data]);
          });
        }
        if (self.eventsListeners && self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(eventHandler => {
            eventHandler.apply(context, data);
          });
        }
      });
      return self;
    }
  };

  function updateSize() {
    const swiper = this;
    let width;
    let height;
    const el = swiper.el;
    if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
      width = swiper.params.width;
    } else {
      width = el.clientWidth;
    }
    if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
      height = swiper.params.height;
    } else {
      height = el.clientHeight;
    }
    if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
      return;
    }

    // Subtract paddings
    width = width - parseInt(elementStyle(el, 'padding-left') || 0, 10) - parseInt(elementStyle(el, 'padding-right') || 0, 10);
    height = height - parseInt(elementStyle(el, 'padding-top') || 0, 10) - parseInt(elementStyle(el, 'padding-bottom') || 0, 10);
    if (Number.isNaN(width)) width = 0;
    if (Number.isNaN(height)) height = 0;
    Object.assign(swiper, {
      width,
      height,
      size: swiper.isHorizontal() ? width : height
    });
  }

  function updateSlides() {
    const swiper = this;
    function getDirectionPropertyValue(node, label) {
      return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
    }
    const params = swiper.params;
    const {
      wrapperEl,
      slidesEl,
      size: swiperSize,
      rtlTranslate: rtl,
      wrongRTL
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
    const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
    const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
    let snapGrid = [];
    const slidesGrid = [];
    const slidesSizesGrid = [];
    let offsetBefore = params.slidesOffsetBefore;
    if (typeof offsetBefore === 'function') {
      offsetBefore = params.slidesOffsetBefore.call(swiper);
    }
    let offsetAfter = params.slidesOffsetAfter;
    if (typeof offsetAfter === 'function') {
      offsetAfter = params.slidesOffsetAfter.call(swiper);
    }
    const previousSnapGridLength = swiper.snapGrid.length;
    const previousSlidesGridLength = swiper.slidesGrid.length;
    let spaceBetween = params.spaceBetween;
    let slidePosition = -offsetBefore;
    let prevSlideSize = 0;
    let index = 0;
    if (typeof swiperSize === 'undefined') {
      return;
    }
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
    } else if (typeof spaceBetween === 'string') {
      spaceBetween = parseFloat(spaceBetween);
    }
    swiper.virtualSize = -spaceBetween;

    // reset margins
    slides.forEach(slideEl => {
      if (rtl) {
        slideEl.style.marginLeft = '';
      } else {
        slideEl.style.marginRight = '';
      }
      slideEl.style.marginBottom = '';
      slideEl.style.marginTop = '';
    });

    // reset cssMode offsets
    if (params.centeredSlides && params.cssMode) {
      setCSSProperty(wrapperEl, '--swiper-centered-offset-before', '');
      setCSSProperty(wrapperEl, '--swiper-centered-offset-after', '');
    }
    const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
    if (gridEnabled) {
      swiper.grid.initSlides(slides);
    } else if (swiper.grid) {
      swiper.grid.unsetSlides();
    }

    // Calc slides
    let slideSize;
    const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
      return typeof params.breakpoints[key].slidesPerView !== 'undefined';
    }).length > 0;
    for (let i = 0; i < slidesLength; i += 1) {
      slideSize = 0;
      let slide;
      if (slides[i]) slide = slides[i];
      if (gridEnabled) {
        swiper.grid.updateSlide(i, slide, slides);
      }
      if (slides[i] && elementStyle(slide, 'display') === 'none') continue; // eslint-disable-line

      if (params.slidesPerView === 'auto') {
        if (shouldResetSlideSize) {
          slides[i].style[swiper.getDirectionLabel('width')] = ``;
        }
        const slideStyles = getComputedStyle(slide);
        const currentTransform = slide.style.transform;
        const currentWebKitTransform = slide.style.webkitTransform;
        if (currentTransform) {
          slide.style.transform = 'none';
        }
        if (currentWebKitTransform) {
          slide.style.webkitTransform = 'none';
        }
        if (params.roundLengths) {
          slideSize = swiper.isHorizontal() ? elementOuterSize(slide, 'width', true) : elementOuterSize(slide, 'height', true);
        } else {
          // eslint-disable-next-line
          const width = getDirectionPropertyValue(slideStyles, 'width');
          const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
          const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
          const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
          const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
          const boxSizing = slideStyles.getPropertyValue('box-sizing');
          if (boxSizing && boxSizing === 'border-box') {
            slideSize = width + marginLeft + marginRight;
          } else {
            const {
              clientWidth,
              offsetWidth
            } = slide;
            slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
          }
        }
        if (currentTransform) {
          slide.style.transform = currentTransform;
        }
        if (currentWebKitTransform) {
          slide.style.webkitTransform = currentWebKitTransform;
        }
        if (params.roundLengths) slideSize = Math.floor(slideSize);
      } else {
        slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
        if (params.roundLengths) slideSize = Math.floor(slideSize);
        if (slides[i]) {
          slides[i].style[swiper.getDirectionLabel('width')] = `${slideSize}px`;
        }
      }
      if (slides[i]) {
        slides[i].swiperSlideSize = slideSize;
      }
      slidesSizesGrid.push(slideSize);
      if (params.centeredSlides) {
        slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
        if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
        if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
      } else {
        if (params.roundLengths) slidePosition = Math.floor(slidePosition);
        if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
        slidesGrid.push(slidePosition);
        slidePosition = slidePosition + slideSize + spaceBetween;
      }
      swiper.virtualSize += slideSize + spaceBetween;
      prevSlideSize = slideSize;
      index += 1;
    }
    swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
    if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
      wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (params.setWrapperSize) {
      wrapperEl.style[swiper.getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
    }
    if (gridEnabled) {
      swiper.grid.updateWrapperSize(slideSize, snapGrid);
    }

    // Remove last grid elements depending on width
    if (!params.centeredSlides) {
      const newSlidesGrid = [];
      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
          newSlidesGrid.push(slidesGridItem);
        }
      }
      snapGrid = newSlidesGrid;
      if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
        snapGrid.push(swiper.virtualSize - swiperSize);
      }
    }
    if (isVirtual && params.loop) {
      const size = slidesSizesGrid[0] + spaceBetween;
      if (params.slidesPerGroup > 1) {
        const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
        const groupSize = size * params.slidesPerGroup;
        for (let i = 0; i < groups; i += 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
        }
      }
      for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) {
        if (params.slidesPerGroup === 1) {
          snapGrid.push(snapGrid[snapGrid.length - 1] + size);
        }
        slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
        swiper.virtualSize += size;
      }
    }
    if (snapGrid.length === 0) snapGrid = [0];
    if (spaceBetween !== 0) {
      const key = swiper.isHorizontal() && rtl ? 'marginLeft' : swiper.getDirectionLabel('marginRight');
      slides.filter((_, slideIndex) => {
        if (!params.cssMode || params.loop) return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      }).forEach(slideEl => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
    }
    if (params.centeredSlides && params.centeredSlidesBounds) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach(slideSizeValue => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
      snapGrid = snapGrid.map(snap => {
        if (snap <= 0) return -offsetBefore;
        if (snap > maxSnap) return maxSnap + offsetAfter;
        return snap;
      });
    }
    if (params.centerInsufficientSlides) {
      let allSlidesSize = 0;
      slidesSizesGrid.forEach(slideSizeValue => {
        allSlidesSize += slideSizeValue + (spaceBetween || 0);
      });
      allSlidesSize -= spaceBetween;
      const offsetSize = (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
      if (allSlidesSize + offsetSize < swiperSize) {
        const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
        snapGrid.forEach((snap, snapIndex) => {
          snapGrid[snapIndex] = snap - allSlidesOffset;
        });
        slidesGrid.forEach((snap, snapIndex) => {
          slidesGrid[snapIndex] = snap + allSlidesOffset;
        });
      }
    }
    Object.assign(swiper, {
      slides,
      snapGrid,
      slidesGrid,
      slidesSizesGrid
    });
    if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
      setCSSProperty(wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
      setCSSProperty(wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
      const addToSnapGrid = -swiper.snapGrid[0];
      const addToSlidesGrid = -swiper.slidesGrid[0];
      swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
      swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
    }
    if (slidesLength !== previousSlidesLength) {
      swiper.emit('slidesLengthChange');
    }
    if (snapGrid.length !== previousSnapGridLength) {
      if (swiper.params.watchOverflow) swiper.checkOverflow();
      swiper.emit('snapGridLengthChange');
    }
    if (slidesGrid.length !== previousSlidesGridLength) {
      swiper.emit('slidesGridLengthChange');
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    swiper.emit('slidesUpdated');
    if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
      const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
      const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
      if (slidesLength <= params.maxBackfaceHiddenSlides) {
        if (!hasClassBackfaceClassAdded) swiper.el.classList.add(backFaceHiddenClass);
      } else if (hasClassBackfaceClassAdded) {
        swiper.el.classList.remove(backFaceHiddenClass);
      }
    }
  }

  function updateAutoHeight(speed) {
    const swiper = this;
    const activeSlides = [];
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let newHeight = 0;
    let i;
    if (typeof speed === 'number') {
      swiper.setTransition(speed);
    } else if (speed === true) {
      swiper.setTransition(swiper.params.speed);
    }
    const getSlideByIndex = index => {
      if (isVirtual) {
        return swiper.slides[swiper.getSlideIndexByData(index)];
      }
      return swiper.slides[index];
    };
    // Find slides currently in view
    if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
      if (swiper.params.centeredSlides) {
        (swiper.visibleSlides || []).forEach(slide => {
          activeSlides.push(slide);
        });
      } else {
        for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
          const index = swiper.activeIndex + i;
          if (index > swiper.slides.length && !isVirtual) break;
          activeSlides.push(getSlideByIndex(index));
        }
      }
    } else {
      activeSlides.push(getSlideByIndex(swiper.activeIndex));
    }

    // Find new height from highest slide in view
    for (i = 0; i < activeSlides.length; i += 1) {
      if (typeof activeSlides[i] !== 'undefined') {
        const height = activeSlides[i].offsetHeight;
        newHeight = height > newHeight ? height : newHeight;
      }
    }

    // Update Height
    if (newHeight || newHeight === 0) swiper.wrapperEl.style.height = `${newHeight}px`;
  }

  function updateSlidesOffset() {
    const swiper = this;
    const slides = swiper.slides;
    // eslint-disable-next-line
    const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
    for (let i = 0; i < slides.length; i += 1) {
      slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
    }
  }

  const toggleSlideClasses$1 = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesProgress(translate) {
    if (translate === void 0) {
      translate = this && this.translate || 0;
    }
    const swiper = this;
    const params = swiper.params;
    const {
      slides,
      rtlTranslate: rtl,
      snapGrid
    } = swiper;
    if (slides.length === 0) return;
    if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
    let offsetCenter = -translate;
    if (rtl) offsetCenter = translate;
    swiper.visibleSlidesIndexes = [];
    swiper.visibleSlides = [];
    let spaceBetween = params.spaceBetween;
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
      spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
    } else if (typeof spaceBetween === 'string') {
      spaceBetween = parseFloat(spaceBetween);
    }
    for (let i = 0; i < slides.length; i += 1) {
      const slide = slides[i];
      let slideOffset = slide.swiperSlideOffset;
      if (params.cssMode && params.centeredSlides) {
        slideOffset -= slides[0].swiperSlideOffset;
      }
      const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
      const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween);
      const slideBefore = -(offsetCenter - slideOffset);
      const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
      const isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
      const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
      if (isVisible) {
        swiper.visibleSlides.push(slide);
        swiper.visibleSlidesIndexes.push(i);
      }
      toggleSlideClasses$1(slide, isVisible, params.slideVisibleClass);
      toggleSlideClasses$1(slide, isFullyVisible, params.slideFullyVisibleClass);
      slide.progress = rtl ? -slideProgress : slideProgress;
      slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
    }
  }

  function updateProgress(translate) {
    const swiper = this;
    if (typeof translate === 'undefined') {
      const multiplier = swiper.rtlTranslate ? -1 : 1;
      // eslint-disable-next-line
      translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
    }
    const params = swiper.params;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    let {
      progress,
      isBeginning,
      isEnd,
      progressLoop
    } = swiper;
    const wasBeginning = isBeginning;
    const wasEnd = isEnd;
    if (translatesDiff === 0) {
      progress = 0;
      isBeginning = true;
      isEnd = true;
    } else {
      progress = (translate - swiper.minTranslate()) / translatesDiff;
      const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1;
      const isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
      isBeginning = isBeginningRounded || progress <= 0;
      isEnd = isEndRounded || progress >= 1;
      if (isBeginningRounded) progress = 0;
      if (isEndRounded) progress = 1;
    }
    if (params.loop) {
      const firstSlideIndex = swiper.getSlideIndexByData(0);
      const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
      const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
      const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
      const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
      const translateAbs = Math.abs(translate);
      if (translateAbs >= firstSlideTranslate) {
        progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
      } else {
        progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
      }
      if (progressLoop > 1) progressLoop -= 1;
    }
    Object.assign(swiper, {
      progress,
      progressLoop,
      isBeginning,
      isEnd
    });
    if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
    if (isBeginning && !wasBeginning) {
      swiper.emit('reachBeginning toEdge');
    }
    if (isEnd && !wasEnd) {
      swiper.emit('reachEnd toEdge');
    }
    if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
      swiper.emit('fromEdge');
    }
    swiper.emit('progress', progress);
  }

  const toggleSlideClasses = (slideEl, condition, className) => {
    if (condition && !slideEl.classList.contains(className)) {
      slideEl.classList.add(className);
    } else if (!condition && slideEl.classList.contains(className)) {
      slideEl.classList.remove(className);
    }
  };
  function updateSlidesClasses() {
    const swiper = this;
    const {
      slides,
      params,
      slidesEl,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const getFilteredSlide = selector => {
      return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
    };
    let activeSlide;
    let prevSlide;
    let nextSlide;
    if (isVirtual) {
      if (params.loop) {
        let slideIndex = activeIndex - swiper.virtual.slidesBefore;
        if (slideIndex < 0) slideIndex = swiper.virtual.slides.length + slideIndex;
        if (slideIndex >= swiper.virtual.slides.length) slideIndex -= swiper.virtual.slides.length;
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
      } else {
        activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
      }
    } else {
      if (gridEnabled) {
        activeSlide = slides.find(slideEl => slideEl.column === activeIndex);
        nextSlide = slides.find(slideEl => slideEl.column === activeIndex + 1);
        prevSlide = slides.find(slideEl => slideEl.column === activeIndex - 1);
      } else {
        activeSlide = slides[activeIndex];
      }
    }
    if (activeSlide) {
      if (!gridEnabled) {
        // Next Slide
        nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !nextSlide) {
          nextSlide = slides[0];
        }

        // Prev Slide
        prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
        if (params.loop && !prevSlide === 0) {
          prevSlide = slides[slides.length - 1];
        }
      }
    }
    slides.forEach(slideEl => {
      toggleSlideClasses(slideEl, slideEl === activeSlide, params.slideActiveClass);
      toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
      toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
    });
    swiper.emitSlidesClasses();
  }

  const processLazyPreloader = (swiper, imageEl) => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    const slideEl = imageEl.closest(slideSelector());
    if (slideEl) {
      let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
      if (!lazyEl && swiper.isElement) {
        if (slideEl.shadowRoot) {
          lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
        } else {
          // init later
          requestAnimationFrame(() => {
            if (slideEl.shadowRoot) {
              lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`);
              if (lazyEl) lazyEl.remove();
            }
          });
        }
      }
      if (lazyEl) lazyEl.remove();
    }
  };
  const unlazy = (swiper, index) => {
    if (!swiper.slides[index]) return;
    const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
    if (imageEl) imageEl.removeAttribute('loading');
  };
  const preload = swiper => {
    if (!swiper || swiper.destroyed || !swiper.params) return;
    let amount = swiper.params.lazyPreloadPrevNext;
    const len = swiper.slides.length;
    if (!len || !amount || amount < 0) return;
    amount = Math.min(amount, len);
    const slidesPerView = swiper.params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
    const activeIndex = swiper.activeIndex;
    if (swiper.params.grid && swiper.params.grid.rows > 1) {
      const activeColumn = activeIndex;
      const preloadColumns = [activeColumn - amount];
      preloadColumns.push(...Array.from({
        length: amount
      }).map((_, i) => {
        return activeColumn + slidesPerView + i;
      }));
      swiper.slides.forEach((slideEl, i) => {
        if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
      });
      return;
    }
    const slideIndexLastInView = activeIndex + slidesPerView - 1;
    if (swiper.params.rewind || swiper.params.loop) {
      for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
        const realIndex = (i % len + len) % len;
        if (realIndex < activeIndex || realIndex > slideIndexLastInView) unlazy(swiper, realIndex);
      }
    } else {
      for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) {
        if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
          unlazy(swiper, i);
        }
      }
    }
  };

  function getActiveIndexByTranslate(swiper) {
    const {
      slidesGrid,
      params
    } = swiper;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    let activeIndex;
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    // Normalize slideIndex
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
    return activeIndex;
  }
  function updateActiveIndex(newActiveIndex) {
    const swiper = this;
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    const {
      snapGrid,
      params,
      activeIndex: previousIndex,
      realIndex: previousRealIndex,
      snapIndex: previousSnapIndex
    } = swiper;
    let activeIndex = newActiveIndex;
    let snapIndex;
    const getVirtualRealIndex = aIndex => {
      let realIndex = aIndex - swiper.virtual.slidesBefore;
      if (realIndex < 0) {
        realIndex = swiper.virtual.slides.length + realIndex;
      }
      if (realIndex >= swiper.virtual.slides.length) {
        realIndex -= swiper.virtual.slides.length;
      }
      return realIndex;
    };
    if (typeof activeIndex === 'undefined') {
      activeIndex = getActiveIndexByTranslate(swiper);
    }
    if (snapGrid.indexOf(translate) >= 0) {
      snapIndex = snapGrid.indexOf(translate);
    } else {
      const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
      snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
    }
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    if (activeIndex === previousIndex && !swiper.params.loop) {
      if (snapIndex !== previousSnapIndex) {
        swiper.snapIndex = snapIndex;
        swiper.emit('snapIndexChange');
      }
      return;
    }
    if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
      return;
    }
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;

    // Get real index
    let realIndex;
    if (swiper.virtual && params.virtual.enabled && params.loop) {
      realIndex = getVirtualRealIndex(activeIndex);
    } else if (gridEnabled) {
      const firstSlideInColumn = swiper.slides.find(slideEl => slideEl.column === activeIndex);
      let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute('data-swiper-slide-index'), 10);
      if (Number.isNaN(activeSlideIndex)) {
        activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
      }
      realIndex = Math.floor(activeSlideIndex / params.grid.rows);
    } else if (swiper.slides[activeIndex]) {
      const slideIndex = swiper.slides[activeIndex].getAttribute('data-swiper-slide-index');
      if (slideIndex) {
        realIndex = parseInt(slideIndex, 10);
      } else {
        realIndex = activeIndex;
      }
    } else {
      realIndex = activeIndex;
    }
    Object.assign(swiper, {
      previousSnapIndex,
      snapIndex,
      previousRealIndex,
      realIndex,
      previousIndex,
      activeIndex
    });
    if (swiper.initialized) {
      preload(swiper);
    }
    swiper.emit('activeIndexChange');
    swiper.emit('snapIndexChange');
    if (swiper.initialized || swiper.params.runCallbacksOnInit) {
      if (previousRealIndex !== realIndex) {
        swiper.emit('realIndexChange');
      }
      swiper.emit('slideChange');
    }
  }

  function updateClickedSlide(el, path) {
    const swiper = this;
    const params = swiper.params;
    let slide = el.closest(`.${params.slideClass}, swiper-slide`);
    if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) {
      [...path.slice(path.indexOf(el) + 1, path.length)].forEach(pathEl => {
        if (!slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`)) {
          slide = pathEl;
        }
      });
    }
    let slideFound = false;
    let slideIndex;
    if (slide) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        if (swiper.slides[i] === slide) {
          slideFound = true;
          slideIndex = i;
          break;
        }
      }
    }
    if (slide && slideFound) {
      swiper.clickedSlide = slide;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        swiper.clickedIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
      } else {
        swiper.clickedIndex = slideIndex;
      }
    } else {
      swiper.clickedSlide = undefined;
      swiper.clickedIndex = undefined;
      return;
    }
    if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
      swiper.slideToClickedSlide();
    }
  }

  var update = {
    updateSize,
    updateSlides,
    updateAutoHeight,
    updateSlidesOffset,
    updateSlidesProgress,
    updateProgress,
    updateSlidesClasses,
    updateActiveIndex,
    updateClickedSlide
  };

  function getSwiperTranslate(axis) {
    if (axis === void 0) {
      axis = this.isHorizontal() ? 'x' : 'y';
    }
    const swiper = this;
    const {
      params,
      rtlTranslate: rtl,
      translate,
      wrapperEl
    } = swiper;
    if (params.virtualTranslate) {
      return rtl ? -translate : translate;
    }
    if (params.cssMode) {
      return translate;
    }
    let currentTranslate = getTranslate(wrapperEl, axis);
    currentTranslate += swiper.cssOverflowAdjustment();
    if (rtl) currentTranslate = -currentTranslate;
    return currentTranslate || 0;
  }

  function setTranslate(translate, byController) {
    const swiper = this;
    const {
      rtlTranslate: rtl,
      params,
      wrapperEl,
      progress
    } = swiper;
    let x = 0;
    let y = 0;
    const z = 0;
    if (swiper.isHorizontal()) {
      x = rtl ? -translate : translate;
    } else {
      y = translate;
    }
    if (params.roundLengths) {
      x = Math.floor(x);
      y = Math.floor(y);
    }
    swiper.previousTranslate = swiper.translate;
    swiper.translate = swiper.isHorizontal() ? x : y;
    if (params.cssMode) {
      wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
    } else if (!params.virtualTranslate) {
      if (swiper.isHorizontal()) {
        x -= swiper.cssOverflowAdjustment();
      } else {
        y -= swiper.cssOverflowAdjustment();
      }
      wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    }

    // Check if we need to update progress
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== progress) {
      swiper.updateProgress(translate);
    }
    swiper.emit('setTranslate', swiper.translate, byController);
  }

  function minTranslate() {
    return -this.snapGrid[0];
  }

  function maxTranslate() {
    return -this.snapGrid[this.snapGrid.length - 1];
  }

  function translateTo(translate, speed, runCallbacks, translateBounds, internal) {
    if (translate === void 0) {
      translate = 0;
    }
    if (speed === void 0) {
      speed = this.params.speed;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (translateBounds === void 0) {
      translateBounds = true;
    }
    const swiper = this;
    const {
      params,
      wrapperEl
    } = swiper;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    const minTranslate = swiper.minTranslate();
    const maxTranslate = swiper.maxTranslate();
    let newTranslate;
    if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate;

    // Update progress
    swiper.updateProgress(newTranslate);
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      if (speed === 0) {
        wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: -newTranslate,
            side: isH ? 'left' : 'top'
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? 'left' : 'top']: -newTranslate,
          behavior: 'smooth'
        });
      }
      return true;
    }
    if (speed === 0) {
      swiper.setTransition(0);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionEnd');
      }
    } else {
      swiper.setTransition(speed);
      swiper.setTranslate(newTranslate);
      if (runCallbacks) {
        swiper.emit('beforeTransitionStart', speed, internal);
        swiper.emit('transitionStart');
      }
      if (!swiper.animating) {
        swiper.animating = true;
        if (!swiper.onTranslateToWrapperTransitionEnd) {
          swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
            if (!swiper || swiper.destroyed) return;
            if (e.target !== this) return;
            swiper.wrapperEl.removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
            swiper.onTranslateToWrapperTransitionEnd = null;
            delete swiper.onTranslateToWrapperTransitionEnd;
            swiper.animating = false;
            if (runCallbacks) {
              swiper.emit('transitionEnd');
            }
          };
        }
        swiper.wrapperEl.addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
      }
    }
    return true;
  }

  var translate = {
    getTranslate: getSwiperTranslate,
    setTranslate,
    minTranslate,
    maxTranslate,
    translateTo
  };

  function setTransition(duration, byController) {
    const swiper = this;
    if (!swiper.params.cssMode) {
      swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : '';
    }
    swiper.emit('setTransition', duration, byController);
  }

  function transitionEmit(_ref) {
    let {
      swiper,
      runCallbacks,
      direction,
      step
    } = _ref;
    const {
      activeIndex,
      previousIndex
    } = swiper;
    let dir = direction;
    if (!dir) {
      if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
    }
    swiper.emit(`transition${step}`);
    if (runCallbacks && activeIndex !== previousIndex) {
      if (dir === 'reset') {
        swiper.emit(`slideResetTransition${step}`);
        return;
      }
      swiper.emit(`slideChangeTransition${step}`);
      if (dir === 'next') {
        swiper.emit(`slideNextTransition${step}`);
      } else {
        swiper.emit(`slidePrevTransition${step}`);
      }
    }
  }

  function transitionStart(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    if (params.cssMode) return;
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: 'Start'
    });
  }

  function transitionEnd(runCallbacks, direction) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.animating = false;
    if (params.cssMode) return;
    swiper.setTransition(0);
    transitionEmit({
      swiper,
      runCallbacks,
      direction,
      step: 'End'
    });
  }

  var transition = {
    setTransition,
    transitionStart,
    transitionEnd
  };

  function slideTo(index, speed, runCallbacks, internal, initial) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === 'string') {
      index = parseInt(index, 10);
    }
    const swiper = this;
    let slideIndex = index;
    if (slideIndex < 0) slideIndex = 0;
    const {
      params,
      snapGrid,
      slidesGrid,
      previousIndex,
      activeIndex,
      rtlTranslate: rtl,
      wrapperEl,
      enabled
    } = swiper;
    if (!enabled && !internal && !initial || swiper.destroyed || swiper.animating && params.preventInteractionOnTransition) {
      return false;
    }
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
    let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
    if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
    const translate = -snapGrid[snapIndex];
    // Normalize slideIndex
    if (params.normalizeSlideIndex) {
      for (let i = 0; i < slidesGrid.length; i += 1) {
        const normalizedTranslate = -Math.floor(translate * 100);
        const normalizedGrid = Math.floor(slidesGrid[i] * 100);
        const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
        if (typeof slidesGrid[i + 1] !== 'undefined') {
          if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
            slideIndex = i;
          } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
            slideIndex = i + 1;
          }
        } else if (normalizedTranslate >= normalizedGrid) {
          slideIndex = i;
        }
      }
    }
    // Directions locks
    if (swiper.initialized && slideIndex !== activeIndex) {
      if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) {
        return false;
      }
      if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
        if ((activeIndex || 0) !== slideIndex) {
          return false;
        }
      }
    }
    if (slideIndex !== (previousIndex || 0) && runCallbacks) {
      swiper.emit('beforeSlideChangeStart');
    }

    // Update progress
    swiper.updateProgress(translate);
    let direction;
    if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset';

    // initial virtual
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const isInitialVirtual = isVirtual && initial;
    // Update Index
    if (!isInitialVirtual && (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate)) {
      swiper.updateActiveIndex(slideIndex);
      // Update Height
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
      swiper.updateSlidesClasses();
      if (params.effect !== 'slide') {
        swiper.setTranslate(translate);
      }
      if (direction !== 'reset') {
        swiper.transitionStart(runCallbacks, direction);
        swiper.transitionEnd(runCallbacks, direction);
      }
      return false;
    }
    if (params.cssMode) {
      const isH = swiper.isHorizontal();
      const t = rtl ? translate : -translate;
      if (speed === 0) {
        if (isVirtual) {
          swiper.wrapperEl.style.scrollSnapType = 'none';
          swiper._immediateVirtual = true;
        }
        if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
          swiper._cssModeVirtualInitialSet = true;
          requestAnimationFrame(() => {
            wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
          });
        } else {
          wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;
        }
        if (isVirtual) {
          requestAnimationFrame(() => {
            swiper.wrapperEl.style.scrollSnapType = '';
            swiper._immediateVirtual = false;
          });
        }
      } else {
        if (!swiper.support.smoothScroll) {
          animateCSSModeScroll({
            swiper,
            targetPosition: t,
            side: isH ? 'left' : 'top'
          });
          return true;
        }
        wrapperEl.scrollTo({
          [isH ? 'left' : 'top']: t,
          behavior: 'smooth'
        });
      }
      return true;
    }
    const browser = getBrowser();
    const isSafari = browser.isSafari;
    if (isVirtual && !initial && isSafari && swiper.isElement) {
      swiper.virtual.update(false, false, slideIndex);
    }
    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    if (speed === 0) {
      swiper.transitionEnd(runCallbacks, direction);
    } else if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.wrapperEl.removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }
      swiper.wrapperEl.addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
    }
    return true;
  }

  function slideToLoop(index, speed, runCallbacks, internal) {
    if (index === void 0) {
      index = 0;
    }
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (typeof index === 'string') {
      const indexAsNumber = parseInt(index, 10);
      index = indexAsNumber;
    }
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    const gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
    let newIndex = index;
    if (swiper.params.loop) {
      if (swiper.virtual && swiper.params.virtual.enabled) {
        // eslint-disable-next-line
        newIndex = newIndex + swiper.virtual.slidesBefore;
      } else {
        let targetSlideIndex;
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          targetSlideIndex = swiper.slides.find(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex).column;
        } else {
          targetSlideIndex = swiper.getSlideIndexByData(newIndex);
        }
        const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length;
        const {
          centeredSlides
        } = swiper.params;
        let slidesPerView = swiper.params.slidesPerView;
        if (slidesPerView === 'auto') {
          slidesPerView = swiper.slidesPerViewDynamic();
        } else {
          slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
          if (centeredSlides && slidesPerView % 2 === 0) {
            slidesPerView = slidesPerView + 1;
          }
        }
        let needLoopFix = cols - targetSlideIndex < slidesPerView;
        if (centeredSlides) {
          needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
        }
        if (internal && centeredSlides && swiper.params.slidesPerView !== 'auto' && !gridEnabled) {
          needLoopFix = false;
        }
        if (needLoopFix) {
          const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? 'prev' : 'next' : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? 'next' : 'prev';
          swiper.loopFix({
            direction,
            slideTo: true,
            activeSlideIndex: direction === 'next' ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
            slideRealIndex: direction === 'next' ? swiper.realIndex : undefined
          });
        }
        if (gridEnabled) {
          const slideIndex = newIndex * swiper.params.grid.rows;
          newIndex = swiper.slides.find(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === slideIndex).column;
        } else {
          newIndex = swiper.getSlideIndexByData(newIndex);
        }
      }
    }
    requestAnimationFrame(() => {
      swiper.slideTo(newIndex, speed, runCallbacks, internal);
    });
    return swiper;
  }

  /* eslint no-unused-vars: "off" */
  function slideNext(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      enabled,
      params,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    let perGroup = params.slidesPerGroup;
    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
    }
    const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: 'next'
      });
      // eslint-disable-next-line
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
      if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
        requestAnimationFrame(() => {
          swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        });
        return true;
      }
    }
    if (params.rewind && swiper.isEnd) {
      return swiper.slideTo(0, speed, runCallbacks, internal);
    }
    return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slidePrev(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    const {
      params,
      snapGrid,
      slidesGrid,
      rtlTranslate,
      enabled,
      animating
    } = swiper;
    if (!enabled || swiper.destroyed) return swiper;
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    const isVirtual = swiper.virtual && params.virtual.enabled;
    if (params.loop) {
      if (animating && !isVirtual && params.loopPreventsSliding) return false;
      swiper.loopFix({
        direction: 'prev'
      });
      // eslint-disable-next-line
      swiper._clientLeft = swiper.wrapperEl.clientLeft;
    }
    const translate = rtlTranslate ? swiper.translate : -swiper.translate;
    function normalize(val) {
      if (val < 0) return -Math.floor(Math.abs(val));
      return Math.floor(val);
    }
    const normalizedTranslate = normalize(translate);
    const normalizedSnapGrid = snapGrid.map(val => normalize(val));
    const isFreeMode = params.freeMode && params.freeMode.enabled;
    let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
    if (typeof prevSnap === 'undefined' && (params.cssMode || isFreeMode)) {
      let prevSnapIndex;
      snapGrid.forEach((snap, snapIndex) => {
        if (normalizedTranslate >= snap) {
          // prevSnap = snap;
          prevSnapIndex = snapIndex;
        }
      });
      if (typeof prevSnapIndex !== 'undefined') {
        prevSnap = isFreeMode ? snapGrid[prevSnapIndex] : snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
      }
    }
    let prevIndex = 0;
    if (typeof prevSnap !== 'undefined') {
      prevIndex = slidesGrid.indexOf(prevSnap);
      if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
      if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
        prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
        prevIndex = Math.max(prevIndex, 0);
      }
    }
    if (params.rewind && swiper.isBeginning) {
      const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
    } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(prevIndex, speed, runCallbacks, internal);
      });
      return true;
    }
    return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideReset(speed, runCallbacks, internal) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
  }

  /* eslint no-unused-vars: "off" */
  function slideToClosest(speed, runCallbacks, internal, threshold) {
    if (runCallbacks === void 0) {
      runCallbacks = true;
    }
    if (threshold === void 0) {
      threshold = 0.5;
    }
    const swiper = this;
    if (swiper.destroyed) return;
    if (typeof speed === 'undefined') {
      speed = swiper.params.speed;
    }
    let index = swiper.activeIndex;
    const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
    const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
    const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
    if (translate >= swiper.snapGrid[snapIndex]) {
      // The current translate is on or after the current snap index, so the choice
      // is between the current index and the one after it.
      const currentSnap = swiper.snapGrid[snapIndex];
      const nextSnap = swiper.snapGrid[snapIndex + 1];
      if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
        index += swiper.params.slidesPerGroup;
      }
    } else {
      // The current translate is before the current snap index, so the choice
      // is between the current index and the one before it.
      const prevSnap = swiper.snapGrid[snapIndex - 1];
      const currentSnap = swiper.snapGrid[snapIndex];
      if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
        index -= swiper.params.slidesPerGroup;
      }
    }
    index = Math.max(index, 0);
    index = Math.min(index, swiper.slidesGrid.length - 1);
    return swiper.slideTo(index, speed, runCallbacks, internal);
  }

  function slideToClickedSlide() {
    const swiper = this;
    if (swiper.destroyed) return;
    const {
      params,
      slidesEl
    } = swiper;
    const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
    let slideToIndex = swiper.clickedIndex;
    let realIndex;
    const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
    if (params.loop) {
      if (swiper.animating) return;
      realIndex = parseInt(swiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
      if (params.centeredSlides) {
        if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
          swiper.loopFix();
          slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
          nextTick(() => {
            swiper.slideTo(slideToIndex);
          });
        } else {
          swiper.slideTo(slideToIndex);
        }
      } else if (slideToIndex > swiper.slides.length - slidesPerView) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else {
      swiper.slideTo(slideToIndex);
    }
  }

  var slide = {
    slideTo,
    slideToLoop,
    slideNext,
    slidePrev,
    slideReset,
    slideToClosest,
    slideToClickedSlide
  };

  function loopCreate(slideRealIndex, initial) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
    const initSlides = () => {
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      slides.forEach((el, index) => {
        el.setAttribute('data-swiper-slide-index', index);
      });
    };
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    const slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
    const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
    const shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows !== 0;
    const addBlankSlides = amountOfSlides => {
      for (let i = 0; i < amountOfSlides; i += 1) {
        const slideEl = swiper.isElement ? createElement('swiper-slide', [params.slideBlankClass]) : createElement('div', [params.slideClass, params.slideBlankClass]);
        swiper.slidesEl.append(slideEl);
      }
    };
    if (shouldFillGroup) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = slidesPerGroup - swiper.slides.length % slidesPerGroup;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning('Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
      }
      initSlides();
    } else if (shouldFillGrid) {
      if (params.loopAddBlankSlides) {
        const slidesToAdd = params.grid.rows - swiper.slides.length % params.grid.rows;
        addBlankSlides(slidesToAdd);
        swiper.recalcSlides();
        swiper.updateSlides();
      } else {
        showWarning('Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)');
      }
      initSlides();
    } else {
      initSlides();
    }
    swiper.loopFix({
      slideRealIndex,
      direction: params.centeredSlides ? undefined : 'next',
      initial
    });
  }

  function loopFix(_temp) {
    let {
      slideRealIndex,
      slideTo = true,
      direction,
      setTranslate,
      activeSlideIndex,
      initial,
      byController,
      byMousewheel
    } = _temp === void 0 ? {} : _temp;
    const swiper = this;
    if (!swiper.params.loop) return;
    swiper.emit('beforeLoopFix');
    const {
      slides,
      allowSlidePrev,
      allowSlideNext,
      slidesEl,
      params
    } = swiper;
    const {
      centeredSlides,
      initialSlide
    } = params;
    swiper.allowSlidePrev = true;
    swiper.allowSlideNext = true;
    if (swiper.virtual && params.virtual.enabled) {
      if (slideTo) {
        if (!params.centeredSlides && swiper.snapIndex === 0) {
          swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
        } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
          swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
        } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
          swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
        }
      }
      swiper.allowSlidePrev = allowSlidePrev;
      swiper.allowSlideNext = allowSlideNext;
      swiper.emit('loopFix');
      return;
    }
    let slidesPerView = params.slidesPerView;
    if (slidesPerView === 'auto') {
      slidesPerView = swiper.slidesPerViewDynamic();
    } else {
      slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
      if (centeredSlides && slidesPerView % 2 === 0) {
        slidesPerView = slidesPerView + 1;
      }
    }
    const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
    let loopedSlides = slidesPerGroup;
    if (loopedSlides % slidesPerGroup !== 0) {
      loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup;
    }
    loopedSlides += params.loopAdditionalSlides;
    swiper.loopedSlides = loopedSlides;
    const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
    if (slides.length < slidesPerView + loopedSlides || swiper.params.effect === 'cards' && slides.length < slidesPerView + loopedSlides * 2) {
      showWarning('Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters');
    } else if (gridEnabled && params.grid.fill === 'row') {
      showWarning('Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`');
    }
    const prependSlidesIndexes = [];
    const appendSlidesIndexes = [];
    const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length;
    const isInitialOverflow = initial && cols - initialSlide < slidesPerView && !centeredSlides;
    let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
    if (typeof activeSlideIndex === 'undefined') {
      activeSlideIndex = swiper.getSlideIndex(slides.find(el => el.classList.contains(params.slideActiveClass)));
    } else {
      activeIndex = activeSlideIndex;
    }
    const isNext = direction === 'next' || !direction;
    const isPrev = direction === 'prev' || !direction;
    let slidesPrepended = 0;
    let slidesAppended = 0;
    const activeColIndex = gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex;
    const activeColIndexWithShift = activeColIndex + (centeredSlides && typeof setTranslate === 'undefined' ? -slidesPerView / 2 + 0.5 : 0);
    // prepend last slides before start
    if (activeColIndexWithShift < loopedSlides) {
      slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
      for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          const colIndexToPrepend = cols - index - 1;
          for (let i = slides.length - 1; i >= 0; i -= 1) {
            if (slides[i].column === colIndexToPrepend) prependSlidesIndexes.push(i);
          }
          // slides.forEach((slide, slideIndex) => {
          //   if (slide.column === colIndexToPrepend) prependSlidesIndexes.push(slideIndex);
          // });
        } else {
          prependSlidesIndexes.push(cols - index - 1);
        }
      }
    } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
      slidesAppended = Math.max(activeColIndexWithShift - (cols - loopedSlides * 2), slidesPerGroup);
      if (isInitialOverflow) {
        slidesAppended = Math.max(slidesAppended, slidesPerView - cols + initialSlide + 1);
      }
      for (let i = 0; i < slidesAppended; i += 1) {
        const index = i - Math.floor(i / cols) * cols;
        if (gridEnabled) {
          slides.forEach((slide, slideIndex) => {
            if (slide.column === index) appendSlidesIndexes.push(slideIndex);
          });
        } else {
          appendSlidesIndexes.push(index);
        }
      }
    }
    swiper.__preventObserver__ = true;
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
    if (swiper.params.effect === 'cards' && slides.length < slidesPerView + loopedSlides * 2) {
      if (appendSlidesIndexes.includes(activeSlideIndex)) {
        appendSlidesIndexes.splice(appendSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
      if (prependSlidesIndexes.includes(activeSlideIndex)) {
        prependSlidesIndexes.splice(prependSlidesIndexes.indexOf(activeSlideIndex), 1);
      }
    }
    if (isPrev) {
      prependSlidesIndexes.forEach(index => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.prepend(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    if (isNext) {
      appendSlidesIndexes.forEach(index => {
        slides[index].swiperLoopMoveDOM = true;
        slidesEl.append(slides[index]);
        slides[index].swiperLoopMoveDOM = false;
      });
    }
    swiper.recalcSlides();
    if (params.slidesPerView === 'auto') {
      swiper.updateSlides();
    } else if (gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext)) {
      swiper.slides.forEach((slide, slideIndex) => {
        swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
      });
    }
    if (params.watchSlidesProgress) {
      swiper.updateSlidesOffset();
    }
    if (slideTo) {
      if (prependSlidesIndexes.length > 0 && isPrev) {
        if (typeof slideRealIndex === 'undefined') {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex + Math.ceil(slidesPrepended), 0, false, true);
            if (setTranslate) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          if (setTranslate) {
            const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
            swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
            swiper.touchEventsData.currentTranslate = swiper.translate;
          }
        }
      } else if (appendSlidesIndexes.length > 0 && isNext) {
        if (typeof slideRealIndex === 'undefined') {
          const currentSlideTranslate = swiper.slidesGrid[activeIndex];
          const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
          const diff = newSlideTranslate - currentSlideTranslate;
          if (byMousewheel) {
            swiper.setTranslate(swiper.translate - diff);
          } else {
            swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
            if (setTranslate) {
              swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff;
              swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff;
            }
          }
        } else {
          const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
        }
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.controller && swiper.controller.control && !byController) {
      const loopParams = {
        slideRealIndex,
        direction,
        setTranslate,
        activeSlideIndex,
        byController: true
      };
      if (Array.isArray(swiper.controller.control)) {
        swiper.controller.control.forEach(c => {
          if (!c.destroyed && c.params.loop) c.loopFix({
            ...loopParams,
            slideTo: c.params.slidesPerView === params.slidesPerView ? slideTo : false
          });
        });
      } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
        swiper.controller.control.loopFix({
          ...loopParams,
          slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView ? slideTo : false
        });
      }
    }
    swiper.emit('loopFix');
  }

  function loopDestroy() {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (!params.loop || !slidesEl || swiper.virtual && swiper.params.virtual.enabled) return;
    swiper.recalcSlides();
    const newSlidesOrder = [];
    swiper.slides.forEach(slideEl => {
      const index = typeof slideEl.swiperSlideIndex === 'undefined' ? slideEl.getAttribute('data-swiper-slide-index') * 1 : slideEl.swiperSlideIndex;
      newSlidesOrder[index] = slideEl;
    });
    swiper.slides.forEach(slideEl => {
      slideEl.removeAttribute('data-swiper-slide-index');
    });
    newSlidesOrder.forEach(slideEl => {
      slidesEl.append(slideEl);
    });
    swiper.recalcSlides();
    swiper.slideTo(swiper.realIndex, 0);
  }

  var loop = {
    loopCreate,
    loopFix,
    loopDestroy
  };

  function setGrabCursor(moving) {
    const swiper = this;
    if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
    const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    el.style.cursor = 'move';
    el.style.cursor = moving ? 'grabbing' : 'grab';
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }

  function unsetGrabCursor() {
    const swiper = this;
    if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
      return;
    }
    if (swiper.isElement) {
      swiper.__preventObserver__ = true;
    }
    swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
    if (swiper.isElement) {
      requestAnimationFrame(() => {
        swiper.__preventObserver__ = false;
      });
    }
  }

  var grabCursor = {
    setGrabCursor,
    unsetGrabCursor
  };

  // Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
  function closestElement(selector, base) {
    if (base === void 0) {
      base = this;
    }
    function __closestFrom(el) {
      if (!el || el === getDocument() || el === getWindow()) return null;
      if (el.assignedSlot) el = el.assignedSlot;
      const found = el.closest(selector);
      if (!found && !el.getRootNode) {
        return null;
      }
      return found || __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  function preventEdgeSwipe(swiper, event, startX) {
    const window = getWindow();
    const {
      params
    } = swiper;
    const edgeSwipeDetection = params.edgeSwipeDetection;
    const edgeSwipeThreshold = params.edgeSwipeThreshold;
    if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
      if (edgeSwipeDetection === 'prevent') {
        event.preventDefault();
        return true;
      }
      return false;
    }
    return true;
  }
  function onTouchStart(event) {
    const swiper = this;
    const document = getDocument();
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    const data = swiper.touchEventsData;
    if (e.type === 'pointerdown') {
      if (data.pointerId !== null && data.pointerId !== e.pointerId) {
        return;
      }
      data.pointerId = e.pointerId;
    } else if (e.type === 'touchstart' && e.targetTouches.length === 1) {
      data.touchId = e.targetTouches[0].identifier;
    }
    if (e.type === 'touchstart') {
      // don't proceed touch event
      preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
      return;
    }
    const {
      params,
      touches,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === 'mouse') return;
    if (swiper.animating && params.preventInteractionOnTransition) {
      return;
    }
    if (!swiper.animating && params.cssMode && params.loop) {
      swiper.loopFix();
    }
    let targetEl = e.target;
    if (params.touchEventsTarget === 'wrapper') {
      if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
    }
    if ('which' in e && e.which === 3) return;
    if ('button' in e && e.button > 0) return;
    if (data.isTouched && data.isMoved) return;

    // change target el for shadow root component
    const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';
    // eslint-disable-next-line
    const eventPath = e.composedPath ? e.composedPath() : e.path;
    if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
      targetEl = eventPath[0];
    }
    const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
    const isTargetShadow = !!(e.target && e.target.shadowRoot);

    // use closestElement for shadow root element to get the actual closest for nested shadow root element
    if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
      swiper.allowClick = true;
      return;
    }
    if (params.swipeHandler) {
      if (!targetEl.closest(params.swipeHandler)) return;
    }
    touches.currentX = e.pageX;
    touches.currentY = e.pageY;
    const startX = touches.currentX;
    const startY = touches.currentY;

    // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

    if (!preventEdgeSwipe(swiper, e, startX)) {
      return;
    }
    Object.assign(data, {
      isTouched: true,
      isMoved: false,
      allowTouchCallbacks: true,
      isScrolling: undefined,
      startMoving: undefined
    });
    touches.startX = startX;
    touches.startY = startY;
    data.touchStartTime = now();
    swiper.allowClick = true;
    swiper.updateSize();
    swiper.swipeDirection = undefined;
    if (params.threshold > 0) data.allowThresholdMove = false;
    let preventDefault = true;
    if (targetEl.matches(data.focusableElements)) {
      preventDefault = false;
      if (targetEl.nodeName === 'SELECT') {
        data.isTouched = false;
      }
    }
    if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && (e.pointerType === 'mouse' || e.pointerType !== 'mouse' && !targetEl.matches(data.focusableElements))) {
      document.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
      e.preventDefault();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
      swiper.freeMode.onTouchStart();
    }
    swiper.emit('touchStart', e);
  }

  function onTouchMove(event) {
    const document = getDocument();
    const swiper = this;
    const data = swiper.touchEventsData;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && event.pointerType === 'mouse') return;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    if (e.type === 'pointermove') {
      if (data.touchId !== null) return; // return from pointer if we use touch
      const id = e.pointerId;
      if (id !== data.pointerId) return;
    }
    let targetTouch;
    if (e.type === 'touchmove') {
      targetTouch = [...e.changedTouches].find(t => t.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    } else {
      targetTouch = e;
    }
    if (!data.isTouched) {
      if (data.startMoving && data.isScrolling) {
        swiper.emit('touchMoveOpposite', e);
      }
      return;
    }
    const pageX = targetTouch.pageX;
    const pageY = targetTouch.pageY;
    if (e.preventedByNestedSwiper) {
      touches.startX = pageX;
      touches.startY = pageY;
      return;
    }
    if (!swiper.allowTouchMove) {
      if (!e.target.matches(data.focusableElements)) {
        swiper.allowClick = false;
      }
      if (data.isTouched) {
        Object.assign(touches, {
          startX: pageX,
          startY: pageY,
          currentX: pageX,
          currentY: pageY
        });
        data.touchStartTime = now();
      }
      return;
    }
    if (params.touchReleaseOnEdges && !params.loop) {
      if (swiper.isVertical()) {
        // Vertical
        if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
          data.isTouched = false;
          data.isMoved = false;
          return;
        }
      } else if (rtl && (pageX > touches.startX && -swiper.translate <= swiper.maxTranslate() || pageX < touches.startX && -swiper.translate >= swiper.minTranslate())) {
        return;
      } else if (!rtl && (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate())) {
        return;
      }
    }
    if (document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== e.target && e.pointerType !== 'mouse') {
      document.activeElement.blur();
    }
    if (document.activeElement) {
      if (e.target === document.activeElement && e.target.matches(data.focusableElements)) {
        data.isMoved = true;
        swiper.allowClick = false;
        return;
      }
    }
    if (data.allowTouchCallbacks) {
      swiper.emit('touchMove', e);
    }
    touches.previousX = touches.currentX;
    touches.previousY = touches.currentY;
    touches.currentX = pageX;
    touches.currentY = pageY;
    const diffX = touches.currentX - touches.startX;
    const diffY = touches.currentY - touches.startY;
    if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
    if (typeof data.isScrolling === 'undefined') {
      let touchAngle;
      if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
        data.isScrolling = false;
      } else {
        // eslint-disable-next-line
        if (diffX * diffX + diffY * diffY >= 25) {
          touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
          data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
        }
      }
    }
    if (data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }
    if (typeof data.startMoving === 'undefined') {
      if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
        data.startMoving = true;
      }
    }
    if (data.isScrolling || e.type === 'touchmove' && data.preventTouchMoveFromPointerMove) {
      data.isTouched = false;
      return;
    }
    if (!data.startMoving) {
      return;
    }
    swiper.allowClick = false;
    if (!params.cssMode && e.cancelable) {
      e.preventDefault();
    }
    if (params.touchMoveStopPropagation && !params.nested) {
      e.stopPropagation();
    }
    let diff = swiper.isHorizontal() ? diffX : diffY;
    let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
    if (params.oneWayMovement) {
      diff = Math.abs(diff) * (rtl ? 1 : -1);
      touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
    }
    touches.diff = diff;
    diff *= params.touchRatio;
    if (rtl) {
      diff = -diff;
      touchesDiff = -touchesDiff;
    }
    const prevTouchesDirection = swiper.touchesDirection;
    swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
    swiper.touchesDirection = touchesDiff > 0 ? 'prev' : 'next';
    const isLoop = swiper.params.loop && !params.cssMode;
    const allowLoopFix = swiper.touchesDirection === 'next' && swiper.allowSlideNext || swiper.touchesDirection === 'prev' && swiper.allowSlidePrev;
    if (!data.isMoved) {
      if (isLoop && allowLoopFix) {
        swiper.loopFix({
          direction: swiper.swipeDirection
        });
      }
      data.startTranslate = swiper.getTranslate();
      swiper.setTransition(0);
      if (swiper.animating) {
        const evt = new window.CustomEvent('transitionend', {
          bubbles: true,
          cancelable: true,
          detail: {
            bySwiperTouchMove: true
          }
        });
        swiper.wrapperEl.dispatchEvent(evt);
      }
      data.allowMomentumBounce = false;
      // Grab Cursor
      if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
        swiper.setGrabCursor(true);
      }
      swiper.emit('sliderFirstMove', e);
    }
    let loopFixed;
    new Date().getTime();
    if (params._loopSwapReset !== false && data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        startTranslate: data.currentTranslate
      });
      data.loopSwapReset = true;
      data.startTranslate = data.currentTranslate;
      return;
    }
    swiper.emit('sliderMove', e);
    data.isMoved = true;
    data.currentTranslate = diff + data.startTranslate;
    let disableParentSwiper = true;
    let resistanceRatio = params.resistanceRatio;
    if (params.touchReleaseOnEdges) {
      resistanceRatio = 0;
    }
    if (diff > 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] - (params.slidesPerView !== 'auto' && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.activeIndex + 1] + swiper.params.spaceBetween : 0) - swiper.params.spaceBetween : swiper.minTranslate())) {
        swiper.loopFix({
          direction: 'prev',
          setTranslate: true,
          activeSlideIndex: 0
        });
      }
      if (data.currentTranslate > swiper.minTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        }
      }
    } else if (diff < 0) {
      if (isLoop && allowLoopFix && !loopFixed && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween + (params.slidesPerView !== 'auto' && swiper.slides.length - params.slidesPerView >= 2 ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] + swiper.params.spaceBetween : 0) : swiper.maxTranslate())) {
        swiper.loopFix({
          direction: 'next',
          setTranslate: true,
          activeSlideIndex: swiper.slides.length - (params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        });
      }
      if (data.currentTranslate < swiper.maxTranslate()) {
        disableParentSwiper = false;
        if (params.resistance) {
          data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
      }
    }
    if (disableParentSwiper) {
      e.preventedByNestedSwiper = true;
    }

    // Directions locks
    if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
      data.currentTranslate = data.startTranslate;
    }
    if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
      data.currentTranslate = data.startTranslate;
    }

    // Threshold
    if (params.threshold > 0) {
      if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
        if (!data.allowThresholdMove) {
          data.allowThresholdMove = true;
          touches.startX = touches.currentX;
          touches.startY = touches.currentY;
          data.currentTranslate = data.startTranslate;
          touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
          return;
        }
      } else {
        data.currentTranslate = data.startTranslate;
        return;
      }
    }
    if (!params.followFinger || params.cssMode) return;

    // Update active index in free mode
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
      swiper.freeMode.onTouchMove();
    }
    // Update progress
    swiper.updateProgress(data.currentTranslate);
    // Update translate
    swiper.setTranslate(data.currentTranslate);
  }

  function onTouchEnd(event) {
    const swiper = this;
    const data = swiper.touchEventsData;
    let e = event;
    if (e.originalEvent) e = e.originalEvent;
    let targetTouch;
    const isTouchEvent = e.type === 'touchend' || e.type === 'touchcancel';
    if (!isTouchEvent) {
      if (data.touchId !== null) return; // return from pointer if we use touch
      if (e.pointerId !== data.pointerId) return;
      targetTouch = e;
    } else {
      targetTouch = [...e.changedTouches].find(t => t.identifier === data.touchId);
      if (!targetTouch || targetTouch.identifier !== data.touchId) return;
    }
    if (['pointercancel', 'pointerout', 'pointerleave', 'contextmenu'].includes(e.type)) {
      const proceed = ['pointercancel', 'contextmenu'].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView);
      if (!proceed) {
        return;
      }
    }
    data.pointerId = null;
    data.touchId = null;
    const {
      params,
      touches,
      rtlTranslate: rtl,
      slidesGrid,
      enabled
    } = swiper;
    if (!enabled) return;
    if (!params.simulateTouch && e.pointerType === 'mouse') return;
    if (data.allowTouchCallbacks) {
      swiper.emit('touchEnd', e);
    }
    data.allowTouchCallbacks = false;
    if (!data.isTouched) {
      if (data.isMoved && params.grabCursor) {
        swiper.setGrabCursor(false);
      }
      data.isMoved = false;
      data.startMoving = false;
      return;
    }

    // Return Grab Cursor
    if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(false);
    }

    // Time diff
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;

    // Tap, doubleTap, Click
    if (swiper.allowClick) {
      const pathTree = e.path || e.composedPath && e.composedPath();
      swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree);
      swiper.emit('tap click', e);
      if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
        swiper.emit('doubleTap doubleClick', e);
      }
    }
    data.lastClickTime = now();
    nextTick(() => {
      if (!swiper.destroyed) swiper.allowClick = true;
    });
    if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) {
      data.isTouched = false;
      data.isMoved = false;
      data.startMoving = false;
      return;
    }
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    let currentPos;
    if (params.followFinger) {
      currentPos = rtl ? swiper.translate : -swiper.translate;
    } else {
      currentPos = -data.currentTranslate;
    }
    if (params.cssMode) {
      return;
    }
    if (params.freeMode && params.freeMode.enabled) {
      swiper.freeMode.onTouchEnd({
        currentPos
      });
      return;
    }

    // Find current slide
    const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
    let stopIndex = 0;
    let groupSize = swiper.slidesSizesGrid[0];
    for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
      const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
      if (typeof slidesGrid[i + increment] !== 'undefined') {
        if (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
          stopIndex = i;
          groupSize = slidesGrid[i + increment] - slidesGrid[i];
        }
      } else if (swipeToLast || currentPos >= slidesGrid[i]) {
        stopIndex = i;
        groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
      }
    }
    let rewindFirstIndex = null;
    let rewindLastIndex = null;
    if (params.rewind) {
      if (swiper.isBeginning) {
        rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
      } else if (swiper.isEnd) {
        rewindFirstIndex = 0;
      }
    }
    // Find current slide size
    const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
    const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (timeDiff > params.longSwipesMs) {
      // Long touches
      if (!params.longSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (swiper.swipeDirection === 'next') {
        if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
      }
      if (swiper.swipeDirection === 'prev') {
        if (ratio > 1 - params.longSwipesRatio) {
          swiper.slideTo(stopIndex + increment);
        } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
          swiper.slideTo(rewindLastIndex);
        } else {
          swiper.slideTo(stopIndex);
        }
      }
    } else {
      // Short swipes
      if (!params.shortSwipes) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
      if (!isNavButtonTarget) {
        if (swiper.swipeDirection === 'next') {
          swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
        }
        if (swiper.swipeDirection === 'prev') {
          swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
        }
      } else if (e.target === swiper.navigation.nextEl) {
        swiper.slideTo(stopIndex + increment);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  }

  function onResize() {
    const swiper = this;
    const {
      params,
      el
    } = swiper;
    if (el && el.offsetWidth === 0) return;

    // Breakpoints
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    // Save locks
    const {
      allowSlideNext,
      allowSlidePrev,
      snapGrid
    } = swiper;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

    // Disable locks on resize
    swiper.allowSlideNext = true;
    swiper.allowSlidePrev = true;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateSlidesClasses();
    const isVirtualLoop = isVirtual && params.loop;
    if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
      swiper.slideTo(swiper.slides.length - 1, 0, false, true);
    } else {
      if (swiper.params.loop && !isVirtual) {
        swiper.slideToLoop(swiper.realIndex, 0, false, true);
      } else {
        swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
    }
    if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
      clearTimeout(swiper.autoplay.resizeTimeout);
      swiper.autoplay.resizeTimeout = setTimeout(() => {
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
          swiper.autoplay.resume();
        }
      }, 500);
    }
    // Return locks after resize
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
  }

  function onClick(e) {
    const swiper = this;
    if (!swiper.enabled) return;
    if (!swiper.allowClick) {
      if (swiper.params.preventClicks) e.preventDefault();
      if (swiper.params.preventClicksPropagation && swiper.animating) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }

  function onScroll() {
    const swiper = this;
    const {
      wrapperEl,
      rtlTranslate,
      enabled
    } = swiper;
    if (!enabled) return;
    swiper.previousTranslate = swiper.translate;
    if (swiper.isHorizontal()) {
      swiper.translate = -wrapperEl.scrollLeft;
    } else {
      swiper.translate = -wrapperEl.scrollTop;
    }
    // eslint-disable-next-line
    if (swiper.translate === 0) swiper.translate = 0;
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
    let newProgress;
    const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
    if (translatesDiff === 0) {
      newProgress = 0;
    } else {
      newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
    }
    if (newProgress !== swiper.progress) {
      swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
    }
    swiper.emit('setTranslate', swiper.translate, false);
  }

  function onLoad(e) {
    const swiper = this;
    processLazyPreloader(swiper, e.target);
    if (swiper.params.cssMode || swiper.params.slidesPerView !== 'auto' && !swiper.params.autoHeight) {
      return;
    }
    swiper.update();
  }

  function onDocumentTouchStart() {
    const swiper = this;
    if (swiper.documentTouchHandlerProceeded) return;
    swiper.documentTouchHandlerProceeded = true;
    if (swiper.params.touchReleaseOnEdges) {
      swiper.el.style.touchAction = 'auto';
    }
  }

  const events = (swiper, method) => {
    const document = getDocument();
    const {
      params,
      el,
      wrapperEl,
      device
    } = swiper;
    const capture = !!params.nested;
    const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
    const swiperMethod = method;
    if (!el || typeof el === 'string') return;

    // Touch Events
    document[domMethod]('touchstart', swiper.onDocumentTouchStart, {
      passive: false,
      capture
    });
    el[domMethod]('touchstart', swiper.onTouchStart, {
      passive: false
    });
    el[domMethod]('pointerdown', swiper.onTouchStart, {
      passive: false
    });
    document[domMethod]('touchmove', swiper.onTouchMove, {
      passive: false,
      capture
    });
    document[domMethod]('pointermove', swiper.onTouchMove, {
      passive: false,
      capture
    });
    document[domMethod]('touchend', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('pointerup', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('pointercancel', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('touchcancel', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('pointerout', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('pointerleave', swiper.onTouchEnd, {
      passive: true
    });
    document[domMethod]('contextmenu', swiper.onTouchEnd, {
      passive: true
    });

    // Prevent Links Clicks
    if (params.preventClicks || params.preventClicksPropagation) {
      el[domMethod]('click', swiper.onClick, true);
    }
    if (params.cssMode) {
      wrapperEl[domMethod]('scroll', swiper.onScroll);
    }

    // Resize handler
    if (params.updateOnWindowResize) {
      swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
    } else {
      swiper[swiperMethod]('observerUpdate', onResize, true);
    }

    // Images loader
    el[domMethod]('load', swiper.onLoad, {
      capture: true
    });
  };
  function attachEvents() {
    const swiper = this;
    const {
      params
    } = swiper;
    swiper.onTouchStart = onTouchStart.bind(swiper);
    swiper.onTouchMove = onTouchMove.bind(swiper);
    swiper.onTouchEnd = onTouchEnd.bind(swiper);
    swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
    if (params.cssMode) {
      swiper.onScroll = onScroll.bind(swiper);
    }
    swiper.onClick = onClick.bind(swiper);
    swiper.onLoad = onLoad.bind(swiper);
    events(swiper, 'on');
  }
  function detachEvents() {
    const swiper = this;
    events(swiper, 'off');
  }
  var events$1 = {
    attachEvents,
    detachEvents
  };

  const isGridEnabled = (swiper, params) => {
    return swiper.grid && params.grid && params.grid.rows > 1;
  };
  function setBreakpoint() {
    const swiper = this;
    const {
      realIndex,
      initialized,
      params,
      el
    } = swiper;
    const breakpoints = params.breakpoints;
    if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return;
    const document = getDocument();

    // Get breakpoint for window/container width and update parameters
    const breakpointsBase = params.breakpointsBase === 'window' || !params.breakpointsBase ? params.breakpointsBase : 'container';
    const breakpointContainer = ['window', 'container'].includes(params.breakpointsBase) || !params.breakpointsBase ? swiper.el : document.querySelector(params.breakpointsBase);
    const breakpoint = swiper.getBreakpoint(breakpoints, breakpointsBase, breakpointContainer);
    if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
    const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
    const breakpointParams = breakpointOnlyParams || swiper.originalParams;
    const wasMultiRow = isGridEnabled(swiper, params);
    const isMultiRow = isGridEnabled(swiper, breakpointParams);
    const wasGrabCursor = swiper.params.grabCursor;
    const isGrabCursor = breakpointParams.grabCursor;
    const wasEnabled = params.enabled;
    if (wasMultiRow && !isMultiRow) {
      el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
      swiper.emitContainerClasses();
    } else if (!wasMultiRow && isMultiRow) {
      el.classList.add(`${params.containerModifierClass}grid`);
      if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
        el.classList.add(`${params.containerModifierClass}grid-column`);
      }
      swiper.emitContainerClasses();
    }
    if (wasGrabCursor && !isGrabCursor) {
      swiper.unsetGrabCursor();
    } else if (!wasGrabCursor && isGrabCursor) {
      swiper.setGrabCursor();
    }

    // Toggle navigation, pagination, scrollbar
    ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
      if (typeof breakpointParams[prop] === 'undefined') return;
      const wasModuleEnabled = params[prop] && params[prop].enabled;
      const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
      if (wasModuleEnabled && !isModuleEnabled) {
        swiper[prop].disable();
      }
      if (!wasModuleEnabled && isModuleEnabled) {
        swiper[prop].enable();
      }
    });
    const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
    const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
    const wasLoop = params.loop;
    if (directionChanged && initialized) {
      swiper.changeDirection();
    }
    extend(swiper.params, breakpointParams);
    const isEnabled = swiper.params.enabled;
    const hasLoop = swiper.params.loop;
    Object.assign(swiper, {
      allowTouchMove: swiper.params.allowTouchMove,
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev
    });
    if (wasEnabled && !isEnabled) {
      swiper.disable();
    } else if (!wasEnabled && isEnabled) {
      swiper.enable();
    }
    swiper.currentBreakpoint = breakpoint;
    swiper.emit('_beforeBreakpoint', breakpointParams);
    if (initialized) {
      if (needsReLoop) {
        swiper.loopDestroy();
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (!wasLoop && hasLoop) {
        swiper.loopCreate(realIndex);
        swiper.updateSlides();
      } else if (wasLoop && !hasLoop) {
        swiper.loopDestroy();
      }
    }
    swiper.emit('breakpoint', breakpointParams);
  }

  function getBreakpoint(breakpoints, base, containerEl) {
    if (base === void 0) {
      base = 'window';
    }
    if (!breakpoints || base === 'container' && !containerEl) return undefined;
    let breakpoint = false;
    const window = getWindow();
    const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
    const points = Object.keys(breakpoints).map(point => {
      if (typeof point === 'string' && point.indexOf('@') === 0) {
        const minRatio = parseFloat(point.substr(1));
        const value = currentHeight * minRatio;
        return {
          value,
          point
        };
      }
      return {
        value: point,
        point
      };
    });
    points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
    for (let i = 0; i < points.length; i += 1) {
      const {
        point,
        value
      } = points[i];
      if (base === 'window') {
        if (window.matchMedia(`(min-width: ${value}px)`).matches) {
          breakpoint = point;
        }
      } else if (value <= containerEl.clientWidth) {
        breakpoint = point;
      }
    }
    return breakpoint || 'max';
  }

  var breakpoints = {
    setBreakpoint,
    getBreakpoint
  };

  function prepareClasses(entries, prefix) {
    const resultClasses = [];
    entries.forEach(item => {
      if (typeof item === 'object') {
        Object.keys(item).forEach(classNames => {
          if (item[classNames]) {
            resultClasses.push(prefix + classNames);
          }
        });
      } else if (typeof item === 'string') {
        resultClasses.push(prefix + item);
      }
    });
    return resultClasses;
  }
  function addClasses() {
    const swiper = this;
    const {
      classNames,
      params,
      rtl,
      el,
      device
    } = swiper;
    // prettier-ignore
    const suffixes = prepareClasses(['initialized', params.direction, {
      'free-mode': swiper.params.freeMode && params.freeMode.enabled
    }, {
      'autoheight': params.autoHeight
    }, {
      'rtl': rtl
    }, {
      'grid': params.grid && params.grid.rows > 1
    }, {
      'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
    }, {
      'android': device.android
    }, {
      'ios': device.ios
    }, {
      'css-mode': params.cssMode
    }, {
      'centered': params.cssMode && params.centeredSlides
    }, {
      'watch-progress': params.watchSlidesProgress
    }], params.containerModifierClass);
    classNames.push(...suffixes);
    el.classList.add(...classNames);
    swiper.emitContainerClasses();
  }

  function removeClasses() {
    const swiper = this;
    const {
      el,
      classNames
    } = swiper;
    if (!el || typeof el === 'string') return;
    el.classList.remove(...classNames);
    swiper.emitContainerClasses();
  }

  var classes = {
    addClasses,
    removeClasses
  };

  function checkOverflow() {
    const swiper = this;
    const {
      isLocked: wasLocked,
      params
    } = swiper;
    const {
      slidesOffsetBefore
    } = params;
    if (slidesOffsetBefore) {
      const lastSlideIndex = swiper.slides.length - 1;
      const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
      swiper.isLocked = swiper.size > lastSlideRightEdge;
    } else {
      swiper.isLocked = swiper.snapGrid.length === 1;
    }
    if (params.allowSlideNext === true) {
      swiper.allowSlideNext = !swiper.isLocked;
    }
    if (params.allowSlidePrev === true) {
      swiper.allowSlidePrev = !swiper.isLocked;
    }
    if (wasLocked && wasLocked !== swiper.isLocked) {
      swiper.isEnd = false;
    }
    if (wasLocked !== swiper.isLocked) {
      swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
    }
  }
  var checkOverflow$1 = {
    checkOverflow
  };

  var defaults = {
    init: true,
    direction: 'horizontal',
    oneWayMovement: false,
    swiperElementNodeName: 'SWIPER-CONTAINER',
    touchEventsTarget: 'wrapper',
    initialSlide: 0,
    speed: 300,
    cssMode: false,
    updateOnWindowResize: true,
    resizeObserver: true,
    nested: false,
    createElements: false,
    eventsPrefix: 'swiper',
    enabled: true,
    focusableElements: 'input, select, option, textarea, button, video, label',
    // Overrides
    width: null,
    height: null,
    //
    preventInteractionOnTransition: false,
    // ssr
    userAgent: null,
    url: null,
    // To support iOS's swipe-to-go-back gesture (when being used in-app).
    edgeSwipeDetection: false,
    edgeSwipeThreshold: 20,
    // Autoheight
    autoHeight: false,
    // Set wrapper width
    setWrapperSize: false,
    // Virtual Translate
    virtualTranslate: false,
    // Effects
    effect: 'slide',
    // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'

    // Breakpoints
    breakpoints: undefined,
    breakpointsBase: 'window',
    // Slides grid
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: false,
    centeredSlides: false,
    centeredSlidesBounds: false,
    slidesOffsetBefore: 0,
    // in px
    slidesOffsetAfter: 0,
    // in px
    normalizeSlideIndex: true,
    centerInsufficientSlides: false,
    // Disable swiper and hide navigation when container not overflow
    watchOverflow: true,
    // Round length
    roundLengths: false,
    // Touches
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: true,
    shortSwipes: true,
    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: true,
    allowTouchMove: true,
    threshold: 5,
    touchMoveStopPropagation: false,
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchReleaseOnEdges: false,
    // Unique Navigation Elements
    uniqueNavElements: true,
    // Resistance
    resistance: true,
    resistanceRatio: 0.85,
    // Progress
    watchSlidesProgress: false,
    // Cursor
    grabCursor: false,
    // Clicks
    preventClicks: true,
    preventClicksPropagation: true,
    slideToClickedSlide: false,
    // loop
    loop: false,
    loopAddBlankSlides: true,
    loopAdditionalSlides: 0,
    loopPreventsSliding: true,
    // rewind
    rewind: false,
    // Swiping/no swiping
    allowSlidePrev: true,
    allowSlideNext: true,
    swipeHandler: null,
    // '.swipe-handler',
    noSwiping: true,
    noSwipingClass: 'swiper-no-swiping',
    noSwipingSelector: null,
    // Passive Listeners
    passiveListeners: true,
    maxBackfaceHiddenSlides: 10,
    // NS
    containerModifierClass: 'swiper-',
    // NEW
    slideClass: 'swiper-slide',
    slideBlankClass: 'swiper-slide-blank',
    slideActiveClass: 'swiper-slide-active',
    slideVisibleClass: 'swiper-slide-visible',
    slideFullyVisibleClass: 'swiper-slide-fully-visible',
    slideNextClass: 'swiper-slide-next',
    slidePrevClass: 'swiper-slide-prev',
    wrapperClass: 'swiper-wrapper',
    lazyPreloaderClass: 'swiper-lazy-preloader',
    lazyPreloadPrevNext: 0,
    // Callbacks
    runCallbacksOnInit: true,
    // Internals
    _emitClasses: false
  };

  function moduleExtendParams(params, allModulesParams) {
    return function extendParams(obj) {
      if (obj === void 0) {
        obj = {};
      }
      const moduleParamName = Object.keys(obj)[0];
      const moduleParams = obj[moduleParamName];
      if (typeof moduleParams !== 'object' || moduleParams === null) {
        extend(allModulesParams, obj);
        return;
      }
      if (params[moduleParamName] === true) {
        params[moduleParamName] = {
          enabled: true
        };
      }
      if (moduleParamName === 'navigation' && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl) {
        params[moduleParamName].auto = true;
      }
      if (['pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el) {
        params[moduleParamName].auto = true;
      }
      if (!(moduleParamName in params && 'enabled' in moduleParams)) {
        extend(allModulesParams, obj);
        return;
      }
      if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
        params[moduleParamName].enabled = true;
      }
      if (!params[moduleParamName]) params[moduleParamName] = {
        enabled: false
      };
      extend(allModulesParams, obj);
    };
  }

  /* eslint no-param-reassign: "off" */
  const prototypes = {
    eventsEmitter,
    update,
    translate,
    transition,
    slide,
    loop,
    grabCursor,
    events: events$1,
    breakpoints,
    checkOverflow: checkOverflow$1,
    classes
  };
  const extendedDefaults = {};
  class Swiper {
    constructor() {
      let el;
      let params;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
        params = args[0];
      } else {
        [el, params] = args;
      }
      if (!params) params = {};
      params = extend({}, params);
      if (el && !params.el) params.el = el;
      const document = getDocument();
      if (params.el && typeof params.el === 'string' && document.querySelectorAll(params.el).length > 1) {
        const swipers = [];
        document.querySelectorAll(params.el).forEach(containerEl => {
          const newParams = extend({}, params, {
            el: containerEl
          });
          swipers.push(new Swiper(newParams));
        });
        // eslint-disable-next-line no-constructor-return
        return swipers;
      }

      // Swiper Instance
      const swiper = this;
      swiper.__swiper__ = true;
      swiper.support = getSupport();
      swiper.device = getDevice({
        userAgent: params.userAgent
      });
      swiper.browser = getBrowser();
      swiper.eventsListeners = {};
      swiper.eventsAnyListeners = [];
      swiper.modules = [...swiper.__modules__];
      if (params.modules && Array.isArray(params.modules)) {
        swiper.modules.push(...params.modules);
      }
      const allModulesParams = {};
      swiper.modules.forEach(mod => {
        mod({
          params,
          swiper,
          extendParams: moduleExtendParams(params, allModulesParams),
          on: swiper.on.bind(swiper),
          once: swiper.once.bind(swiper),
          off: swiper.off.bind(swiper),
          emit: swiper.emit.bind(swiper)
        });
      });

      // Extend defaults with modules params
      const swiperParams = extend({}, defaults, allModulesParams);

      // Extend defaults with passed params
      swiper.params = extend({}, swiperParams, extendedDefaults, params);
      swiper.originalParams = extend({}, swiper.params);
      swiper.passedParams = extend({}, params);

      // add event listeners
      if (swiper.params && swiper.params.on) {
        Object.keys(swiper.params.on).forEach(eventName => {
          swiper.on(eventName, swiper.params.on[eventName]);
        });
      }
      if (swiper.params && swiper.params.onAny) {
        swiper.onAny(swiper.params.onAny);
      }

      // Extend Swiper
      Object.assign(swiper, {
        enabled: swiper.params.enabled,
        el,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal() {
          return swiper.params.direction === 'horizontal';
        },
        isVertical() {
          return swiper.params.direction === 'vertical';
        },
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        //
        isBeginning: true,
        isEnd: false,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: false,
        cssOverflowAdjustment() {
          // Returns 0 unless `translate` is > 2**23
          // Should be subtracted from css values to prevent overflow
          return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
        },
        // Locks
        allowSlideNext: swiper.params.allowSlideNext,
        allowSlidePrev: swiper.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: undefined,
          isMoved: undefined,
          allowTouchCallbacks: undefined,
          touchStartTime: undefined,
          isScrolling: undefined,
          currentTranslate: undefined,
          startTranslate: undefined,
          allowThresholdMove: undefined,
          // Form elements to match
          focusableElements: swiper.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: undefined,
          // Velocities
          velocities: [],
          allowMomentumBounce: undefined,
          startMoving: undefined,
          pointerId: null,
          touchId: null
        },
        // Clicks
        allowClick: true,
        // Touches
        allowTouchMove: swiper.params.allowTouchMove,
        touches: {
          startX: 0,
          startY: 0,
          currentX: 0,
          currentY: 0,
          diff: 0
        },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0
      });
      swiper.emit('_swiper');

      // Init
      if (swiper.params.init) {
        swiper.init();
      }

      // Return app instance
      // eslint-disable-next-line no-constructor-return
      return swiper;
    }
    getDirectionLabel(property) {
      if (this.isHorizontal()) {
        return property;
      }
      // prettier-ignore
      return {
        'width': 'height',
        'margin-top': 'margin-left',
        'margin-bottom ': 'margin-right',
        'margin-left': 'margin-top',
        'margin-right': 'margin-bottom',
        'padding-left': 'padding-top',
        'padding-right': 'padding-bottom',
        'marginRight': 'marginBottom'
      }[property];
    }
    getSlideIndex(slideEl) {
      const {
        slidesEl,
        params
      } = this;
      const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
      const firstSlideIndex = elementIndex(slides[0]);
      return elementIndex(slideEl) - firstSlideIndex;
    }
    getSlideIndexByData(index) {
      return this.getSlideIndex(this.slides.find(slideEl => slideEl.getAttribute('data-swiper-slide-index') * 1 === index));
    }
    recalcSlides() {
      const swiper = this;
      const {
        slidesEl,
        params
      } = swiper;
      swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    }
    enable() {
      const swiper = this;
      if (swiper.enabled) return;
      swiper.enabled = true;
      if (swiper.params.grabCursor) {
        swiper.setGrabCursor();
      }
      swiper.emit('enable');
    }
    disable() {
      const swiper = this;
      if (!swiper.enabled) return;
      swiper.enabled = false;
      if (swiper.params.grabCursor) {
        swiper.unsetGrabCursor();
      }
      swiper.emit('disable');
    }
    setProgress(progress, speed) {
      const swiper = this;
      progress = Math.min(Math.max(progress, 0), 1);
      const min = swiper.minTranslate();
      const max = swiper.maxTranslate();
      const current = (max - min) * progress + min;
      swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    emitContainerClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const cls = swiper.el.className.split(' ').filter(className => {
        return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
      });
      swiper.emit('_containerClasses', cls.join(' '));
    }
    getSlideClasses(slideEl) {
      const swiper = this;
      if (swiper.destroyed) return '';
      return slideEl.className.split(' ').filter(className => {
        return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
      }).join(' ');
    }
    emitSlidesClasses() {
      const swiper = this;
      if (!swiper.params._emitClasses || !swiper.el) return;
      const updates = [];
      swiper.slides.forEach(slideEl => {
        const classNames = swiper.getSlideClasses(slideEl);
        updates.push({
          slideEl,
          classNames
        });
        swiper.emit('_slideClass', slideEl, classNames);
      });
      swiper.emit('_slideClasses', updates);
    }
    slidesPerViewDynamic(view, exact) {
      if (view === void 0) {
        view = 'current';
      }
      if (exact === void 0) {
        exact = false;
      }
      const swiper = this;
      const {
        params,
        slides,
        slidesGrid,
        slidesSizesGrid,
        size: swiperSize,
        activeIndex
      } = swiper;
      let spv = 1;
      if (typeof params.slidesPerView === 'number') return params.slidesPerView;
      if (params.centeredSlides) {
        let slideSize = slides[activeIndex] ? Math.ceil(slides[activeIndex].swiperSlideSize) : 0;
        let breakLoop;
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          if (slides[i] && !breakLoop) {
            slideSize += Math.ceil(slides[i].swiperSlideSize);
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          if (slides[i] && !breakLoop) {
            slideSize += slides[i].swiperSlideSize;
            spv += 1;
            if (slideSize > swiperSize) breakLoop = true;
          }
        }
      } else {
        // eslint-disable-next-line
        if (view === 'current') {
          for (let i = activeIndex + 1; i < slides.length; i += 1) {
            const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        } else {
          // previous
          for (let i = activeIndex - 1; i >= 0; i -= 1) {
            const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
            if (slideInView) {
              spv += 1;
            }
          }
        }
      }
      return spv;
    }
    update() {
      const swiper = this;
      if (!swiper || swiper.destroyed) return;
      const {
        snapGrid,
        params
      } = swiper;
      // Breakpoints
      if (params.breakpoints) {
        swiper.setBreakpoint();
      }
      [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach(imageEl => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        }
      });
      swiper.updateSize();
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();
      function setTranslate() {
        const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
        const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
        swiper.setTranslate(newTranslate);
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
      let translated;
      if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
        setTranslate();
        if (params.autoHeight) {
          swiper.updateAutoHeight();
        }
      } else {
        if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
          const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
          translated = swiper.slideTo(slides.length - 1, 0, false, true);
        } else {
          translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
        }
        if (!translated) {
          setTranslate();
        }
      }
      if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
        swiper.checkOverflow();
      }
      swiper.emit('update');
    }
    changeDirection(newDirection, needUpdate) {
      if (needUpdate === void 0) {
        needUpdate = true;
      }
      const swiper = this;
      const currentDirection = swiper.params.direction;
      if (!newDirection) {
        // eslint-disable-next-line
        newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
      }
      if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
        return swiper;
      }
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
      swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
      swiper.emitContainerClasses();
      swiper.params.direction = newDirection;
      swiper.slides.forEach(slideEl => {
        if (newDirection === 'vertical') {
          slideEl.style.width = '';
        } else {
          slideEl.style.height = '';
        }
      });
      swiper.emit('changeDirection');
      if (needUpdate) swiper.update();
      return swiper;
    }
    changeLanguageDirection(direction) {
      const swiper = this;
      if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
      swiper.rtl = direction === 'rtl';
      swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;
      if (swiper.rtl) {
        swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = 'rtl';
      } else {
        swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
        swiper.el.dir = 'ltr';
      }
      swiper.update();
    }
    mount(element) {
      const swiper = this;
      if (swiper.mounted) return true;

      // Find el
      let el = element || swiper.params.el;
      if (typeof el === 'string') {
        el = document.querySelector(el);
      }
      if (!el) {
        return false;
      }
      el.swiper = swiper;
      if (el.parentNode && el.parentNode.host && el.parentNode.host.nodeName === swiper.params.swiperElementNodeName.toUpperCase()) {
        swiper.isElement = true;
      }
      const getWrapperSelector = () => {
        return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
      };
      const getWrapper = () => {
        if (el && el.shadowRoot && el.shadowRoot.querySelector) {
          const res = el.shadowRoot.querySelector(getWrapperSelector());
          // Children needs to return slot items
          return res;
        }
        return elementChildren(el, getWrapperSelector())[0];
      };
      // Find Wrapper
      let wrapperEl = getWrapper();
      if (!wrapperEl && swiper.params.createElements) {
        wrapperEl = createElement('div', swiper.params.wrapperClass);
        el.append(wrapperEl);
        elementChildren(el, `.${swiper.params.slideClass}`).forEach(slideEl => {
          wrapperEl.append(slideEl);
        });
      }
      Object.assign(swiper, {
        el,
        wrapperEl,
        slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
        hostEl: swiper.isElement ? el.parentNode.host : el,
        mounted: true,
        // RTL
        rtl: el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl',
        rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || elementStyle(el, 'direction') === 'rtl'),
        wrongRTL: elementStyle(wrapperEl, 'display') === '-webkit-box'
      });
      return true;
    }
    init(el) {
      const swiper = this;
      if (swiper.initialized) return swiper;
      const mounted = swiper.mount(el);
      if (mounted === false) return swiper;
      swiper.emit('beforeInit');

      // Set breakpoint
      if (swiper.params.breakpoints) {
        swiper.setBreakpoint();
      }

      // Add Classes
      swiper.addClasses();

      // Update size
      swiper.updateSize();

      // Update slides
      swiper.updateSlides();
      if (swiper.params.watchOverflow) {
        swiper.checkOverflow();
      }

      // Set Grab Cursor
      if (swiper.params.grabCursor && swiper.enabled) {
        swiper.setGrabCursor();
      }

      // Slide To Initial Slide
      if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
        swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
      } else {
        swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
      }

      // Create loop
      if (swiper.params.loop) {
        swiper.loopCreate(undefined, true);
      }

      // Attach events
      swiper.attachEvents();
      const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
      if (swiper.isElement) {
        lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
      }
      lazyElements.forEach(imageEl => {
        if (imageEl.complete) {
          processLazyPreloader(swiper, imageEl);
        } else {
          imageEl.addEventListener('load', e => {
            processLazyPreloader(swiper, e.target);
          });
        }
      });
      preload(swiper);

      // Init Flag
      swiper.initialized = true;
      preload(swiper);

      // Emit
      swiper.emit('init');
      swiper.emit('afterInit');
      return swiper;
    }
    destroy(deleteInstance, cleanStyles) {
      if (deleteInstance === void 0) {
        deleteInstance = true;
      }
      if (cleanStyles === void 0) {
        cleanStyles = true;
      }
      const swiper = this;
      const {
        params,
        el,
        wrapperEl,
        slides
      } = swiper;
      if (typeof swiper.params === 'undefined' || swiper.destroyed) {
        return null;
      }
      swiper.emit('beforeDestroy');

      // Init Flag
      swiper.initialized = false;

      // Detach events
      swiper.detachEvents();

      // Destroy loop
      if (params.loop) {
        swiper.loopDestroy();
      }

      // Cleanup styles
      if (cleanStyles) {
        swiper.removeClasses();
        if (el && typeof el !== 'string') {
          el.removeAttribute('style');
        }
        if (wrapperEl) {
          wrapperEl.removeAttribute('style');
        }
        if (slides && slides.length) {
          slides.forEach(slideEl => {
            slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            slideEl.removeAttribute('style');
            slideEl.removeAttribute('data-swiper-slide-index');
          });
        }
      }
      swiper.emit('destroy');

      // Detach emitter events
      Object.keys(swiper.eventsListeners).forEach(eventName => {
        swiper.off(eventName);
      });
      if (deleteInstance !== false) {
        if (swiper.el && typeof swiper.el !== 'string') {
          swiper.el.swiper = null;
        }
        deleteProps(swiper);
      }
      swiper.destroyed = true;
      return null;
    }
    static extendDefaults(newDefaults) {
      extend(extendedDefaults, newDefaults);
    }
    static get extendedDefaults() {
      return extendedDefaults;
    }
    static get defaults() {
      return defaults;
    }
    static installModule(mod) {
      if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
      const modules = Swiper.prototype.__modules__;
      if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
        modules.push(mod);
      }
    }
    static use(module) {
      if (Array.isArray(module)) {
        module.forEach(m => Swiper.installModule(m));
        return Swiper;
      }
      Swiper.installModule(module);
      return Swiper;
    }
  }
  Object.keys(prototypes).forEach(prototypeGroup => {
    Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
      Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
    });
  });
  Swiper.use([Resize, Observer]);

  function Virtual(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    extendParams({
      virtual: {
        enabled: false,
        slides: [],
        cache: true,
        renderSlide: null,
        renderExternal: null,
        renderExternalUpdate: true,
        addSlidesBefore: 0,
        addSlidesAfter: 0
      }
    });
    let cssModeTimeout;
    const document = getDocument();
    swiper.virtual = {
      cache: {},
      from: undefined,
      to: undefined,
      slides: [],
      offset: 0,
      slidesGrid: []
    };
    const tempDOM = document.createElement('div');
    function renderSlide(slide, index) {
      const params = swiper.params.virtual;
      if (params.cache && swiper.virtual.cache[index]) {
        return swiper.virtual.cache[index];
      }
      // eslint-disable-next-line
      let slideEl;
      if (params.renderSlide) {
        slideEl = params.renderSlide.call(swiper, slide, index);
        if (typeof slideEl === 'string') {
          tempDOM.innerHTML = slideEl;
          slideEl = tempDOM.children[0];
        }
      } else if (swiper.isElement) {
        slideEl = createElement('swiper-slide');
      } else {
        slideEl = createElement('div', swiper.params.slideClass);
      }
      slideEl.setAttribute('data-swiper-slide-index', index);
      if (!params.renderSlide) {
        slideEl.innerHTML = slide;
      }
      if (params.cache) {
        swiper.virtual.cache[index] = slideEl;
      }
      return slideEl;
    }
    function update(force, beforeInit, forceActiveIndex) {
      const {
        slidesPerView,
        slidesPerGroup,
        centeredSlides,
        loop: isLoop,
        initialSlide
      } = swiper.params;
      if (beforeInit && !isLoop && initialSlide > 0) {
        return;
      }
      const {
        addSlidesBefore,
        addSlidesAfter
      } = swiper.params.virtual;
      const {
        from: previousFrom,
        to: previousTo,
        slides,
        slidesGrid: previousSlidesGrid,
        offset: previousOffset
      } = swiper.virtual;
      if (!swiper.params.cssMode) {
        swiper.updateActiveIndex();
      }
      const activeIndex = typeof forceActiveIndex === 'undefined' ? swiper.activeIndex || 0 : forceActiveIndex;
      let offsetProp;
      if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
      let slidesAfter;
      let slidesBefore;
      if (centeredSlides) {
        slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
        slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
      } else {
        slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
        slidesBefore = (isLoop ? slidesPerView : slidesPerGroup) + addSlidesBefore;
      }
      let from = activeIndex - slidesBefore;
      let to = activeIndex + slidesAfter;
      if (!isLoop) {
        from = Math.max(from, 0);
        to = Math.min(to, slides.length - 1);
      }
      let offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
      if (isLoop && activeIndex >= slidesBefore) {
        from -= slidesBefore;
        if (!centeredSlides) offset += swiper.slidesGrid[0];
      } else if (isLoop && activeIndex < slidesBefore) {
        from = -slidesBefore;
        if (centeredSlides) offset += swiper.slidesGrid[0];
      }
      Object.assign(swiper.virtual, {
        from,
        to,
        offset,
        slidesGrid: swiper.slidesGrid,
        slidesBefore,
        slidesAfter
      });
      function onRendered() {
        swiper.updateSlides();
        swiper.updateProgress();
        swiper.updateSlidesClasses();
        emit('virtualUpdate');
      }
      if (previousFrom === from && previousTo === to && !force) {
        if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
          swiper.slides.forEach(slideEl => {
            slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
          });
        }
        swiper.updateProgress();
        emit('virtualUpdate');
        return;
      }
      if (swiper.params.virtual.renderExternal) {
        swiper.params.virtual.renderExternal.call(swiper, {
          offset,
          from,
          to,
          slides: function getSlides() {
            const slidesToRender = [];
            for (let i = from; i <= to; i += 1) {
              slidesToRender.push(slides[i]);
            }
            return slidesToRender;
          }()
        });
        if (swiper.params.virtual.renderExternalUpdate) {
          onRendered();
        } else {
          emit('virtualUpdate');
        }
        return;
      }
      const prependIndexes = [];
      const appendIndexes = [];
      const getSlideIndex = index => {
        let slideIndex = index;
        if (index < 0) {
          slideIndex = slides.length + index;
        } else if (slideIndex >= slides.length) {
          // eslint-disable-next-line
          slideIndex = slideIndex - slides.length;
        }
        return slideIndex;
      };
      if (force) {
        swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`)).forEach(slideEl => {
          slideEl.remove();
        });
      } else {
        for (let i = previousFrom; i <= previousTo; i += 1) {
          if (i < from || i > to) {
            const slideIndex = getSlideIndex(i);
            swiper.slides.filter(el => el.matches(`.${swiper.params.slideClass}[data-swiper-slide-index="${slideIndex}"], swiper-slide[data-swiper-slide-index="${slideIndex}"]`)).forEach(slideEl => {
              slideEl.remove();
            });
          }
        }
      }
      const loopFrom = isLoop ? -slides.length : 0;
      const loopTo = isLoop ? slides.length * 2 : slides.length;
      for (let i = loopFrom; i < loopTo; i += 1) {
        if (i >= from && i <= to) {
          const slideIndex = getSlideIndex(i);
          if (typeof previousTo === 'undefined' || force) {
            appendIndexes.push(slideIndex);
          } else {
            if (i > previousTo) appendIndexes.push(slideIndex);
            if (i < previousFrom) prependIndexes.push(slideIndex);
          }
        }
      }
      appendIndexes.forEach(index => {
        swiper.slidesEl.append(renderSlide(slides[index], index));
      });
      if (isLoop) {
        for (let i = prependIndexes.length - 1; i >= 0; i -= 1) {
          const index = prependIndexes[i];
          swiper.slidesEl.prepend(renderSlide(slides[index], index));
        }
      } else {
        prependIndexes.sort((a, b) => b - a);
        prependIndexes.forEach(index => {
          swiper.slidesEl.prepend(renderSlide(slides[index], index));
        });
      }
      elementChildren(swiper.slidesEl, '.swiper-slide, swiper-slide').forEach(slideEl => {
        slideEl.style[offsetProp] = `${offset - Math.abs(swiper.cssOverflowAdjustment())}px`;
      });
      onRendered();
    }
    function appendSlide(slides) {
      if (typeof slides === 'object' && 'length' in slides) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) swiper.virtual.slides.push(slides[i]);
        }
      } else {
        swiper.virtual.slides.push(slides);
      }
      update(true);
    }
    function prependSlide(slides) {
      const activeIndex = swiper.activeIndex;
      let newActiveIndex = activeIndex + 1;
      let numberOfNewSlides = 1;
      if (Array.isArray(slides)) {
        for (let i = 0; i < slides.length; i += 1) {
          if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
        }
        newActiveIndex = activeIndex + slides.length;
        numberOfNewSlides = slides.length;
      } else {
        swiper.virtual.slides.unshift(slides);
      }
      if (swiper.params.virtual.cache) {
        const cache = swiper.virtual.cache;
        const newCache = {};
        Object.keys(cache).forEach(cachedIndex => {
          const cachedEl = cache[cachedIndex];
          const cachedElIndex = cachedEl.getAttribute('data-swiper-slide-index');
          if (cachedElIndex) {
            cachedEl.setAttribute('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
          }
          newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = cachedEl;
        });
        swiper.virtual.cache = newCache;
      }
      update(true);
      swiper.slideTo(newActiveIndex, 0);
    }
    function removeSlide(slidesIndexes) {
      if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
      let activeIndex = swiper.activeIndex;
      if (Array.isArray(slidesIndexes)) {
        for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
          if (swiper.params.virtual.cache) {
            delete swiper.virtual.cache[slidesIndexes[i]];
            // shift cache indexes
            Object.keys(swiper.virtual.cache).forEach(key => {
              if (key > slidesIndexes) {
                swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
                swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
                delete swiper.virtual.cache[key];
              }
            });
          }
          swiper.virtual.slides.splice(slidesIndexes[i], 1);
          if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
          activeIndex = Math.max(activeIndex, 0);
        }
      } else {
        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes];
          // shift cache indexes
          Object.keys(swiper.virtual.cache).forEach(key => {
            if (key > slidesIndexes) {
              swiper.virtual.cache[key - 1] = swiper.virtual.cache[key];
              swiper.virtual.cache[key - 1].setAttribute('data-swiper-slide-index', key - 1);
              delete swiper.virtual.cache[key];
            }
          });
        }
        swiper.virtual.slides.splice(slidesIndexes, 1);
        if (slidesIndexes < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
      update(true);
      swiper.slideTo(activeIndex, 0);
    }
    function removeAllSlides() {
      swiper.virtual.slides = [];
      if (swiper.params.virtual.cache) {
        swiper.virtual.cache = {};
      }
      update(true);
      swiper.slideTo(0, 0);
    }
    on('beforeInit', () => {
      if (!swiper.params.virtual.enabled) return;
      let domSlidesAssigned;
      if (typeof swiper.passedParams.virtual.slides === 'undefined') {
        const slides = [...swiper.slidesEl.children].filter(el => el.matches(`.${swiper.params.slideClass}, swiper-slide`));
        if (slides && slides.length) {
          swiper.virtual.slides = [...slides];
          domSlidesAssigned = true;
          slides.forEach((slideEl, slideIndex) => {
            slideEl.setAttribute('data-swiper-slide-index', slideIndex);
            swiper.virtual.cache[slideIndex] = slideEl;
            slideEl.remove();
          });
        }
      }
      if (!domSlidesAssigned) {
        swiper.virtual.slides = swiper.params.virtual.slides;
      }
      swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
      update(false, true);
    });
    on('setTranslate', () => {
      if (!swiper.params.virtual.enabled) return;
      if (swiper.params.cssMode && !swiper._immediateVirtual) {
        clearTimeout(cssModeTimeout);
        cssModeTimeout = setTimeout(() => {
          update();
        }, 100);
      } else {
        update();
      }
    });
    on('init update resize', () => {
      if (!swiper.params.virtual.enabled) return;
      if (swiper.params.cssMode) {
        setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
      }
    });
    Object.assign(swiper.virtual, {
      appendSlide,
      prependSlide,
      removeSlide,
      removeAllSlides,
      update
    });
  }

  /* eslint-disable consistent-return */
  function Keyboard(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const document = getDocument();
    const window = getWindow();
    swiper.keyboard = {
      enabled: false
    };
    extendParams({
      keyboard: {
        enabled: false,
        onlyInViewport: true,
        pageUpDown: true
      }
    });
    function handle(event) {
      if (!swiper.enabled) return;
      const {
        rtlTranslate: rtl
      } = swiper;
      let e = event;
      if (e.originalEvent) e = e.originalEvent; // jquery fix
      const kc = e.keyCode || e.charCode;
      const pageUpDown = swiper.params.keyboard.pageUpDown;
      const isPageUp = pageUpDown && kc === 33;
      const isPageDown = pageUpDown && kc === 34;
      const isArrowLeft = kc === 37;
      const isArrowRight = kc === 39;
      const isArrowUp = kc === 38;
      const isArrowDown = kc === 40;
      // Directions locks
      if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
        return false;
      }
      if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
        return false;
      }
      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        return undefined;
      }
      if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
        return undefined;
      }
      if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
        let inView = false;
        // Check that swiper should be inside of visible area of window
        if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
          return undefined;
        }
        const el = swiper.el;
        const swiperWidth = el.clientWidth;
        const swiperHeight = el.clientHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const swiperOffset = elementOffset(el);
        if (rtl) swiperOffset.left -= el.scrollLeft;
        const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
        for (let i = 0; i < swiperCoord.length; i += 1) {
          const point = swiperCoord[i];
          if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line
            inView = true;
          }
        }
        if (!inView) return undefined;
      }
      if (swiper.isHorizontal()) {
        if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
          if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        }
        if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
        if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
      } else {
        if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
          if (e.preventDefault) e.preventDefault();else e.returnValue = false;
        }
        if (isPageDown || isArrowDown) swiper.slideNext();
        if (isPageUp || isArrowUp) swiper.slidePrev();
      }
      emit('keyPress', kc);
      return undefined;
    }
    function enable() {
      if (swiper.keyboard.enabled) return;
      document.addEventListener('keydown', handle);
      swiper.keyboard.enabled = true;
    }
    function disable() {
      if (!swiper.keyboard.enabled) return;
      document.removeEventListener('keydown', handle);
      swiper.keyboard.enabled = false;
    }
    on('init', () => {
      if (swiper.params.keyboard.enabled) {
        enable();
      }
    });
    on('destroy', () => {
      if (swiper.keyboard.enabled) {
        disable();
      }
    });
    Object.assign(swiper.keyboard, {
      enable,
      disable
    });
  }

  /* eslint-disable consistent-return */
  function Mousewheel(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const window = getWindow();
    extendParams({
      mousewheel: {
        enabled: false,
        releaseOnEdges: false,
        invert: false,
        forceToAxis: false,
        sensitivity: 1,
        eventsTarget: 'container',
        thresholdDelta: null,
        thresholdTime: null,
        noMousewheelClass: 'swiper-no-mousewheel'
      }
    });
    swiper.mousewheel = {
      enabled: false
    };
    let timeout;
    let lastScrollTime = now();
    let lastEventBeforeSnap;
    const recentWheelEvents = [];
    function normalize(e) {
      // Reasonable defaults
      const PIXEL_STEP = 10;
      const LINE_HEIGHT = 40;
      const PAGE_HEIGHT = 800;
      let sX = 0;
      let sY = 0; // spinX, spinY
      let pX = 0;
      let pY = 0; // pixelX, pixelY

      // Legacy
      if ('detail' in e) {
        sY = e.detail;
      }
      if ('wheelDelta' in e) {
        sY = -e.wheelDelta / 120;
      }
      if ('wheelDeltaY' in e) {
        sY = -e.wheelDeltaY / 120;
      }
      if ('wheelDeltaX' in e) {
        sX = -e.wheelDeltaX / 120;
      }

      // side scrolling on FF with DOMMouseScroll
      if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
      }
      pX = sX * PIXEL_STEP;
      pY = sY * PIXEL_STEP;
      if ('deltaY' in e) {
        pY = e.deltaY;
      }
      if ('deltaX' in e) {
        pX = e.deltaX;
      }
      if (e.shiftKey && !pX) {
        // if user scrolls with shift he wants horizontal scroll
        pX = pY;
        pY = 0;
      }
      if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode === 1) {
          // delta in LINE units
          pX *= LINE_HEIGHT;
          pY *= LINE_HEIGHT;
        } else {
          // delta in PAGE units
          pX *= PAGE_HEIGHT;
          pY *= PAGE_HEIGHT;
        }
      }

      // Fall-back if spin cannot be determined
      if (pX && !sX) {
        sX = pX < 1 ? -1 : 1;
      }
      if (pY && !sY) {
        sY = pY < 1 ? -1 : 1;
      }
      return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
      };
    }
    function handleMouseEnter() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = true;
    }
    function handleMouseLeave() {
      if (!swiper.enabled) return;
      swiper.mouseEntered = false;
    }
    function animateSlider(newEvent) {
      if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
        // Prevent if delta of wheel scroll delta is below configured threshold
        return false;
      }
      if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
        // Prevent if time between scrolls is below configured threshold
        return false;
      }

      // If the movement is NOT big enough and
      // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
      //   Don't go any further (avoid insignificant scroll movement).
      if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
        // Return false as a default
        return true;
      }
      // If user is scrolling towards the end:
      //   If the slider hasn't hit the latest slide or
      //   if the slider is a loop and
      //   if the slider isn't moving right now:
      //     Go to next slide and
      //     emit a scroll event.
      // Else (the user is scrolling towards the beginning) and
      // if the slider hasn't hit the first slide or
      // if the slider is a loop and
      // if the slider isn't moving right now:
      //   Go to prev slide and
      //   emit a scroll event.
      if (newEvent.direction < 0) {
        if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
          swiper.slideNext();
          emit('scroll', newEvent.raw);
        }
      } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
        swiper.slidePrev();
        emit('scroll', newEvent.raw);
      }
      // If you got here is because an animation has been triggered so store the current time
      lastScrollTime = new window.Date().getTime();
      // Return false as a default
      return false;
    }
    function releaseScroll(newEvent) {
      const params = swiper.params.mousewheel;
      if (newEvent.direction < 0) {
        if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
          // Return true to animate scroll on edges
          return true;
        }
      } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
      return false;
    }
    function handle(event) {
      let e = event;
      let disableParentSwiper = true;
      if (!swiper.enabled) return;

      // Ignore event if the target or its parents have the swiper-no-mousewheel class
      if (event.target.closest(`.${swiper.params.mousewheel.noMousewheelClass}`)) return;
      const params = swiper.params.mousewheel;
      if (swiper.params.cssMode) {
        e.preventDefault();
      }
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== 'container') {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      const targetElContainsTarget = targetEl && targetEl.contains(e.target);
      if (!swiper.mouseEntered && !targetElContainsTarget && !params.releaseOnEdges) return true;
      if (e.originalEvent) e = e.originalEvent; // jquery fix
      let delta = 0;
      const rtlFactor = swiper.rtlTranslate ? -1 : 1;
      const data = normalize(e);
      if (params.forceToAxis) {
        if (swiper.isHorizontal()) {
          if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
        } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
      } else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
      }
      if (delta === 0) return true;
      if (params.invert) delta = -delta;

      // Get the scroll positions
      let positions = swiper.getTranslate() + delta * params.sensitivity;
      if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
      if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate();

      // When loop is true:
      //     the disableParentSwiper will be true.
      // When loop is false:
      //     if the scroll positions is not on edge,
      //     then the disableParentSwiper will be true.
      //     if the scroll on edge positions,
      //     then the disableParentSwiper will be false.
      disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
      if (disableParentSwiper && swiper.params.nested) e.stopPropagation();
      if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
        // Register the new event in a variable which stores the relevant data
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta),
          raw: event
        };

        // Keep the most recent events
        if (recentWheelEvents.length >= 2) {
          recentWheelEvents.shift(); // only store the last N events
        }

        const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
        recentWheelEvents.push(newEvent);

        // If there is at least one previous recorded event:
        //   If direction has changed or
        //   if the scroll is quicker than the previous one:
        //     Animate the slider.
        // Else (this is the first time the wheel is moved):
        //     Animate the slider.
        if (prevEvent) {
          if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
            animateSlider(newEvent);
          }
        } else {
          animateSlider(newEvent);
        }

        // If it's time to release the scroll:
        //   Return now so you don't hit the preventDefault.
        if (releaseScroll(newEvent)) {
          return true;
        }
      } else {
        // Freemode or scrollContainer:

        // If we recently snapped after a momentum scroll, then ignore wheel events
        // to give time for the deceleration to finish. Stop ignoring after 500 msecs
        // or if it's a new scroll (larger delta or inverse sign as last event before
        // an end-of-momentum snap).
        const newEvent = {
          time: now(),
          delta: Math.abs(delta),
          direction: Math.sign(delta)
        };
        const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;
        if (!ignoreWheelEvents) {
          lastEventBeforeSnap = undefined;
          let position = swiper.getTranslate() + delta * params.sensitivity;
          const wasBeginning = swiper.isBeginning;
          const wasEnd = swiper.isEnd;
          if (position >= swiper.minTranslate()) position = swiper.minTranslate();
          if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
          swiper.setTransition(0);
          swiper.setTranslate(position);
          swiper.updateProgress();
          swiper.updateActiveIndex();
          swiper.updateSlidesClasses();
          if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
            swiper.updateSlidesClasses();
          }
          if (swiper.params.loop) {
            swiper.loopFix({
              direction: newEvent.direction < 0 ? 'next' : 'prev',
              byMousewheel: true
            });
          }
          if (swiper.params.freeMode.sticky) {
            // When wheel scrolling starts with sticky (aka snap) enabled, then detect
            // the end of a momentum scroll by storing recent (N=15?) wheel events.
            // 1. do all N events have decreasing or same (absolute value) delta?
            // 2. did all N events arrive in the last M (M=500?) msecs?
            // 3. does the earliest event have an (absolute value) delta that's
            //    at least P (P=1?) larger than the most recent event's delta?
            // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
            // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
            // Snap immediately and ignore remaining wheel events in this scroll.
            // See comment above for "remaining wheel events in this scroll" determination.
            // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
            clearTimeout(timeout);
            timeout = undefined;
            if (recentWheelEvents.length >= 15) {
              recentWheelEvents.shift(); // only store the last N events
            }

            const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
            const firstEvent = recentWheelEvents[0];
            recentWheelEvents.push(newEvent);
            if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
              // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
              recentWheelEvents.splice(0);
            } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
              // We're at the end of the deceleration of a momentum scroll, so there's no need
              // to wait for more events. Snap ASAP on the next tick.
              // Also, because there's some remaining momentum we'll bias the snap in the
              // direction of the ongoing scroll because it's better UX for the scroll to snap
              // in the same direction as the scroll instead of reversing to snap.  Therefore,
              // if it's already scrolled more than 20% in the current direction, keep going.
              const snapToThreshold = delta > 0 ? 0.8 : 0.2;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              timeout = nextTick(() => {
                if (swiper.destroyed || !swiper.params) return;
                swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 0); // no delay; move on next tick
            }

            if (!timeout) {
              // if we get here, then we haven't detected the end of a momentum scroll, so
              // we'll consider a scroll "complete" when there haven't been any wheel events
              // for 500ms.
              timeout = nextTick(() => {
                if (swiper.destroyed || !swiper.params) return;
                const snapToThreshold = 0.5;
                lastEventBeforeSnap = newEvent;
                recentWheelEvents.splice(0);
                swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
              }, 500);
            }
          }

          // Emit event
          if (!ignoreWheelEvents) emit('scroll', e);

          // Stop autoplay
          if (swiper.params.autoplay && swiper.params.autoplay.disableOnInteraction) swiper.autoplay.stop();
          // Return page scroll on edge positions
          if (params.releaseOnEdges && (position === swiper.minTranslate() || position === swiper.maxTranslate())) {
            return true;
          }
        }
      }
      if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      return false;
    }
    function events(method) {
      let targetEl = swiper.el;
      if (swiper.params.mousewheel.eventsTarget !== 'container') {
        targetEl = document.querySelector(swiper.params.mousewheel.eventsTarget);
      }
      targetEl[method]('mouseenter', handleMouseEnter);
      targetEl[method]('mouseleave', handleMouseLeave);
      targetEl[method]('wheel', handle);
    }
    function enable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.removeEventListener('wheel', handle);
        return true;
      }
      if (swiper.mousewheel.enabled) return false;
      events('addEventListener');
      swiper.mousewheel.enabled = true;
      return true;
    }
    function disable() {
      if (swiper.params.cssMode) {
        swiper.wrapperEl.addEventListener(event, handle);
        return true;
      }
      if (!swiper.mousewheel.enabled) return false;
      events('removeEventListener');
      swiper.mousewheel.enabled = false;
      return true;
    }
    on('init', () => {
      if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
        disable();
      }
      if (swiper.params.mousewheel.enabled) enable();
    });
    on('destroy', () => {
      if (swiper.params.cssMode) {
        enable();
      }
      if (swiper.mousewheel.enabled) disable();
    });
    Object.assign(swiper.mousewheel, {
      enable,
      disable
    });
  }

  function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
    if (swiper.params.createElements) {
      Object.keys(checkProps).forEach(key => {
        if (!params[key] && params.auto === true) {
          let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
          if (!element) {
            element = createElement('div', checkProps[key]);
            element.className = checkProps[key];
            swiper.el.append(element);
          }
          params[key] = element;
          originalParams[key] = element;
        }
      });
    }
    return params;
  }

  function Navigation(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    extendParams({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: false,
        disabledClass: 'swiper-button-disabled',
        hiddenClass: 'swiper-button-hidden',
        lockClass: 'swiper-button-lock',
        navigationDisabledClass: 'swiper-navigation-disabled'
      }
    });
    swiper.navigation = {
      nextEl: null,
      prevEl: null
    };
    function getEl(el) {
      let res;
      if (el && typeof el === 'string' && swiper.isElement) {
        res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
        if (res) return res;
      }
      if (el) {
        if (typeof el === 'string') res = [...document.querySelectorAll(el)];
        if (swiper.params.uniqueNavElements && typeof el === 'string' && res && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
          res = swiper.el.querySelector(el);
        } else if (res && res.length === 1) {
          res = res[0];
        }
      }
      if (el && !res) return el;
      // if (Array.isArray(res) && res.length === 1) res = res[0];
      return res;
    }
    function toggleEl(el, disabled) {
      const params = swiper.params.navigation;
      el = makeElementsArray(el);
      el.forEach(subEl => {
        if (subEl) {
          subEl.classList[disabled ? 'add' : 'remove'](...params.disabledClass.split(' '));
          if (subEl.tagName === 'BUTTON') subEl.disabled = disabled;
          if (swiper.params.watchOverflow && swiper.enabled) {
            subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
          }
        }
      });
    }
    function update() {
      // Update Navigation Buttons
      const {
        nextEl,
        prevEl
      } = swiper.navigation;
      if (swiper.params.loop) {
        toggleEl(prevEl, false);
        toggleEl(nextEl, false);
        return;
      }
      toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
      toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
    }
    function onPrevClick(e) {
      e.preventDefault();
      if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
      swiper.slidePrev();
      emit('navigationPrev');
    }
    function onNextClick(e) {
      e.preventDefault();
      if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
      swiper.slideNext();
      emit('navigationNext');
    }
    function init() {
      const params = swiper.params.navigation;
      swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
        nextEl: 'swiper-button-next',
        prevEl: 'swiper-button-prev'
      });
      if (!(params.nextEl || params.prevEl)) return;
      let nextEl = getEl(params.nextEl);
      let prevEl = getEl(params.prevEl);
      Object.assign(swiper.navigation, {
        nextEl,
        prevEl
      });
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const initButton = (el, dir) => {
        if (el) {
          el.addEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
        }
        if (!swiper.enabled && el) {
          el.classList.add(...params.lockClass.split(' '));
        }
      };
      nextEl.forEach(el => initButton(el, 'next'));
      prevEl.forEach(el => initButton(el, 'prev'));
    }
    function destroy() {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const destroyButton = (el, dir) => {
        el.removeEventListener('click', dir === 'next' ? onNextClick : onPrevClick);
        el.classList.remove(...swiper.params.navigation.disabledClass.split(' '));
      };
      nextEl.forEach(el => destroyButton(el, 'next'));
      prevEl.forEach(el => destroyButton(el, 'prev'));
    }
    on('init', () => {
      if (swiper.params.navigation.enabled === false) {
        // eslint-disable-next-line
        disable();
      } else {
        init();
        update();
      }
    });
    on('toEdge fromEdge lock unlock', () => {
      update();
    });
    on('destroy', () => {
      destroy();
    });
    on('enable disable', () => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      if (swiper.enabled) {
        update();
        return;
      }
      [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.add(swiper.params.navigation.lockClass));
    });
    on('click', (_s, e) => {
      let {
        nextEl,
        prevEl
      } = swiper.navigation;
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      const targetEl = e.target;
      let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
      if (swiper.isElement && !targetIsButton) {
        const path = e.path || e.composedPath && e.composedPath();
        if (path) {
          targetIsButton = path.find(pathEl => nextEl.includes(pathEl) || prevEl.includes(pathEl));
        }
      }
      if (swiper.params.navigation.hideOnClick && !targetIsButton) {
        if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
        let isHidden;
        if (nextEl.length) {
          isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        } else if (prevEl.length) {
          isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
        }
        if (isHidden === true) {
          emit('navigationShow');
        } else {
          emit('navigationHide');
        }
        [...nextEl, ...prevEl].filter(el => !!el).forEach(el => el.classList.toggle(swiper.params.navigation.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(' '));
      init();
      update();
    };
    const disable = () => {
      swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(' '));
      destroy();
    };
    Object.assign(swiper.navigation, {
      enable,
      disable,
      update,
      init,
      destroy
    });
  }

  function classesToSelector(classes) {
    if (classes === void 0) {
      classes = '';
    }
    return `.${classes.trim().replace(/([\.:!+\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
  }

  function Pagination(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const pfx = 'swiper-pagination';
    extendParams({
      pagination: {
        el: null,
        bulletElement: 'span',
        clickable: false,
        hideOnClick: false,
        renderBullet: null,
        renderProgressbar: null,
        renderFraction: null,
        renderCustom: null,
        progressbarOpposite: false,
        type: 'bullets',
        // 'bullets' or 'progressbar' or 'fraction' or 'custom'
        dynamicBullets: false,
        dynamicMainBullets: 1,
        formatFractionCurrent: number => number,
        formatFractionTotal: number => number,
        bulletClass: `${pfx}-bullet`,
        bulletActiveClass: `${pfx}-bullet-active`,
        modifierClass: `${pfx}-`,
        currentClass: `${pfx}-current`,
        totalClass: `${pfx}-total`,
        hiddenClass: `${pfx}-hidden`,
        progressbarFillClass: `${pfx}-progressbar-fill`,
        progressbarOppositeClass: `${pfx}-progressbar-opposite`,
        clickableClass: `${pfx}-clickable`,
        lockClass: `${pfx}-lock`,
        horizontalClass: `${pfx}-horizontal`,
        verticalClass: `${pfx}-vertical`,
        paginationDisabledClass: `${pfx}-disabled`
      }
    });
    swiper.pagination = {
      el: null,
      bullets: []
    };
    let bulletSize;
    let dynamicBulletIndex = 0;
    function isPaginationDisabled() {
      return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
    }
    function setSideBullets(bulletEl, position) {
      const {
        bulletActiveClass
      } = swiper.params.pagination;
      if (!bulletEl) return;
      bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}`);
        bulletEl = bulletEl[`${position === 'prev' ? 'previous' : 'next'}ElementSibling`];
        if (bulletEl) {
          bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
        }
      }
    }
    function getMoveDirection(prevIndex, nextIndex, length) {
      prevIndex = prevIndex % length;
      nextIndex = nextIndex % length;
      if (nextIndex === prevIndex + 1) {
        return 'next';
      } else if (nextIndex === prevIndex - 1) {
        return 'previous';
      }
      return;
    }
    function onBulletClick(e) {
      const bulletEl = e.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
      if (!bulletEl) {
        return;
      }
      e.preventDefault();
      const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
      if (swiper.params.loop) {
        if (swiper.realIndex === index) return;
        const moveDirection = getMoveDirection(swiper.realIndex, index, swiper.slides.length);
        if (moveDirection === 'next') {
          swiper.slideNext();
        } else if (moveDirection === 'previous') {
          swiper.slidePrev();
        } else {
          swiper.slideToLoop(index);
        }
      } else {
        swiper.slideTo(index);
      }
    }
    function update() {
      // Render || Update Pagination bullets/items
      const rtl = swiper.rtl;
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      let el = swiper.pagination.el;
      el = makeElementsArray(el);
      // Current/Total
      let current;
      let previousIndex;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
      const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.loop) {
        previousIndex = swiper.previousRealIndex || 0;
        current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
      } else if (typeof swiper.snapIndex !== 'undefined') {
        current = swiper.snapIndex;
        previousIndex = swiper.previousSnapIndex;
      } else {
        previousIndex = swiper.previousIndex || 0;
        current = swiper.activeIndex || 0;
      }
      // Types
      if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
        const bullets = swiper.pagination.bullets;
        let firstIndex;
        let lastIndex;
        let midIndex;
        if (params.dynamicBullets) {
          bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? 'width' : 'height', true);
          el.forEach(subEl => {
            subEl.style[swiper.isHorizontal() ? 'width' : 'height'] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
          });
          if (params.dynamicMainBullets > 1 && previousIndex !== undefined) {
            dynamicBulletIndex += current - (previousIndex || 0);
            if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
              dynamicBulletIndex = params.dynamicMainBullets - 1;
            } else if (dynamicBulletIndex < 0) {
              dynamicBulletIndex = 0;
            }
          }
          firstIndex = Math.max(current - dynamicBulletIndex, 0);
          lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
          midIndex = (lastIndex + firstIndex) / 2;
        }
        bullets.forEach(bulletEl => {
          const classesToRemove = [...['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`)].map(s => typeof s === 'string' && s.includes(' ') ? s.split(' ') : s).flat();
          bulletEl.classList.remove(...classesToRemove);
        });
        if (el.length > 1) {
          bullets.forEach(bullet => {
            const bulletIndex = elementIndex(bullet);
            if (bulletIndex === current) {
              bullet.classList.add(...params.bulletActiveClass.split(' '));
            } else if (swiper.isElement) {
              bullet.setAttribute('part', 'bullet');
            }
            if (params.dynamicBullets) {
              if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
                bullet.classList.add(...`${params.bulletActiveClass}-main`.split(' '));
              }
              if (bulletIndex === firstIndex) {
                setSideBullets(bullet, 'prev');
              }
              if (bulletIndex === lastIndex) {
                setSideBullets(bullet, 'next');
              }
            }
          });
        } else {
          const bullet = bullets[current];
          if (bullet) {
            bullet.classList.add(...params.bulletActiveClass.split(' '));
          }
          if (swiper.isElement) {
            bullets.forEach((bulletEl, bulletIndex) => {
              bulletEl.setAttribute('part', bulletIndex === current ? 'bullet-active' : 'bullet');
            });
          }
          if (params.dynamicBullets) {
            const firstDisplayedBullet = bullets[firstIndex];
            const lastDisplayedBullet = bullets[lastIndex];
            for (let i = firstIndex; i <= lastIndex; i += 1) {
              if (bullets[i]) {
                bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(' '));
              }
            }
            setSideBullets(firstDisplayedBullet, 'prev');
            setSideBullets(lastDisplayedBullet, 'next');
          }
        }
        if (params.dynamicBullets) {
          const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
          const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
          const offsetProp = rtl ? 'right' : 'left';
          bullets.forEach(bullet => {
            bullet.style[swiper.isHorizontal() ? offsetProp : 'top'] = `${bulletsOffset}px`;
          });
        }
      }
      el.forEach((subEl, subElIndex) => {
        if (params.type === 'fraction') {
          subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach(fractionEl => {
            fractionEl.textContent = params.formatFractionCurrent(current + 1);
          });
          subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach(totalEl => {
            totalEl.textContent = params.formatFractionTotal(total);
          });
        }
        if (params.type === 'progressbar') {
          let progressbarDirection;
          if (params.progressbarOpposite) {
            progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
          } else {
            progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
          }
          const scale = (current + 1) / total;
          let scaleX = 1;
          let scaleY = 1;
          if (progressbarDirection === 'horizontal') {
            scaleX = scale;
          } else {
            scaleY = scale;
          }
          subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach(progressEl => {
            progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
            progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
          });
        }
        if (params.type === 'custom' && params.renderCustom) {
          subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
          if (subElIndex === 0) emit('paginationRender', subEl);
        } else {
          if (subElIndex === 0) emit('paginationRender', subEl);
          emit('paginationUpdate', subEl);
        }
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? 'add' : 'remove'](params.lockClass);
        }
      });
    }
    function render() {
      // Render Container
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
      let el = swiper.pagination.el;
      el = makeElementsArray(el);
      let paginationHTML = '';
      if (params.type === 'bullets') {
        let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
          numberOfBullets = slidesLength;
        }
        for (let i = 0; i < numberOfBullets; i += 1) {
          if (params.renderBullet) {
            paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
          } else {
            // prettier-ignore
            paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ''} class="${params.bulletClass}"></${params.bulletElement}>`;
          }
        }
      }
      if (params.type === 'fraction') {
        if (params.renderFraction) {
          paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
        } else {
          paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
        }
      }
      if (params.type === 'progressbar') {
        if (params.renderProgressbar) {
          paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
        } else {
          paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
        }
      }
      swiper.pagination.bullets = [];
      el.forEach(subEl => {
        if (params.type !== 'custom') {
          subEl.innerHTML = paginationHTML || '';
        }
        if (params.type === 'bullets') {
          swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
        }
      });
      if (params.type !== 'custom') {
        emit('paginationRender', el[0]);
      }
    }
    function init() {
      swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
        el: 'swiper-pagination'
      });
      const params = swiper.params.pagination;
      if (!params.el) return;
      let el;
      if (typeof params.el === 'string' && swiper.isElement) {
        el = swiper.el.querySelector(params.el);
      }
      if (!el && typeof params.el === 'string') {
        el = [...document.querySelectorAll(params.el)];
      }
      if (!el) {
        el = params.el;
      }
      if (!el || el.length === 0) return;
      if (swiper.params.uniqueNavElements && typeof params.el === 'string' && Array.isArray(el) && el.length > 1) {
        el = [...swiper.el.querySelectorAll(params.el)];
        // check if it belongs to another nested Swiper
        if (el.length > 1) {
          el = el.find(subEl => {
            if (elementParents(subEl, '.swiper')[0] !== swiper.el) return false;
            return true;
          });
        }
      }
      if (Array.isArray(el) && el.length === 1) el = el[0];
      Object.assign(swiper.pagination, {
        el
      });
      el = makeElementsArray(el);
      el.forEach(subEl => {
        if (params.type === 'bullets' && params.clickable) {
          subEl.classList.add(...(params.clickableClass || '').split(' '));
        }
        subEl.classList.add(params.modifierClass + params.type);
        subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.type === 'bullets' && params.dynamicBullets) {
          subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
          dynamicBulletIndex = 0;
          if (params.dynamicMainBullets < 1) {
            params.dynamicMainBullets = 1;
          }
        }
        if (params.type === 'progressbar' && params.progressbarOpposite) {
          subEl.classList.add(params.progressbarOppositeClass);
        }
        if (params.clickable) {
          subEl.addEventListener('click', onBulletClick);
        }
        if (!swiper.enabled) {
          subEl.classList.add(params.lockClass);
        }
      });
    }
    function destroy() {
      const params = swiper.params.pagination;
      if (isPaginationDisabled()) return;
      let el = swiper.pagination.el;
      if (el) {
        el = makeElementsArray(el);
        el.forEach(subEl => {
          subEl.classList.remove(params.hiddenClass);
          subEl.classList.remove(params.modifierClass + params.type);
          subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
          if (params.clickable) {
            subEl.classList.remove(...(params.clickableClass || '').split(' '));
            subEl.removeEventListener('click', onBulletClick);
          }
        });
      }
      if (swiper.pagination.bullets) swiper.pagination.bullets.forEach(subEl => subEl.classList.remove(...params.bulletActiveClass.split(' ')));
    }
    on('changeDirection', () => {
      if (!swiper.pagination || !swiper.pagination.el) return;
      const params = swiper.params.pagination;
      let {
        el
      } = swiper.pagination;
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.classList.remove(params.horizontalClass, params.verticalClass);
        subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      });
    });
    on('init', () => {
      if (swiper.params.pagination.enabled === false) {
        // eslint-disable-next-line
        disable();
      } else {
        init();
        render();
        update();
      }
    });
    on('activeIndexChange', () => {
      if (typeof swiper.snapIndex === 'undefined') {
        update();
      }
    });
    on('snapIndexChange', () => {
      update();
    });
    on('snapGridLengthChange', () => {
      render();
      update();
    });
    on('destroy', () => {
      destroy();
    });
    on('enable disable', () => {
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach(subEl => subEl.classList[swiper.enabled ? 'remove' : 'add'](swiper.params.pagination.lockClass));
      }
    });
    on('lock unlock', () => {
      update();
    });
    on('click', (_s, e) => {
      const targetEl = e.target;
      const el = makeElementsArray(swiper.pagination.el);
      if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
        if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
        const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
        if (isHidden === true) {
          emit('paginationShow');
        } else {
          emit('paginationHide');
        }
        el.forEach(subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
      }
    });
    const enable = () => {
      swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach(subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
      }
      init();
      render();
      update();
    };
    const disable = () => {
      swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
      let {
        el
      } = swiper.pagination;
      if (el) {
        el = makeElementsArray(el);
        el.forEach(subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
      }
      destroy();
    };
    Object.assign(swiper.pagination, {
      enable,
      disable,
      render,
      update,
      init,
      destroy
    });
  }

  function Scrollbar(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const document = getDocument();
    let isTouched = false;
    let timeout = null;
    let dragTimeout = null;
    let dragStartPos;
    let dragSize;
    let trackSize;
    let divider;
    extendParams({
      scrollbar: {
        el: null,
        dragSize: 'auto',
        hide: false,
        draggable: false,
        snapOnRelease: true,
        lockClass: 'swiper-scrollbar-lock',
        dragClass: 'swiper-scrollbar-drag',
        scrollbarDisabledClass: 'swiper-scrollbar-disabled',
        horizontalClass: `swiper-scrollbar-horizontal`,
        verticalClass: `swiper-scrollbar-vertical`
      }
    });
    swiper.scrollbar = {
      el: null,
      dragEl: null
    };
    function setTranslate() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const {
        scrollbar,
        rtlTranslate: rtl
      } = swiper;
      const {
        dragEl,
        el
      } = scrollbar;
      const params = swiper.params.scrollbar;
      const progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
      let newSize = dragSize;
      let newPos = (trackSize - dragSize) * progress;
      if (rtl) {
        newPos = -newPos;
        if (newPos > 0) {
          newSize = dragSize - newPos;
          newPos = 0;
        } else if (-newPos + dragSize > trackSize) {
          newSize = trackSize + newPos;
        }
      } else if (newPos < 0) {
        newSize = dragSize + newPos;
        newPos = 0;
      } else if (newPos + dragSize > trackSize) {
        newSize = trackSize - newPos;
      }
      if (swiper.isHorizontal()) {
        dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
        dragEl.style.width = `${newSize}px`;
      } else {
        dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
        dragEl.style.height = `${newSize}px`;
      }
      if (params.hide) {
        clearTimeout(timeout);
        el.style.opacity = 1;
        timeout = setTimeout(() => {
          el.style.opacity = 0;
          el.style.transitionDuration = '400ms';
        }, 1000);
      }
    }
    function setTransition(duration) {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
    }
    function updateSize() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      const {
        scrollbar
      } = swiper;
      const {
        dragEl,
        el
      } = scrollbar;
      dragEl.style.width = '';
      dragEl.style.height = '';
      trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
      divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
      if (swiper.params.scrollbar.dragSize === 'auto') {
        dragSize = trackSize * divider;
      } else {
        dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
      }
      if (swiper.isHorizontal()) {
        dragEl.style.width = `${dragSize}px`;
      } else {
        dragEl.style.height = `${dragSize}px`;
      }
      if (divider >= 1) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
      if (swiper.params.scrollbar.hide) {
        el.style.opacity = 0;
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        scrollbar.el.classList[swiper.isLocked ? 'add' : 'remove'](swiper.params.scrollbar.lockClass);
      }
    }
    function getPointerPosition(e) {
      return swiper.isHorizontal() ? e.clientX : e.clientY;
    }
    function setDragPosition(e) {
      const {
        scrollbar,
        rtlTranslate: rtl
      } = swiper;
      const {
        el
      } = scrollbar;
      let positionRatio;
      positionRatio = (getPointerPosition(e) - elementOffset(el)[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
      positionRatio = Math.max(Math.min(positionRatio, 1), 0);
      if (rtl) {
        positionRatio = 1 - positionRatio;
      }
      const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
      swiper.updateProgress(position);
      swiper.setTranslate(position);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    function onDragStart(e) {
      const params = swiper.params.scrollbar;
      const {
        scrollbar,
        wrapperEl
      } = swiper;
      const {
        el,
        dragEl
      } = scrollbar;
      isTouched = true;
      dragStartPos = e.target === dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
      e.preventDefault();
      e.stopPropagation();
      wrapperEl.style.transitionDuration = '100ms';
      dragEl.style.transitionDuration = '100ms';
      setDragPosition(e);
      clearTimeout(dragTimeout);
      el.style.transitionDuration = '0ms';
      if (params.hide) {
        el.style.opacity = 1;
      }
      if (swiper.params.cssMode) {
        swiper.wrapperEl.style['scroll-snap-type'] = 'none';
      }
      emit('scrollbarDragStart', e);
    }
    function onDragMove(e) {
      const {
        scrollbar,
        wrapperEl
      } = swiper;
      const {
        el,
        dragEl
      } = scrollbar;
      if (!isTouched) return;
      if (e.preventDefault && e.cancelable) e.preventDefault();else e.returnValue = false;
      setDragPosition(e);
      wrapperEl.style.transitionDuration = '0ms';
      el.style.transitionDuration = '0ms';
      dragEl.style.transitionDuration = '0ms';
      emit('scrollbarDragMove', e);
    }
    function onDragEnd(e) {
      const params = swiper.params.scrollbar;
      const {
        scrollbar,
        wrapperEl
      } = swiper;
      const {
        el
      } = scrollbar;
      if (!isTouched) return;
      isTouched = false;
      if (swiper.params.cssMode) {
        swiper.wrapperEl.style['scroll-snap-type'] = '';
        wrapperEl.style.transitionDuration = '';
      }
      if (params.hide) {
        clearTimeout(dragTimeout);
        dragTimeout = nextTick(() => {
          el.style.opacity = 0;
          el.style.transitionDuration = '400ms';
        }, 1000);
      }
      emit('scrollbarDragEnd', e);
      if (params.snapOnRelease) {
        swiper.slideToClosest();
      }
    }
    function events(method) {
      const {
        scrollbar,
        params
      } = swiper;
      const el = scrollbar.el;
      if (!el) return;
      const target = el;
      const activeListener = params.passiveListeners ? {
        passive: false,
        capture: false
      } : false;
      const passiveListener = params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      if (!target) return;
      const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
      target[eventMethod]('pointerdown', onDragStart, activeListener);
      document[eventMethod]('pointermove', onDragMove, activeListener);
      document[eventMethod]('pointerup', onDragEnd, passiveListener);
    }
    function enableDraggable() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      events('on');
    }
    function disableDraggable() {
      if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
      events('off');
    }
    function init() {
      const {
        scrollbar,
        el: swiperEl
      } = swiper;
      swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
        el: 'swiper-scrollbar'
      });
      const params = swiper.params.scrollbar;
      if (!params.el) return;
      let el;
      if (typeof params.el === 'string' && swiper.isElement) {
        el = swiper.el.querySelector(params.el);
      }
      if (!el && typeof params.el === 'string') {
        el = document.querySelectorAll(params.el);
        if (!el.length) return;
      } else if (!el) {
        el = params.el;
      }
      if (swiper.params.uniqueNavElements && typeof params.el === 'string' && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
        el = swiperEl.querySelector(params.el);
      }
      if (el.length > 0) el = el[0];
      el.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      let dragEl;
      if (el) {
        dragEl = el.querySelector(classesToSelector(swiper.params.scrollbar.dragClass));
        if (!dragEl) {
          dragEl = createElement('div', swiper.params.scrollbar.dragClass);
          el.append(dragEl);
        }
      }
      Object.assign(scrollbar, {
        el,
        dragEl
      });
      if (params.draggable) {
        enableDraggable();
      }
      if (el) {
        el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
      }
    }
    function destroy() {
      const params = swiper.params.scrollbar;
      const el = swiper.scrollbar.el;
      if (el) {
        el.classList.remove(...classesToTokens(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass));
      }
      disableDraggable();
    }
    on('changeDirection', () => {
      if (!swiper.scrollbar || !swiper.scrollbar.el) return;
      const params = swiper.params.scrollbar;
      let {
        el
      } = swiper.scrollbar;
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.classList.remove(params.horizontalClass, params.verticalClass);
        subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      });
    });
    on('init', () => {
      if (swiper.params.scrollbar.enabled === false) {
        // eslint-disable-next-line
        disable();
      } else {
        init();
        updateSize();
        setTranslate();
      }
    });
    on('update resize observerUpdate lock unlock changeDirection', () => {
      updateSize();
    });
    on('setTranslate', () => {
      setTranslate();
    });
    on('setTransition', (_s, duration) => {
      setTransition(duration);
    });
    on('enable disable', () => {
      const {
        el
      } = swiper.scrollbar;
      if (el) {
        el.classList[swiper.enabled ? 'remove' : 'add'](...classesToTokens(swiper.params.scrollbar.lockClass));
      }
    });
    on('destroy', () => {
      destroy();
    });
    const enable = () => {
      swiper.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
      if (swiper.scrollbar.el) {
        swiper.scrollbar.el.classList.remove(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
      }
      init();
      updateSize();
      setTranslate();
    };
    const disable = () => {
      swiper.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
      if (swiper.scrollbar.el) {
        swiper.scrollbar.el.classList.add(...classesToTokens(swiper.params.scrollbar.scrollbarDisabledClass));
      }
      destroy();
    };
    Object.assign(swiper.scrollbar, {
      enable,
      disable,
      updateSize,
      setTranslate,
      init,
      destroy
    });
  }

  function Parallax(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      parallax: {
        enabled: false
      }
    });
    const elementsSelector = '[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]';
    const setTransform = (el, progress) => {
      const {
        rtl
      } = swiper;
      const rtlFactor = rtl ? -1 : 1;
      const p = el.getAttribute('data-swiper-parallax') || '0';
      let x = el.getAttribute('data-swiper-parallax-x');
      let y = el.getAttribute('data-swiper-parallax-y');
      const scale = el.getAttribute('data-swiper-parallax-scale');
      const opacity = el.getAttribute('data-swiper-parallax-opacity');
      const rotate = el.getAttribute('data-swiper-parallax-rotate');
      if (x || y) {
        x = x || '0';
        y = y || '0';
      } else if (swiper.isHorizontal()) {
        x = p;
        y = '0';
      } else {
        y = p;
        x = '0';
      }
      if (x.indexOf('%') >= 0) {
        x = `${parseInt(x, 10) * progress * rtlFactor}%`;
      } else {
        x = `${x * progress * rtlFactor}px`;
      }
      if (y.indexOf('%') >= 0) {
        y = `${parseInt(y, 10) * progress}%`;
      } else {
        y = `${y * progress}px`;
      }
      if (typeof opacity !== 'undefined' && opacity !== null) {
        const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
        el.style.opacity = currentOpacity;
      }
      let transform = `translate3d(${x}, ${y}, 0px)`;
      if (typeof scale !== 'undefined' && scale !== null) {
        const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
        transform += ` scale(${currentScale})`;
      }
      if (rotate && typeof rotate !== 'undefined' && rotate !== null) {
        const currentRotate = rotate * progress * -1;
        transform += ` rotate(${currentRotate}deg)`;
      }
      el.style.transform = transform;
    };
    const setTranslate = () => {
      const {
        el,
        slides,
        progress,
        snapGrid,
        isElement
      } = swiper;
      const elements = elementChildren(el, elementsSelector);
      if (swiper.isElement) {
        elements.push(...elementChildren(swiper.hostEl, elementsSelector));
      }
      elements.forEach(subEl => {
        setTransform(subEl, progress);
      });
      slides.forEach((slideEl, slideIndex) => {
        let slideProgress = slideEl.progress;
        if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
          slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
        }
        slideProgress = Math.min(Math.max(slideProgress, -1), 1);
        slideEl.querySelectorAll(`${elementsSelector}, [data-swiper-parallax-rotate]`).forEach(subEl => {
          setTransform(subEl, slideProgress);
        });
      });
    };
    const setTransition = function (duration) {
      if (duration === void 0) {
        duration = swiper.params.speed;
      }
      const {
        el,
        hostEl
      } = swiper;
      const elements = [...el.querySelectorAll(elementsSelector)];
      if (swiper.isElement) {
        elements.push(...hostEl.querySelectorAll(elementsSelector));
      }
      elements.forEach(parallaxEl => {
        let parallaxDuration = parseInt(parallaxEl.getAttribute('data-swiper-parallax-duration'), 10) || duration;
        if (duration === 0) parallaxDuration = 0;
        parallaxEl.style.transitionDuration = `${parallaxDuration}ms`;
      });
    };
    on('beforeInit', () => {
      if (!swiper.params.parallax.enabled) return;
      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    });
    on('init', () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on('setTranslate', () => {
      if (!swiper.params.parallax.enabled) return;
      setTranslate();
    });
    on('setTransition', (_swiper, duration) => {
      if (!swiper.params.parallax.enabled) return;
      setTransition(duration);
    });
  }

  function Zoom(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit
    } = _ref;
    const window = getWindow();
    extendParams({
      zoom: {
        enabled: false,
        limitToOriginalSize: false,
        maxRatio: 3,
        minRatio: 1,
        panOnMouseMove: false,
        toggle: true,
        containerClass: 'swiper-zoom-container',
        zoomedSlideClass: 'swiper-slide-zoomed'
      }
    });
    swiper.zoom = {
      enabled: false
    };
    let currentScale = 1;
    let isScaling = false;
    let isPanningWithMouse = false;
    let mousePanStart = {
      x: 0,
      y: 0
    };
    const mousePanSensitivity = -3; // Negative to invert pan direction
    let fakeGestureTouched;
    let fakeGestureMoved;
    const evCache = [];
    const gesture = {
      originX: 0,
      originY: 0,
      slideEl: undefined,
      slideWidth: undefined,
      slideHeight: undefined,
      imageEl: undefined,
      imageWrapEl: undefined,
      maxRatio: 3
    };
    const image = {
      isTouched: undefined,
      isMoved: undefined,
      currentX: undefined,
      currentY: undefined,
      minX: undefined,
      minY: undefined,
      maxX: undefined,
      maxY: undefined,
      width: undefined,
      height: undefined,
      startX: undefined,
      startY: undefined,
      touchesStart: {},
      touchesCurrent: {}
    };
    const velocity = {
      x: undefined,
      y: undefined,
      prevPositionX: undefined,
      prevPositionY: undefined,
      prevTime: undefined
    };
    let scale = 1;
    Object.defineProperty(swiper.zoom, 'scale', {
      get() {
        return scale;
      },
      set(value) {
        if (scale !== value) {
          const imageEl = gesture.imageEl;
          const slideEl = gesture.slideEl;
          emit('zoomChange', value, imageEl, slideEl);
        }
        scale = value;
      }
    });
    function getDistanceBetweenTouches() {
      if (evCache.length < 2) return 1;
      const x1 = evCache[0].pageX;
      const y1 = evCache[0].pageY;
      const x2 = evCache[1].pageX;
      const y2 = evCache[1].pageY;
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      return distance;
    }
    function getMaxRatio() {
      const params = swiper.params.zoom;
      const maxRatio = gesture.imageWrapEl.getAttribute('data-swiper-zoom') || params.maxRatio;
      if (params.limitToOriginalSize && gesture.imageEl && gesture.imageEl.naturalWidth) {
        const imageMaxRatio = gesture.imageEl.naturalWidth / gesture.imageEl.offsetWidth;
        return Math.min(imageMaxRatio, maxRatio);
      }
      return maxRatio;
    }
    function getScaleOrigin() {
      if (evCache.length < 2) return {
        x: null,
        y: null
      };
      const box = gesture.imageEl.getBoundingClientRect();
      return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x - window.scrollX) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y - window.scrollY) / currentScale];
    }
    function getSlideSelector() {
      return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
    }
    function eventWithinSlide(e) {
      const slideSelector = getSlideSelector();
      if (e.target.matches(slideSelector)) return true;
      if (swiper.slides.filter(slideEl => slideEl.contains(e.target)).length > 0) return true;
      return false;
    }
    function eventWithinZoomContainer(e) {
      const selector = `.${swiper.params.zoom.containerClass}`;
      if (e.target.matches(selector)) return true;
      if ([...swiper.hostEl.querySelectorAll(selector)].filter(containerEl => containerEl.contains(e.target)).length > 0) return true;
      return false;
    }

    // Events
    function onGestureStart(e) {
      if (e.pointerType === 'mouse') {
        evCache.splice(0, evCache.length);
      }
      if (!eventWithinSlide(e)) return;
      const params = swiper.params.zoom;
      fakeGestureTouched = false;
      fakeGestureMoved = false;
      evCache.push(e);
      if (evCache.length < 2) {
        return;
      }
      fakeGestureTouched = true;
      gesture.scaleStart = getDistanceBetweenTouches();
      if (!gesture.slideEl) {
        gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
        if (!gesture.slideEl) gesture.slideEl = swiper.slides[swiper.activeIndex];
        let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
        if (imageEl) {
          imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
        }
        gesture.imageEl = imageEl;
        if (imageEl) {
          gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
        } else {
          gesture.imageWrapEl = undefined;
        }
        if (!gesture.imageWrapEl) {
          gesture.imageEl = undefined;
          return;
        }
        gesture.maxRatio = getMaxRatio();
      }
      if (gesture.imageEl) {
        const [originX, originY] = getScaleOrigin();
        gesture.originX = originX;
        gesture.originY = originY;
        gesture.imageEl.style.transitionDuration = '0ms';
      }
      isScaling = true;
    }
    function onGestureChange(e) {
      if (!eventWithinSlide(e)) return;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;
      const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
      if (pointerIndex >= 0) evCache[pointerIndex] = e;
      if (evCache.length < 2) {
        return;
      }
      fakeGestureMoved = true;
      gesture.scaleMove = getDistanceBetweenTouches();
      if (!gesture.imageEl) {
        return;
      }
      zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
      if (zoom.scale > gesture.maxRatio) {
        zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
      }
      if (zoom.scale < params.minRatio) {
        zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
      }
      gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    }
    function onGestureEnd(e) {
      if (!eventWithinSlide(e)) return;
      if (e.pointerType === 'mouse' && e.type === 'pointerout') return;
      const params = swiper.params.zoom;
      const zoom = swiper.zoom;
      const pointerIndex = evCache.findIndex(cachedEv => cachedEv.pointerId === e.pointerId);
      if (pointerIndex >= 0) evCache.splice(pointerIndex, 1);
      if (!fakeGestureTouched || !fakeGestureMoved) {
        return;
      }
      fakeGestureTouched = false;
      fakeGestureMoved = false;
      if (!gesture.imageEl) return;
      zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
      gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
      gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
      currentScale = zoom.scale;
      isScaling = false;
      if (zoom.scale > 1 && gesture.slideEl) {
        gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
      } else if (zoom.scale <= 1 && gesture.slideEl) {
        gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
      }
      if (zoom.scale === 1) {
        gesture.originX = 0;
        gesture.originY = 0;
        gesture.slideEl = undefined;
      }
    }
    let allowTouchMoveTimeout;
    function allowTouchMove() {
      swiper.touchEventsData.preventTouchMoveFromPointerMove = false;
    }
    function preventTouchMove() {
      clearTimeout(allowTouchMoveTimeout);
      swiper.touchEventsData.preventTouchMoveFromPointerMove = true;
      allowTouchMoveTimeout = setTimeout(() => {
        if (swiper.destroyed) return;
        allowTouchMove();
      });
    }
    function onTouchStart(e) {
      const device = swiper.device;
      if (!gesture.imageEl) return;
      if (image.isTouched) return;
      if (device.android && e.cancelable) e.preventDefault();
      image.isTouched = true;
      const event = evCache.length > 0 ? evCache[0] : e;
      image.touchesStart.x = event.pageX;
      image.touchesStart.y = event.pageY;
    }
    function onTouchMove(e) {
      const isMouseEvent = e.pointerType === 'mouse';
      const isMousePan = isMouseEvent && swiper.params.zoom.panOnMouseMove;
      if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) {
        return;
      }
      const zoom = swiper.zoom;
      if (!gesture.imageEl) {
        return;
      }
      if (!image.isTouched || !gesture.slideEl) {
        if (isMousePan) onMouseMove(e);
        return;
      }
      if (isMousePan) {
        onMouseMove(e);
        return;
      }
      if (!image.isMoved) {
        image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
        image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
        image.startX = getTranslate(gesture.imageWrapEl, 'x') || 0;
        image.startY = getTranslate(gesture.imageWrapEl, 'y') || 0;
        gesture.slideWidth = gesture.slideEl.offsetWidth;
        gesture.slideHeight = gesture.slideEl.offsetHeight;
        gesture.imageWrapEl.style.transitionDuration = '0ms';
      }
      // Define if we need image drag
      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e.pageX;
      image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e.pageY;
      const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
      if (touchesDiff > 5) {
        swiper.allowClick = false;
      }
      if (!image.isMoved && !isScaling) {
        if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
          image.isTouched = false;
          allowTouchMove();
          return;
        }
        if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
          image.isTouched = false;
          allowTouchMove();
          return;
        }
      }
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      preventTouchMove();
      image.isMoved = true;
      const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper.params.zoom.minRatio);
      const {
        originX,
        originY
      } = gesture;
      image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
      image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
      if (image.currentX < image.minX) {
        image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
      }
      if (image.currentX > image.maxX) {
        image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
      }
      if (image.currentY < image.minY) {
        image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
      }
      if (image.currentY > image.maxY) {
        image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
      }

      // Velocity
      if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
      if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
      if (!velocity.prevTime) velocity.prevTime = Date.now();
      velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
      velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
      if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
      if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
      velocity.prevPositionX = image.touchesCurrent.x;
      velocity.prevPositionY = image.touchesCurrent.y;
      velocity.prevTime = Date.now();
      gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
    }
    function onTouchEnd() {
      const zoom = swiper.zoom;
      evCache.length = 0;
      if (!gesture.imageEl) return;
      if (!image.isTouched || !image.isMoved) {
        image.isTouched = false;
        image.isMoved = false;
        return;
      }
      image.isTouched = false;
      image.isMoved = false;
      let momentumDurationX = 300;
      let momentumDurationY = 300;
      const momentumDistanceX = velocity.x * momentumDurationX;
      const newPositionX = image.currentX + momentumDistanceX;
      const momentumDistanceY = velocity.y * momentumDurationY;
      const newPositionY = image.currentY + momentumDistanceY;

      // Fix duration
      if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
      if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
      const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
      image.currentX = newPositionX;
      image.currentY = newPositionY;
      // Define if we need image drag
      const scaledWidth = image.width * zoom.scale;
      const scaledHeight = image.height * zoom.scale;
      image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
      image.maxX = -image.minX;
      image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
      image.maxY = -image.minY;
      image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
      image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
      gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
      gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
    }
    function onTransitionEnd() {
      const zoom = swiper.zoom;
      if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
        if (gesture.imageEl) {
          gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
        }
        if (gesture.imageWrapEl) {
          gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
        }
        gesture.slideEl.classList.remove(`${swiper.params.zoom.zoomedSlideClass}`);
        zoom.scale = 1;
        currentScale = 1;
        gesture.slideEl = undefined;
        gesture.imageEl = undefined;
        gesture.imageWrapEl = undefined;
        gesture.originX = 0;
        gesture.originY = 0;
      }
    }
    function onMouseMove(e) {
      // Only pan if zoomed in and mouse panning is enabled
      if (currentScale <= 1 || !gesture.imageWrapEl) return;
      if (!eventWithinSlide(e) || !eventWithinZoomContainer(e)) return;
      const currentTransform = window.getComputedStyle(gesture.imageWrapEl).transform;
      const matrix = new window.DOMMatrix(currentTransform);
      if (!isPanningWithMouse) {
        isPanningWithMouse = true;
        mousePanStart.x = e.clientX;
        mousePanStart.y = e.clientY;
        image.startX = matrix.e;
        image.startY = matrix.f;
        image.width = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
        image.height = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
        gesture.slideWidth = gesture.slideEl.offsetWidth;
        gesture.slideHeight = gesture.slideEl.offsetHeight;
        return;
      }
      const deltaX = (e.clientX - mousePanStart.x) * mousePanSensitivity;
      const deltaY = (e.clientY - mousePanStart.y) * mousePanSensitivity;
      const scaledWidth = image.width * currentScale;
      const scaledHeight = image.height * currentScale;
      const slideWidth = gesture.slideWidth;
      const slideHeight = gesture.slideHeight;
      const minX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      const maxX = -minX;
      const minY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      const maxY = -minY;
      const newX = Math.max(Math.min(image.startX + deltaX, maxX), minX);
      const newY = Math.max(Math.min(image.startY + deltaY, maxY), minY);
      gesture.imageWrapEl.style.transitionDuration = '0ms';
      gesture.imageWrapEl.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      mousePanStart.x = e.clientX;
      mousePanStart.y = e.clientY;
      image.startX = newX;
      image.startY = newY;
      image.currentX = newX;
      image.currentY = newY;
    }
    function zoomIn(e) {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;
      if (!gesture.slideEl) {
        if (e && e.target) {
          gesture.slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
        }
        if (!gesture.slideEl) {
          if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
            gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
          } else {
            gesture.slideEl = swiper.slides[swiper.activeIndex];
          }
        }
        let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
        if (imageEl) {
          imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
        }
        gesture.imageEl = imageEl;
        if (imageEl) {
          gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
        } else {
          gesture.imageWrapEl = undefined;
        }
      }
      if (!gesture.imageEl || !gesture.imageWrapEl) return;
      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = 'hidden';
        swiper.wrapperEl.style.touchAction = 'none';
      }
      gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
      let touchX;
      let touchY;
      let offsetX;
      let offsetY;
      let diffX;
      let diffY;
      let translateX;
      let translateY;
      let imageWidth;
      let imageHeight;
      let scaledWidth;
      let scaledHeight;
      let translateMinX;
      let translateMinY;
      let translateMaxX;
      let translateMaxY;
      let slideWidth;
      let slideHeight;
      if (typeof image.touchesStart.x === 'undefined' && e) {
        touchX = e.pageX;
        touchY = e.pageY;
      } else {
        touchX = image.touchesStart.x;
        touchY = image.touchesStart.y;
      }
      const prevScale = currentScale;
      const forceZoomRatio = typeof e === 'number' ? e : null;
      if (currentScale === 1 && forceZoomRatio) {
        touchX = undefined;
        touchY = undefined;
        image.touchesStart.x = undefined;
        image.touchesStart.y = undefined;
      }
      const maxRatio = getMaxRatio();
      zoom.scale = forceZoomRatio || maxRatio;
      currentScale = forceZoomRatio || maxRatio;
      if (e && !(currentScale === 1 && forceZoomRatio)) {
        slideWidth = gesture.slideEl.offsetWidth;
        slideHeight = gesture.slideEl.offsetHeight;
        offsetX = elementOffset(gesture.slideEl).left + window.scrollX;
        offsetY = elementOffset(gesture.slideEl).top + window.scrollY;
        diffX = offsetX + slideWidth / 2 - touchX;
        diffY = offsetY + slideHeight / 2 - touchY;
        imageWidth = gesture.imageEl.offsetWidth || gesture.imageEl.clientWidth;
        imageHeight = gesture.imageEl.offsetHeight || gesture.imageEl.clientHeight;
        scaledWidth = imageWidth * zoom.scale;
        scaledHeight = imageHeight * zoom.scale;
        translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
        translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
        translateMaxX = -translateMinX;
        translateMaxY = -translateMinY;
        if (prevScale > 0 && forceZoomRatio && typeof image.currentX === 'number' && typeof image.currentY === 'number') {
          translateX = image.currentX * zoom.scale / prevScale;
          translateY = image.currentY * zoom.scale / prevScale;
        } else {
          translateX = diffX * zoom.scale;
          translateY = diffY * zoom.scale;
        }
        if (translateX < translateMinX) {
          translateX = translateMinX;
        }
        if (translateX > translateMaxX) {
          translateX = translateMaxX;
        }
        if (translateY < translateMinY) {
          translateY = translateMinY;
        }
        if (translateY > translateMaxY) {
          translateY = translateMaxY;
        }
      } else {
        translateX = 0;
        translateY = 0;
      }
      if (forceZoomRatio && zoom.scale === 1) {
        gesture.originX = 0;
        gesture.originY = 0;
      }
      image.currentX = translateX;
      image.currentY = translateY;
      gesture.imageWrapEl.style.transitionDuration = '300ms';
      gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
      gesture.imageEl.style.transitionDuration = '300ms';
      gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    }
    function zoomOut() {
      const zoom = swiper.zoom;
      const params = swiper.params.zoom;
      if (!gesture.slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
        } else {
          gesture.slideEl = swiper.slides[swiper.activeIndex];
        }
        let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
        if (imageEl) {
          imageEl = imageEl.querySelectorAll('picture, img, svg, canvas, .swiper-zoom-target')[0];
        }
        gesture.imageEl = imageEl;
        if (imageEl) {
          gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
        } else {
          gesture.imageWrapEl = undefined;
        }
      }
      if (!gesture.imageEl || !gesture.imageWrapEl) return;
      if (swiper.params.cssMode) {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.style.touchAction = '';
      }
      zoom.scale = 1;
      currentScale = 1;
      image.currentX = undefined;
      image.currentY = undefined;
      image.touchesStart.x = undefined;
      image.touchesStart.y = undefined;
      gesture.imageWrapEl.style.transitionDuration = '300ms';
      gesture.imageWrapEl.style.transform = 'translate3d(0,0,0)';
      gesture.imageEl.style.transitionDuration = '300ms';
      gesture.imageEl.style.transform = 'translate3d(0,0,0) scale(1)';
      gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
      gesture.slideEl = undefined;
      gesture.originX = 0;
      gesture.originY = 0;
      if (swiper.params.zoom.panOnMouseMove) {
        mousePanStart = {
          x: 0,
          y: 0
        };
        if (isPanningWithMouse) {
          isPanningWithMouse = false;
          image.startX = 0;
          image.startY = 0;
        }
      }
    }

    // Toggle Zoom
    function zoomToggle(e) {
      const zoom = swiper.zoom;
      if (zoom.scale && zoom.scale !== 1) {
        // Zoom Out
        zoomOut();
      } else {
        // Zoom In
        zoomIn(e);
      }
    }
    function getListeners() {
      const passiveListener = swiper.params.passiveListeners ? {
        passive: true,
        capture: false
      } : false;
      const activeListenerWithCapture = swiper.params.passiveListeners ? {
        passive: false,
        capture: true
      } : true;
      return {
        passiveListener,
        activeListenerWithCapture
      };
    }

    // Attach/Detach Events
    function enable() {
      const zoom = swiper.zoom;
      if (zoom.enabled) return;
      zoom.enabled = true;
      const {
        passiveListener,
        activeListenerWithCapture
      } = getListeners();

      // Scale image
      swiper.wrapperEl.addEventListener('pointerdown', onGestureStart, passiveListener);
      swiper.wrapperEl.addEventListener('pointermove', onGestureChange, activeListenerWithCapture);
      ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
        swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
      });

      // Move image
      swiper.wrapperEl.addEventListener('pointermove', onTouchMove, activeListenerWithCapture);
    }
    function disable() {
      const zoom = swiper.zoom;
      if (!zoom.enabled) return;
      zoom.enabled = false;
      const {
        passiveListener,
        activeListenerWithCapture
      } = getListeners();

      // Scale image
      swiper.wrapperEl.removeEventListener('pointerdown', onGestureStart, passiveListener);
      swiper.wrapperEl.removeEventListener('pointermove', onGestureChange, activeListenerWithCapture);
      ['pointerup', 'pointercancel', 'pointerout'].forEach(eventName => {
        swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
      });

      // Move image
      swiper.wrapperEl.removeEventListener('pointermove', onTouchMove, activeListenerWithCapture);
    }
    on('init', () => {
      if (swiper.params.zoom.enabled) {
        enable();
      }
    });
    on('destroy', () => {
      disable();
    });
    on('touchStart', (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchStart(e);
    });
    on('touchEnd', (_s, e) => {
      if (!swiper.zoom.enabled) return;
      onTouchEnd();
    });
    on('doubleTap', (_s, e) => {
      if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
        zoomToggle(e);
      }
    });
    on('transitionEnd', () => {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
        onTransitionEnd();
      }
    });
    on('slideChange', () => {
      if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
        onTransitionEnd();
      }
    });
    Object.assign(swiper.zoom, {
      enable,
      disable,
      in: zoomIn,
      out: zoomOut,
      toggle: zoomToggle
    });
  }

  /* eslint no-bitwise: ["error", { "allow": [">>"] }] */
  function Controller(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      controller: {
        control: undefined,
        inverse: false,
        by: 'slide' // or 'container'
      }
    });

    swiper.controller = {
      control: undefined
    };
    function LinearSpline(x, y) {
      const binarySearch = function search() {
        let maxIndex;
        let minIndex;
        let guess;
        return (array, val) => {
          minIndex = -1;
          maxIndex = array.length;
          while (maxIndex - minIndex > 1) {
            guess = maxIndex + minIndex >> 1;
            if (array[guess] <= val) {
              minIndex = guess;
            } else {
              maxIndex = guess;
            }
          }
          return maxIndex;
        };
      }();
      this.x = x;
      this.y = y;
      this.lastIndex = x.length - 1;
      // Given an x value (x2), return the expected y2 value:
      // (x1,y1) is the known point before given value,
      // (x3,y3) is the known point after given value.
      let i1;
      let i3;
      this.interpolate = function interpolate(x2) {
        if (!x2) return 0;

        // Get the indexes of x1 and x3 (the array indexes before and after given x2):
        i3 = binarySearch(this.x, x2);
        i1 = i3 - 1;

        // We have our indexes i1 & i3, so we can calculate already:
        // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
        return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
      };
      return this;
    }
    function getInterpolateFunction(c) {
      swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
    }
    function setTranslate(_t, byController) {
      const controlled = swiper.controller.control;
      let multiplier;
      let controlledTranslate;
      const Swiper = swiper.constructor;
      function setControlledTranslate(c) {
        if (c.destroyed) return;

        // this will create an Interpolate function based on the snapGrids
        // x is the Grid of the scrolled scroller and y will be the controlled scroller
        // it makes sense to create this only once and recall it for the interpolation
        // the function does a lot of value caching for performance
        const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;
        if (swiper.params.controller.by === 'slide') {
          getInterpolateFunction(c);
          // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
          // but it did not work out
          controlledTranslate = -swiper.controller.spline.interpolate(-translate);
        }
        if (!controlledTranslate || swiper.params.controller.by === 'container') {
          multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
          if (Number.isNaN(multiplier) || !Number.isFinite(multiplier)) {
            multiplier = 1;
          }
          controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
        }
        if (swiper.params.controller.inverse) {
          controlledTranslate = c.maxTranslate() - controlledTranslate;
        }
        c.updateProgress(controlledTranslate);
        c.setTranslate(controlledTranslate, swiper);
        c.updateActiveIndex();
        c.updateSlidesClasses();
      }
      if (Array.isArray(controlled)) {
        for (let i = 0; i < controlled.length; i += 1) {
          if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
            setControlledTranslate(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTranslate(controlled);
      }
    }
    function setTransition(duration, byController) {
      const Swiper = swiper.constructor;
      const controlled = swiper.controller.control;
      let i;
      function setControlledTransition(c) {
        if (c.destroyed) return;
        c.setTransition(duration, swiper);
        if (duration !== 0) {
          c.transitionStart();
          if (c.params.autoHeight) {
            nextTick(() => {
              c.updateAutoHeight();
            });
          }
          elementTransitionEnd(c.wrapperEl, () => {
            if (!controlled) return;
            c.transitionEnd();
          });
        }
      }
      if (Array.isArray(controlled)) {
        for (i = 0; i < controlled.length; i += 1) {
          if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
            setControlledTransition(controlled[i]);
          }
        }
      } else if (controlled instanceof Swiper && byController !== controlled) {
        setControlledTransition(controlled);
      }
    }
    function removeSpline() {
      if (!swiper.controller.control) return;
      if (swiper.controller.spline) {
        swiper.controller.spline = undefined;
        delete swiper.controller.spline;
      }
    }
    on('beforeInit', () => {
      if (typeof window !== 'undefined' && (
      // eslint-disable-line
      typeof swiper.params.controller.control === 'string' || swiper.params.controller.control instanceof HTMLElement)) {
        const controlElements = typeof swiper.params.controller.control === 'string' ? [...document.querySelectorAll(swiper.params.controller.control)] : [swiper.params.controller.control];
        controlElements.forEach(controlElement => {
          if (!swiper.controller.control) swiper.controller.control = [];
          if (controlElement && controlElement.swiper) {
            swiper.controller.control.push(controlElement.swiper);
          } else if (controlElement) {
            const eventName = `${swiper.params.eventsPrefix}init`;
            const onControllerSwiper = e => {
              swiper.controller.control.push(e.detail[0]);
              swiper.update();
              controlElement.removeEventListener(eventName, onControllerSwiper);
            };
            controlElement.addEventListener(eventName, onControllerSwiper);
          }
        });
        return;
      }
      swiper.controller.control = swiper.params.controller.control;
    });
    on('update', () => {
      removeSpline();
    });
    on('resize', () => {
      removeSpline();
    });
    on('observerUpdate', () => {
      removeSpline();
    });
    on('setTranslate', (_s, translate, byController) => {
      if (!swiper.controller.control || swiper.controller.control.destroyed) return;
      swiper.controller.setTranslate(translate, byController);
    });
    on('setTransition', (_s, duration, byController) => {
      if (!swiper.controller.control || swiper.controller.control.destroyed) return;
      swiper.controller.setTransition(duration, byController);
    });
    Object.assign(swiper.controller, {
      setTranslate,
      setTransition
    });
  }

  function A11y(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      a11y: {
        enabled: true,
        notificationClass: 'swiper-notification',
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
        slideLabelMessage: '{{index}} / {{slidesLength}}',
        containerMessage: null,
        containerRoleDescriptionMessage: null,
        containerRole: null,
        itemRoleDescriptionMessage: null,
        slideRole: 'group',
        id: null,
        scrollOnFocus: true
      }
    });
    swiper.a11y = {
      clicked: false
    };
    let liveRegion = null;
    let preventFocusHandler;
    let focusTargetSlideEl;
    let visibilityChangedTimestamp = new Date().getTime();
    function notify(message) {
      const notification = liveRegion;
      if (notification.length === 0) return;
      notification.innerHTML = '';
      notification.innerHTML = message;
    }
    function getRandomNumber(size) {
      if (size === void 0) {
        size = 16;
      }
      const randomChar = () => Math.round(16 * Math.random()).toString(16);
      return 'x'.repeat(size).replace(/x/g, randomChar);
    }
    function makeElFocusable(el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('tabIndex', '0');
      });
    }
    function makeElNotFocusable(el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('tabIndex', '-1');
      });
    }
    function addElRole(el, role) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('role', role);
      });
    }
    function addElRoleDescription(el, description) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-roledescription', description);
      });
    }
    function addElControls(el, controls) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-controls', controls);
      });
    }
    function addElLabel(el, label) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-label', label);
      });
    }
    function addElId(el, id) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('id', id);
      });
    }
    function addElLive(el, live) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-live', live);
      });
    }
    function disableEl(el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-disabled', true);
      });
    }
    function enableEl(el) {
      el = makeElementsArray(el);
      el.forEach(subEl => {
        subEl.setAttribute('aria-disabled', false);
      });
    }
    function onEnterOrSpaceKey(e) {
      if (e.keyCode !== 13 && e.keyCode !== 32) return;
      const params = swiper.params.a11y;
      const targetEl = e.target;
      if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target))) {
        if (!e.target.matches(classesToSelector(swiper.params.pagination.bulletClass))) return;
      }
      if (swiper.navigation && swiper.navigation.prevEl && swiper.navigation.nextEl) {
        const prevEls = makeElementsArray(swiper.navigation.prevEl);
        const nextEls = makeElementsArray(swiper.navigation.nextEl);
        if (nextEls.includes(targetEl)) {
          if (!(swiper.isEnd && !swiper.params.loop)) {
            swiper.slideNext();
          }
          if (swiper.isEnd) {
            notify(params.lastSlideMessage);
          } else {
            notify(params.nextSlideMessage);
          }
        }
        if (prevEls.includes(targetEl)) {
          if (!(swiper.isBeginning && !swiper.params.loop)) {
            swiper.slidePrev();
          }
          if (swiper.isBeginning) {
            notify(params.firstSlideMessage);
          } else {
            notify(params.prevSlideMessage);
          }
        }
      }
      if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) {
        targetEl.click();
      }
    }
    function updateNavigation() {
      if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
      const {
        nextEl,
        prevEl
      } = swiper.navigation;
      if (prevEl) {
        if (swiper.isBeginning) {
          disableEl(prevEl);
          makeElNotFocusable(prevEl);
        } else {
          enableEl(prevEl);
          makeElFocusable(prevEl);
        }
      }
      if (nextEl) {
        if (swiper.isEnd) {
          disableEl(nextEl);
          makeElNotFocusable(nextEl);
        } else {
          enableEl(nextEl);
          makeElFocusable(nextEl);
        }
      }
    }
    function hasPagination() {
      return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
    }
    function hasClickablePagination() {
      return hasPagination() && swiper.params.pagination.clickable;
    }
    function updatePagination() {
      const params = swiper.params.a11y;
      if (!hasPagination()) return;
      swiper.pagination.bullets.forEach(bulletEl => {
        if (swiper.params.pagination.clickable) {
          makeElFocusable(bulletEl);
          if (!swiper.params.pagination.renderBullet) {
            addElRole(bulletEl, 'button');
            addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
          }
        }
        if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) {
          bulletEl.setAttribute('aria-current', 'true');
        } else {
          bulletEl.removeAttribute('aria-current');
        }
      });
    }
    const initNavEl = (el, wrapperId, message) => {
      makeElFocusable(el);
      if (el.tagName !== 'BUTTON') {
        addElRole(el, 'button');
        el.addEventListener('keydown', onEnterOrSpaceKey);
      }
      addElLabel(el, message);
      addElControls(el, wrapperId);
    };
    const handlePointerDown = e => {
      if (focusTargetSlideEl && focusTargetSlideEl !== e.target && !focusTargetSlideEl.contains(e.target)) {
        preventFocusHandler = true;
      }
      swiper.a11y.clicked = true;
    };
    const handlePointerUp = () => {
      preventFocusHandler = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!swiper.destroyed) {
            swiper.a11y.clicked = false;
          }
        });
      });
    };
    const onVisibilityChange = e => {
      visibilityChangedTimestamp = new Date().getTime();
    };
    const handleFocus = e => {
      if (swiper.a11y.clicked || !swiper.params.a11y.scrollOnFocus) return;
      if (new Date().getTime() - visibilityChangedTimestamp < 100) return;
      const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      if (!slideEl || !swiper.slides.includes(slideEl)) return;
      focusTargetSlideEl = slideEl;
      const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
      const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
      if (isActive || isVisible) return;
      if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
      if (swiper.isHorizontal()) {
        swiper.el.scrollLeft = 0;
      } else {
        swiper.el.scrollTop = 0;
      }
      requestAnimationFrame(() => {
        if (preventFocusHandler) return;
        if (swiper.params.loop) {
          swiper.slideToLoop(parseInt(slideEl.getAttribute('data-swiper-slide-index')), 0);
        } else {
          swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
        }
        preventFocusHandler = false;
      });
    };
    const initSlides = () => {
      const params = swiper.params.a11y;
      if (params.itemRoleDescriptionMessage) {
        addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
      }
      if (params.slideRole) {
        addElRole(swiper.slides, params.slideRole);
      }
      const slidesLength = swiper.slides.length;
      if (params.slideLabelMessage) {
        swiper.slides.forEach((slideEl, index) => {
          const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10) : index;
          const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
          addElLabel(slideEl, ariaLabelMessage);
        });
      }
    };
    const init = () => {
      const params = swiper.params.a11y;
      swiper.el.append(liveRegion);

      // Container
      const containerEl = swiper.el;
      if (params.containerRoleDescriptionMessage) {
        addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
      }
      if (params.containerMessage) {
        addElLabel(containerEl, params.containerMessage);
      }
      if (params.containerRole) {
        addElRole(containerEl, params.containerRole);
      }

      // Wrapper
      const wrapperEl = swiper.wrapperEl;
      const wrapperId = params.id || wrapperEl.getAttribute('id') || `swiper-wrapper-${getRandomNumber(16)}`;
      const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
      addElId(wrapperEl, wrapperId);
      addElLive(wrapperEl, live);

      // Slide
      initSlides();

      // Navigation
      let {
        nextEl,
        prevEl
      } = swiper.navigation ? swiper.navigation : {};
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      if (nextEl) {
        nextEl.forEach(el => initNavEl(el, wrapperId, params.nextSlideMessage));
      }
      if (prevEl) {
        prevEl.forEach(el => initNavEl(el, wrapperId, params.prevSlideMessage));
      }

      // Pagination
      if (hasClickablePagination()) {
        const paginationEl = makeElementsArray(swiper.pagination.el);
        paginationEl.forEach(el => {
          el.addEventListener('keydown', onEnterOrSpaceKey);
        });
      }

      // Tab focus
      const document = getDocument();
      document.addEventListener('visibilitychange', onVisibilityChange);
      swiper.el.addEventListener('focus', handleFocus, true);
      swiper.el.addEventListener('focus', handleFocus, true);
      swiper.el.addEventListener('pointerdown', handlePointerDown, true);
      swiper.el.addEventListener('pointerup', handlePointerUp, true);
    };
    function destroy() {
      if (liveRegion) liveRegion.remove();
      let {
        nextEl,
        prevEl
      } = swiper.navigation ? swiper.navigation : {};
      nextEl = makeElementsArray(nextEl);
      prevEl = makeElementsArray(prevEl);
      if (nextEl) {
        nextEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
      }
      if (prevEl) {
        prevEl.forEach(el => el.removeEventListener('keydown', onEnterOrSpaceKey));
      }

      // Pagination
      if (hasClickablePagination()) {
        const paginationEl = makeElementsArray(swiper.pagination.el);
        paginationEl.forEach(el => {
          el.removeEventListener('keydown', onEnterOrSpaceKey);
        });
      }
      const document = getDocument();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      // Tab focus
      if (swiper.el && typeof swiper.el !== 'string') {
        swiper.el.removeEventListener('focus', handleFocus, true);
        swiper.el.removeEventListener('pointerdown', handlePointerDown, true);
        swiper.el.removeEventListener('pointerup', handlePointerUp, true);
      }
    }
    on('beforeInit', () => {
      liveRegion = createElement('span', swiper.params.a11y.notificationClass);
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.setAttribute('aria-atomic', 'true');
    });
    on('afterInit', () => {
      if (!swiper.params.a11y.enabled) return;
      init();
    });
    on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
      if (!swiper.params.a11y.enabled) return;
      initSlides();
    });
    on('fromEdge toEdge afterInit lock unlock', () => {
      if (!swiper.params.a11y.enabled) return;
      updateNavigation();
    });
    on('paginationUpdate', () => {
      if (!swiper.params.a11y.enabled) return;
      updatePagination();
    });
    on('destroy', () => {
      if (!swiper.params.a11y.enabled) return;
      destroy();
    });
  }

  function History(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      history: {
        enabled: false,
        root: '',
        replaceState: false,
        key: 'slides',
        keepQuery: false
      }
    });
    let initialized = false;
    let paths = {};
    const slugify = text => {
      return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    };
    const getPathValues = urlOverride => {
      const window = getWindow();
      let location;
      if (urlOverride) {
        location = new URL(urlOverride);
      } else {
        location = window.location;
      }
      const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
      const total = pathArray.length;
      const key = pathArray[total - 2];
      const value = pathArray[total - 1];
      return {
        key,
        value
      };
    };
    const setHistory = (key, index) => {
      const window = getWindow();
      if (!initialized || !swiper.params.history.enabled) return;
      let location;
      if (swiper.params.url) {
        location = new URL(swiper.params.url);
      } else {
        location = window.location;
      }
      const slide = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${index}"]`) : swiper.slides[index];
      let value = slugify(slide.getAttribute('data-history'));
      if (swiper.params.history.root.length > 0) {
        let root = swiper.params.history.root;
        if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
        value = `${root}/${key ? `${key}/` : ''}${value}`;
      } else if (!location.pathname.includes(key)) {
        value = `${key ? `${key}/` : ''}${value}`;
      }
      if (swiper.params.history.keepQuery) {
        value += location.search;
      }
      const currentState = window.history.state;
      if (currentState && currentState.value === value) {
        return;
      }
      if (swiper.params.history.replaceState) {
        window.history.replaceState({
          value
        }, null, value);
      } else {
        window.history.pushState({
          value
        }, null, value);
      }
    };
    const scrollToSlide = (speed, value, runCallbacks) => {
      if (value) {
        for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
          const slide = swiper.slides[i];
          const slideHistory = slugify(slide.getAttribute('data-history'));
          if (slideHistory === value) {
            const index = swiper.getSlideIndex(slide);
            swiper.slideTo(index, speed, runCallbacks);
          }
        }
      } else {
        swiper.slideTo(0, speed, runCallbacks);
      }
    };
    const setHistoryPopState = () => {
      paths = getPathValues(swiper.params.url);
      scrollToSlide(swiper.params.speed, paths.value, false);
    };
    const init = () => {
      const window = getWindow();
      if (!swiper.params.history) return;
      if (!window.history || !window.history.pushState) {
        swiper.params.history.enabled = false;
        swiper.params.hashNavigation.enabled = true;
        return;
      }
      initialized = true;
      paths = getPathValues(swiper.params.url);
      if (!paths.key && !paths.value) {
        if (!swiper.params.history.replaceState) {
          window.addEventListener('popstate', setHistoryPopState);
        }
        return;
      }
      scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);
      if (!swiper.params.history.replaceState) {
        window.addEventListener('popstate', setHistoryPopState);
      }
    };
    const destroy = () => {
      const window = getWindow();
      if (!swiper.params.history.replaceState) {
        window.removeEventListener('popstate', setHistoryPopState);
      }
    };
    on('init', () => {
      if (swiper.params.history.enabled) {
        init();
      }
    });
    on('destroy', () => {
      if (swiper.params.history.enabled) {
        destroy();
      }
    });
    on('transitionEnd _freeModeNoMomentumRelease', () => {
      if (initialized) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
    on('slideChange', () => {
      if (initialized && swiper.params.cssMode) {
        setHistory(swiper.params.history.key, swiper.activeIndex);
      }
    });
  }

  function HashNavigation(_ref) {
    let {
      swiper,
      extendParams,
      emit,
      on
    } = _ref;
    let initialized = false;
    const document = getDocument();
    const window = getWindow();
    extendParams({
      hashNavigation: {
        enabled: false,
        replaceState: false,
        watchState: false,
        getSlideIndex(_s, hash) {
          if (swiper.virtual && swiper.params.virtual.enabled) {
            const slideWithHash = swiper.slides.find(slideEl => slideEl.getAttribute('data-hash') === hash);
            if (!slideWithHash) return 0;
            const index = parseInt(slideWithHash.getAttribute('data-swiper-slide-index'), 10);
            return index;
          }
          return swiper.getSlideIndex(elementChildren(swiper.slidesEl, `.${swiper.params.slideClass}[data-hash="${hash}"], swiper-slide[data-hash="${hash}"]`)[0]);
        }
      }
    });
    const onHashChange = () => {
      emit('hashChange');
      const newHash = document.location.hash.replace('#', '');
      const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
      const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') : '';
      if (newHash !== activeSlideHash) {
        const newIndex = swiper.params.hashNavigation.getSlideIndex(swiper, newHash);
        if (typeof newIndex === 'undefined' || Number.isNaN(newIndex)) return;
        swiper.slideTo(newIndex);
      }
    };
    const setHash = () => {
      if (!initialized || !swiper.params.hashNavigation.enabled) return;
      const activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slidesEl.querySelector(`[data-swiper-slide-index="${swiper.activeIndex}"]`) : swiper.slides[swiper.activeIndex];
      const activeSlideHash = activeSlideEl ? activeSlideEl.getAttribute('data-hash') || activeSlideEl.getAttribute('data-history') : '';
      if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
        window.history.replaceState(null, null, `#${activeSlideHash}` || '');
        emit('hashSet');
      } else {
        document.location.hash = activeSlideHash || '';
        emit('hashSet');
      }
    };
    const init = () => {
      if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
      initialized = true;
      const hash = document.location.hash.replace('#', '');
      if (hash) {
        const speed = 0;
        const index = swiper.params.hashNavigation.getSlideIndex(swiper, hash);
        swiper.slideTo(index || 0, speed, swiper.params.runCallbacksOnInit, true);
      }
      if (swiper.params.hashNavigation.watchState) {
        window.addEventListener('hashchange', onHashChange);
      }
    };
    const destroy = () => {
      if (swiper.params.hashNavigation.watchState) {
        window.removeEventListener('hashchange', onHashChange);
      }
    };
    on('init', () => {
      if (swiper.params.hashNavigation.enabled) {
        init();
      }
    });
    on('destroy', () => {
      if (swiper.params.hashNavigation.enabled) {
        destroy();
      }
    });
    on('transitionEnd _freeModeNoMomentumRelease', () => {
      if (initialized) {
        setHash();
      }
    });
    on('slideChange', () => {
      if (initialized && swiper.params.cssMode) {
        setHash();
      }
    });
  }

  /* eslint no-underscore-dangle: "off" */
  /* eslint no-use-before-define: "off" */
  function Autoplay(_ref) {
    let {
      swiper,
      extendParams,
      on,
      emit,
      params
    } = _ref;
    swiper.autoplay = {
      running: false,
      paused: false,
      timeLeft: 0
    };
    extendParams({
      autoplay: {
        enabled: false,
        delay: 3000,
        waitForTransition: true,
        disableOnInteraction: false,
        stopOnLastSlide: false,
        reverseDirection: false,
        pauseOnMouseEnter: false
      }
    });
    let timeout;
    let raf;
    let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3000;
    let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3000;
    let autoplayTimeLeft;
    let autoplayStartTime = new Date().getTime();
    let wasPaused;
    let isTouched;
    let pausedByTouch;
    let touchStartTimeout;
    let slideChanged;
    let pausedByInteraction;
    let pausedByPointerEnter;
    function onTransitionEnd(e) {
      if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
      if (e.target !== swiper.wrapperEl) return;
      swiper.wrapperEl.removeEventListener('transitionend', onTransitionEnd);
      if (pausedByPointerEnter || e.detail && e.detail.bySwiperTouchMove) {
        return;
      }
      resume();
    }
    const calcTimeLeft = () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (swiper.autoplay.paused) {
        wasPaused = true;
      } else if (wasPaused) {
        autoplayDelayCurrent = autoplayTimeLeft;
        wasPaused = false;
      }
      const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - new Date().getTime();
      swiper.autoplay.timeLeft = timeLeft;
      emit('autoplayTimeLeft', timeLeft, timeLeft / autoplayDelayTotal);
      raf = requestAnimationFrame(() => {
        calcTimeLeft();
      });
    };
    const getSlideDelay = () => {
      let activeSlideEl;
      if (swiper.virtual && swiper.params.virtual.enabled) {
        activeSlideEl = swiper.slides.find(slideEl => slideEl.classList.contains('swiper-slide-active'));
      } else {
        activeSlideEl = swiper.slides[swiper.activeIndex];
      }
      if (!activeSlideEl) return undefined;
      const currentSlideDelay = parseInt(activeSlideEl.getAttribute('data-swiper-autoplay'), 10);
      return currentSlideDelay;
    };
    const run = delayForce => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      cancelAnimationFrame(raf);
      calcTimeLeft();
      let delay = typeof delayForce === 'undefined' ? swiper.params.autoplay.delay : delayForce;
      autoplayDelayTotal = swiper.params.autoplay.delay;
      autoplayDelayCurrent = swiper.params.autoplay.delay;
      const currentSlideDelay = getSlideDelay();
      if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === 'undefined') {
        delay = currentSlideDelay;
        autoplayDelayTotal = currentSlideDelay;
        autoplayDelayCurrent = currentSlideDelay;
      }
      autoplayTimeLeft = delay;
      const speed = swiper.params.speed;
      const proceed = () => {
        if (!swiper || swiper.destroyed) return;
        if (swiper.params.autoplay.reverseDirection) {
          if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
            swiper.slidePrev(speed, true, true);
            emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            swiper.slideTo(swiper.slides.length - 1, speed, true, true);
            emit('autoplay');
          }
        } else {
          if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
            swiper.slideNext(speed, true, true);
            emit('autoplay');
          } else if (!swiper.params.autoplay.stopOnLastSlide) {
            swiper.slideTo(0, speed, true, true);
            emit('autoplay');
          }
        }
        if (swiper.params.cssMode) {
          autoplayStartTime = new Date().getTime();
          requestAnimationFrame(() => {
            run();
          });
        }
      };
      if (delay > 0) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          proceed();
        }, delay);
      } else {
        requestAnimationFrame(() => {
          proceed();
        });
      }

      // eslint-disable-next-line
      return delay;
    };
    const start = () => {
      autoplayStartTime = new Date().getTime();
      swiper.autoplay.running = true;
      run();
      emit('autoplayStart');
    };
    const stop = () => {
      swiper.autoplay.running = false;
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      emit('autoplayStop');
    };
    const pause = (internal, reset) => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      clearTimeout(timeout);
      if (!internal) {
        pausedByInteraction = true;
      }
      const proceed = () => {
        emit('autoplayPause');
        if (swiper.params.autoplay.waitForTransition) {
          swiper.wrapperEl.addEventListener('transitionend', onTransitionEnd);
        } else {
          resume();
        }
      };
      swiper.autoplay.paused = true;
      if (reset) {
        if (slideChanged) {
          autoplayTimeLeft = swiper.params.autoplay.delay;
        }
        slideChanged = false;
        proceed();
        return;
      }
      const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
      autoplayTimeLeft = delay - (new Date().getTime() - autoplayStartTime);
      if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
      if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
      proceed();
    };
    const resume = () => {
      if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running) return;
      autoplayStartTime = new Date().getTime();
      if (pausedByInteraction) {
        pausedByInteraction = false;
        run(autoplayTimeLeft);
      } else {
        run();
      }
      swiper.autoplay.paused = false;
      emit('autoplayResume');
    };
    const onVisibilityChange = () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      const document = getDocument();
      if (document.visibilityState === 'hidden') {
        pausedByInteraction = true;
        pause(true);
      }
      if (document.visibilityState === 'visible') {
        resume();
      }
    };
    const onPointerEnter = e => {
      if (e.pointerType !== 'mouse') return;
      pausedByInteraction = true;
      pausedByPointerEnter = true;
      if (swiper.animating || swiper.autoplay.paused) return;
      pause(true);
    };
    const onPointerLeave = e => {
      if (e.pointerType !== 'mouse') return;
      pausedByPointerEnter = false;
      if (swiper.autoplay.paused) {
        resume();
      }
    };
    const attachMouseEvents = () => {
      if (swiper.params.autoplay.pauseOnMouseEnter) {
        swiper.el.addEventListener('pointerenter', onPointerEnter);
        swiper.el.addEventListener('pointerleave', onPointerLeave);
      }
    };
    const detachMouseEvents = () => {
      if (swiper.el && typeof swiper.el !== 'string') {
        swiper.el.removeEventListener('pointerenter', onPointerEnter);
        swiper.el.removeEventListener('pointerleave', onPointerLeave);
      }
    };
    const attachDocumentEvents = () => {
      const document = getDocument();
      document.addEventListener('visibilitychange', onVisibilityChange);
    };
    const detachDocumentEvents = () => {
      const document = getDocument();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    on('init', () => {
      if (swiper.params.autoplay.enabled) {
        attachMouseEvents();
        attachDocumentEvents();
        start();
      }
    });
    on('destroy', () => {
      detachMouseEvents();
      detachDocumentEvents();
      if (swiper.autoplay.running) {
        stop();
      }
    });
    on('_freeModeStaticRelease', () => {
      if (pausedByTouch || pausedByInteraction) {
        resume();
      }
    });
    on('_freeModeNoMomentumRelease', () => {
      if (!swiper.params.autoplay.disableOnInteraction) {
        pause(true, true);
      } else {
        stop();
      }
    });
    on('beforeTransitionStart', (_s, speed, internal) => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (internal || !swiper.params.autoplay.disableOnInteraction) {
        pause(true, true);
      } else {
        stop();
      }
    });
    on('sliderFirstMove', () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
        return;
      }
      isTouched = true;
      pausedByTouch = false;
      pausedByInteraction = false;
      touchStartTimeout = setTimeout(() => {
        pausedByInteraction = true;
        pausedByTouch = true;
        pause(true);
      }, 200);
    });
    on('touchEnd', () => {
      if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
      clearTimeout(touchStartTimeout);
      clearTimeout(timeout);
      if (swiper.params.autoplay.disableOnInteraction) {
        pausedByTouch = false;
        isTouched = false;
        return;
      }
      if (pausedByTouch && swiper.params.cssMode) resume();
      pausedByTouch = false;
      isTouched = false;
    });
    on('slideChange', () => {
      if (swiper.destroyed || !swiper.autoplay.running) return;
      slideChanged = true;
    });
    Object.assign(swiper.autoplay, {
      start,
      stop,
      pause,
      resume
    });
  }

  function Thumb(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      thumbs: {
        swiper: null,
        multipleActiveThumbs: true,
        autoScrollOffset: 0,
        slideThumbActiveClass: 'swiper-slide-thumb-active',
        thumbsContainerClass: 'swiper-thumbs'
      }
    });
    let initialized = false;
    let swiperCreated = false;
    swiper.thumbs = {
      swiper: null
    };
    function onThumbClick() {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper || thumbsSwiper.destroyed) return;
      const clickedIndex = thumbsSwiper.clickedIndex;
      const clickedSlide = thumbsSwiper.clickedSlide;
      if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
      if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
      let slideToIndex;
      if (thumbsSwiper.params.loop) {
        slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute('data-swiper-slide-index'), 10);
      } else {
        slideToIndex = clickedIndex;
      }
      if (swiper.params.loop) {
        swiper.slideToLoop(slideToIndex);
      } else {
        swiper.slideTo(slideToIndex);
      }
    }
    function init() {
      const {
        thumbs: thumbsParams
      } = swiper.params;
      if (initialized) return false;
      initialized = true;
      const SwiperClass = swiper.constructor;
      if (thumbsParams.swiper instanceof SwiperClass) {
        if (thumbsParams.swiper.destroyed) {
          initialized = false;
          return false;
        }
        swiper.thumbs.swiper = thumbsParams.swiper;
        Object.assign(swiper.thumbs.swiper.originalParams, {
          watchSlidesProgress: true,
          slideToClickedSlide: false
        });
        Object.assign(swiper.thumbs.swiper.params, {
          watchSlidesProgress: true,
          slideToClickedSlide: false
        });
        swiper.thumbs.swiper.update();
      } else if (isObject(thumbsParams.swiper)) {
        const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
        Object.assign(thumbsSwiperParams, {
          watchSlidesProgress: true,
          slideToClickedSlide: false
        });
        swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
        swiperCreated = true;
      }
      swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
      swiper.thumbs.swiper.on('tap', onThumbClick);
      return true;
    }
    function update(initial) {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper || thumbsSwiper.destroyed) return;
      const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;

      // Activate thumbs
      let thumbsToActivate = 1;
      const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
      if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
        thumbsToActivate = swiper.params.slidesPerView;
      }
      if (!swiper.params.thumbs.multipleActiveThumbs) {
        thumbsToActivate = 1;
      }
      thumbsToActivate = Math.floor(thumbsToActivate);
      thumbsSwiper.slides.forEach(slideEl => slideEl.classList.remove(thumbActiveClass));
      if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach(slideEl => {
            slideEl.classList.add(thumbActiveClass);
          });
        }
      } else {
        for (let i = 0; i < thumbsToActivate; i += 1) {
          if (thumbsSwiper.slides[swiper.realIndex + i]) {
            thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
          }
        }
      }
      const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
      const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
      if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
        const currentThumbsIndex = thumbsSwiper.activeIndex;
        let newThumbsIndex;
        let direction;
        if (thumbsSwiper.params.loop) {
          const newThumbsSlide = thumbsSwiper.slides.find(slideEl => slideEl.getAttribute('data-swiper-slide-index') === `${swiper.realIndex}`);
          newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
          direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
        } else {
          newThumbsIndex = swiper.realIndex;
          direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
        }
        if (useOffset) {
          newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
        }
        if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
          if (thumbsSwiper.params.centeredSlides) {
            if (newThumbsIndex > currentThumbsIndex) {
              newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
            } else {
              newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
            }
          } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;
          thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
        }
      }
    }
    on('beforeInit', () => {
      const {
        thumbs
      } = swiper.params;
      if (!thumbs || !thumbs.swiper) return;
      if (typeof thumbs.swiper === 'string' || thumbs.swiper instanceof HTMLElement) {
        const document = getDocument();
        const getThumbsElementAndInit = () => {
          const thumbsElement = typeof thumbs.swiper === 'string' ? document.querySelector(thumbs.swiper) : thumbs.swiper;
          if (thumbsElement && thumbsElement.swiper) {
            thumbs.swiper = thumbsElement.swiper;
            init();
            update(true);
          } else if (thumbsElement) {
            const eventName = `${swiper.params.eventsPrefix}init`;
            const onThumbsSwiper = e => {
              thumbs.swiper = e.detail[0];
              thumbsElement.removeEventListener(eventName, onThumbsSwiper);
              init();
              update(true);
              thumbs.swiper.update();
              swiper.update();
            };
            thumbsElement.addEventListener(eventName, onThumbsSwiper);
          }
          return thumbsElement;
        };
        const watchForThumbsToAppear = () => {
          if (swiper.destroyed) return;
          const thumbsElement = getThumbsElementAndInit();
          if (!thumbsElement) {
            requestAnimationFrame(watchForThumbsToAppear);
          }
        };
        requestAnimationFrame(watchForThumbsToAppear);
      } else {
        init();
        update(true);
      }
    });
    on('slideChange update resize observerUpdate', () => {
      update();
    });
    on('setTransition', (_s, duration) => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper || thumbsSwiper.destroyed) return;
      thumbsSwiper.setTransition(duration);
    });
    on('beforeDestroy', () => {
      const thumbsSwiper = swiper.thumbs.swiper;
      if (!thumbsSwiper || thumbsSwiper.destroyed) return;
      if (swiperCreated) {
        thumbsSwiper.destroy();
      }
    });
    Object.assign(swiper.thumbs, {
      init,
      update
    });
  }

  function freeMode(_ref) {
    let {
      swiper,
      extendParams,
      emit,
      once
    } = _ref;
    extendParams({
      freeMode: {
        enabled: false,
        momentum: true,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        momentumVelocityRatio: 1,
        sticky: false,
        minimumVelocity: 0.02
      }
    });
    function onTouchStart() {
      if (swiper.params.cssMode) return;
      const translate = swiper.getTranslate();
      swiper.setTranslate(translate);
      swiper.setTransition(0);
      swiper.touchEventsData.velocities.length = 0;
      swiper.freeMode.onTouchEnd({
        currentPos: swiper.rtl ? swiper.translate : -swiper.translate
      });
    }
    function onTouchMove() {
      if (swiper.params.cssMode) return;
      const {
        touchEventsData: data,
        touches
      } = swiper;
      // Velocity
      if (data.velocities.length === 0) {
        data.velocities.push({
          position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
          time: data.touchStartTime
        });
      }
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
        time: now()
      });
    }
    function onTouchEnd(_ref2) {
      let {
        currentPos
      } = _ref2;
      if (swiper.params.cssMode) return;
      const {
        params,
        wrapperEl,
        rtlTranslate: rtl,
        snapGrid,
        touchEventsData: data
      } = swiper;
      // Time diff
      const touchEndTime = now();
      const timeDiff = touchEndTime - data.touchStartTime;
      if (currentPos < -swiper.minTranslate()) {
        swiper.slideTo(swiper.activeIndex);
        return;
      }
      if (currentPos > -swiper.maxTranslate()) {
        if (swiper.slides.length < snapGrid.length) {
          swiper.slideTo(snapGrid.length - 1);
        } else {
          swiper.slideTo(swiper.slides.length - 1);
        }
        return;
      }
      if (params.freeMode.momentum) {
        if (data.velocities.length > 1) {
          const lastMoveEvent = data.velocities.pop();
          const velocityEvent = data.velocities.pop();
          const distance = lastMoveEvent.position - velocityEvent.position;
          const time = lastMoveEvent.time - velocityEvent.time;
          swiper.velocity = distance / time;
          swiper.velocity /= 2;
          if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
            swiper.velocity = 0;
          }
          // this implies that the user stopped moving a finger then released.
          // There would be no events with distance zero, so the last event is stale.
          if (time > 150 || now() - lastMoveEvent.time > 300) {
            swiper.velocity = 0;
          }
        } else {
          swiper.velocity = 0;
        }
        swiper.velocity *= params.freeMode.momentumVelocityRatio;
        data.velocities.length = 0;
        let momentumDuration = 1000 * params.freeMode.momentumRatio;
        const momentumDistance = swiper.velocity * momentumDuration;
        let newPosition = swiper.translate + momentumDistance;
        if (rtl) newPosition = -newPosition;
        let doBounce = false;
        let afterBouncePosition;
        const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
        let needsLoopFix;
        if (newPosition < swiper.maxTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition + swiper.maxTranslate() < -bounceAmount) {
              newPosition = swiper.maxTranslate() - bounceAmount;
            }
            afterBouncePosition = swiper.maxTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.maxTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (newPosition > swiper.minTranslate()) {
          if (params.freeMode.momentumBounce) {
            if (newPosition - swiper.minTranslate() > bounceAmount) {
              newPosition = swiper.minTranslate() + bounceAmount;
            }
            afterBouncePosition = swiper.minTranslate();
            doBounce = true;
            data.allowMomentumBounce = true;
          } else {
            newPosition = swiper.minTranslate();
          }
          if (params.loop && params.centeredSlides) needsLoopFix = true;
        } else if (params.freeMode.sticky) {
          let nextSlide;
          for (let j = 0; j < snapGrid.length; j += 1) {
            if (snapGrid[j] > -newPosition) {
              nextSlide = j;
              break;
            }
          }
          if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
            newPosition = snapGrid[nextSlide];
          } else {
            newPosition = snapGrid[nextSlide - 1];
          }
          newPosition = -newPosition;
        }
        if (needsLoopFix) {
          once('transitionEnd', () => {
            swiper.loopFix();
          });
        }
        // Fix duration
        if (swiper.velocity !== 0) {
          if (rtl) {
            momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
          } else {
            momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
          }
          if (params.freeMode.sticky) {
            // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
            // event, then durations can be 20+ seconds to slide one (or zero!) slides.
            // It's easy to see this when simulating touch with mouse events. To fix this,
            // limit single-slide swipes to the default slide duration. This also has the
            // nice side effect of matching slide speed if the user stopped moving before
            // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
            // For faster swipes, also apply limits (albeit higher ones).
            const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
            const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];
            if (moveDistance < currentSlideSize) {
              momentumDuration = params.speed;
            } else if (moveDistance < 2 * currentSlideSize) {
              momentumDuration = params.speed * 1.5;
            } else {
              momentumDuration = params.speed * 2.5;
            }
          }
        } else if (params.freeMode.sticky) {
          swiper.slideToClosest();
          return;
        }
        if (params.freeMode.momentumBounce && doBounce) {
          swiper.updateProgress(afterBouncePosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          swiper.animating = true;
          elementTransitionEnd(wrapperEl, () => {
            if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
            emit('momentumBounce');
            swiper.setTransition(params.speed);
            setTimeout(() => {
              swiper.setTranslate(afterBouncePosition);
              elementTransitionEnd(wrapperEl, () => {
                if (!swiper || swiper.destroyed) return;
                swiper.transitionEnd();
              });
            }, 0);
          });
        } else if (swiper.velocity) {
          emit('_freeModeNoMomentumRelease');
          swiper.updateProgress(newPosition);
          swiper.setTransition(momentumDuration);
          swiper.setTranslate(newPosition);
          swiper.transitionStart(true, swiper.swipeDirection);
          if (!swiper.animating) {
            swiper.animating = true;
            elementTransitionEnd(wrapperEl, () => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }
        } else {
          swiper.updateProgress(newPosition);
        }
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      } else if (params.freeMode) {
        emit('_freeModeNoMomentumRelease');
      }
      if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
        emit('_freeModeStaticRelease');
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
      }
    }
    Object.assign(swiper, {
      freeMode: {
        onTouchStart,
        onTouchMove,
        onTouchEnd
      }
    });
  }

  function Grid(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      grid: {
        rows: 1,
        fill: 'column'
      }
    });
    let slidesNumberEvenToRows;
    let slidesPerRow;
    let numFullColumns;
    let wasMultiRow;
    const getSpaceBetween = () => {
      let spaceBetween = swiper.params.spaceBetween;
      if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiper.size;
      } else if (typeof spaceBetween === 'string') {
        spaceBetween = parseFloat(spaceBetween);
      }
      return spaceBetween;
    };
    const initSlides = slides => {
      const {
        slidesPerView
      } = swiper.params;
      const {
        rows,
        fill
      } = swiper.params.grid;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
      numFullColumns = Math.floor(slidesLength / rows);
      if (Math.floor(slidesLength / rows) === slidesLength / rows) {
        slidesNumberEvenToRows = slidesLength;
      } else {
        slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
      }
      if (slidesPerView !== 'auto' && fill === 'row') {
        slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
      }
      slidesPerRow = slidesNumberEvenToRows / rows;
    };
    const unsetSlides = () => {
      if (swiper.slides) {
        swiper.slides.forEach(slide => {
          if (slide.swiperSlideGridSet) {
            slide.style.height = '';
            slide.style[swiper.getDirectionLabel('margin-top')] = '';
          }
        });
      }
    };
    const updateSlide = (i, slide, slides) => {
      const {
        slidesPerGroup
      } = swiper.params;
      const spaceBetween = getSpaceBetween();
      const {
        rows,
        fill
      } = swiper.params.grid;
      const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : slides.length;
      // Set slides order
      let newSlideOrderIndex;
      let column;
      let row;
      if (fill === 'row' && slidesPerGroup > 1) {
        const groupIndex = Math.floor(i / (slidesPerGroup * rows));
        const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
        const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
        row = Math.floor(slideIndexInGroup / columnsInGroup);
        column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
        newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
        slide.style.order = newSlideOrderIndex;
      } else if (fill === 'column') {
        column = Math.floor(i / rows);
        row = i - column * rows;
        if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
          row += 1;
          if (row >= rows) {
            row = 0;
            column += 1;
          }
        }
      } else {
        row = Math.floor(i / slidesPerRow);
        column = i - row * slidesPerRow;
      }
      slide.row = row;
      slide.column = column;
      slide.style.height = `calc((100% - ${(rows - 1) * spaceBetween}px) / ${rows})`;
      slide.style[swiper.getDirectionLabel('margin-top')] = row !== 0 ? spaceBetween && `${spaceBetween}px` : '';
      slide.swiperSlideGridSet = true;
    };
    const updateWrapperSize = (slideSize, snapGrid) => {
      const {
        centeredSlides,
        roundLengths
      } = swiper.params;
      const spaceBetween = getSpaceBetween();
      const {
        rows
      } = swiper.params.grid;
      swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
      swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
      if (!swiper.params.cssMode) {
        swiper.wrapperEl.style[swiper.getDirectionLabel('width')] = `${swiper.virtualSize + spaceBetween}px`;
      }
      if (centeredSlides) {
        const newSlidesGrid = [];
        for (let i = 0; i < snapGrid.length; i += 1) {
          let slidesGridItem = snapGrid[i];
          if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
          if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
        }
        snapGrid.splice(0, snapGrid.length);
        snapGrid.push(...newSlidesGrid);
      }
    };
    const onInit = () => {
      wasMultiRow = swiper.params.grid && swiper.params.grid.rows > 1;
    };
    const onUpdate = () => {
      const {
        params,
        el
      } = swiper;
      const isMultiRow = params.grid && params.grid.rows > 1;
      if (wasMultiRow && !isMultiRow) {
        el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
        numFullColumns = 1;
        swiper.emitContainerClasses();
      } else if (!wasMultiRow && isMultiRow) {
        el.classList.add(`${params.containerModifierClass}grid`);
        if (params.grid.fill === 'column') {
          el.classList.add(`${params.containerModifierClass}grid-column`);
        }
        swiper.emitContainerClasses();
      }
      wasMultiRow = isMultiRow;
    };
    on('init', onInit);
    on('update', onUpdate);
    swiper.grid = {
      initSlides,
      unsetSlides,
      updateSlide,
      updateWrapperSize
    };
  }

  function appendSlide(slides) {
    const swiper = this;
    const {
      params,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    const appendElement = slideEl => {
      if (typeof slideEl === 'string') {
        const tempDOM = document.createElement('div');
        tempDOM.innerHTML = slideEl;
        slidesEl.append(tempDOM.children[0]);
        tempDOM.innerHTML = '';
      } else {
        slidesEl.append(slideEl);
      }
    };
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) appendElement(slides[i]);
      }
    } else {
      appendElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
  }

  function prependSlide(slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    if (params.loop) {
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndex + 1;
    const prependElement = slideEl => {
      if (typeof slideEl === 'string') {
        const tempDOM = document.createElement('div');
        tempDOM.innerHTML = slideEl;
        slidesEl.prepend(tempDOM.children[0]);
        tempDOM.innerHTML = '';
      } else {
        slidesEl.prepend(slideEl);
      }
    };
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) prependElement(slides[i]);
      }
      newActiveIndex = activeIndex + slides.length;
    } else {
      prependElement(slides);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    swiper.slideTo(newActiveIndex, 0, false);
  }

  function addSlide(index, slides) {
    const swiper = this;
    const {
      params,
      activeIndex,
      slidesEl
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
      swiper.recalcSlides();
    }
    const baseLength = swiper.slides.length;
    if (index <= 0) {
      swiper.prependSlide(slides);
      return;
    }
    if (index >= baseLength) {
      swiper.appendSlide(slides);
      return;
    }
    let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
    const slidesBuffer = [];
    for (let i = baseLength - 1; i >= index; i -= 1) {
      const currentSlide = swiper.slides[i];
      currentSlide.remove();
      slidesBuffer.unshift(currentSlide);
    }
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) slidesEl.append(slides[i]);
      }
      newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
    } else {
      slidesEl.append(slides);
    }
    for (let i = 0; i < slidesBuffer.length; i += 1) {
      slidesEl.append(slidesBuffer[i]);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeSlide(slidesIndexes) {
    const swiper = this;
    const {
      params,
      activeIndex
    } = swiper;
    let activeIndexBuffer = activeIndex;
    if (params.loop) {
      activeIndexBuffer -= swiper.loopedSlides;
      swiper.loopDestroy();
    }
    let newActiveIndex = activeIndexBuffer;
    let indexToRemove;
    if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
      for (let i = 0; i < slidesIndexes.length; i += 1) {
        indexToRemove = slidesIndexes[i];
        if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
        if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      }
      newActiveIndex = Math.max(newActiveIndex, 0);
    } else {
      indexToRemove = slidesIndexes;
      if (swiper.slides[indexToRemove]) swiper.slides[indexToRemove].remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
      newActiveIndex = Math.max(newActiveIndex, 0);
    }
    swiper.recalcSlides();
    if (params.loop) {
      swiper.loopCreate();
    }
    if (!params.observer || swiper.isElement) {
      swiper.update();
    }
    if (params.loop) {
      swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
    } else {
      swiper.slideTo(newActiveIndex, 0, false);
    }
  }

  function removeAllSlides() {
    const swiper = this;
    const slidesIndexes = [];
    for (let i = 0; i < swiper.slides.length; i += 1) {
      slidesIndexes.push(i);
    }
    swiper.removeSlide(slidesIndexes);
  }

  function Manipulation(_ref) {
    let {
      swiper
    } = _ref;
    Object.assign(swiper, {
      appendSlide: appendSlide.bind(swiper),
      prependSlide: prependSlide.bind(swiper),
      addSlide: addSlide.bind(swiper),
      removeSlide: removeSlide.bind(swiper),
      removeAllSlides: removeAllSlides.bind(swiper)
    });
  }

  function effectInit(params) {
    const {
      effect,
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams,
      perspective,
      recreateShadows,
      getEffectParams
    } = params;
    on('beforeInit', () => {
      if (swiper.params.effect !== effect) return;
      swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
      if (perspective && perspective()) {
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
      }
      const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
      Object.assign(swiper.params, overwriteParamsResult);
      Object.assign(swiper.originalParams, overwriteParamsResult);
    });
    on('setTranslate', () => {
      if (swiper.params.effect !== effect) return;
      setTranslate();
    });
    on('setTransition', (_s, duration) => {
      if (swiper.params.effect !== effect) return;
      setTransition(duration);
    });
    on('transitionEnd', () => {
      if (swiper.params.effect !== effect) return;
      if (recreateShadows) {
        if (!getEffectParams || !getEffectParams().slideShadows) return;
        // remove shadows
        swiper.slides.forEach(slideEl => {
          slideEl.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => shadowEl.remove());
        });
        // create new one
        recreateShadows();
      }
    });
    let requireUpdateOnVirtual;
    on('virtualUpdate', () => {
      if (swiper.params.effect !== effect) return;
      if (!swiper.slides.length) {
        requireUpdateOnVirtual = true;
      }
      requestAnimationFrame(() => {
        if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
          setTranslate();
          requireUpdateOnVirtual = false;
        }
      });
    });
  }

  function effectTarget(effectParams, slideEl) {
    const transformEl = getSlideTransformEl(slideEl);
    if (transformEl !== slideEl) {
      transformEl.style.backfaceVisibility = 'hidden';
      transformEl.style['-webkit-backface-visibility'] = 'hidden';
    }
    return transformEl;
  }

  function effectVirtualTransitionEnd(_ref) {
    let {
      swiper,
      duration,
      transformElements,
      allSlides
    } = _ref;
    const {
      activeIndex
    } = swiper;
    const getSlide = el => {
      if (!el.parentElement) {
        // assume shadow root
        const slide = swiper.slides.find(slideEl => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode);
        return slide;
      }
      return el.parentElement;
    };
    if (swiper.params.virtualTranslate && duration !== 0) {
      let eventTriggered = false;
      let transitionEndTarget;
      if (allSlides) {
        transitionEndTarget = transformElements;
      } else {
        transitionEndTarget = transformElements.filter(transformEl => {
          const el = transformEl.classList.contains('swiper-slide-transform') ? getSlide(transformEl) : transformEl;
          return swiper.getSlideIndex(el) === activeIndex;
        });
      }
      transitionEndTarget.forEach(el => {
        elementTransitionEnd(el, () => {
          if (eventTriggered) return;
          if (!swiper || swiper.destroyed) return;
          eventTriggered = true;
          swiper.animating = false;
          const evt = new window.CustomEvent('transitionend', {
            bubbles: true,
            cancelable: true
          });
          swiper.wrapperEl.dispatchEvent(evt);
        });
      });
    }
  }

  function EffectFade(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      fadeEffect: {
        crossFade: false
      }
    });
    const setTranslate = () => {
      const {
        slides
      } = swiper;
      const params = swiper.params.fadeEffect;
      for (let i = 0; i < slides.length; i += 1) {
        const slideEl = swiper.slides[i];
        const offset = slideEl.swiperSlideOffset;
        let tx = -offset;
        if (!swiper.params.virtualTranslate) tx -= swiper.translate;
        let ty = 0;
        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
        }
        const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.opacity = slideOpacity;
        targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
      }
    };
    const setTransition = duration => {
      const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
      transformElements.forEach(el => {
        el.style.transitionDuration = `${duration}ms`;
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements,
        allSlides: true
      });
    };
    effectInit({
      effect: 'fade',
      swiper,
      on,
      setTranslate,
      setTransition,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCube(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      cubeEffect: {
        slideShadows: true,
        shadow: true,
        shadowOffset: 20,
        shadowScale: 0.94
      }
    });
    const createSlideShadows = (slideEl, progress, isHorizontal) => {
      let shadowBefore = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
      let shadowAfter = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
      if (!shadowBefore) {
        shadowBefore = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}`.split(' '));
        slideEl.append(shadowBefore);
      }
      if (!shadowAfter) {
        shadowAfter = createElement('div', `swiper-slide-shadow-cube swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}`.split(' '));
        slideEl.append(shadowAfter);
      }
      if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
      if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
    };
    const recreateShadows = () => {
      // create new ones
      const isHorizontal = swiper.isHorizontal();
      swiper.slides.forEach(slideEl => {
        const progress = Math.max(Math.min(slideEl.progress, 1), -1);
        createSlideShadows(slideEl, progress, isHorizontal);
      });
    };
    const setTranslate = () => {
      const {
        el,
        wrapperEl,
        slides,
        width: swiperWidth,
        height: swiperHeight,
        rtlTranslate: rtl,
        size: swiperSize,
        browser
      } = swiper;
      const r = getRotateFix(swiper);
      const params = swiper.params.cubeEffect;
      const isHorizontal = swiper.isHorizontal();
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      let wrapperRotate = 0;
      let cubeShadowEl;
      if (params.shadow) {
        if (isHorizontal) {
          cubeShadowEl = swiper.wrapperEl.querySelector('.swiper-cube-shadow');
          if (!cubeShadowEl) {
            cubeShadowEl = createElement('div', 'swiper-cube-shadow');
            swiper.wrapperEl.append(cubeShadowEl);
          }
          cubeShadowEl.style.height = `${swiperWidth}px`;
        } else {
          cubeShadowEl = el.querySelector('.swiper-cube-shadow');
          if (!cubeShadowEl) {
            cubeShadowEl = createElement('div', 'swiper-cube-shadow');
            el.append(cubeShadowEl);
          }
        }
      }
      for (let i = 0; i < slides.length; i += 1) {
        const slideEl = slides[i];
        let slideIndex = i;
        if (isVirtual) {
          slideIndex = parseInt(slideEl.getAttribute('data-swiper-slide-index'), 10);
        }
        let slideAngle = slideIndex * 90;
        let round = Math.floor(slideAngle / 360);
        if (rtl) {
          slideAngle = -slideAngle;
          round = Math.floor(-slideAngle / 360);
        }
        const progress = Math.max(Math.min(slideEl.progress, 1), -1);
        let tx = 0;
        let ty = 0;
        let tz = 0;
        if (slideIndex % 4 === 0) {
          tx = -round * 4 * swiperSize;
          tz = 0;
        } else if ((slideIndex - 1) % 4 === 0) {
          tx = 0;
          tz = -round * 4 * swiperSize;
        } else if ((slideIndex - 2) % 4 === 0) {
          tx = swiperSize + round * 4 * swiperSize;
          tz = swiperSize;
        } else if ((slideIndex - 3) % 4 === 0) {
          tx = -swiperSize;
          tz = 3 * swiperSize + swiperSize * 4 * round;
        }
        if (rtl) {
          tx = -tx;
        }
        if (!isHorizontal) {
          ty = tx;
          tx = 0;
        }
        const transform = `rotateX(${r(isHorizontal ? 0 : -slideAngle)}deg) rotateY(${r(isHorizontal ? slideAngle : 0)}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
        if (progress <= 1 && progress > -1) {
          wrapperRotate = slideIndex * 90 + progress * 90;
          if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
        }
        slideEl.style.transform = transform;
        if (params.slideShadows) {
          createSlideShadows(slideEl, progress, isHorizontal);
        }
      }
      wrapperEl.style.transformOrigin = `50% 50% -${swiperSize / 2}px`;
      wrapperEl.style['-webkit-transform-origin'] = `50% 50% -${swiperSize / 2}px`;
      if (params.shadow) {
        if (isHorizontal) {
          cubeShadowEl.style.transform = `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(89.99deg) rotateZ(0deg) scale(${params.shadowScale})`;
        } else {
          const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
          const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
          const scale1 = params.shadowScale;
          const scale2 = params.shadowScale / multiplier;
          const offset = params.shadowOffset;
          cubeShadowEl.style.transform = `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-89.99deg)`;
        }
      }
      const zFactor = (browser.isSafari || browser.isWebView) && browser.needPerspectiveFix ? -swiperSize / 2 : 0;
      wrapperEl.style.transform = `translate3d(0px,0,${zFactor}px) rotateX(${r(swiper.isHorizontal() ? 0 : wrapperRotate)}deg) rotateY(${r(swiper.isHorizontal() ? -wrapperRotate : 0)}deg)`;
      wrapperEl.style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
    };
    const setTransition = duration => {
      const {
        el,
        slides
      } = swiper;
      slides.forEach(slideEl => {
        slideEl.style.transitionDuration = `${duration}ms`;
        slideEl.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(subEl => {
          subEl.style.transitionDuration = `${duration}ms`;
        });
      });
      if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
        const shadowEl = el.querySelector('.swiper-cube-shadow');
        if (shadowEl) shadowEl.style.transitionDuration = `${duration}ms`;
      }
    };
    effectInit({
      effect: 'cube',
      swiper,
      on,
      setTranslate,
      setTransition,
      recreateShadows,
      getEffectParams: () => swiper.params.cubeEffect,
      perspective: () => true,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        resistanceRatio: 0,
        spaceBetween: 0,
        centeredSlides: false,
        virtualTranslate: true
      })
    });
  }

  function createShadow(suffix, slideEl, side) {
    const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}${suffix ? ` swiper-slide-shadow-${suffix}` : ''}`;
    const shadowContainer = getSlideTransformEl(slideEl);
    let shadowEl = shadowContainer.querySelector(`.${shadowClass.split(' ').join('.')}`);
    if (!shadowEl) {
      shadowEl = createElement('div', shadowClass.split(' '));
      shadowContainer.append(shadowEl);
    }
    return shadowEl;
  }

  function EffectFlip(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      flipEffect: {
        slideShadows: true,
        limitRotation: true
      }
    });
    const createSlideShadows = (slideEl, progress) => {
      let shadowBefore = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
      let shadowAfter = swiper.isHorizontal() ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
      if (!shadowBefore) {
        shadowBefore = createShadow('flip', slideEl, swiper.isHorizontal() ? 'left' : 'top');
      }
      if (!shadowAfter) {
        shadowAfter = createShadow('flip', slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
      }
      if (shadowBefore) shadowBefore.style.opacity = Math.max(-progress, 0);
      if (shadowAfter) shadowAfter.style.opacity = Math.max(progress, 0);
    };
    const recreateShadows = () => {
      // Set shadows
      swiper.params.flipEffect;
      swiper.slides.forEach(slideEl => {
        let progress = slideEl.progress;
        if (swiper.params.flipEffect.limitRotation) {
          progress = Math.max(Math.min(slideEl.progress, 1), -1);
        }
        createSlideShadows(slideEl, progress);
      });
    };
    const setTranslate = () => {
      const {
        slides,
        rtlTranslate: rtl
      } = swiper;
      const params = swiper.params.flipEffect;
      const rotateFix = getRotateFix(swiper);
      for (let i = 0; i < slides.length; i += 1) {
        const slideEl = slides[i];
        let progress = slideEl.progress;
        if (swiper.params.flipEffect.limitRotation) {
          progress = Math.max(Math.min(slideEl.progress, 1), -1);
        }
        const offset = slideEl.swiperSlideOffset;
        const rotate = -180 * progress;
        let rotateY = rotate;
        let rotateX = 0;
        let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let ty = 0;
        if (!swiper.isHorizontal()) {
          ty = tx;
          tx = 0;
          rotateX = -rotateY;
          rotateY = 0;
        } else if (rtl) {
          rotateY = -rotateY;
        }
        slideEl.style.zIndex = -Math.abs(Math.round(progress)) + slides.length;
        if (params.slideShadows) {
          createSlideShadows(slideEl, progress);
        }
        const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateFix(rotateX)}deg) rotateY(${rotateFix(rotateY)}deg)`;
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.transform = transform;
      }
    };
    const setTransition = duration => {
      const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
      transformElements.forEach(el => {
        el.style.transitionDuration = `${duration}ms`;
        el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
          shadowEl.style.transitionDuration = `${duration}ms`;
        });
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements
      });
    };
    effectInit({
      effect: 'flip',
      swiper,
      on,
      setTranslate,
      setTransition,
      recreateShadows,
      getEffectParams: () => swiper.params.flipEffect,
      perspective: () => true,
      overwriteParams: () => ({
        slidesPerView: 1,
        slidesPerGroup: 1,
        watchSlidesProgress: true,
        spaceBetween: 0,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCoverflow(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        scale: 1,
        modifier: 1,
        slideShadows: true
      }
    });
    const setTranslate = () => {
      const {
        width: swiperWidth,
        height: swiperHeight,
        slides,
        slidesSizesGrid
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform = swiper.translate;
      const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth;
      const r = getRotateFix(swiper);
      // Each slide offset from center
      for (let i = 0, length = slides.length; i < length; i += 1) {
        const slideEl = slides[i];
        const slideSize = slidesSizesGrid[i];
        const slideOffset = slideEl.swiperSlideOffset;
        const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
        const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
        let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
        // var rotateZ = 0
        let translateZ = -translate * Math.abs(offsetMultiplier);
        let stretch = params.stretch;
        // Allow percentage to make a relative stretch for responsive sliders
        if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
          stretch = parseFloat(params.stretch) / 100 * slideSize;
        }
        let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
        let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
        let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);

        // Fix for ultra small values
        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        if (Math.abs(scale) < 0.001) scale = 0;
        const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${r(rotateX)}deg) rotateY(${r(rotateY)}deg) scale(${scale})`;
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.transform = slideTransform;
        slideEl.style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
        if (params.slideShadows) {
          // Set shadows
          let shadowBeforeEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-left') : slideEl.querySelector('.swiper-slide-shadow-top');
          let shadowAfterEl = isHorizontal ? slideEl.querySelector('.swiper-slide-shadow-right') : slideEl.querySelector('.swiper-slide-shadow-bottom');
          if (!shadowBeforeEl) {
            shadowBeforeEl = createShadow('coverflow', slideEl, isHorizontal ? 'left' : 'top');
          }
          if (!shadowAfterEl) {
            shadowAfterEl = createShadow('coverflow', slideEl, isHorizontal ? 'right' : 'bottom');
          }
          if (shadowBeforeEl) shadowBeforeEl.style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
          if (shadowAfterEl) shadowAfterEl.style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
        }
      }
    };
    const setTransition = duration => {
      const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
      transformElements.forEach(el => {
        el.style.transitionDuration = `${duration}ms`;
        el.querySelectorAll('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').forEach(shadowEl => {
          shadowEl.style.transitionDuration = `${duration}ms`;
        });
      });
    };
    effectInit({
      effect: 'coverflow',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        watchSlidesProgress: true
      })
    });
  }

  function EffectCreative(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      creativeEffect: {
        limitProgress: 1,
        shadowPerProgress: false,
        progressMultiplier: 1,
        perspective: true,
        prev: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1
        },
        next: {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          opacity: 1,
          scale: 1
        }
      }
    });
    const getTranslateValue = value => {
      if (typeof value === 'string') return value;
      return `${value}px`;
    };
    const setTranslate = () => {
      const {
        slides,
        wrapperEl,
        slidesSizesGrid
      } = swiper;
      const params = swiper.params.creativeEffect;
      const {
        progressMultiplier: multiplier
      } = params;
      const isCenteredSlides = swiper.params.centeredSlides;
      const rotateFix = getRotateFix(swiper);
      if (isCenteredSlides) {
        const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
        wrapperEl.style.transform = `translateX(calc(50% - ${margin}px))`;
      }
      for (let i = 0; i < slides.length; i += 1) {
        const slideEl = slides[i];
        const slideProgress = slideEl.progress;
        const progress = Math.min(Math.max(slideEl.progress, -params.limitProgress), params.limitProgress);
        let originalProgress = progress;
        if (!isCenteredSlides) {
          originalProgress = Math.min(Math.max(slideEl.originalProgress, -params.limitProgress), params.limitProgress);
        }
        const offset = slideEl.swiperSlideOffset;
        const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
        const r = [0, 0, 0];
        let custom = false;
        if (!swiper.isHorizontal()) {
          t[1] = t[0];
          t[0] = 0;
        }
        let data = {
          translate: [0, 0, 0],
          rotate: [0, 0, 0],
          scale: 1,
          opacity: 1
        };
        if (progress < 0) {
          data = params.next;
          custom = true;
        } else if (progress > 0) {
          data = params.prev;
          custom = true;
        }
        // set translate
        t.forEach((value, index) => {
          t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
        });
        // set rotates
        r.forEach((value, index) => {
          let val = data.rotate[index] * Math.abs(progress * multiplier);
          r[index] = val;
        });
        slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
        const translateString = t.join(', ');
        const rotateString = `rotateX(${rotateFix(r[0])}deg) rotateY(${rotateFix(r[1])}deg) rotateZ(${rotateFix(r[2])}deg)`;
        const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
        const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
        const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`;

        // Set shadows
        if (custom && data.shadow || !custom) {
          let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
          if (!shadowEl && data.shadow) {
            shadowEl = createShadow('creative', slideEl);
          }
          if (shadowEl) {
            const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
            shadowEl.style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
          }
        }
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.transform = transform;
        targetEl.style.opacity = opacityString;
        if (data.origin) {
          targetEl.style.transformOrigin = data.origin;
        }
      }
    };
    const setTransition = duration => {
      const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
      transformElements.forEach(el => {
        el.style.transitionDuration = `${duration}ms`;
        el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
          shadowEl.style.transitionDuration = `${duration}ms`;
        });
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements,
        allSlides: true
      });
    };
    effectInit({
      effect: 'creative',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => swiper.params.creativeEffect.perspective,
      overwriteParams: () => ({
        watchSlidesProgress: true,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  function EffectCards(_ref) {
    let {
      swiper,
      extendParams,
      on
    } = _ref;
    extendParams({
      cardsEffect: {
        slideShadows: true,
        rotate: true,
        perSlideRotate: 2,
        perSlideOffset: 8
      }
    });
    const setTranslate = () => {
      const {
        slides,
        activeIndex,
        rtlTranslate: rtl
      } = swiper;
      const params = swiper.params.cardsEffect;
      const {
        startTranslate,
        isTouched
      } = swiper.touchEventsData;
      const currentTranslate = rtl ? -swiper.translate : swiper.translate;
      for (let i = 0; i < slides.length; i += 1) {
        const slideEl = slides[i];
        const slideProgress = slideEl.progress;
        const progress = Math.min(Math.max(slideProgress, -4), 4);
        let offset = slideEl.swiperSlideOffset;
        if (swiper.params.centeredSlides && !swiper.params.cssMode) {
          swiper.wrapperEl.style.transform = `translateX(${swiper.minTranslate()}px)`;
        }
        if (swiper.params.centeredSlides && swiper.params.cssMode) {
          offset -= slides[0].swiperSlideOffset;
        }
        let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
        let tY = 0;
        const tZ = -100 * Math.abs(progress);
        let scale = 1;
        let rotate = -params.perSlideRotate * progress;
        let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
        const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
        const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
        const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;
        if (isSwipeToNext || isSwipeToPrev) {
          const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
          rotate += -28 * progress * subProgress;
          scale += -0.5 * subProgress;
          tXAdd += 96 * subProgress;
          tY = `${-25 * subProgress * Math.abs(progress)}%`;
        }
        if (progress < 0) {
          // next
          tX = `calc(${tX}px ${rtl ? '-' : '+'} (${tXAdd * Math.abs(progress)}%))`;
        } else if (progress > 0) {
          // prev
          tX = `calc(${tX}px ${rtl ? '-' : '+'} (-${tXAdd * Math.abs(progress)}%))`;
        } else {
          tX = `${tX}px`;
        }
        if (!swiper.isHorizontal()) {
          const prevY = tY;
          tY = tX;
          tX = prevY;
        }
        const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;

        /* eslint-disable */
        const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rtl ? -rotate : rotate : 0}deg)
        scale(${scaleString})
      `;
        /* eslint-enable */

        if (params.slideShadows) {
          // Set shadows
          let shadowEl = slideEl.querySelector('.swiper-slide-shadow');
          if (!shadowEl) {
            shadowEl = createShadow('cards', slideEl);
          }
          if (shadowEl) shadowEl.style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
        }
        slideEl.style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
        const targetEl = effectTarget(params, slideEl);
        targetEl.style.transform = transform;
      }
    };
    const setTransition = duration => {
      const transformElements = swiper.slides.map(slideEl => getSlideTransformEl(slideEl));
      transformElements.forEach(el => {
        el.style.transitionDuration = `${duration}ms`;
        el.querySelectorAll('.swiper-slide-shadow').forEach(shadowEl => {
          shadowEl.style.transitionDuration = `${duration}ms`;
        });
      });
      effectVirtualTransitionEnd({
        swiper,
        duration,
        transformElements
      });
    };
    effectInit({
      effect: 'cards',
      swiper,
      on,
      setTranslate,
      setTransition,
      perspective: () => true,
      overwriteParams: () => ({
        _loopSwapReset: false,
        watchSlidesProgress: true,
        loopAdditionalSlides: swiper.params.cardsEffect.rotate ? 3 : 2,
        centeredSlides: true,
        virtualTranslate: !swiper.params.cssMode
      })
    });
  }

  /**
   * Swiper 11.2.6
   * Most modern mobile touch slider and framework with hardware accelerated transitions
   * https://swiperjs.com
   *
   * Copyright 2014-2025 Vladimir Kharlampidi
   *
   * Released under the MIT License
   *
   * Released on: March 19, 2025
   */


  // Swiper Class
  const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
  Swiper.use(modules);

  return Swiper;

})();

!/*! License details at fancyapps.com/license */function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).window=e.window||{})}(this,function(e){"use strict";let t,n,o,i,r=e=>"object"==typeof e&&null!==e&&e.constructor===Object&&"[object Object]"===Object.prototype.toString.call(e),l=e=>"string"==typeof e,a=e=>e&&null!==e&&e instanceof Element&&"nodeType"in e,s=function(e){var t=new DOMParser().parseFromString(e,"text/html").body;if(t.childElementCount>1){for(var n=document.createElement("div");t.firstChild;)n.appendChild(t.firstChild);return n}let o=t.firstChild;if(o&&!(o instanceof HTMLElement)){var n=document.createElement("div");return n.appendChild(o),n}return o},c=function(e){if(!(e&&e instanceof Element&&e.offsetParent))return!1;let t=e.scrollHeight>e.clientHeight,n=window.getComputedStyle(e).overflowY,o=-1!==n.indexOf("hidden"),i=-1!==n.indexOf("visible");return t&&!o&&!i},u=function(e,t){return!e||e===document.body||t&&e===t?null:c(e)?e:u(e.parentElement,t)},d=(e=!0,t="--f-scrollbar-compensate",n="--f-body-margin",o="hide-scrollbar")=>{let i=document,r=i.body,l=i.documentElement;if(e){if(r.classList.contains(o))return;let e=window.innerWidth-l.getBoundingClientRect().width;e<0&&(e=0),l.style.setProperty(t,`${e}px`);let i=parseFloat(window.getComputedStyle(r).marginRight);i&&r.style.setProperty(n,`${i}px`),r.classList.add(o)}else r.classList.remove(o),r.style.setProperty(n,""),i.documentElement.style.setProperty(t,"")},f=(e,...t)=>{let n=t.length;for(let o=0;o<n;o++)Object.entries(t[o]||{}).forEach(([t,n])=>{let o=Array.isArray(n)?[]:{};e[t]||Object.assign(e,{[t]:o}),r(n)?Object.assign(e[t],f(e[t],n)):Array.isArray(n)?Object.assign(e,{[t]:[...n]}):Object.assign(e,{[t]:n})});return e};function g(){return!!("undefined"!=typeof window&&window.document&&window.document.createElement)}let m=function(e=0,t=0,n=0){return Math.max(Math.min(t,n),e)},p=function(e=0,t=0,n=0,o=0,i=0,r=!1){let l=(e-t)/(n-t)*(i-o)+o;return r?o<i?m(o,l,i):m(i,l,o):l},h=(e,t="")=>{e&&e.classList&&t.split(" ").forEach(t=>{t&&e.classList.add(t)})},y=(e,t="")=>{e&&e.classList&&t.split(" ").forEach(t=>{t&&e.classList.remove(t)})},v=(e,t="",n)=>{e&&e.classList&&t.split(" ").forEach(t=>{t&&e.classList.toggle(t,n||!1)})};function b(e){return r(e)||Array.isArray(e)}function E(e,t){let n=Object.keys(e),o=Object.keys(t);return n.length===o.length&&n.every(n=>{let o=e[n],i=t[n];return"function"==typeof o?`${o}`==`${i}`:b(o)&&b(i)?E(o,i):o===i})}let w=1/60*3e3,x=function(e){for(let t of $)t.getState()===M.Running&&t.tick(H?e-H:0);H=e,F=window.requestAnimationFrame(x)},M=((L={})[L.Initializing=0]="Initializing",L[L.Running=1]="Running",L[L.Paused=2]="Paused",L[L.Completed=3]="Completed",L[L.Destroyed=4]="Destroyed",L);var L,S,T,P,A,R,C,O,I,z,k=((S=k||{})[S.Spring=0]="Spring",S[S.Ease=1]="Ease",S);let _=((T={})[T.Loop=0]="Loop",T[T.Reverse=1]="Reverse",T),$=new Set,F=null,H=0;function D(){let e=M.Initializing,t=k.Ease,n=0,o=0,i=D.Easings.Linear,r=500,l=0,a=0,s=0,c=0,u=1/0,d=.01,f=.01,g=!1,p={},h=null,y={},v={},b={},L=0,S=0,T=_.Loop,P=D.Easings.Linear,A=new Map;function R(e,...t){for(let n of A.get(e)||[])n(...t)}function C(e){return o=0,e?h=setTimeout(()=>{O()},e):O(),z}function O(){e=M.Running,R("start",y,v)}function I(){if(e=M.Completed,b={},R("end",y),e===M.Completed)if(n<L){if(n++,T===_.Reverse){let e={...p};p={...v},v=e}C(S)}else n=0;return z}let z={getState:function(){return e},easing:function(e){return i=e,t=k.Ease,b={},z},duration:function(e){return r=e,z},spring:function(e={}){t=k.Spring;let{velocity:n,mass:o,tension:i,friction:r,restDelta:m,restSpeed:p,maxSpeed:h,clamp:y}={velocity:0,mass:1,tension:170,friction:26,restDelta:.1,restSpeed:.1,maxSpeed:1/0,clamp:!0,...e};return l=n,a=o,s=i,c=r,f=m,d=p,u=h,g=y,b={},z},isRunning:function(){return e===M.Running},isSpring:function(){return t===k.Spring},from:function(e){return y={...e},z},to:function(e){return v=e,z},repeat:function(e,t=0,n=_.Loop,o){return L=e,S=t,T=n,P=o||i,z},on:function(e,t){return A.set(e,[...A.get(e)||[],t]),z},off:function(e,t){return A.has(e)&&A.set(e,A.get(e).filter(e=>e!==t)),z},start:function(t){return E(y,v)||(e=M.Initializing,p={...y},$.add(this),F||(F=window.requestAnimationFrame(x)),C(t)),z},pause:function(){return h&&(clearTimeout(h),h=null),e===M.Running&&(e=M.Paused,R("pause",y)),z},end:I,tick:function(n){n>w&&(n=w),o+=n;let h=0,x=!1;if(e!==M.Running)return z;if(t===k.Ease){x=1===(h=m(0,o/r,1));let e=T===_.Reverse?P:i;for(let t in y)y[t]=p[t]+(v[t]-p[t])*e(h)}if(t===k.Spring){let e=.001*n,t=0;for(let n in y){let o=v[n],i=y[n];if(!("number"==typeof o&&!isNaN(o))||!("number"==typeof i&&!isNaN(i)))continue;if(Math.abs(o-i)<=f){y[n]=o,b[n]=0;continue}b[n]||("object"==typeof l&&"number"==typeof l[n]?b[n]=l[n]:"number"==typeof l?b[n]=l:b[n]=0);let r=b[n],p=(r=m(-1*Math.abs(u),r,Math.abs(u)))*a*c,h=Math.abs(o-i)*s;r+=((i>o?-1:1)*h-p)/a*e,i+=r*e;let E=y[n]>o?i<o:i>o,w=Math.abs(r)<d&&Math.abs(o-i)<=f;g&&E&&(w=!0),w?(i=o,r=0):t++,y[n]=i,b[n]=r}x=!t}let L={...v};return R("step",y,p,v,h),x&&e===M.Running&&E(v,L)&&(e=M.Completed,I()),z},getStartValues:function(){return p},getCurrentValues:function(){return y},getCurrentVelocities:function(){return b},getEndValues:function(){return v},destroy:function(){e=M.Destroyed,h&&(clearTimeout(h),h=null),p=y=v={},$.delete(this)}};return z}function V(e){return"undefined"!=typeof TouchEvent&&e instanceof TouchEvent}function j(e,t){let n=[];for(let o of V(e)?e[t]:e instanceof MouseEvent&&("changedTouches"===t||"mouseup"!==e.type)?[e]:[])n.push({x:o.clientX,y:o.clientY,ts:Date.now()});return n}function q(e){return j(e,"touches")}function N(e){return j(e,"targetTouches")}function B(e){return j(e,"changedTouches")}function Z(e){let t=e[0],n=e[1]||t;return{x:(t.x+n.x)/2,y:(t.y+n.y)/2,ts:n.ts}}function G(e){let t=e[0],n=e[1]||e[0];return t&&n?-1*Math.sqrt((n.x-t.x)*(n.x-t.x)+(n.y-t.y)*(n.y-t.y)):0}D.destroy=()=>{for(let e of $)e.destroy();F&&(cancelAnimationFrame(F),F=null)},D.Easings={Linear:function(e){return e},EaseIn:function(e){return 0===e?0:Math.pow(2,10*e-10)},EaseOut:function(e){return 1===e?1:1-Math.pow(2,-10*e)},EaseInOut:function(e){return 0===e?0:1===e?1:e<.5?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2}};let W=e=>{e.cancelable&&e.preventDefault()},Y={passive:!1},U={panThreshold:5,swipeThreshold:3,ignore:["textarea","input","select","[contenteditable]","[data-selectable]","[data-draggable]"]},X=!1,K=!0,J=(e,t)=>{let n,o,i,r={...U,...t},l=[],a=[],s=[],c=!1,u=!1,d=!1,f=!1,g=0,m=0,p=0,h=0,y=0,v=0,b=0,E=0,w=0,x=[],M=0,L=0,S=new Map;function T(e){let t=G(a),r=G(s),d=Math.abs(b)>Math.abs(E)?b:E,f={srcEvent:i,isPanRecognized:c,isSwipeRecognized:u,firstTouch:l,previousTouch:s,currentTouch:a,deltaX:p,deltaY:h,offsetX:y,offsetY:v,velocityX:b,velocityY:E,velocity:d,angle:w,axis:o,scale:t&&r?t/r:0,center:n};for(let t of S.get(e)||[])t(f)}function P(e){let t=Date.now();if(x=x.filter(e=>!e.ts||e.ts>t-100),e&&x.push(e),b=0,E=0,x.length>3){let e=x[0],t=x[x.length-1];if(e&&t){let n=t.x-e.x,o=t.y-e.y,i=e.ts&&t.ts?t.ts-e.ts:0;i>0&&(b=Math.abs(n)>3?n/(i/30):0,E=Math.abs(o)>3?o/(i/30):0)}}}function A(e){if("undefined"!=typeof MouseEvent&&e instanceof MouseEvent){if(X)return}else X=!0;let t=e.composedPath()[0],o=r.ignore.join(",");if(t.matches(o)||t.closest(o))return;if("undefined"!=typeof MouseEvent&&e instanceof MouseEvent){if(!e.buttons||0!==e.button)return;W(e)}e instanceof MouseEvent&&(window.addEventListener("mousemove",R),window.addEventListener("mouseup",C)),window.addEventListener("blur",O),i=e,l=[...a=N(e)],s=[],m=a.length,n=Z(a),1===m&&(c=!1,u=!1,d=!1),m&&P(Z(a));let p=Date.now(),h=p-(g||p);f=h>0&&h<=250&&1===m,g=p,clearTimeout(M),T("start")}function R(e){if(!l.length||e.defaultPrevented)return;i=e,s=[...a],a=q(e);let t=Z(s),u=Z(q(e));if(P(u),m=a.length,n=u,s.length===a.length?(p=u.x-t.x,h=u.y-t.y):(p=0,h=0),l.length){let e=Z(l);y=u.x-e.x,v=u.y-e.y}a.length>1&&Math.abs(G(a)-G(s))>=.1&&(d=!0,T("pinch")),!c&&(c=Math.abs(y)>r.panThreshold||Math.abs(v)>r.panThreshold)&&(K=!1,clearTimeout(L),L=0,o=(w=Math.abs(180*Math.atan2(v,y)/Math.PI))>45&&w<135?"y":"x",l=[...a],s=[...a],y=0,v=0,p=0,h=0,window.getSelection()?.removeAllRanges(),T("panstart")),c&&(p||h)&&T("pan"),T("move")}function C(e){if(i=e,!l.length)return;let t=N(e),o=B(e);if(m=t.length,n=Z(o),o.length&&P(Z(o)),s=[...a],a=[...t],l=[...t],m>0)T("end"),c=!1,u=!1,x=[];else{let e=r.swipeThreshold;(Math.abs(b)>e||Math.abs(E)>e)&&(u=!0),c&&T("panend"),u&&T("swipe"),c||u||d||(T("tap"),f?T("doubleTap"):M=setTimeout(function(){T("singleTap")},250)),T("end"),I()}}function O(){clearTimeout(M),I(),c&&T("panend"),T("end")}function I(){X=!1,c=!1,u=!1,f=!1,m=0,x=[],a=[],s=[],l=[],p=0,h=0,y=0,v=0,b=0,E=0,w=0,o=void 0,window.removeEventListener("mousemove",R),window.removeEventListener("mouseup",C),window.removeEventListener("blur",O),K||L||(L=setTimeout(()=>{K=!0,L=0},100))}function z(e){let t=e.target;X=!1,t&&!e.defaultPrevented&&(K||(W(e),e.stopPropagation()))}let k={init:function(){return e&&(e.addEventListener("click",z,Y),e.addEventListener("mousedown",A,Y),e.addEventListener("touchstart",A,Y),e.addEventListener("touchmove",R,Y),e.addEventListener("touchend",C),e.addEventListener("touchcancel",C)),k},on:function(e,t){return S.set(e,[...S.get(e)||[],t]),k},off:function(e,t){return S.has(e)&&S.set(e,S.get(e).filter(e=>e!==t)),k},isPointerDown:()=>m>0,destroy:function(){clearTimeout(M),clearTimeout(L),L=0,e&&(e.removeEventListener("click",z,Y),e.removeEventListener("mousedown",A,Y),e.removeEventListener("touchstart",A,Y),e.removeEventListener("touchmove",R,Y),e.removeEventListener("touchend",C),e.removeEventListener("touchcancel",C)),e=null,I()}};return k};J.isClickAllowed=()=>K;let Q={IMAGE_ERROR:"This image couldn't be loaded. <br /> Please try again later.",MOVE_UP:"Move up",MOVE_DOWN:"Move down",MOVE_LEFT:"Move left",MOVE_RIGHT:"Move right",ZOOM_IN:"Zoom in",ZOOM_OUT:"Zoom out",TOGGLE_FULL:"Toggle zoom level",TOGGLE_1TO1:"Toggle zoom level",ITERATE_ZOOM:"Toggle zoom level",ROTATE_CCW:"Rotate counterclockwise",ROTATE_CW:"Rotate clockwise",FLIP_X:"Flip horizontally",FLIP_Y:"Flip vertically",RESET:"Reset",TOGGLE_FS:"Toggle fullscreen"},ee=1e4,et=e=>{e.cancelable&&e.preventDefault()},en=(e,t=ee)=>Math.round(((e=parseFloat(e+"")||0)+Number.EPSILON)*t)/t,eo=((P={}).Reset="reset",P.Zoom="zoom",P.ZoomIn="zoomIn",P.ZoomOut="zoomOut",P.ZoomTo="zoomTo",P.ToggleCover="toggleCover",P.ToggleFull="toggleFull",P.ToggleMax="toggleMax",P.IterateZoom="iterateZoom",P.Pan="pan",P.Swipe="swipe",P.Move="move",P.MoveLeft="moveLeft",P.MoveRight="moveRight",P.MoveUp="moveUp",P.MoveDown="moveDown",P.RotateCCW="rotateCCW",P.RotateCW="rotateCW",P.FlipX="flipX",P.FlipY="flipY",P.ToggleFS="toggleFS",P),ei=((A={}).Cover="cover",A.Full="full",A.Max="max",A),er={x:0,y:0,scale:1,angle:0,flipX:1,flipY:1},el=((R={})[R.Init=0]="Init",R[R.Loading=1]="Loading",R[R.Error=2]="Error",R[R.Ready=3]="Ready",R[R.Destroyed=4]="Destroyed",R),ea={bounds:!0,classes:{container:"f-panzoom",wrapper:"f-panzoom__wrapper",content:"f-panzoom__content",viewport:"f-panzoom__viewport"},clickAction:eo.ToggleFull,dblClickAction:!1,gestures:{},height:"auto",l10n:Q,maxScale:4,minScale:1,mouseMoveFactor:1,panMode:"drag",protected:!1,singleClickAction:!1,spinnerTpl:'<div class="f-spinner"></div>',wheelAction:eo.Zoom,width:"auto"},es=0,ec=0,eu=0,ed=(e,n={},o={})=>{let i,r,c,d,f,g,p,b,w=el.Init,x={...ea,...n},M={},L={...er},S={...er},T=[];function P(e){let t=x[e];return t&&"function"==typeof t?t(eS):t}function A(){return e&&e.parentElement&&i&&w===el.Ready}let R=new Map;function C(e,...t){let n=[...R.get(e)||[]];for(let o of(x.on&&n.push(x.on[e]),n))o&&o instanceof Function&&o(eS,...t);"*"!==e&&C("*",e,...t)}function O(e){if(!A()||u(e.target))return;let t=Date.now(),n=m(-1,[-e.deltaX||0,-e.deltaY||0,-e.detail||0].reduce(function(e,t){return Math.abs(t)>Math.abs(e)?t:e}),1);C("wheel",e,n);let o=P("wheelAction");if(!o||e.defaultPrevented)return;let i=S.scale,r=i*(n>0?1.5:.5);if(o===eo.Zoom){let o=100>Math.abs(e.deltaY)&&100>Math.abs(e.deltaX);if(t-ec<(o?200:45))return void et(e);ec=t;let l=G(),a=X();if(en(r)<en(l)&&en(i)<=en(l)?(eu+=Math.abs(n),r=l):en(r)>en(a)&&en(i)>=en(a)?(eu+=Math.abs(n),r=a):(eu=0,r=m(l,r,a)),eu>7)return}switch(et(e),o){case eo.Pan:ed(o,{srcEvent:e,deltaX:-(2*e.deltaX),deltaY:-(2*e.deltaY)});break;case eo.Zoom:ed(eo.ZoomTo,{srcEvent:e,scale:r,center:{x:e.clientX,y:e.clientY}});break;default:ed(o,{srcEvent:e})}}function I(n){let o=n.composedPath()[0];if(!J.isClickAllowed()||!a(o)||n.defaultPrevented||!e?.contains(o)||o.hasAttribute("disabled")||o.hasAttribute("aria-disabled"))return;let r=o.closest("[data-panzoom-action]"),l=r?.dataset?.panzoomAction,s=r?.dataset?.panzoomValue||"";if(l){switch(et(n),l){case eo.ZoomTo:case eo.ZoomIn:case eo.ZoomOut:ed(l,{scale:parseFloat(s||"")||void 0});break;case eo.MoveLeft:case eo.MoveRight:ed(l,{deltaX:parseFloat(s||"")||void 0});break;case eo.MoveUp:case eo.MoveDown:ed(l,{deltaY:parseFloat(s||"")||void 0});break;case eo.ToggleFS:eM();break;default:ed(l)}return}if(!i?.contains(o))return;let c={srcEvent:n};if(ed(P("clickAction"),c),P("dblClickAction")){let e=Date.now(),n=e-(es||e);es=e,n>0&&n<=250?(t&&(clearTimeout(t),t=void 0),ed(P("dblClickAction"),c)):t=setTimeout(()=>{ed(P("singleClickAction"),c)},250)}}function z(e){if(b=e,!A()||!j()||L.scale<=1||S.scale<=1||(i?.dataset.animationName||"").indexOf("zoom")>-1)return;let t=q(S.scale);if(!t)return;let{x:n,y:o}=t;ed(eo.Pan,{deltaX:n-S.x,deltaY:o-S.y})}function k(){e&&(y(e,"is-loading"),e.querySelector(".f-spinner")?.remove())}function _(){if(!e||!r)return;if(k(),r instanceof HTMLImageElement&&!(r.complete&&r.naturalWidth)){w=el.Error,i?.classList.add("has-error"),C("error");return}C("loaded");let{width:t,height:n}=H();r instanceof HTMLImageElement&&(r.setAttribute("width",t+""),r.setAttribute("height",n+"")),i&&(y(i,"has-error"),r instanceof HTMLImageElement&&(i.setAttribute("width",t+""),i.setAttribute("height",n+""),i.style.aspectRatio=`${t/n||""}`)),g=D().on("start",(e,t)=>{void 0!==t.angle&&(t.angle=90*Math.round(t.angle/90)),void 0!==t.flipX&&(t.flipX=t.flipX>0?1:-1),void 0!==t.flipY&&(t.flipY=t.flipY>0?1:-1),S={...er,...t},ei(),C("animationStart")}).on("pause",e=>{S={...er,...e}}).on("step",e=>{if(!A())return void g?.end();if(L={...er,...e},j()||!P("bounds")||eE()||S.scale>L.scale||S.scale<W())return void ef();let t=K(S.scale),n=!1,o=!1,i=!1,r=!1;L.x<t.x[0]&&(n=!0),L.x>t.x[1]&&(o=!0),L.y<t.y[0]&&(r=!0),L.y>t.y[1]&&(i=!0);let l=!1,a=!1,s=!1,c=!1;S.x<t.x[0]&&(l=!0),S.x>t.x[1]&&(a=!0),S.y<t.y[0]&&(c=!0),S.y>t.y[1]&&(s=!0);let u=!1;(o&&a||n&&l)&&(S.x=m(t.x[0],S.x,t.x[1]),u=!0),(i&&s||r&&c)&&(S.y=m(t.y[0],S.y,t.y[1]),u=!0),u&&g&&g.spring({tension:94,friction:17,maxSpeed:555*S.scale,restDelta:.1,restSpeed:.1,velocity:g.getCurrentVelocities()}).from(L).to(S).start(),ef()}).on("end",()=>{f?.isPointerDown()||Q(),g?.isRunning()||(ei(),C("animationEnd"))}),function(){let e=P("gestures");if(!e||!d||!r)return;let t=!1;f=J(d,e).on("start",e=>{if(!P("gestures")||!g||!A()||j())return;let n=e.srcEvent;(L.scale>1||e.currentTouch.length>1)&&(n?.stopPropagation(),g.pause(),t=!0),1===e.currentTouch.length&&C("touchStart")}).on("move",e=>{t&&(1!==S.scale||e.currentTouch.length>1)&&(et(e.srcEvent),e.srcEvent?.stopPropagation())}).on("pan",e=>{if(!t)return;let n=e.srcEvent;(1!==S.scale||e.currentTouch.length>1)&&(et(n),ed(eo.Pan,e))}).on("swipe",e=>{t&&S.scale>1&&ed(eo.Swipe,e)}).on("tap",e=>{C("click",e)}).on("singleTap",e=>{C("singleClick",e)}).on("doubleTap",e=>{C("dblClick",e)}).on("pinch",e=>{t&&(e.scale>W()?ed(eo.ZoomIn,e):e.scale<W()?ed(eo.ZoomOut,e):ed(eo.Pan,e))}).on("end",e=>{t&&(e.currentTouch.length?(e.srcEvent.stopPropagation(),et(e.srcEvent),g?.end()):(t=!1,ei(),Q(),C("touchEnd")))}).init()}(),d&&(d.addEventListener("wheel",O,{passive:!1}),T.push(()=>{d?.removeEventListener("wheel",O,{passive:!1})})),e?.addEventListener("click",I),document?.addEventListener("mousemove",z),T.push(()=>{e?.removeEventListener("click",I),document?.removeEventListener("mousemove",z)});let o=$();L={...o},S={...o},w=el.Ready,ef(),ei(),C("ready"),requestAnimationFrame(()=>{k(),d&&(d.style.visibility="")})}function $(){let e={...P("startPos")||{}},t=e.scale,n=1;n="string"==typeof t?N(t):"number"==typeof t?t:W();let o={...er,...e,scale:n},i=j()?q(n):void 0;if(i){let{x:e,y:t}=i;o.x=e,o.y=t}return o}function F(){let e={top:0,left:0,width:0,height:0};if(i){let t=i.getBoundingClientRect();S.angle%180==90?(e.top=t.top+.5*t.height-.5*t.width,e.left=t.left+.5*t.width-.5*t.height,e.width=t.height,e.height=t.width):(e.top=t.top,e.left=t.left,e.width=t.width,e.height=t.height)}return e}function H(){let e=P("width"),t=P("height");if(r&&"auto"===e){let t=r.getAttribute("width");e=t?parseFloat(t+""):void 0!==r.dataset.width?parseFloat(r.dataset.width+""):d instanceof HTMLImageElement?d.naturalWidth:r instanceof HTMLImageElement?r.naturalWidth:i?.getBoundingClientRect().width||0}else e=l(e)?parseFloat(e):e;if(r&&"auto"===t){let e=r.getAttribute("height");t=e?parseFloat(e+""):void 0!==r.dataset.height?parseFloat(r.dataset.height+""):d instanceof HTMLImageElement?d.naturalHeight:r instanceof HTMLImageElement?r.naturalHeight:i?.getBoundingClientRect().height||0}else t=l(t)?parseFloat(t):t;return{width:e,height:t}}function V(){let e=F();return{width:e.width,height:e.height}}function j(){return"mousemove"===P("panMode")&&matchMedia("(hover: hover)").matches}function q(e){let t=b||P("event"),n=i?.getBoundingClientRect();if(!t||!n||e<=1)return{x:0,y:0};let o=(t.clientX||0)-n.left,r=(t.clientY||0)-n.top,{width:l,height:a}=V(),s=K(e);if(e>1){let t=P("mouseMoveFactor");t>1&&(e*=t)}let c=l*e,u=a*e,d=(c-l)*.5-o/l*100/100*(c-l),f=(u-a)*.5-r/a*100/100*(u-a);return{x:d=m(s.x[0],d,s.x[1]),y:f=m(s.y[0],f,s.y[1])}}function N(t="base"){if(!e)return 1;let n=e.getBoundingClientRect(),o=F(),{width:i,height:r}=H(),l=e=>{if("number"==typeof e)return e;switch(e){case"min":case"base":return 1;case"cover":return Math.max(n.height/o.height,n.width/o.width)||1;case"full":case"max":{let e=S.angle%180==90?r:i;return e&&o.width?e/o.width:1}}},a=P("minScale"),s=P("maxScale"),c=Math.min(l("full"),l(a)),u="number"==typeof s?l("full")*s:Math.min(l("full"),l(s));switch(t){case"min":return c;case"base":return m(c,1,u);case"cover":return l("cover");case"full":return Math.min(u,l("full"));case"max":return u}}function G(){return N("min")}function W(){return N("base")}function Y(){return N("cover")}function U(){return N("full")}function X(){return N("max")}function K(t){let n={x:[0,0],y:[0,0]},o=e?.getBoundingClientRect();if(!o)return n;let i=F(),r=o.width,l=o.height,a=i.width,s=i.height,c=t=void 0===t?S.scale:t,u=t;if(j()&&t>1){let e=P("mouseMoveFactor");e>1&&(a*t>r+.01&&(c*=e),s*t>l+.01&&(u*=e))}return a*=c,s*=u,t>1&&(a>r&&(n.x[0]=(r-a)*.5,n.x[1]=(a-r)*.5),n.x[0]-=(i.left-o.left)*.5,n.x[1]-=(i.left-o.left)*.5,n.x[0]-=(i.left+i.width-o.right)*.5,n.x[1]-=(i.left+i.width-o.right)*.5,s>l&&(n.y[0]=(l-s)*.5,n.y[1]=(s-l)*.5),n.y[0]-=(i.top-o.top)*.5,n.y[1]-=(i.top-o.top)*.5,n.y[0]-=(i.top+i.height-o.bottom)*.5,n.y[1]-=(i.top+i.height-o.bottom)*.5),n}function Q(){if(!A()||!P("bounds")||!g)return;let e=G(),t=X(),n=m(e,S.scale,t);if(S.scale<e-.01||S.scale>t+.01)return void ed(eo.ZoomTo,{scale:n});if(g.isRunning()||eE())return;let o=K(n);S.x<o.x[0]||S.x>o.x[1]||S.y<o.y[0]||S.y>o.y[1]?(S.x=m(o.x[0],S.x,o.x[1]),S.y=m(o.y[0],S.y,o.y[1]),g.spring({tension:170,friction:17,restDelta:.001,restSpeed:.001,maxSpeed:1/0,velocity:g.getCurrentVelocities()}),g.from(L).to(S).start()):ef()}function ei(t){if(!A())return;let n=eb(),o=eE(),r=ew(),l=ex(),a=em(),s=ep();v(i,"is-fullsize",l),v(i,"is-expanded",r),v(i,"is-dragging",o),v(i,"can-drag",n),v(i,"will-zoom-in",a),v(i,"will-zoom-out",s);let c=ey(),u=ev(),d=eh(),f=!A();for(let n of(t||e)?.querySelectorAll("[data-panzoom-action]")||[]){let e=n.dataset.panzoomAction,t=!1;if(f)t=!0;else switch(e){case eo.ZoomIn:c||(t=!0);break;case eo.ZoomOut:d||(t=!0);break;case eo.ToggleFull:{u||d||(t=!0);let e=n.querySelector("g");e&&(e.style.display=l&&!t?"none":"");break}case eo.IterateZoom:{c||d||(t=!0);let e=n.querySelector("g");e&&(e.style.display=c||t?"":"none");break}case eo.ToggleCover:case eo.ToggleMax:c||d||(t=!0)}t?(n.setAttribute("aria-disabled",""),n.setAttribute("tabindex","-1")):(n.removeAttribute("aria-disabled"),n.removeAttribute("tabindex"))}}function ed(t,n){if(!t||!e||!r||!g||!A()||t===eo.Swipe&&Math.abs(g.getCurrentVelocities().scale)>.01)return;let o={...S},i={...S},l=K(j()?o.scale:L.scale),a=g.getCurrentVelocities(),s=F();n=n||{};let c=(n.currentTouch?.length||0)>1,u=n.velocityX||0,d=n.velocityY||0,f=n.center;n.srcEvent&&(f=Z(B(n.srcEvent)));let p=n.deltaX||0,h=n.deltaY||0;switch(t){case eo.MoveRight:p=n.deltaX||100;break;case eo.MoveLeft:p=n.deltaX||-100;break;case eo.MoveUp:h=n.deltaY||-100;break;case eo.MoveDown:h=n.deltaY||100}let y=[];switch(t){case eo.Reset:(i={...er}).scale=W();break;case eo.Pan:case eo.Move:case eo.MoveLeft:case eo.MoveRight:case eo.MoveUp:case eo.MoveDown:if(eE()){let e=1,t=1;i.x<=l.x[0]&&u<=0&&(e=.2*Math.max(.01,1-Math.abs(1/s.width*Math.abs(i.x-l.x[0])))),i.x>=l.x[1]&&u>=0&&(e=.2*Math.max(.01,1-Math.abs(1/s.width*Math.abs(i.x-l.x[1])))),i.y<=l.y[0]&&d<=0&&(t=.2*Math.max(.01,1-Math.abs(1/s.height*Math.abs(i.y-l.y[0])))),i.y>=l.y[1]&&d>=0&&(t=.2*Math.max(.01,1-Math.abs(1/s.height*Math.abs(i.y-l.y[1])))),i.x+=p*e,i.y+=h*t}else i.x=m(l.x[0],i.x+p,l.x[1]),i.y=m(l.y[0],i.y+h,l.y[1]);break;case eo.Swipe:let v=(e=0)=>Math.sign(e)*Math.pow(Math.abs(e),1.5);i.x+=m(-1e3,v(u),1e3),i.y+=m(-1e3,v(d),1e3),d&&!u&&(i.x=m(l.x[0],i.x,l.x[1])),!d&&u&&(i.y=m(l.y[0],i.y,l.y[1])),a.x=u,a.y=d;break;case eo.ZoomTo:i.scale=n.scale||1;break;case eo.ZoomIn:i.scale=i.scale*(n.scale||2),c||(i.scale=Math.min(i.scale,X()));break;case eo.ZoomOut:i.scale=i.scale*(n.scale||.5),c||(i.scale=Math.max(i.scale,G()));break;case eo.ToggleCover:y=[W(),Y()];break;case eo.ToggleFull:y=[W(),U()];break;case eo.ToggleMax:y=[W(),X()];break;case eo.IterateZoom:y=[W(),U(),X()];break;case eo.Zoom:let b=U();i.scale>=b-.05?i.scale=W():i.scale=Math.min(b,i.scale*(n.scale||2));break;case eo.RotateCW:i.angle+=90;break;case eo.RotateCCW:i.angle-=90;break;case eo.FlipX:i.flipX*=-1;break;case eo.FlipY:i.flipY*=-1}if(void 0!==L.angle&&Math.abs(L.angle)>=360&&(i.angle-=360*Math.floor(L.angle/360),L.angle-=360*Math.floor(L.angle/360)),y.length){let e=y.findIndex(e=>e>i.scale+1/ee);i.scale=y[e]||y[0]}if(c&&(i.scale=m(G()*(c?.8:1),i.scale,X()*(c?1.6:1))),j()){let e=q(i.scale);if(e){let{x:t,y:n}=e;i.x=t,i.y=n}}else if(Math.abs(i.scale-o.scale)>1e-4){let t=0,n=0;if(f)t=f.x,n=f.y;else{let o=e.getBoundingClientRect();t=o.x+.5*o.width,n=o.y+.5*o.height}let r=t-s.left,a=n-s.top;r-=.5*s.width,a-=.5*s.height;let u=(r-o.x)/o.scale,d=(a-o.y)/o.scale;i.x=r-u*i.scale,i.y=a-d*i.scale,!c&&P("bounds")&&(l=K(i.scale),i.x=m(l.x[0],i.x,l.x[1]),i.y=m(l.y[0],i.y,l.y[1]))}if(t===eo.Swipe){let e=500*i.scale;g.spring({tension:94,friction:17,maxSpeed:e,restDelta:.1,restSpeed:.1,velocity:a})}else t===eo.Pan||c?g.spring({tension:900,friction:17,restDelta:.01,restSpeed:.01,maxSpeed:1}):g.spring({tension:170,friction:17,restDelta:.001,restSpeed:.001,maxSpeed:1/0,velocity:a});if(0===n.velocity||E(L,i))L={...i},S={...i},g.end(),ef(),ei();else{if(E(S,i))return;g.from(L).to(i).start()}C("action",t)}function ef(){if(!r||!i||!d)return;let{width:t,height:n}=H();Object.assign(i.style,{maxWidth:`min(${t}px, 100%)`,maxHeight:`min(${n}px, 100%)`});let{x:o,y:l,width:a,height:s,scale:c,angle:u,flipX:f,flipY:g}=function(){let{width:t,height:n}=H(),{width:o,height:i}=V();if(!e)return{x:0,y:0,width:0,height:0,scale:0,flipX:0,flipY:0,angle:0,fitWidth:o,fitHeight:i,fullWidth:t,fullHeight:n};let{x:r,y:l,scale:a,angle:s,flipX:c,flipY:u}=L,d=1/U(),f=t,g=n,m=L.scale*d,p=S.scale*d,h=Math.max(o,i),y=Math.min(o,i);t>n?(f=h,g=y):(f=y,g=h),m=t>n?h*a/t||1:h*a/n||1;let v=f?t*p:0,b=g?n*p:0,E=f&&g?t*m/v:0;return{x:r=r+.5*f-.5*v,y:l=l+.5*g-.5*b,width:v,height:b,scale:E,flipX:c,flipY:u,angle:s,fitWidth:o,fitHeight:i,fullWidth:t,fullHeight:n}}(),m=`translate(${en(o)}px, ${en(l)}px)`;1!==f||1!==g?m+=` scaleX(${en(c*f)}) scaleY(${en(c*g)})`:m+=` scale(${en(c)})`,0!==u&&(m+=` rotate(${u}deg)`),d.style.width=`${en(a)}px`,d.style.height=`${en(s)}px`,d.style.transform=`${m}`,C("render")}function eg(){let e=S.scale,t,n=P("clickAction"),o=W();if(n){let i=[];switch(n){case eo.ZoomIn:o=e*(t||2);break;case eo.ZoomOut:o=e*(t||.5);break;case eo.ToggleCover:i=[W(),Y()];break;case eo.ToggleFull:i=[W(),U()];break;case eo.ToggleMax:i=[W(),X()];break;case eo.IterateZoom:i=[W(),U(),X()];break;case eo.Zoom:let r=U();o=e>=r-.05?W():Math.min(r,e*(t||2))}if(i.length){let t=i.findIndex(t=>t>e+1/ee);o=i[t]||W()}}return m(G(),o,X())}function em(){return!!(A()&&eg()>S.scale)}function ep(){return!!(A()&&eg()<S.scale)}function eh(){return!!(A()&&S.scale>G())}function ey(){return!!(A()&&S.scale<X())}function ev(){return!!(A()&&S.scale<U())}function eb(){return!!(A()&&ew()&&f&&!j())}function eE(){return!!(A()&&f?.isPointerDown()&&!j())}function ew(){return!!(A()&&S.scale>W())}function ex(){return!!(A()&&S.scale>=U())}function eM(){let t="in-fullscreen",n="with-panzoom-in-fullscreen";e?.classList.toggle(t);let o=e?.classList.contains(t);o?(document.documentElement.classList.add(n),document.addEventListener("keydown",eL,!0)):(document.documentElement.classList.remove(n),document.removeEventListener("keydown",eL,!0)),ef(),C(o?"enterFS":"exitFS")}function eL(e){"Escape"!==e.key||e.defaultPrevented||eM()}let eS={canDrag:eb,canZoomIn:ey,canZoomOut:eh,canZoomToFull:ev,destroy:function(){for(let e of(C("destroy"),Object.values(M)))e?.destroy(eS);for(let e of T)e();return i&&(i.style.aspectRatio="",i.style.maxWidth="",i.style.maxHeight=""),d&&(d.style.width="",d.style.height="",d.style.transform=""),i=void 0,r=void 0,d=void 0,L={...er},S={...er},g?.destroy(),g=void 0,f?.destroy(),f=void 0,w=el.Destroyed,eS},emit:C,execute:ed,getBoundaries:K,getContainer:function(){return e},getContent:function(){return r},getFullDim:H,getGestures:function(){return f},getMousemovePos:q,getOptions:function(){return x},getPlugins:function(){return M},getScale:N,getStartPosition:$,getState:function(){return w},getTransform:function(e){return!0===e?S:L},getTween:function(){return g},getViewport:function(){return d},getWrapper:function(){return i},init:function(){return w=el.Init,C("init"),function(){for(let[e,t]of Object.entries({...o,...x.plugins||{}}))if(e&&!M[e]&&t instanceof Function){let n=t();n.init(eS),M[e]=n}C("initPlugins")}(),function(){let t={...ea.classes,...P("classes")};if(e&&(h(e,t.container),r=e.querySelector("."+t.content))){if(r.setAttribute("draggable","false"),(i=e.querySelector("."+t.wrapper))||(h(i=document.createElement("div"),t.wrapper),r.insertAdjacentElement("beforebegin",i),i.insertAdjacentElement("afterbegin",r)),(d=e.querySelector("."+t.viewport))||(h(d=document.createElement("div"),t.viewport),d.insertAdjacentElement("afterbegin",r),i.insertAdjacentElement("beforeend",d)),(c=r.cloneNode(!0)).removeAttribute("id"),i.insertAdjacentElement("afterbegin",c),r instanceof HTMLPictureElement&&(r=r.querySelector("img")),c instanceof HTMLPictureElement&&(c=c.querySelector("img")),d instanceof HTMLPictureElement&&(d=d.querySelector("img")),d&&(d.style.visibility="hidden",P("protected"))){d.addEventListener("contextmenu",e=>{et(e)});let e=document.createElement("div");h(e,"f-panzoom__protected"),d.appendChild(e)}C("initLayout")}}(),function(){if(e&&i&&!p){let e=null;(p=new ResizeObserver(()=>{A()&&(e=e||requestAnimationFrame(()=>{A()&&(ei(),Q(),C("refresh")),e=null}))})).observe(i),T.push(()=>{p?.disconnect(),p=void 0,e&&(cancelAnimationFrame(e),e=null)})}}(),function(){if(!e||!r)return;if(!(r instanceof HTMLImageElement&&c instanceof HTMLImageElement))return _();let t=()=>{r&&r instanceof HTMLImageElement&&r.decode().then(()=>{_()}).catch(()=>{_()})};(w=el.Loading,e.classList.add("is-loading"),C("loading"),c.src&&c.complete)?t():(function(){if(!e||e?.querySelector(".f-spinner"))return;let t=s(P("spinnerTpl"));t&&(t.classList.add("f-spinner"),e.classList.add("is-loading"),i?.insertAdjacentElement("afterbegin",t))}(),c.addEventListener("load",t,!1),c.addEventListener("error",t,!1),T.push(()=>{c?.removeEventListener("load",t,!1),c?.removeEventListener("error",t,!1)}))}(),eS},isDragging:eE,isExpanded:ew,isFullsize:ex,isMousemoveMode:j,localize:function(e,t=[]){let n=P("l10n")||{};e=String(e).replace(/\{\{(\w+)\}\}/g,(e,t)=>n[t]||e);for(let n=0;n<t.length;n++)e=e.split(t[n][0]).join(t[n][1]);return e.replace(/\{\{(.*?)\}\}/g,(e,t)=>t)},off:function(e,t){for(let n of e instanceof Array?e:[e])R.has(n)&&R.set(n,R.get(n).filter(e=>e!==t));return eS},on:function(e,t){for(let n of e instanceof Array?e:[e])R.set(n,[...R.get(n)||[],t]);return eS},toggleFS:eM,updateControls:ei,version:"6.1.3",willZoomIn:em,willZoomOut:ep};return eS};ed.l10n={en_EN:Q},ed.getDefaults=()=>ea;let ef=(e,t)=>{let n=[];return e.childNodes.forEach(e=>{e.nodeType===Node.ELEMENT_NODE&&(!t||e.matches(t))&&n.push(e)}),n},eg={...Q,ERROR:"Something went wrong. <br /> Please try again later.",NEXT:"Next page",PREV:"Previous page",GOTO:"Go to page #%d",DOWNLOAD:"Download",TOGGLE_FULLSCREEN:"Toggle full-screen mode",TOGGLE_EXPAND:"Toggle full-size mode",TOGGLE_THUMBS:"Toggle thumbnails",TOGGLE_AUTOPLAY:"Toggle slideshow"},em=e=>{e.cancelable&&e.preventDefault()},ep=((C={})[C.Init=0]="Init",C[C.Ready=1]="Ready",C[C.Destroyed=2]="Destroyed",C),eh=((O={})[O.Loading=0]="Loading",O[O.Loaded=1]="Loaded",O[O.Error=2]="Error",O),ey={adaptiveHeight:!1,center:!0,classes:{container:"f-carousel",isEnabled:"is-enabled",isLTR:"is-ltr",isRTL:"is-rtl",isHorizontal:"is-horizontal",isVertical:"is-vertical",hasAdaptiveHeight:"has-adaptive-height",viewport:"f-carousel__viewport",slide:"f-carousel__slide",isSelected:"is-selected"},dragFree:!1,enabled:!0,errorTpl:'<div class="f-html">{{ERROR}}</div>',fill:!1,infinite:!0,initialPage:0,l10n:eg,rtl:!1,slides:[],slidesPerPage:"auto",spinnerTpl:'<div class="f-spinner"></div>',transition:"fade",tween:{clamp:!0,mass:1,tension:160,friction:25,restDelta:1,restSpeed:1,velocity:0},vertical:!1},ev=0,eb=(e,t={},o={})=>{let i,c,d,g,b;ev++;let E=ep.Init,w={...ey},x={...ey},M={},L=null,S=null,T=!1,P=!1,A=!1,R=!1,C="height",O=0,I=!0,z=0,k=0,_=0,$=0,F="*",H=[],j=[],q=new Set,N=[],B=[],Z=0,G=0,W=0;function Y(e,...t){let n=x[e];return n&&n instanceof Function?n(e_,...t):n}function U(e,t=[]){let n=Y("l10n")||{};e=String(e).replace(/\{\{(\w+)\}\}/g,(e,t)=>n[t]||e);for(let n=0;n<t.length;n++)e=e.split(t[n][0]).join(t[n][1]);return e.replace(/\{\{(.*?)\}\}/g,(e,t)=>t)}let X=new Map;function K(e,...t){let n=[...X.get(e)||[]];for(let o of(x.on&&n.push(x.on[e]),n))o&&o instanceof Function&&o(e_,...t);"*"!==e&&K("*",e,...t)}function Q(){let e=f({},ey,w);f(e,ey,w);let t="",n=w.breakpoints||{};if(n)for(let[o,i]of Object.entries(n))window.matchMedia(o).matches&&(t+=o,f(e,i));if(void 0===b||t!==b){if(b=t,E!==ep.Init){let t=B[z]?.slides[0]?.index;for(let n of(void 0===t&&(t=x.initialSlide),e.initialSlide=t,e.slides=[],H))n.isVirtual&&e.slides.push(n)}eI(),x=e,!1!==Y("enabled")&&(E=ep.Init,K("init"),function(){for(let[e,t]of Object.entries({...o,...x.plugins||{}}))if(e&&!M[e]&&t instanceof Function){let n=t();n.init(e_,eb),M[e]=n}K("initPlugins")}(),function(){if(!L)return;let e=Y("classes")||{};h(L,e.container);let t=Y("style");if(t&&r(t))for(let[e,n]of Object.entries(t))L.style.setProperty(e,n);(S=L.querySelector(`.${e.viewport}`))||(h(S=document.createElement("div"),e.viewport),S.append(...ef(L,`.${e.slide}`)),L.insertAdjacentElement("afterbegin",S)),L.carousel=e_,K("initLayout")}(),function(){if(!S)return;let e=Y("classes")||{};for(let t of(H=[],[...ef(S,`.${e.slide}`)].forEach(e=>{if(e.parentElement){let t=ed({el:e,isVirtual:!1,...e.dataset||{}});K("createSlide",t),H.push(t)}}),eE(),H))K("addSlide",t);for(let e of(eu(Y("slides")),H)){let t=e.el;t?.parentElement===S&&(h(t,x.classes.slide),h(t,e.class),eA(e),K("attachSlideEl",e))}K("initSlides")}(),ew(),E=ep.Ready,h(L,(Y("classes")||{}).isEnabled||""),eO(),ei(),c=D().on("start",()=>{i&&i.isPointerDown()||(eo(),eO())}).on("step",e=>{let t=O;(O=e.pos)!==t&&(I=!1,eO())}).on("end",e=>{!i?.isPointerDown()&&(O=e.pos,c&&!P&&(O<_||O>$)?c.spring({clamp:!0,mass:1,tension:200,friction:25,velocity:0,restDelta:1,restSpeed:1}).from({pos:O}).to({pos:m(_,O,$)}).start():I||(I=!0,K("settle")))}),et(),function(){if(!L||!S)return;L.addEventListener("click",eS,{passive:!1}),document.addEventListener("mousemove",ee);let e=S.getBoundingClientRect();if(Z=e.height,G=e.width,!d){let e=null;(d=new ResizeObserver(()=>{e||(e=requestAnimationFrame(()=>{(function(){if(E!==ep.Ready||!S)return;let e=B.length,t=S.getBoundingClientRect(),n=t.height,o=t.width;e>1&&(R&&.5>Math.abs(n-Z)||!R&&.5>Math.abs(o-G))||(ew(),et(),Z=n,G=o,R&&!n||!R&&!o||L&&S&&(e===B.length&&i?.isPointerDown()||(Y("dragFree")&&(P||O>_&&O<$)?(eo(),eO()):eR(z,{transition:!1}))))})(),e=null}))})).observe(S)}}(),K("ready"))}}function ee(e){n=e}function et(){if(!1===Y("gestures"))i&&(i.destroy(),i=void 0);else{let e;i||(e=Y("gestures"),!i&&!1!==e&&S&&(i=J(S,e).on("start",e=>{if(!c)return;let{srcEvent:t}=e;R&&V(t)&&!u(t.target)&&em(t),c.pause(),c.getCurrentVelocities().pos=0;let n=B[z]?.slides[0];if(n&&q.has(n.index)&&n.el){var o;let e;O=(n.offset||0)+((o=n.el,{width:(e=new DOMMatrixReadOnly(window.getComputedStyle(o).transform)).m41||0,height:e.m42||0})[C]||0)*(A&&!R?1:-1)}eM(),!P&&(O<_||O>$)&&c.spring({clamp:!0,mass:1,tension:500,friction:25,velocity:c.getCurrentVelocities()?.pos||0,restDelta:1,restSpeed:1}).from({pos:O}).to({pos:m(_,O,$)}).start()}).on("move",e=>{let{srcEvent:t,axis:n}=e,o=t.target;if(n||(em(t),t.stopPropagation(),t.stopImmediatePropagation()),("y"===n&&R||"x"===n&&!R)&&(em(t),t.stopPropagation()),!n)return;let{deltaX:i,deltaY:r}=e;if(!c||V(t)&&t.touches?.length>1||"y"===n&&!R||"x"===n&&R||o&&u(o)&&!("x"===n&&!R))return;let l=A&&!R?1:-1,a=R?r:i,s=c?.isRunning()?c.getEndValues().pos:O,d=1;!P&&(s<=_&&a*l<0?d=.2*Math.max(.01,1-(Math.abs(1/ea()*Math.abs(s-_))||0)):s>=$&&a*l>0&&(d=.2*Math.max(.01,1-(Math.abs(1/ea()*Math.abs(s-$))||0)))),s+=a*d*l,c.spring({clamp:!0,mass:1,tension:700,friction:25,velocity:c.getCurrentVelocities()?.pos||0,restDelta:1,restSpeed:1}).from({pos:O}).to({pos:s}).start()}).on("panstart",e=>{e?.axis===(R?"y":"x")&&h(S,"is-dragging")}).on("panend",()=>{y(S,"is-dragging")}).on("end",e=>{let{srcEvent:t,axis:n,velocityX:o,velocityY:i,currentTouch:r}=e;if(r.length>0||!c)return;let l=t.target,a=l&&u(l)&&!("x"===n&&!R);R&&V(t)&&!e.axis&&eS(t);let s=B.length,d=Y("dragFree");if(!s)return;let f=Y("vertical")?i:o,g=c?.isRunning()?c.getEndValues().pos:O,p=A&&!R?1:-1;if(a||(g+=f*(d?5:1)*p),!P&&(f*p<=0&&g<_||f*p>=0&&g>$)){let e=0;Math.abs(f)>0&&(e=2*Math.abs(f),e=Math.min(.3*ea(),e)),g=m(_+-1*e,g,$+e),c.spring({clamp:!0,mass:1,tension:380,friction:25,velocity:-1*f,restDelta:1,restSpeed:1}).from({pos:O}).to({pos:g}).start();return}if(d||M.Autoscroll?.isEnabled())return void(Math.abs(f)>10?c.spring({clamp:!0,mass:1,tension:150,friction:25,velocity:-1*f,restDelta:1,restSpeed:1}).from({pos:O}).to({pos:g}).start():c.isRunning()||I||(I=!0,K("settle")));if(!(d||M.Autoscroll?.isEnabled())&&(!(e.offsetX||e.offsetY)||"y"===n&&!R||"x"===n&&R))return void eR(z,{transition:"tween"});let h=el(g);Math.abs(f)>10&&h===z&&(f>0?h+=A&&!R?1:-1:h+=A&&!R?-1:1),eR(h,{transition:"tween",tween:{velocity:-1*f}})}).init()))}v(S,"is-draggable",!!i&&B.length>0)}function en(e="*"){let t=[];for(let n of H)("*"===e||n.class&&n.class.includes(e)||n.el&&n.el?.classList.contains(e))&&t.push(n);g=void 0,F=e,j=[...t]}function eo(){if(!c)return;let e=el(c?.isRunning()?c.getEndValues().pos:O);e!==z&&(g=z,z=e,eA(),ei(),er(),K("change",z,g))}function ei(){if(!L)return;for(let e of L.querySelectorAll("[data-carousel-index]"))e.innerHTML=z+"";for(let e of L.querySelectorAll("[data-carousel-page]"))e.innerHTML=z+1+"";for(let e of L.querySelectorAll("[data-carousel-pages]"))e.innerHTML=B.length+"";for(let e of L.querySelectorAll("[data-carousel-go-to]"))parseInt(e.dataset?.carouselGoTo||"-1",10)===z?e.setAttribute("aria-current","true"):e.removeAttribute("aria-current");for(let e of L.querySelectorAll("[data-carousel-go-prev]"))e.toggleAttribute("aria-disabled",!ez()),ez()?e.removeAttribute("tabindex"):e.setAttribute("tabindex","-1");for(let e of L.querySelectorAll("[data-carousel-go-next]"))e.toggleAttribute("aria-disabled",!ek()),ek()?e.removeAttribute("tabindex"):e.setAttribute("tabindex","-1");let e=!1,t=B[z]?.slides[0];for(let n of(t&&(t.downloadSrc||"image"===t.type&&t.src)&&(e=!0),L.querySelectorAll("[data-carousel-download]")))n.toggleAttribute("aria-disabled",!e)}function er(e){e||(e=B[z]?.slides[0]);let t=e?.el;if(t)for(let n of t.querySelectorAll("[data-slide-index]"))n.innerHTML=e.index+1+""}function el(e){if(!B.length)return 0;let t=es(),n=e;P?n-=Math.floor((e-B[0]?.pos)/t)*t||0:n=m(B[0]?.pos,e,B[B.length-1]?.pos);let o=new Map,i=0;for(let e of B){let r=Math.min(Math.abs(e.pos-n),Math.abs(e.pos-n-t),Math.abs(e.pos-n+t));o.set(i,r),i++}return parseInt((o.size>0?[...o.entries()].reduce((e,t)=>t[1]<e[1]?t:e):[z,0])[0])}function ea(){let e=0;return S&&(S.childElementCount||(S.style.display="grid"),e=S.getBoundingClientRect()[C]||0,S.style.display=""),e}function es(e=!0){return j.length?j.reduce((e,t)=>e+t.dim,0)+(j.length-(P&&e?0:1))*W:0}function ec(e){let t=es(),n=ea();if(!t||!S||!n)return[];let o=[];e=void 0===e?O:e,P&&(e-=Math.floor(e/t)*t||0);let i=0,r=0;if(T){let e=S.getBoundingClientRect();i=Math.abs(e[R?"top":"left"]),r=Math.abs(window[R?"innerHeight":"innerWidth"]-e[R?"bottom":"right"])}let l=0;for(let a of j){let s=(t=0)=>{!(o.indexOf(a)>-1)&&(a.pos=l-e+t||0,a.offset+t>e-a.dim-i+.51&&a.offset+t<e+n+r-.51&&o.push(a))};a.offset=l,P&&(s(t),s(-1*t)),s(),l+=a.dim+W}return o}function eu(e,t){let n=[];for(let t of Array.isArray(e)?e:[e]){let e=ed({...t,isVirtual:!0});e.el||(e.el=document.createElement("div")),K("createSlide",e),n.push(e)}for(let e of(H.splice(void 0===t?H.length:t,0,...n),eE(),n))K("addSlide",e),function(e){let t=e.el;if(!e||!t)return;let n=e.html?e.html instanceof HTMLElement?e.html:s(e.html):void 0;n&&(h(n,"f-html"),e.htmlEl=n,h(t,"has-html"),t.append(n),K("contentReady",e))}(e);return en(F),n}function ed(e){return(l(e)||e instanceof HTMLElement)&&(e={html:e}),{index:-1,el:void 0,class:"",isVirtual:!0,dim:0,pos:0,offset:0,html:"",src:"",...e}}function eg(e){if(!S||!e)return;let t=e.el;if(t){if(t.setAttribute("index",e.index+""),t.parentElement!==S){let n;for(let o of(h(t,x.classes.slide),h(t,e.class),eA(e),H))if(o.index>e.index){n=o.el;break}S.insertBefore(t,n&&S.contains(n)?n:null),K("attachSlideEl",e)}return er(e),t}}function eh(e){let t=e?.el;t&&(t.remove(),ex(t),K("detachSlideEl",e))}function eE(){for(let e=0;e<H.length;e++){let t=H[e],n=t.el;n&&(t.index!==e&&ex(n),n.setAttribute("index",`${e}`)),t.index=e}}function ew(){if(!L||!S)return;A=Y("rtl"),C=(R=Y("vertical"))?"height":"width";let e=Y("classes");if(v(L,e.isLTR,!A),v(L,e.isRTL,A),v(L,e.isHorizontal,!R),v(L,e.isVertical,R),v(L,e.hasAdaptiveHeight,Y("adaptiveHeight")),!ea())return;let t=window.getComputedStyle(S);T="visible"===t.getPropertyValue("overflow-"+(R?"y":"x")),W=S&&parseFloat(t.getPropertyValue("--f-carousel-gap"))||0;let n=function(){let e=0;if(S){let t=document.createElement("div");t.style.display="block",h(t,x.classes.slide),S.appendChild(t),e=t.getBoundingClientRect()[C],t.remove(),t=void 0}return e}();for(let e of j){let t=e.el,o=0;if(!e.isVirtual&&t&&a(t)){let e=!1;t.parentElement&&t.parentElement===S||(S.appendChild(t),e=!0),o=t.getBoundingClientRect()[C],e&&t.parentElement?.removeChild(t)}else o=n;e.dim=o}if(P=!1,Y("infinite")){P=!0;let e=es(),t=ea();if(T){let e=S.getBoundingClientRect();t+=e.left,t+=e.right-e.width}for(let n=0;n<j.length;n++){let o=j[n]?.dim+W;if(e-o<t&&e-o-t<o){P=!1;break}}}if(!function(){let e;if(!L)return;let t=ea(),n=es(!1),o=Y("slidesPerPage");o="auto"===o?1/0:parseFloat(o+""),B=[];let i=0,r=0;for(let e of j)(!B.length||i+e.dim-t>.05||r>=o)&&(B.push({index:B.length,slides:[],dim:0,offset:0,pos:0}),i=0,r=0),B[B.length-1]?.slides.push(e),i+=e.dim+W,r++;let l=Y("center"),a=Y("fill"),s=0;for(let e of B){for(let t of(e.dim=(e.slides.length-1)*W,e.slides))e.dim+=t.dim;e.offset=s,e.pos=s,!1!==l&&(e.pos-=(t-e.dim)*.5),a&&!P&&n>t&&(e.pos=m(0,e.pos,n-t)),s+=e.dim+W}let c=[];for(let t of B){let n={...t};e&&.1>Math.abs(n.pos-e.pos)?(e.dim+=n.dim,e.slides=[...e.slides,...n.slides]):(e=n,n.index=c.length,c.push(n))}z=m(0,z,(B=c).length-1)}(),_=B[0]?.pos||0,$=B[B.length-1]?.pos||0,E===ep.Init){let e;g=void 0,z=Y("initialPage"),void 0!==(e=Y("initialSlide")||void 0)&&(z=e_.getPageIndex(e)||0),z=m(0,z,B.length-1),k=O=B[z]?.pos||0}else k=B[z||0]?.pos||0;K("refresh"),ei()}function ex(e){if(!e||!a(e))return;let t=parseInt(e.getAttribute("index")||"-1"),n="";for(let t of Array.from(e.classList)){let e=t.match(/^f-(\w+)(Out|In)$/);e&&e[1]&&(n=e[1]+"")}if(!e||!n)return;let o=[`f-${n}Out`,`f-${n}In`,"to-prev","to-next","from-prev","from-next"];e.removeEventListener("animationend",eL),y(e,o.join(" ")),q.delete(t)}function eM(){if(!S)return;let e=q.size>0;for(let e of j)ex(e.el);q.clear(),e&&eO()}function eL(e){e.animationName?.substring(0,2)==="f-"&&(ex(e.target),!q.size&&(y(L,"in-transition"),!I&&.5>Math.abs(e_.getPosition(!0)-k)&&(I=!0,K("settle"))),eO())}function eS(e){if(e.defaultPrevented)return;let t=e.composedPath()[0];if(t.closest("[data-carousel-go-prev]")){em(e),e_.prev();return}if(t.closest("[data-carousel-go-next]")){em(e),e_.next();return}let n=t.closest("[data-carousel-go-to]");if(n){em(e),e_.goTo(parseFloat(n.dataset.carouselGoTo||"")||0);return}if(t.closest("[data-carousel-download]")){em(e);let t=B[z]?.slides[0];if(t&&(t.downloadSrc||"image"===t.type&&t.src)){let e=t.downloadFilename,n=document.createElement("a"),o=t.downloadSrc||t.src||"";n.href=o,n.target="_blank",n.download=e||o,n.click()}return}K("click",e)}function eT(e){let t=e.el;t&&t.querySelector(".f-spinner")?.remove()}function eP(e){let t=e.el;t&&(t.querySelector(".f-html.is-error")?.remove(),y(t,"has-error"))}function eA(e){e||(e=B[z]?.slides[0]);let t=e?.el;if(!t)return;let n=Y("formatCaption",e);void 0===n&&(n=e.caption),n=n||"";let o=Y("captionEl");if(o&&o instanceof HTMLElement){if(e.index!==z)return;if(l(n)&&(o.innerHTML=U(n+"")),n instanceof HTMLElement){if(n.parentElement===o)return;o.innerHTML="",n.parentElement&&(n=n.cloneNode(!0)),o.append(n)}return}if(!n)return;let i=e.captionEl||t.querySelector(".f-caption");!i&&n instanceof HTMLElement&&n.classList.contains("f-caption")&&(i=n),!i&&(h(i=document.createElement("div"),"f-caption"),l(n)?i.innerHTML=U(n+""):n instanceof HTMLElement&&(n.parentElement&&(n=n.cloneNode(!0)),i.append(n)));let r=`f-caption-${ev}_${e.index}`;i.setAttribute("id",r),i.dataset.selectable="true",h(t,"has-caption"),t.setAttribute("aria-labelledby",r),e.captionEl=i,t.insertAdjacentElement("beforeend",i)}function eR(e,t={}){let{transition:n,tween:o}={...{transition:x.transition,tween:x.tween},...t||{}};if(!L||!c)return;let i=B.length;if(!i||function(e,t){if(!L||!c||!t||!l(t)||"tween"===t||B[z]?.slides.length>1)return!1;let n=B.length,o=e>z?1:-1;e=P?(e%n+n)%n:m(0,e,n-1),A&&(o*=-1);let i=B[z]?.slides[0],r=i?.index,a=B[e]?.slides[0],s=a?.index,u=B[e]?.pos;if(void 0===s||void 0===r||r===s||O===u||Math.abs(ea()-(a?.dim||0))>1)return!1;I=!1,c.pause(),eM(),h(L,"in-transition"),O=k=u;let d=eg(i),f=eg(a);return eo(),d&&(q.add(r),d.style.transform="",d.addEventListener("animationend",eL),y(d,x.classes.isSelected),d.inert=!1,h(d,`f-${t}Out to-${o>0?"next":"prev"}`)),f&&(q.add(s),f.style.transform="",f.addEventListener("animationend",eL),h(f,x.classes.isSelected),f.inert=!1,h(f,`f-${t}In from-${o>0?"prev":"next"}`)),eO(),!0}(e,n))return;e=P?(e%i+i)%i:m(0,e,i-1),k=B[e||0]?.pos||0;let a=c.isRunning()?c.getEndValues().pos:O;if(1>Math.abs(k-a)){O=k,z!==e&&(eA(),g=z,z=e,ei(),er(),K("change",z,g)),eO(),I||(I=!0,K("settle"));return}if(c.pause(),eM(),P){let e=es(),t=Math.floor((a-B[0]?.pos)/e)||0,n=k+t*e,o=n-e;k=[n+e,n,o].reduce(function(e,t){return Math.abs(t-a)<Math.abs(e-a)?t:e})}!1!==n&&r(o)?c.spring(f({},x.tween,o)).from({pos:O}).to({pos:k}).start():(O=k,eo(),eO(),I||(I=!0,K("settle")))}function eC(e){let t=O;if(P&&!0!==e){let e=es();t-=(Math.floor((O-B[0]?.pos||0)/e)||0)*e}return t}function eO(){let e;if(!L||!S)return;N=ec();let t=new Set,n=[],o=B[z],i=x.setTransform;for(let i of j){let r=q.has(i.index),l=N.indexOf(i)>-1,a=o?.slides?.indexOf(i)>-1;if(i.isVirtual&&!r&&!l)continue;let s=eg(i);if(s&&(n.push(i),a&&t.add(s),Y("adaptiveHeight")&&a)){let t=(s.firstElementChild||s).getBoundingClientRect().height;e=void 0==e?t:Math.max(e,t)}}S&&e&&(S.style.height=`${e}px`),[...ef(S,`.${x.classes.slide}`)].forEach(e=>{v(e,x.classes.isSelected,t.has(e));let n=H[parseInt(e.getAttribute("index")||"-1")];if(!n){e.remove(),ex(e);return}let o=q.has(n.index),r=N.indexOf(n)>-1;if(n.isVirtual&&!o&&!r)return void eh(n);if(e.inert=!r,!1===i)return;let l=n.pos?Math.round(1e4*n.pos)/1e4:0,a=0,s=0,c=0,u=0;o||(a=R?0:A?-1*l:l,s=R?l:0,c=p(a,0,n.dim,0,100),u=p(s,0,n.dim,0,100)),i instanceof Function&&!o?i(e_,n,{x:a,y:s,xPercent:c,yPercent:u}):e.style.transform=a||s?`translate3d(${c}%, ${u}%,0)`:""}),K("render",n)}function eI(){for(let e of(L?.removeEventListener("click",eS),document.removeEventListener("mousemove",ee),q.clear(),d?.disconnect(),d=void 0,H)){let t=e.el;t&&a(t)&&(e.state=void 0,eT(e),eP(e),e.isVirtual?(eh(e),e.el=void 0):(ex(t),t.style.transform="",S&&!S.contains(t)&&S.appendChild(t)))}for(let e of Object.values(M))e?.destroy();for(let[e,t]of(M={},i?.destroy(),i=void 0,c?.destroy(),c=void 0,Object.entries(x.classes||{})))"container"!==e&&y(L,t);y(S,"is-draggable")}function ez(){return P||z>0}function ek(){return P||z<B.length-1}let e_={add:function(e,t){let n=O,o=z,i=es(),r=c?.isRunning()?c.getEndValues().pos:O,l=i&&Math.floor((r-(B[0]?.pos||0))/i)||0;return eu(e,t),en(F),ew(),c&&i&&(o===z&&(n-=l*i),n===k?O=k:c.spring({clamp:!0,mass:1,tension:300,friction:25,restDelta:1,restSpeed:1}).from({pos:n}).to({pos:k}).start()),eO(),e_},canGoPrev:ez,canGoNext:ek,destroy:function(){return K("destroy"),window.removeEventListener("resize",Q),eI(),X.clear(),L=null,B=[],H=[],x={...ey},M={},j=[],b=void 0,F="*",E=ep.Destroyed,e_},emit:K,filter:function(e="*"){return en(e),ew(),O=m(_,O,$),eO(),K("filter",e),e_},getContainer:function(){return L},getGapDim:function(){return W},getGestures:function(){return i},getLastMouseMove:function(){return n},getOption:function(e){return Y(e)},getOptions:function(){return x},getPage:function(){return B[z]},getPageIndex:function(e){if(void 0!==e){for(let t of B||[])for(let n of t.slides)if(n.index===e)return t.index;return -1}return z},getPageIndexFromPosition:el,getPageProgress:function(e,t){void 0===e&&(e=z);let n=B[e];if(!n)return e>z?-1:1;let o=es(),i=W,r=n.pos,l=eC();if(P&&!0!==t){let e=Math.floor((l-B[0]?.pos)/o)||0;l-=e*o,r=[r+o,r,r-o].reduce(function(e,t){return Math.abs(t-l)<Math.abs(e-l)?t:e})}return(l-r)/(n.dim+i)||0},getPageVisibility:function(e){void 0===e&&(e=z);let t=B[e];if(!t)return e>z?-1:1;let n=eC(),o=ea(),i=t.pos;if(P){let e=es(),t=i+(Math.floor((n-B[0]?.pos)/e)||0)*e,o=t-e;i=[t+e,t,o].reduce(function(e,t){return Math.abs(t-n)<Math.abs(e-n)?t:e})}return i>n&&i+t.dim<n+o?1:i<n?(i+t.dim-n)/t.dim||0:i+t.dim>n+o&&(n+o-i)/t.dim||0},getPages:function(){return B},getPlugins:function(){return M},getPosition:eC,getSlides:function(){return H},getState:function(){return E},getTotalSlideDim:es,getTween:function(){return c},getViewport:function(){return S},getViewportDim:ea,getVisibleSlides:function(e){return void 0===e?N:ec(e)},goTo:eR,hasNavigated:function(){return void 0!==g},hideError:eP,hideLoading:eT,init:function(){if(!e||!a(e))throw Error("No Element found");return E!==ep.Init&&(eI(),E=ep.Init),L=e,w=t,window.removeEventListener("resize",Q),w.breakpoints&&window.addEventListener("resize",Q),Q(),e_},isInfinite:function(){return P},isInTransition:function(){return q.size>0},isRTL:function(){return A},isSettled:function(){return I},isVertical:function(){return R},localize:function(e,t=[]){return U(e,t)},next:function(e={}){return eR(z+1,e),e_},off:function(e,t){for(let n of e instanceof Array?e:[e])X.has(n)&&X.set(n,X.get(n).filter(e=>e!==t));return e_},on:function(e,t){for(let n of e instanceof Array?e:[e])X.set(n,[...X.get(n)||[],t]);return e_},prev:function(e={}){return eR(z-1,e),e_},reInit:function(e={},n={}){return eI(),E=ep.Init,b=void 0,F="*",t=e,w=e,o=n,Q(),e_},remove:function(e){void 0===e&&(e=H.length-1);let t=H[e];return t&&(K("removeSlide",t),t.el&&(ex(t.el),t.el.remove(),t.el=void 0),H.splice(e,1),en(F),ew(),O=m(_,O,$),eO()),e_},setPosition:function(e){O=e,eo(),eO()},showError:function(e,t){eT(e),eP(e);let n=e.el;if(n){let o=document.createElement("div");h(o,"f-html"),h(o,"is-error"),o.innerHTML=U(t||"<p>{{ERROR}}</p>"),e.htmlEl=o,h(n,"has-html"),h(n,"has-error"),n.insertAdjacentElement("afterbegin",o),K("contentReady",e)}return e_},showLoading:function(e){let t=e.el,n=t?.querySelector(".f-spinner");if(!t||n)return e_;let o=s(Y("spinnerTpl"));return o&&(h(o,"f-spinner"),t.insertAdjacentElement("beforeend",o)),e_},version:"6.1.3"};return e_};eb.l10n={en_EN:eg},eb.getDefaults=()=>ey;let eE=function(e="",t="",n=""){return e.split(t).join(n)},ew={tpl:e=>`<img class="f-panzoom__content" 
    ${e.srcset?'data-lazy-srcset="{{srcset}}"':""} 
    ${e.sizes?'data-lazy-sizes="{{sizes}}"':""} 
    data-lazy-src="{{src}}" alt="{{alt}}" />`},ex=()=>{let e;function t(t,n){let o=e?.getOptions().Zoomable,i=(r(o)?{...ew,...o}:ew)[t];return i&&"function"==typeof i&&n?i(n):i}function n(){e&&!1!==e.getOptions().Zoomable&&(e.on("addSlide",a),e.on("removeSlide",s),e.on("attachSlideEl",c),e.on("click",i),e.on("change",o),e.on("ready",o))}function o(){u();let t=e?.getVisibleSlides()||[];if(t.length>1||e?.getOption("transition")==="slide")for(let n of t){let t=n.panzoomRef;t&&0>(e?.getPage().slides||[]).indexOf(n)&&t.execute(eo.ZoomTo,{...t.getStartPosition()})}}function i(e,t){let n=t.target;n&&!t.defaultPrevented&&n.dataset.panzoomAction&&d(n.dataset.panzoomAction)}function a(n,o){let i=o.el;if(!e||!i||o.panzoomRef)return;let r=o.src||o.lazySrc||"",a=o.alt||o.caption||`Image #${o.index}`,s=o.srcset||o.lazySrcset||"",c=o.sizes||o.lazySizes||"";if(r&&l(r)&&!o.html&&(!o.type||"image"===o.type)){o.type="image",o.thumbSrc=o.thumbSrc||r;let e=t("tpl",o);e=eE(e,"{{src}}",r+""),e=eE(e,"{{srcset}}",s+""),e=eE(e,"{{sizes}}",c+""),i.insertAdjacentHTML("afterbegin",e)}let d=i.querySelector(".f-panzoom__content");if(!d)return;d.setAttribute("alt",a+"");let f=ed(i,{width:o.width&&"auto"!==o.width?parseFloat(o.width+""):"auto",height:o.height&&"auto"!==o.height?parseFloat(o.height+""):"auto",classes:{container:"f-zoomable"},event:()=>e?.getLastMouseMove(),spinnerTpl:()=>e?.getOption("spinnerTpl")||"",...t("Panzoom")});f.on("*",(t,n,...i)=>{e&&("loading"===n&&(o.state=0),"loaded"===n&&(o.state=1),"error"===n&&(o.state=2,e?.showError(o,"{{IMAGE_ERROR}}")),e.emit(`panzoom:${n}`,o,...i),"ready"===n&&e.emit("contentReady",o),o.index===e?.getPageIndex()&&u())}),o.panzoomRef=f}function s(e,t){t.panzoomRef&&(t.panzoomRef.destroy(),t.panzoomRef=void 0)}function c(e,t){let n=t.panzoomRef;if(n)switch(n.getState()){case el.Init:n.init();break;case el.Ready:n.execute(eo.ZoomTo,{...n.getStartPosition(),velocity:0})}}function u(){let t=e?.getContainer()||void 0,n=e?.getPage()?.slides[0]?.panzoomRef;if(t)if(n)n.updateControls(t);else for(let e of t.querySelectorAll("[data-panzoom-action]")||[])e.setAttribute("aria-disabled",""),e.setAttribute("tabindex","-1")}function d(t,...n){e?.getPage().slides[0].panzoomRef?.execute(t,...n)}return{init:function(t){(e=t).on("initPlugins",n)},destroy:function(){if(e)for(let t of(e.off("initPlugins",n),e.off("addSlide",a),e.off("removeSlide",s),e.off("attachSlideEl",c),e.off("click",i),e.off("change",o),e.off("ready",o),e.getSlides()))s(e,t);e=void 0},execute:d}},eM={syncOnChange:!1,syncOnClick:!0,syncOnHover:!1},eL=()=>{let e,t;function n(){let t=e?.getOptions().Sync;return r(t)?{...eM,...t}:eM}function o(){let o=n().target;e&&o&&e&&o&&(t=o,e.getOptions().classes={...e.getOptions().classes,isSelected:""},e.getOptions().initialSlide=t.getPage()?.slides[0]?.index||0,n().syncOnChange&&e.on("change",l),n().syncOnClick&&e.on("click",s),n().syncOnHover&&e.getViewport()?.addEventListener("mouseover",c),e&&t&&(e.on("ready",i),e.on("refresh",u),t.on("change",a),t.on("filter",d)))}function i(){f()}function l(){if(e&&t){let n=e.getPage()?.slides||[],o=t.getPageIndex(n[0].index||0);o>-1&&t.goTo(o,e.hasNavigated()?void 0:{tween:!1,transition:!1}),f()}}function a(){if(e&&t){let n=e.getPageIndex(t.getPage()?.slides[0].index||0);n>-1&&e.goTo(n,t.hasNavigated()?void 0:{tween:!1,transition:!1}),f()}}function s(n,o){if(!e||!t||e.getTween()?.isRunning())return;let i=e?.getOptions().classes.slide;if(!i)return;let r=i?o.target.closest(`.${i}`):null;if(r){let e=parseInt(r.getAttribute("index")||"")||0,n=t.getPageIndex(e);t.goTo(n)}}function c(t){e&&s(e,t)}function u(){if(e&&t){let n=e.getPageIndex(t.getPage()?.slides[0].index||0);n>-1&&e.goTo(n,{tween:!1,transition:!1}),f()}}function d(n,o){e&&t&&(e.filter(o),a())}function f(){if(!t)return;let n=t.getPage()?.slides[0]?.index||0;for(let t of e?.getSlides()||[])t.el?.classList.toggle("is-selected",t.index===n)}return{init:function(t){(e=t).on("initSlides",o)},destroy:function(){e?.off("ready",i),e?.off("refresh",u),e?.off("change",l),e?.off("click",s),e?.getViewport()?.removeEventListener("mouseover",c),t?.off("change",a),t?.off("filter",d),t=void 0,e?.off("initSlides",o),e=void 0},getTarget:function(){return t}}},eS={showLoading:!0,preload:1},eT="is-lazyloading",eP="is-lazyloaded",eA="has-lazyerror",eR=()=>{let e;function t(){let t=e?.getOptions().Lazyload;return r(t)?{...eS,...t}:eS}function n(){if(!e)return;let n=[...e.getVisibleSlides()],o=t().preload;if(o>0){let t=e.getPosition(),i=e.getViewportDim();n.push(...e.getVisibleSlides(t+i*o),...e.getVisibleSlides(t-i*o))}for(let o of n)!function(n){let o=n.el;if(!o)return;let i="[data-lazy-src],[data-lazy-srcset],[data-lazy-bg]",r=Array.from(o.querySelectorAll(i));for(let l of(o.matches(i)&&r.push(o),r)){let o=l.dataset.lazySrc,i=l.dataset.lazySrcset,r=l.dataset.lazySizes,a=l.dataset.lazyBg,s=(l instanceof HTMLImageElement||l instanceof HTMLSourceElement)&&(o||i),c=l instanceof HTMLElement&&a;if(!(s||c))continue;let u=o||i||a;if(u){if(s&&u){let a=l.parentElement?.classList.contains("f-panzoom__wrapper");t().showLoading&&e?.showLoading(n),l.addEventListener("load",()=>{e?.hideLoading(n),y(l,eA),l instanceof HTMLImageElement?l.decode().then(()=>{y(l,eT),h(l,eP)}):(y(l,eT),h(l,eP)),a||e?.emit("lazyLoad:loaded",n,l,u)}),l.addEventListener("error",()=>{e?.hideLoading(n),y(l,eT),h(l,eA),a||e?.emit("lazyLoad:error",n,l,u)}),l.classList.add("f-lazyload"),l.classList.add(eT),a||e?.emit("lazyLoad:load",n,l,u),o&&(l.src=o),i&&(l.srcset=i),r&&(l.sizes=r)}else c&&(document.body.contains(l)||(document.createElement("img").src=a),l.style.backgroundImage=`url('${a}')`);delete l.dataset.lazySrc,delete l.dataset.lazySrcset,delete l.dataset.lazySizes,delete l.dataset.lazyBg}}}(o)}return{init:function(t){(e=t).on("render",n)},destroy:function(){e?.off("render",n),e=void 0}}},eC='<svg width="24" height="24" viewBox="0 0 24 24" tabindex="-1">',eO="</svg>",eI={prevTpl:eC+'<path d="M15 3l-9 9 9 9"></path>'+eO,nextTpl:eC+'<path d="M9 3l9 9-9 9"></path>'+eO},ez=()=>{let e,t,n;function o(){let t=e?.getOptions().Arrows;return r(t)?{...eI,...t}:eI}function i(t){if(!e)return;let n=`<button data-carousel-go-${t} tabindex="0" class="f-button is-arrow is-${t}" title="{{${t.toUpperCase()}}}">`+o()[`${t}Tpl`]+"</button",i=s(e.localize(n))||void 0;return i&&h(i,o()[`${t}Class`]),i}function l(){t?.remove(),t=void 0,n?.remove(),n=void 0,e?.getContainer()?.classList.remove("has-arrows")}function a(){e&&!1!==e.getOptions().Arrows&&e.getPages().length>1?(!function(){if(!e)return;let o=e.getViewport();o&&(!t&&(t=i("prev"))&&o.insertAdjacentElement("beforebegin",t),!n&&(n=i("next"))&&o.insertAdjacentElement("afterend",n),v(e.getContainer(),"has-arrows",!!(t||n)))}(),e&&(t?.toggleAttribute("aria-disabled",!e.canGoPrev()),n?.toggleAttribute("aria-disabled",!e.canGoNext()))):l()}return{init:function(t){e=t.on(["change","refresh"],a)},destroy:function(){l(),e?.off(["change","refresh"],a),e=void 0}}},ek='<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/>',e_='<g><line x1="11" y1="8" x2="11" y2="14"></line></g>'+ek,e$={};for(let[e,t]of Object.entries({moveLeft:["moveLeft","MOVE_LEFT",'<path d="M5 12h14M5 12l6 6M5 12l6-6"/>'],moveRight:["moveRight","MOVE_RIGHT",'<path d="M5 12h14M13 18l6-6M13 6l6 6"/>'],moveUp:["moveUp","MOVE_UP",'<path d="M12 5v14M18 11l-6-6M6 11l6-6"/>'],moveDown:["moveDown","MOVE_DOWN",'<path d="M12 5v14M18 13l-6 6M6 13l6 6"/>'],zoomOut:["zoomOut","ZOOM_OUT",ek],zoomIn:["zoomIn","ZOOM_IN",e_],toggleFull:["toggleFull","TOGGLE_FULL",e_],iterateZoom:["iterateZoom","ITERATE_ZOOM",e_],toggle1to1:["toggleFull","TOGGLE_FULL",'<path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/>'],rotateCCW:["rotateCCW","ROTATE_CCW",'<path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/>'],rotateCW:["rotateCW","ROTATE_CW",'<path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/>'],flipX:["flipX","FLIP_X",'<path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/>'],flipY:["flipY","FLIP_Y",'<path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/>'],reset:["reset","RESET",'<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>'],toggleFS:["toggleFS","TOGGLE_FS",'<g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g>']}))e$[e]={tpl:`<button data-panzoom-action="${t[0]}" class="f-button" title="{{${t[1]}}}"><svg>${t[2]}</svg></button>`};let eF=((I={}).Left="left",I.middle="middle",I.right="right",I),eH={counter:{tpl:'<div class="f-counter"><span data-carousel-page></span>/<span data-carousel-pages></span></div>'},download:{tpl:'<button data-carousel-download class="f-button" title="{{DOWNLOAD}}"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></button>'},autoplay:{tpl:'<button data-autoplay-action="toggle" class="f-button" title="{{TOGGLE_AUTOPLAY}}"><svg><g><path d="M5 3.5 19 12 5 20.5Z"/></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>'},thumbs:{tpl:'<button data-thumbs-action="toggle" class="f-button" title="{{TOGGLE_THUMBS}}"><svg><rect width="18" height="14" x="3" y="3" rx="2"/><path d="M4 21h1M9 21h1M14 21h1M19 21h1"/></svg></button>'},...e$},eD={absolute:!1,display:{left:[],middle:["zoomIn","zoomOut","toggle1to1","rotateCCW","rotateCW","flipX","flipY","reset"],right:[]},enabled:"auto",items:{}},eV=()=>{let e,t;function n(t){let n=e?.getOptions().Toolbar,o=(r(n)?{...eD,...n}:eD)[t];return o&&"function"==typeof o&&e?o(e):o}function o(){if(!e?.getOptions().Toolbar||!e||t)return;let o=e.getContainer();if(!o)return;let i=n("enabled");if(!i)return;let a=n("absolute"),c=e.getSlides().length>1,u=!1,d=!1;for(let t of e.getSlides())t.panzoomRef&&(u=!0),(t.downloadSrc||"image"===t.type&&t.src)&&(d=!0);let g=e.getPlugins().Thumbs?.isEnabled()||!1,m=c&&e.getPlugins().Autoplay||!1,p=e.getPlugins().Fullscreen&&(document.fullscreenEnabled||document.webkitFullscreenEnabled);if("auto"===i&&(i=u),!i)return;(t=o.querySelector(".f-carousel__toolbar")||void 0)||(t=document.createElement("div")).classList.add("f-carousel__toolbar");let h=n("display"),y=f({},eH,n("items"));for(let n of["left","middle","right"]){let o=h[n]||[],i=document.createElement("div");for(let t of(i.classList.add("f-carousel__toolbar__column"),i.classList.add(`is-${n}`),o)){let n;if(l(t)){if("counter"===t&&!c||"autoplay"===t&&!m||e$[t]&&!u||"fullscreen"===t&&!p||"thumbs"===t&&!g||"download"===t&&!d)continue;n=y[t]}if(r(t)&&(n=t),n&&n.tpl){let t=e.localize(n.tpl),o=s(t=t.split("<svg>").join('<svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24">'));o&&("function"==typeof n.click&&e&&o.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),"function"==typeof n.click&&e&&n.click(e,t)}),i.append(o))}}t.append(i)}if(t.childElementCount){if(a&&t.classList.add("is-absolute"),!t.parentElement){let o=n("parentEl");o?o.insertAdjacentElement("afterbegin",t):e.getViewport()?.insertAdjacentElement("beforebegin",t)}o.contains(t)&&o.classList.add("has-toolbar")}}return{init:function(t){e=t,e?.on("initSlides",o)},destroy:function(){e?.off("initSlides",o),e?.getContainer()?.classList.remove("has-toolbar"),t?.remove(),t=void 0},add:function(e,t){eH[e]=t},isEnabled:function(){return!!t}}},ej={autoStart:!0,pauseOnHover:!0,showProgressbar:!0,timeout:2e3},eq=()=>{let e,t,n=!1,o=!1,i=!1,l=null;function a(t){let n=e?.getOptions().Autoplay,o=(r(n)?{...ej,...n}:ej)[t];return o&&"function"==typeof o&&e?o(e):o}function s(){clearTimeout(t),t=void 0}function c(){!e||!n||i||o||t||!e.isSettled()||function(){for(let t of e?.getPage()?.slides||[])if(0===t.state)return!0;return!1}()||(function(){if(!e||(f(),!a("showProgressbar")))return;let t=a("progressbarParentEl");if(!t&&e.getPlugins().Toolbar?.isEnabled()&&(t=e.getContainer()),!t&&e.getPlugins().Toolbar?.isEnabled()!==!0){let n=e.getPages()[0]?.slides||[],o=e.getPage()?.slides||[];1===n.length&&1===o.length&&(t=o[0].el)}if(t||(t=e.getViewport()),!t)return;h(l=document.createElement("div"),"f-progressbar"),t.prepend(l);let n=a("timeout")||1e3;l.style.animationDuration=`${n}ms`}(),t=setTimeout(()=>{if(e&&n&&!o){if(!e.isInfinite()&&e.getPageIndex()===e.getPages().length-1)return void e.goTo(0);e.next()}},a("timeout")))}function u(){if(!e||e.getPages().length<2||!1===e.getOptions().Autoplay||n)return;n=!0,e.emit("autoplay:start",a("timeout")),h(e.getContainer(),"has-autoplay"),e.getTween()?.on("start",b);let t=e?.getContainer();t&&a("pauseOnHover")&&matchMedia("(hover: hover)").matches&&(t.addEventListener("mouseenter",E,!1),t.addEventListener("mouseleave",w,!1)),e.on("change",y),e.on("settle",v),e.on("contentReady",m),e.on("panzoom:touchStart",d),e.on("panzoom:wheel",d),e.isSettled()&&c()}function d(){if(s(),f(),e){if(n){e.emit("autoplay:end"),e.getTween()?.off("start",b);let t=e.getContainer();t&&(t.classList.remove("has-autoplay"),t.removeEventListener("mouseenter",E,!1),t.removeEventListener("mouseleave",w,!1))}e.off("change",y),e.off("settle",v),e.off("contentReady",m),e.off("panzoom:touchStart",d),e.off("panzoom:wheel",d)}n=!1,o=!1}function f(){l&&(l.remove(),l=null)}function g(){e&&e.getPages().length>1&&a("autoStart")&&u()}function m(){c()}function p(e,t){let n=t.target;n&&!t.defaultPrevented&&"toggle"===n.dataset.autoplayAction&&x.toggle()}function y(){e&&(e?.isInfinite()||e.getPageIndex()!==e.getPages().length-1)?(f(),s()):d()}function v(){c()}function b(){s(),f()}function E(){i=!0,n&&(f(),s())}function w(){i=!1,n&&!o&&e?.isSettled()&&c()}let x={init:function(t){(e=t).on("ready",g),e.on("click",p)},destroy:function(){d(),e?.off("ready",g),e?.off("click",p),e=void 0},isEnabled:()=>n,pause:function(){o=!0,s()},resume:function(){o=!1,n&&!i&&c()},start(){u()},stop(){d()},toggle(){n?d():u()}};return x},eN={Carousel:{Lazyload:{showLoading:!1}},minCount:2,showOnStart:!0,thumbTpl:'<button aria-label="Slide to #{{page}}"><img draggable="false" alt="{{alt}}" data-lazy-src="{{src}}" /></button>',type:"modern"},eB=()=>{let e,t,n,i,l,a=0,c=0,u=!0;function d(t){let n=e?.getOptions().Thumbs,o=(r(n)?{...eN,...n}:eN)[t];return o&&"function"==typeof o&&e?o(e):o}function g(){if(!e||e?.getOptions().Thumbs===!1)return!1;let t=0;for(let n of e.getSlides())n.thumbSrc&&t++;return t>=d("minCount")}function p(){return"modern"===d("type")}function y(){return"scrollable"===d("type")}function v(){let t=[];for(let n of e?.getSlides()||[])t.push({index:n.index,class:n.thumbClass,html:b(n)});return t}function b(e){let t=e.thumb?e.thumb instanceof HTMLImageElement?e.thumb.src:e.thumb:e.thumbSrc||void 0,n=void 0===e.thumbAlt?`Thumbnail #${e.index}`:e.thumbAlt+"",o=d("thumbTpl");return o=eE(o,"{{alt}}",n),o=eE(o,"{{src}}",t+""),o=eE(o,"{{index}}",`${e.index}`),o=eE(o,"{{page}}",`${e.index||1}`)}function E(e){return`<div index="${e.index||0}" class="f-thumbs__slide ${e.class||""}">${e.html||""}</div>`}function w(t=!1){let o=e?.getContainer();if(!e||!o||n||!g())return;let i=d("Carousel")?.classes||{};if(i.container=i.container||"f-thumbs",!n){let e=o.nextElementSibling;e?.classList.contains(i.container)&&(n=e)}if(!n){n=document.createElement("div");let e=d("parentEl");e?e.insertAdjacentElement("beforeend",n):o.insertAdjacentElement("afterend",n)}h(n,i.container),h(n,"f-thumbs"),h(n,`is-${d("type")}`),t&&h(n,"is-hidden")}function x(){if(!n||!y())return;h(i=document.createElement("div"),"f-thumbs__viewport");let t="";for(let e of v())"string"==typeof(e.html||"")&&(t+=E(e));i.innerHTML=t,n.append(i),n.addEventListener("click",t=>{t.preventDefault();let n=t.target.closest("[index]"),o=parseInt(n?.getAttribute("index")||"-1");e&&o>-1&&e.goTo(o)}),l=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target instanceof HTMLImageElement&&(e.target.src=e.target.getAttribute("data-lazy-src")+"",e.target.removeAttribute("data-lazy-src"),l?.unobserve(e.target))})},{root:i,rootMargin:"100px"}),n.querySelectorAll("[data-lazy-src]").forEach(e=>{l?.observe(e)}),e?.emit("thumbs:ready")}function M(){if(!o||!e||!n||y()||t)return;let i=v();if(!i.length)return;let r=f({},{Sync:{target:e},Lazyload:{preload:1},slides:i,classes:{container:"f-thumbs",viewport:"f-thumbs__viewport",slide:"f-thumbs__slide"},center:!0,fill:!p(),infinite:!1,dragFree:!0,rtl:e.getOptions().rtl||!1,slidesPerPage:e=>{let t=0;return(p()&&(function(){if(!p()||!n)return;let e=e=>n&&parseFloat(getComputedStyle(n).getPropertyValue("--f-thumb-"+e))||0;a=e("width"),c=e("clip-width")}(),t=(a-c)*4),e&&e.getTotalSlideDim()<=e.getViewportDim()-t)?1/0:1}},eN.Carousel||{},d("Carousel")||{});(t=o(n,r,{Sync:eL,Lazyload:eR})).on("ready",()=>{h(n,"is-syncing"),e?.emit("thumbs:ready"),p()&&e?.on("render",P)}),t.on("destroy",()=>{e?.emit("thumbs:destroy")}),t.init(),t.getGestures()?.on("start",()=>{u=!1}),t.on("click",(e,t)=>{let n=t.target;if(n){let e=n.matches("button")?n:n.firstElementChild;e&&e.matches("button")&&(t.preventDefault(),e.focus({preventScroll:!0}))}}),h(e.getContainer(),"has-thumbs"),k()}function L(){g()&&d("showOnStart")&&(w(),x())}function S(){g()&&(M(),e?.on("addSlide",R),e?.on("removeSlide",C),e?.on("click",O),e?.on("refresh",I),e?.getGestures()?.on("start",T),z(!0))}function T(){u=!0,document.activeElement?.closest(".f-thumbs")&&document.activeElement?.blur()}function P(){n?.classList.toggle("is-syncing",e?.hasNavigated()===!1||e?.getTween()?.isRunning()),k(),e?.getGestures()?.isPointerDown()&&function(){if(!p()||!e||!t||!u)return;let n=t.getTween(),o=t.getPages(),i=e.getPageIndex()||0,r=e.getPageProgress()||0;if(!e||!o||!o[i]||!n)return;let l=n.isRunning()?n.getCurrentValues().pos:t.getPosition();if(void 0===l)return;let s=o[i].pos+r*(a-c);s=m(o[0].pos,s,o[o.length-1].pos),n.from({pos:l}).to({pos:s}).start()}()}function A(){u=!0,z()}function R(e,n){let o={html:b(n)};if(t)t.add(o,n.index);else if(i){let e=s(E(o));if(e){i.append(e);let t=e.querySelector("img");t&&l?.observe(t)}}}function C(e,n){t?t.remove(n.index):i&&i.querySelector(`[index="${n.index}"]`)?.remove()}function O(e,t){let o=t.target;!t.defaultPrevented&&o?.dataset?.thumbsAction==="toggle"&&(n||(w(!0),x(),M()),n&&n.classList.toggle("is-hidden"))}function I(){z()}function z(t=!1){if(!e||!i||!y())return;let n=e.getPageIndex();i.querySelectorAll(".is-selected").forEach(e=>{e.classList.remove("is-selected")});let o=i.querySelector(`[index="${n}"]`);if(o){o.classList.add("is-selected");let e=i.getBoundingClientRect(),n=o.getBoundingClientRect(),r=o.offsetTop-i.offsetTop-.5*e.height+.5*n.height,l=o.scrollLeft-i.scrollLeft-.5*e.width+.5*n.width;i.scrollTo({top:r,left:l,behavior:t?"instant":"smooth"})}}function k(){if(!p()||!e||!t)return;let n=t?.getSlides()||[],o=-.5*a;for(let t of n){let n=t.el;if(!n)continue;let i=e.getPageProgress(t.index)||0;(i=Math.max(-1,Math.min(1,i)))>-1&&i<1&&(o+=.5*a*(1-Math.abs(i))),i=Math.round(1e4*i)/1e4,o=Math.round(1e4*o)/1e4,n.style.setProperty("--progress",`${Math.abs(i)}`),n.style.setProperty("--shift",`${e?.isRTL()?-1*o:o}px`),i>-1&&i<1&&(o+=.5*a*(1-Math.abs(i)))}}return{init:function(t,n){o=n,(e=t).on("ready",S),e.on("initSlides",L),e.on("change",A)},destroy:function(){y()&&e?.emit("thumbs:destroy"),e?.off("ready",S),e?.off("initSlides",L),e?.off("change",A),e?.off("render",P),e?.off("addSlide",R),e?.off("click",O),e?.off("refresh",I),e?.getGestures()?.off("start",T),e?.getContainer()?.classList.remove("has-thumbs"),e=void 0,t?.destroy(),t=void 0,n?.remove(),n=void 0},getCarousel:function(){return t},getContainer:function(){return n},getType:function(){return d("type")},isEnabled:g}},eZ={iframeAttr:{allow:"autoplay; fullscreen",scrolling:"auto"}},eG=()=>{let e;function t(e,t){let n=t.src;if(!l(n))return;let o=t.type;if(!o){if(!o&&("#"===n.charAt(0)?o="inline":n.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.((a)?png|avif|gif|jp(g|eg)|pjp(eg)?|jfif|svg|webp|bmp|ico|tif(f)?)((\?|#).*)?$)/i)?o="image":n.match(/\.(pdf)((\?|#).*)?$/i)?o="pdf":n.match(/\.(html|php)((\?|#).*)?$/i)&&(o="iframe")),!o){let e=n.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i);e&&(n=`https://maps.google.${e[1]}/?ll=${(e[2]?e[2]+"&z="+Math.floor(parseFloat(e[3]))+(e[4]?e[4].replace(/^\//,"&"):""):e[4]+"").replace(/\?/,"&")}&output=${e[4]&&e[4].indexOf("layer=c")>0?"svembed":"embed"}`,o="gmap")}if(!o){let e=n.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i);e&&(n=`https://maps.google.${e[1]}/maps?q=${e[2].replace("query=","q=").replace("api=1","")}&output=embed`,o="gmap")}t.src=n,t.type=o}}function n(t,n){("iframe"===n.type||"pdf"===n.type||"gmap"===n.type)&&function(t){let n;if(!e||!t.el||!t.src)return;let o=document.createElement("iframe");for(let[t,i]of(o.classList.add("f-iframe"),Object.entries((r(n=e?.getOptions().Html)?{...eZ,...n}:eZ).iframeAttr||{})))o.setAttribute(t,i);o.onerror=()=>{e&&1===e.getState()&&e.showError(t,"{{IFRAME_ERROR}}")},o.src=t.src;let i=document.createElement("div");if(i.classList.add("f-html"),i.append(o),t.width){let e=`${t.width}`;e.match(/^\d+$/)&&(e+="px"),i.style.maxWidth=`${e}`}if(t.height){let e=`${t.height}`;e.match(/^\d+$/)&&(e+="px"),i.style.maxHeight=`${e}`}if(t.aspectRatio){let e=t.el.getBoundingClientRect();i.style.aspectRatio=`${t.aspectRatio}`,i.style[e.width>e.height?"width":"height"]="auto",i.style[e.width>e.height?"maxWidth":"maxHeight"]="none"}t.contentEl=o,t.htmlEl=i,t.el.classList.add("has-html"),t.el.classList.add("has-iframe"),t.el.classList.add(`has-${t.type}`),t.el.prepend(i),e.emit("contentReady",t)}(n)}function o(t,n){("iframe"===n.type||"pdf"===n.type||"gmap"===n.type)&&(e?.hideError(n),n.contentEl?.remove(),n.contentEl=void 0,n.htmlEl?.remove(),n.htmlEl=void 0)}return{init:function(i){(e=i).on("addSlide",t),e.on("attachSlideEl",n),e.on("detachSlideEl",o)},destroy:function(){e?.off("addSlide",t),e?.off("attachSlideEl",n),e?.off("detachSlideEl",o),e=void 0}}},eW=(e,t={})=>{let n=new URLSearchParams(new URL(e).search),o=new URLSearchParams;for(let[e,i]of[...n,...Object.entries(t)]){let t=i+"";if("t"===e){let e=t.match(/((\d*)m)?(\d*)s?/);e&&o.set("start",60*parseInt(e[2]||"0")+parseInt(e[3]||"0")+"")}else o.set(e,t)}let i=o+"",r=e.match(/#t=((.*)?\d+s)/);return r&&(i+=`#t=${r[1]}`),i},eY={autoplay:!1,html5videoTpl:`<video class="f-html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
    <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,iframeAttr:{allow:"autoplay; fullscreen",scrolling:"auto",credentialless:""},vimeo:{byline:1,color:"00adef",controls:1,dnt:1,muted:0},youtube:{controls:1,enablejsapi:1,nocookie:1,rel:0,fs:1}},eU=()=>{let e,t=!1;function n(){let t=e?.getOptions().Video;return r(t)?{...eY,...t}:eY}function o(){return e?.getPage()?.slides[0]}let i=t=>{try{let n=JSON.parse(t.data);if("https://player.vimeo.com"===t.origin){if("ready"===n.event)for(let n of Array.from(e?.getContainer()?.getElementsByClassName("f-iframe")||[]))n instanceof HTMLIFrameElement&&n.contentWindow===t.source&&(n.dataset.ready="true")}else if(t.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/)&&"onReady"===n.event){let e=document.getElementById(n.id);e&&(e.dataset.ready="true")}}catch(e){}};function a(e,t){let o=t.src;if(!l(o))return;let i=t.type;if(!i||"html5video"===i){let e=o.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i);e&&(i="html5video",t.html5videoFormat=t.html5videoFormat||"video/"+("ogv"===e[1]?"ogg":e[1]))}if(!i||"youtube"===i){let e=o.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i);if(e){let r={...n().youtube,...t.youtube||{}},l=`www.youtube${r.nocookie?"-nocookie":""}.com`,a=eW(o,r),s=encodeURIComponent(e[2]);t.videoId=s,t.src=`https://${l}/embed/${s}?${a}`,t.thumb=t.thumb||`https://i.ytimg.com/vi/${s}/mqdefault.jpg`,i="youtube"}}if(!i||"vimeo"===i){let e=o.match(/^.+vimeo.com\/(?:\/)?(video\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/);if(e){let r=eW(o,{...n().vimeo,...t.vimeo||{}}),l=encodeURIComponent(e[2]),a=e[5]||"";t.videoId=l,t.src=`https://player.vimeo.com/video/${l}?${a?`h=${a}${r?"&":""}`:""}${r}`,i="vimeo"}}t.type=i}function c(t,o){"html5video"===o.type&&function(t){if(!e||!t.el||!t.src)return;let{el:o,src:i}=t;if(!o||!i)return;let r=t.html5videoTpl||n().html5videoTpl,a=t.html5videoFormat||n().html5videoFormat;if(!r)return;let c=t.poster||(t.thumb&&l(t.thumb)?t.thumb:""),u=s(r.replace(/\{\{src\}\}/gi,i+"").replace(/\{\{format\}\}/gi,a||"").replace(/\{\{poster\}\}/gi,c+""));if(!u)return;let d=document.createElement("div");d.classList.add("f-html"),d.append(u),t.contentEl=u,t.htmlEl=d,o.classList.add(`has-${t.type}`),o.prepend(d),g(t),e.emit("contentReady",t)}(o),("youtube"===o.type||"vimeo"===o.type)&&function(t){if(!e||!t.el||!t.src)return;let o=document.createElement("iframe");for(let[e,i]of(o.classList.add("f-iframe"),o.setAttribute("id",`f-iframe_${t.videoId}`),Object.entries(n().iframeAttr||{})))o.setAttribute(e,i);o.onload=()=>{e&&1===e.getState()&&"youtube"===t.type&&o.contentWindow?.postMessage(JSON.stringify({event:"listening",id:o.getAttribute("id")}),"*")},o.onerror=()=>{e&&1===e.getState()&&e?.showError(t,"{{IFRAME_ERROR}}")},o.src=t.src;let i=document.createElement("div");i.classList.add("f-html"),i.append(o),t.contentEl=o,t.htmlEl=i,t.el.classList.add("has-html"),t.el.classList.add("has-iframe"),t.el.classList.add(`has-${t.type}`),t.el.prepend(i),g(t),e.emit("contentReady",t)}(o)}function u(e,t){("html5video"===t.type||"youtube"===t.type||"vimeo"===t.type)&&(t.contentEl?.remove(),t.contentEl=void 0,t.htmlEl?.remove(),t.htmlEl=void 0),t.poller&&clearTimeout(t.poller)}function d(){t=!1}function f(){if(t)return;t=!0;let e=o();(e&&void 0!==e.autoplay?e.autoplay:n().autoplay)&&(!function(){let e=o(),t=e?.el;if(t&&e?.type==="html5video")try{let e=t.querySelector("video");if(e){let t=e.play();void 0!==t&&t.then(()=>{}).catch(t=>{e.muted=!0,e.play()})}}catch(e){}let n=e?.htmlEl;n instanceof HTMLIFrameElement&&n.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}',"*")}(),function(){let e=o(),t=e?.type;if(!(e?.el&&("youtube"===t||"vimeo"===t)))return;let n=()=>{if(e.contentEl&&e.contentEl instanceof HTMLIFrameElement&&e.contentEl.contentWindow){let t;if("true"===e.contentEl.dataset.ready){(t="youtube"===e.type?{event:"command",func:"playVideo"}:{method:"play",value:"true"})&&e.contentEl.contentWindow.postMessage(JSON.stringify(t),"*"),e.poller=void 0;return}"youtube"===e.type&&(t={event:"listening",id:e.contentEl.getAttribute("id")},e.contentEl.contentWindow.postMessage(JSON.stringify(t),"*"))}e.poller=setTimeout(n,250)};n()}())}function g(e){let t=e?.htmlEl;if(e&&t&&("html5video"===e.type||"youtube"===e.type||"vimeo"===e.type)){if(t.style.aspectRatio="",t.style.width="",t.style.height="",t.style.maxWidth="",t.style.maxHeight="",e.width){let n=`${e.width}`;n.match(/^\d+$/)&&(n+="px"),t.style.maxWidth=`${n}`}if(e.height){let n=`${e.height}`;n.match(/^\d+$/)&&(n+="px"),t.style.maxHeight=`${n}`}if(e.aspectRatio){let n=e.aspectRatio.split("/"),o=parseFloat(n[0].trim()),i=n[1]?parseFloat(n[1].trim()):0;t.offsetHeight;let r=t.getBoundingClientRect(),l=(o&&i?o/i:o)<(r.width||1)/(r.height||1);t.style.aspectRatio=`${e.aspectRatio}`,t.style.width=l?"auto":"",t.style.height=l?"":"auto"}}}function m(){g(o())}return{init:function(t){(e=t).on("addSlide",a),e.on("attachSlideEl",c),e.on("detachSlideEl",u),e.on("ready",f),e.on("change",d),e.on("settle",f),e.on("refresh",m),window.addEventListener("message",i)},destroy:function(){e?.off("addSlide",a),e?.off("attachSlideEl",c),e?.off("detachSlideEl",u),e?.off("ready",f),e?.off("change",d),e?.off("settle",f),e?.off("refresh",m),window.removeEventListener("message",i),e=void 0}}},eX={autoStart:!1,btnTpl:'<button data-fullscreen-action="toggle" class="f-button" title="{{TOGGLE_FULLSCREEN}}"><svg><g><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>'},eK="in-fullscreen-mode",eJ=()=>{let e;function t(t){let n=e?.getOptions().Fullscreen,o=(r(n)?{...eX,...n}:eX)[t];return o&&"function"==typeof o&&e?o(e):o}function n(){e?.getPlugins().Toolbar?.add("fullscreen",{tpl:t("btnTpl")})}function o(){if(t("autoStart")){let e=l();e&&s(e)}}function i(e,t){let n=t.target;n&&!t.defaultPrevented&&"toggle"===n.dataset.fullscreenAction&&u()}function l(){return t("el")||e?.getContainer()||void 0}function a(){let e=document;return e.fullscreenEnabled?!!e.fullscreenElement:!!e.webkitFullscreenEnabled&&!!e.webkitFullscreenElement}function s(e){let t,n=document;return e||(e=n.documentElement),n.fullscreenEnabled?t=e.requestFullscreen():n.webkitFullscreenEnabled&&(t=e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)),t&&t.then(()=>{e.classList.add(eK)}),t}function c(){let e,t=document;return t.fullscreenEnabled?e=t.fullscreenElement&&t.exitFullscreen():t.webkitFullscreenEnabled&&(e=t.webkitFullscreenElement&&t.webkitExitFullscreen()),e&&e.then(()=>{l()?.classList.remove(eK)}),e}function u(){if(a())c();else{let e=l();e&&s(e)}}return{init:function(t){(e=t).on("initPlugins",n),e.on("ready",o),e.on("click",i)},destroy:function(){e?.off("initPlugins",n),e?.off("ready",o),e?.off("click",i)},exit:c,inFullscreen:a,request:s,toggle:u}},eQ=!1,e0=!1,e1=!1,e2=!1,e5=()=>{let e=new URL(document.URL).hash,t=e.slice(1).split("-"),n=t[t.length-1],o=n&&/^\+?\d+$/.test(n)&&parseInt(t.pop()||"1",10)||1;return{urlHash:e,urlSlug:t.join("-"),urlIndex:o}},e4=()=>{let e=i?.getInstance();return!!e&&1==e.getState()},e3=()=>{if(!i||e4())return;let{urlSlug:e,urlIndex:t}=e5();if(!e)return;let n=document.querySelector(`[data-slug="${e}"]`);n&&i.fromTriggerEl(n),!e4()&&(n=document.querySelectorAll(`[data-fancybox="${e}"]`)[t-1])&&i.fromTriggerEl(n,{startIndex:t-1}),n&&e4()&&n.scrollIntoView({behavior:"instant",block:"center",inline:"center"})},e6=()=>{if(!i||e1)return;let e=i?.getInstance(),t=e?.getCarousel();if(e?.getOptions().Hash===!1)return;let{urlSlug:n,urlIndex:o}=e5();if(e&&t){for(let e of t.getSlides()||[])if(n===e.slug||n===e.fancybox&&e.index===o-1)return void t.goTo(e.index);e2=!0,e.close(),e2=!1}e3()},e7=()=>{i&&setTimeout(()=>{eQ=!0,e3(),eQ=!1,window.addEventListener("hashchange",e6,!1)},300)},e9=()=>{let e,t="auto",n="";function o(){if(!e||!e.isTopMost()||!1===e.getOptions().Hash)return;let o=e.getCarousel();if(!o)return;let{urlHash:r,urlSlug:l}=e5(),a=e.getSlide();if(!a)return;let s=a.slug||a.fancybox||"",c=parseInt(a.index+"",10)+1;if(!s)return;let u=a.slug?`#${a.slug}`:`#${s}-${c}`;if(2>(e.getCarousel()?.getPages()?.length||0)&&(u=`#${s}`),r!==u&&(n=r),history.scrollRestoration&&(t=history.scrollRestoration,history.scrollRestoration="manual"),o.on("change",i),eQ)return void e.getOptions().sync?.goTo(e.getCarousel()?.getPageIndex()||0,{transition:!1});let d=s!==l;try{window.history[d?"pushState":"replaceState"]({},document.title,window.location.pathname+window.location.search+u)}catch(e){}d&&(e0=!0)}function i(){if(!e||!e.isTopMost()||!1===e.getOptions().Hash)return;let t=e.getSlide();if(!t)return;let n=t.slug||t.fancybox||"",o=t.index+1,i=t.slug?`#${t.slug}`:`#${n}-${o}`;e1=!0;try{window.history.replaceState({},document.title,window.location.pathname+window.location.search+i)}catch(e){}e1=!1}function r(){if(e2||!e||!e.isTopMost()||!1===e.getOptions().Hash)return;let t=e.getSlide();if(t&&t.fancybox){e1=!0;try{e0&&!eQ&&!function(){if(window.parent===window)return!1;try{var e=window.frameElement}catch(t){e=null}return null===e?"data:"===location.protocol:e.hasAttribute("sandbox")}()?window.history.back():window.history.replaceState({},document.title,window.location.pathname+window.location.search+n)}catch(e){}e1=!1}}return{init:function(t){(e=t).on("ready",o),e.on("close",r)},destroy:function(){e?.off("ready",o),e?.off("close",r);let n=e?.getCarousel();n&&n.off("change",i),e=void 0,history.scrollRestoration&&t&&(history.scrollRestoration=t)}}};e9.startFromUrl=e3,e9.setup=function(e){!i&&(i=e,g()&&(/complete|interactive|loaded/.test(document.readyState)?e7():document.addEventListener("DOMContentLoaded",e7)))};let e8={...eg,CLOSE:"Close",NEXT:"Next",PREV:"Previous",MODAL:"You can close this modal content with the ESC key",ELEMENT_NOT_FOUND:"HTML Element Not Found",IFRAME_ERROR:"Error Loading Page"},te='<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg tabindex="-1" width="24" height="24" viewBox="0 0 24 24"><path d="M19.286 4.714 4.714 19.286M4.714 4.714l14.572 14.572" /></svg></button>';eV().add("close",{tpl:te});let tt=e=>{e.cancelable&&e.preventDefault()},tn=(e=null,t="",n)=>{if(!e||!e.parentElement||!t){n&&n();return}to(e);let o=i=>{i.target===e&&e.dataset.animationName&&(e.removeEventListener("animationend",o),delete e.dataset.animationName,n&&n(),e.classList.remove(t))};e.dataset.animationName=t,e.addEventListener("animationend",o),h(e,t)},to=e=>{e&&e.dispatchEvent(new CustomEvent("animationend",{bubbles:!1,cancelable:!0,currentTarget:e}))},ti=((z={})[z.Init=0]="Init",z[z.Ready=1]="Ready",z[z.Closing=2]="Closing",z[z.Destroyed=3]="Destroyed",z),tr={ajax:null,backdropClick:"close",Carousel:{},closeButton:"auto",closeExisting:!1,delegateEl:void 0,dragToClose:!0,fadeEffect:!0,groupAll:!1,groupAttr:"data-fancybox",hideClass:"f-fadeOut",hideScrollbar:!0,id:void 0,idle:!1,keyboard:{Escape:"close",Delete:"close",Backspace:"close",PageUp:"next",PageDown:"prev",ArrowUp:"prev",ArrowDown:"next",ArrowRight:"next",ArrowLeft:"prev"},l10n:e8,mainClass:"",mainStyle:{},mainTpl:`<dialog class="fancybox__dialog">
    <div class="fancybox__container" tabindex="0" aria-label="{{MODAL}}">
      <div class="fancybox__backdrop"></div>
      <div class="fancybox__carousel"></div>
    </div>
  </dialog>`,modal:!0,on:{},parentEl:void 0,placeFocusBack:!0,showClass:"f-zoomInUp",startIndex:0,sync:void 0,theme:"dark",triggerEl:void 0,triggerEvent:void 0,zoomEffect:!0},tl=new Map,ta=0,ts="with-fancybox";function tc(e,t={}){let n,o,i,r;if(!(e&&e instanceof Element))return;let l={};for(let[t,a]of tu.openers)if(t.contains(e))for(let[s,c]of a){let a;if(s){for(let n of t.querySelectorAll(s))if(n.contains(e)){a=n;break}if(!a)continue}for(let[s,u]of c){let c=null;try{c=e.closest(s)}catch(e){}c&&(o=t,i=a,n=c,r=s,f(l,u||{}))}}if(!o||!r||!n)return;let a=f({},tr,t,l,{triggerEl:n}),s=[].slice.call((i||o).querySelectorAll(r)),c=n.closest(".f-carousel"),u=c?.carousel;if(u&&!(i&&c.contains(i))){let e=[];for(let t of u?.getSlides()){let n=t.el;n&&(n.matches(r)?e.push(n):e.push(...[].slice.call(n.querySelectorAll(r))))}e.length&&(s=[...e],u.getPlugins().Autoplay?.pause(),u.getPlugins().Autoscroll?.pause(),a.sync=u)}if(!1===a.groupAll){let e=a.groupAttr,t=e&&n?n.getAttribute(`${e}`):"";s=e&&t?s.filter(n=>n.getAttribute(`${e}`)===t):[n]}if(!s.length)return;a.triggerEvent?.preventDefault();let d=tu.getInstance();if(d){let e=d.getOptions().triggerEl;if(e&&s.indexOf(e)>-1)return}return({...a.Carousel||{}}).rtl&&(s=s.reverse()),n&&void 0===t.startIndex&&(a.startIndex=s.indexOf(n)),tu.fromNodes(s,a)}let tu={Plugins:{Hash:e9},version:"6.1.3",openers:new Map,bind:function(e,t,n,o){if(!g())return;let i=document.body,r=null,a="[data-fancybox]",s={};e instanceof Element&&(i=e),l(e)&&l(t)?(r=e,a=t):l(t)&&l(n)?(r=t,a=n):l(t)?a=t:l(e)&&(a=e),"object"==typeof t&&(s=t||{}),"object"==typeof n&&(s=n||{}),"object"==typeof o&&(s=o||{}),function(e,t,n,o={}){if(!(e&&e instanceof Element)||!n)return;let i=tu.openers.get(e)||new Map,r=i.get(t)||new Map;if(r.set(n,o),i.set(t,r),tu.openers.set(e,i),1===i.size&&e.addEventListener("click",tu.fromEvent),1===tu.openers.size)for(let e of Object.values(tu.Plugins)){let t=e.setup;"function"==typeof t&&t(tu)}}(i,r,a,s)},close:function(e=!0,...t){if(e)for(let e of tl.values())e.close(...t);else{let e=tu.getInstance();e&&e.close(...t)}},destroy:function(){let e;for(;e=tu.getInstance();)e.destroy();for(let e of tu.openers.keys())e.removeEventListener("click",tu.fromEvent);tu.openers.clear()},fromEvent:function(e){if(e.defaultPrevented||e.button&&0!==e.button||e.ctrlKey||e.metaKey||e.shiftKey)return;let t=e.composedPath()[0],n={triggerEvent:e};if(t.closest(".fancybox__container.is-hiding")){tt(e),e.stopPropagation();return}let o=t.closest("[data-fancybox-delegate]")||void 0;if(o){let e=o.dataset.fancyboxDelegate||"",i=document.querySelectorAll(`[data-fancybox="${e}"]`),r=parseInt(o.dataset.fancyboxIndex||"",10)||0;t=i[r]||i[0],f(n,{delegateEl:o,startIndex:r})}return tc(t,n)},fromNodes:function(e,t){t=f({},tr,t||{});let n=[],o=e=>e instanceof HTMLImageElement?e:e instanceof HTMLElement?e.querySelector("img:not([aria-hidden])"):void 0;for(let i of e){let r=i.dataset||{},l=t.delegateEl&&e.indexOf(i)===t.startIndex?t.delegateEl:void 0,a=o(l)||o(i)||void 0,s=r.src||i.getAttribute("href")||i.getAttribute("currentSrc")||i.getAttribute("src")||void 0,c=r.thumb||r.thumbSrc||a?.getAttribute("currentSrc")||a?.getAttribute("src")||a?.dataset.lazySrc||void 0,u={src:s,alt:r.alt||a?.getAttribute("alt")||void 0,thumbSrc:c,thumbEl:a,triggerEl:i,delegateEl:l};for(let e in r){let t=r[e]+"";t="false"!==t&&("true"===t||t),u[e]=t}n.push(u)}return tu.show(n,t)},fromSelector:function(e,t,n,o){if(!g())return;let i=document.body,r=null,a="[data-fancybox]",s={};for(let[c,u]of(e instanceof Element&&(i=e),l(e)&&l(t)?(r=e,a=t):l(t)&&l(n)?(r=t,a=n):l(t)?a=t:l(e)&&(a=e),"object"==typeof t&&(s=t||{}),"object"==typeof n&&(s=n||{}),"object"==typeof o&&(s=o||{}),tu.openers))for(let[e,t]of u)for(let[n,o]of t)if(c===i&&e===r){let t=i.querySelector((e?`${e} `:"")+a);if(t&&t.matches(n))return tu.fromTriggerEl(t,s)}},fromTriggerEl:tc,getCarousel:function(){return tu.getInstance()?.getCarousel()||void 0},getDefaults:function(){return tr},getInstance:function(e){if(e){let t=tl.get(e);return t&&t.getState()!==ti.Destroyed?t:void 0}return Array.from(tl.values()).reverse().find(e=>{if(e.getState()!==ti.Destroyed)return e})||void 0},getSlide:function(){return tu.getInstance()?.getSlide()||void 0},show:function(e=[],t={}){return(()=>{let e,t,n,o,i,c,g,m=ti.Init,b={...tr},E=-1,w={},x=[],M=!1,L=!0,S=0;function T(e,...t){let n=b[e];return n&&"function"==typeof n?n(ed,...t):n}function P(e,t=[]){let n=T("l10n")||{};e=String(e).replace(/\{\{(\w+)\}\}/g,(e,t)=>n[t]||e);for(let n=0;n<t.length;n++)e=e.split(t[n][0]).join(t[n][1]);return e.replace(/\{\{(.*?)\}\}/g,(e,t)=>t)}let A=new Map;function R(e,...t){let n=[...A.get(e)||[]];for(let[t,o]of Object.entries(b.on||{}))(t===e||t.split(" ").indexOf(e)>-1)&&n.push(o);for(let e of n)e&&"function"==typeof e&&e(ed,...t);"*"!==e&&R("*",e,...t)}function C(){y(c,"is-revealing");try{document.activeElement===i&&(c?.querySelector("[autofocus]")||c).focus()}catch(e){}}function O(t,n){G(n),j(),n.el?.addEventListener("click",z),("inline"===n.type||"clone"===n.type)&&function(t){if(!e||!t||!t.el)return;let n=null;if(l(t.src)){let e=t.src.split("#",2).pop();n=e?document.getElementById(e):null}if(n){if(h(n,"f-html"),"clone"===t.type||n.closest(".fancybox__carousel")){let e=(n=n.cloneNode(!0)).dataset.animationName;e&&(n.classList.remove(e),delete n.dataset.animationName);let o=n.getAttribute("id");o=o?`${o}--clone`:`clone-${E}-${t.index}`,n.setAttribute("id",o)}else if(n.parentNode){let e=document.createElement("div");e.inert=!0,n.parentNode.insertBefore(e,n),t.placeholderEl=e}t.htmlEl=n,h(t.el,"has-html"),t.el.prepend(n),n.classList.remove("hidden"),"none"===n.style.display&&(n.style.display=""),"none"===getComputedStyle(n).getPropertyValue("display")&&(n.style.display=n.dataset.display||"flex"),e?.emit("contentReady",t)}else e?.showError(t,"{{ELEMENT_NOT_FOUND}}")}(n),"ajax"===n.type&&function(t){let n=t.el;if(!n||t.htmlEl||t.xhr)return;e?.showLoading(t),t.state=eh.Loading;let o=new XMLHttpRequest;o.onreadystatechange=function(){if(o.readyState===XMLHttpRequest.DONE&&m===ti.Ready)if(e?.hideLoading(t),t.state=eh.Loaded,200===o.status){let i=o.responseText+"",r=null,l=null;if(t.filter){let e=document.createElement("div");e.innerHTML=i,l=e.querySelector(t.filter+"")}l&&l instanceof HTMLElement?r=l:(r=document.createElement("div")).innerHTML=i,r.classList.add("f-html"),t.htmlEl=r,n.classList.add("has-html"),n.classList.add("has-ajax"),n.prepend(r),e?.emit("contentReady",t)}else e?.showError(t)};let i=T("ajax")||null;o.open(i?"POST":"GET",t.src+""),o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.send(i),t.xhr=o}(n)}function I(e,t){var n;let o,i;W(t),t.el?.removeEventListener("click",z),("inline"===t.type||"clone"===t.type)&&(o=(n=t).htmlEl,i=n.placeholderEl,o&&("none"!==getComputedStyle(o).getPropertyValue("display")&&(o.style.display="none"),o.offsetHeight),i&&(o&&i.parentNode&&i.parentNode.insertBefore(o,i),i.remove()),n.htmlEl=void 0,n.placeholderEl=void 0),t.xhr&&(t.xhr.abort(),t.xhr=void 0)}function z(e){if(!U())return;if(m!==ti.Ready){tt(e),e.stopPropagation();return}if(e.defaultPrevented||!J.isClickAllowed())return;let t=e.composedPath()[0];t.closest(".fancybox__carousel")&&t.classList.contains("fancybox__slide")&&q(e)}function k(){L=!1,c&&e&&c.classList.remove("is-revealing"),j();let t=T("sync");if(e&&t){let n=t.getPageIndex(e.getPageIndex())||0;t.goTo(n,{transition:!1})}}function _(){(function(){let o=e?.getViewport();if(!T("dragToClose")||!e||!o||!(t=J(o).init()))return;let i=!1,r=0,l=0,a={},s=1;function d(){n?.spring({clamp:!0,mass:1,tension:0===l?140:960,friction:17,restDelta:.1,restSpeed:.1,maxSpeed:1/0}).from({y:r}).to({y:l}).start();let t=e?.getViewport()?.getBoundingClientRect().height||0,o=X()?.panzoomRef;if(t&&o)if(0===l)o.execute(eo.Reset);else{let e=p(Math.abs(r),0,.33*t,s,.77*s,!1);o.execute(eo.ZoomTo,{scale:e})}}let f=t=>{let n=t.srcEvent,o=n.target;return e&&!(V(n)&&n.touches?.length>1)&&o&&!u(o)};n=D().on("step",e=>{if(c&&o&&m===ti.Ready){let t=o.getBoundingClientRect().height,n=p(Math.abs(r=Math.min(t,Math.max(-1*t,e.y))),0,.5*t,1,0,!0);c.style.setProperty("--f-drag-opacity",n+""),c.style.setProperty("--f-drag-offset",r+"px")}}),t.on("start",function(){i||(n?.pause(),l=r)}).on("panstart",t=>{if(!i&&f(t)&&"y"===t.axis){tt(t.srcEvent),i=!0,ea(),e?.getViewport()?.classList.add("is-dragging");let n=X()?.panzoomRef;if(n){s=n.getTransform().scale||1;let e=n.getOptions();a={...e},e.bounds=!1,e.gestures=!1}}else i=!1}).on("pan",function(e){i&&f(e)&&(tt(e.srcEvent),e.srcEvent.stopPropagation(),"y"===e.axis&&(l+=e.deltaY,d()))}).on("end",t=>{if(e?.getViewport()?.classList.remove("is-dragging"),i){let e=X()?.panzoomRef;if(e){e.getTween()?.end();let t=e.getOptions();t.bounds=a.bounds||!1,t.gestures=a.gestures||!1}f(t)&&"y"===t.axis&&(Math.abs(t.velocityY)>5||Math.abs(r)>50)&&es(t.srcEvent,"f-throwOut"+(t.velocityY>0?"Down":"Up"))}i=!1,m===ti.Ready&&0!==r&&(l=0,d())})})(),document.body.addEventListener("click",Z),document.body.addEventListener("keydown",B,{passive:!1,capture:!0}),j(),et();let o=T("sync");e&&o&&o.getTween()?.start(),Y(X())}function $(){e?.canGoNext()?et():el()}function F(e,t){G(t),Y(t)}function H(){let t=e?.getPlugins().Thumbs;v(c,"has-thumbs",t?.isEnabled()||!1),v(c,"has-vertical-thumbs",!!t&&("scrollable"===t.getType()||t.getCarousel()?.isVertical()===!0))}function j(){if(c){let t=e?.getPages()||[],n=e?.getPageIndex()||0;for(let e of c.querySelectorAll("[data-fancybox-index]"))e.innerHTML=n+"";for(let e of c.querySelectorAll("[data-fancybox-page]"))e.innerHTML=n+1+"";for(let e of c.querySelectorAll("[data-fancybox-pages]"))e.innerHTML=t.length+""}}function q(e){e.composedPath()[0].closest("[data-fancybox-close]")?es(e):(R("backdropClick",e),e.defaultPrevented||T("backdropClick")&&es(e))}function N(){ei()}function B(t){let n;if(!U()||m!==ti.Ready)return;let o=t.key,i=T("keyboard");if(!i||t.ctrlKey||t.altKey||t.shiftKey)return;let r=t.composedPath()[0];if(!a(r)||"Escape"!==o&&(n="input,textarea,select,option,video,iframe,[contenteditable],[data-selectable],[data-draggable]",r.matches(n)||r.closest(n))||(R("keydown",t),t.defaultPrevented))return;let l=i[o];if(l)switch(l){case"close":es(t);break;case"next":tt(t),e?.next();break;case"prev":tt(t),e?.prev()}}function Z(e){if(!U()||m!==ti.Ready||(ei(),e.defaultPrevented))return;let t=e.composedPath()[0],n=!!t.closest("[data-fancybox-close]"),o=t.classList.contains("fancybox__backdrop");(n||o)&&q(e)}function G(t){let{el:n,htmlEl:o,closeButtonEl:i}=t;if(!n||!n.parentElement||!o)return;let r=T("closeButton");if("auto"===r&&(r=e?.getPlugins().Toolbar?.isEnabled()!==!0),!r)return void W(t);if(!i){let e=s(P(te));e&&(h(e,"is-close-button"),t.closeButtonEl=o.insertAdjacentElement("afterbegin",e),h(n,"has-close-btn"))}}function W(e){e.closeButtonEl&&(e.closeButtonEl.remove(),e.closeButtonEl=void 0),y(e.el,"has-close-btn")}function Y(t){if(!(L&&e&&e.getState()===ep.Ready&&t&&t.index===e.getOptions().initialPage&&t.el&&t.el.parentElement)||void 0!==t.state&&t.state!==eh.Loaded)return;L=!1;let n=t.panzoomRef,o=n?.getTween(),i=T("zoomEffect")&&o?Q(t):void 0;if(n&&o&&i){let{x:e,y:t,scale:r}=n.getStartPosition();o.spring({tension:215,friction:25,restDelta:.001,restSpeed:.001,maxSpeed:1/0}).from(i).to({x:e,y:t,scale:r}).start();return}let r=n?.getContent()||t.htmlEl;r&&tn(r,T("showClass",t))}function U(){return tu.getInstance()?.getId()===E}function X(){return e?.getPage()?.slides[0]}function K(){let e=X();return e?e.triggerEl||T("triggerEl"):void 0}function Q(e){let t=e.thumbEl;if(!t||!(e=>{let t=e.getBoundingClientRect(),n=e.closest("[style]"),o=n?.parentElement;if(n&&n.style.transform&&o){let e=o.getBoundingClientRect();if(t.left<e.left||t.left>e.left+e.width-t.width||t.top<e.top||t.top>e.top+e.height-t.height)return!1}let i=Math.max(document.documentElement.clientHeight,window.innerHeight),r=Math.max(document.documentElement.clientWidth,window.innerWidth);return!(t.bottom<0)&&!(t.top-i>=0)&&!(t.right<0)&&!(t.left-r>=0)})(t))return;let n=e.panzoomRef?.getWrapper()?.getBoundingClientRect(),o=n?.width,i=n?.height;if(!o||!i)return;let r=t.getBoundingClientRect(),l=r.width,a=r.height,s=r.left,c=r.top;if(!r||!l||!a)return;if(t instanceof HTMLImageElement){let e=window.getComputedStyle(t).getPropertyValue("object-fit");if("contain"===e||"scale-down"===e){let{width:n,height:o}=((e,t,n,o,i="contain")=>{if("contain"===i||e>n||t>o){let i=Math.min(n/e,o/t);e*=i,t*=i}return{width:e,height:t}})(t.naturalWidth,t.naturalHeight,l,a,e);s+=(l-n)*.5,c+=(a-o)*.5,l=n,a=o}}if(Math.abs(o/i-l/a)>.1)return;let u=s+.5*l-(n.left+.5*o);return{x:u,y:c+.5*a-(n.top+.5*i),scale:l/o}}function ee(){o&&clearTimeout(o),o=void 0,document.removeEventListener("mousemove",N)}function et(){if(M||o)return;let e=T("idle");e&&(o=setTimeout(en,e))}function en(){c&&(ee(),h(c,"is-idle"),document.addEventListener("mousemove",N),M=!0)}function ei(){M&&(el(),et())}function el(){ee(),c?.classList.remove("is-idle"),M=!1}function ea(){var e;let t=K();t&&!((e=t.getBoundingClientRect()).bottom>0&&e.right>0&&e.left<(window.innerWidth||document.documentElement.clientWidth)&&e.top<(window.innerHeight||document.documentElement.clientHeight))&&t.scrollIntoView({behavior:"instant",block:"center",inline:"center"})}function es(o,i){if(m===ti.Closing||m===ti.Destroyed)return;let r=new Event("shouldClose",{bubbles:!0,cancelable:!0});if(R("shouldClose",r,o),r.defaultPrevented)return;if(ee(),o){if(o.defaultPrevented)return;tt(o),o.stopPropagation(),o.stopImmediatePropagation()}if(m=ti.Closing,n?.pause(),t?.destroy(),e)for(let t of(e.getGestures()?.destroy(),e.getTween()?.pause(),e.getSlides())){let e=t.panzoomRef;e&&(f(e.getOptions(),{clickAction:!1,dblClickAction:!1,wheelAction:!1,bounds:!1,minScale:0,maxScale:1/0}),e.getGestures()?.destroy(),e.getTween()?.pause())}let l=e?.getPlugins();l?.Autoplay?.stop();let a=l?.Fullscreen;a&&a.inFullscreen()?Promise.resolve(a.exit()).then(()=>{setTimeout(()=>{ec(o,i)},150)}):ec(o,i)}function ec(t,n){if(m!==ti.Closing)return;R("close",t),L=!1,document.body.removeEventListener("click",Z),document.body.removeEventListener("keydown",B,{passive:!1,capture:!0}),T("placeFocusBack")&&ea(),T("fadeEffect")&&(c?.classList.remove("is-ready"),c?.classList.add("is-hiding")),c?.classList.add("is-closing");let o=X(),i=o?.el,r=o?.panzoomRef,l=o?.panzoomRef?.getTween(),a=n||T("hideClass"),s=!1,u=!1;if(e&&o&&i&&r&&l){let e;if(T("zoomEffect")&&o.state===eh.Loaded&&(e=Q(o)),e){s=!0;let t=()=>{(e=Q(o))?l.to({...er,...e}):eu()};r.on("refresh",()=>{t()}),l.easing(D.Easings.EaseOut).duration(350).from({...r.getTransform()}).to({...er,...e}).start(),i?.getAnimations()&&(i.style.animationPlayState="paused",requestAnimationFrame(()=>{t()}))}}let d=o?.htmlEl||o?.panzoomRef?.getWrapper();d&&to(d),!s&&a&&d&&(u=!0,tn(d,a,()=>{eu()})),s||u?setTimeout(()=>{eu()},350):eu()}function eu(){if(m===ti.Destroyed)return;m=ti.Destroyed;let t=K();for(let t of(R("destroy"),T("sync")?.getPlugins().Autoplay?.resume(),T("sync")?.getPlugins().Autoscroll?.resume(),i instanceof HTMLDialogElement&&i.close(),e?.getContainer()?.classList.remove("is-idle"),e?.destroy(),Object.values(w)))t?.destroy();if(w={},i?.remove(),i=void 0,c=void 0,e=void 0,tl.delete(E),!tl.size&&(d(!1),document.documentElement.classList.remove(ts),T("placeFocusBack")))try{t?.focus({preventScroll:!0})}catch(e){}}let ed={close:es,destroy:eu,getCarousel:function(){return e},getContainer:function(){return c},getId:function(){return E},getOptions:function(){return b},getPlugins:function(){return w},getSlide:function(){return X()},getState:function(){return m},init:function(t=[],n={}){m!==ti.Init&&(ed.destroy(),m=ti.Init),b=f({},tr,n),E=T("id")||`fancybox-${++ta}`;let o=tl.get(E);if(o&&o.destroy(),tl.set(E,ed),R("init"),function(){for(let[e,t]of Object.entries({...tu.Plugins,...b.plugins||{}}))if(e&&!w[e]&&t instanceof Function){let n=t();n.init(ed),w[e]=n}R("initPlugins")}(),function(e=[]){R("initSlides",e),x=[...e]}(t),function(){let t=T("parentEl")||document.body;if(!(t&&t instanceof HTMLElement)||!(i=s(P(T("mainTpl")||""))||void 0)||!((c=i.querySelector(".fancybox__container"))&&c instanceof HTMLElement))return;let n=T("mainClass");n&&h(c,n);let o=T("mainStyle");if(o&&r(o))for(let[e,t]of Object.entries(o))c.style.setProperty(e,t);let l=T("theme"),a="auto"===l?window.matchMedia("(prefers-color-scheme:light)").matches:"light"===l;c.setAttribute("theme",a?"light":"dark"),i.setAttribute("id",`${E}`),i.addEventListener("keydown",e=>{"Escape"===e.key&&tt(e)}),i.addEventListener("wheel",t=>{let n=t.target,o=T("wheel",t);n.closest(".f-thumbs")&&(o="slide");let i="slide"===o,r=Math.max(-1,Math.min(1,[-t.deltaX||0,-t.deltaY||0,-t.detail||0].reduce(function(e,t){return Math.abs(t)>Math.abs(e)?t:e}))),l=Date.now();if(S&&l-S<300){i&&tt(t);return}S=l,R("wheel",t,r),t.defaultPrevented||("close"===o?es(t):"slide"===o&&e&&!u(n)&&(tt(t),e[r>0?"prev":"next"]()))},{capture:!0,passive:!1}),i.addEventListener("cancel",e=>{es(e)}),t.append(i),1===tl.size&&(T("hideScrollbar")&&d(!0),document.documentElement.classList.add(ts)),i instanceof HTMLDialogElement&&(T("modal")?i.showModal():i.show()),R("initLayout")}(),function(){if(!(g=i?.querySelector(".fancybox__carousel")||void 0))return;g.fancybox=ed;let t=f({},{Autoplay:{autoStart:!1,pauseOnHover:!1,progressbarParentEl:e=>{let t=e.getContainer();return t?.querySelector(".f-carousel__toolbar [data-autoplay-action]")||t}},Fullscreen:{el:c},Toolbar:{absolute:!0,items:{counter:{tpl:'<div class="f-counter"><span data-fancybox-page></span>/<span data-fancybox-pages></span></div>'}},display:{left:["counter"],right:["toggleFull","autoplay","fullscreen","thumbs","close"]}},Video:{autoplay:!0},Thumbs:{minCount:2,Carousel:{classes:{container:"fancybox__thumbs"}}},classes:{container:"fancybox__carousel",viewport:"fancybox__viewport",slide:"fancybox__slide"},spinnerTpl:'<div class="f-spinner" data-fancybox-close></div>',dragFree:!1,slidesPerPage:1,plugins:{Sync:eL,Arrows:ez,Lazyload:eR,Zoomable:ex,Html:eG,Video:eU,Autoplay:eq,Fullscreen:eJ,Thumbs:eB,Toolbar:eV}},T("Carousel")||{},{slides:x,enabled:!0,initialPage:T("startIndex")||0,l10n:T("l10n")});R("initCarousel",e=eb(g,t)),e.on("*",(e,t,...n)=>{R(`Carousel.${t}`,e,...n)}),e.on("attachSlideEl",O),e.on("detachSlideEl",I),e.on("contentReady",F),e.on("ready",_),e.on("change",k),e.on("settle",$),e.on("thumbs:ready",H),e.on("thumbs:destroy",H),e.init()}(),i&&c){if(T("closeExisting"))for(let[e,t]of tl.entries())e!==E&&t.close();T("fadeEffect")?(setTimeout(()=>{C()},500),h(c,"is-revealing")):C(),c.classList.add("is-ready"),m=ti.Ready,R("ready")}},isCurrentSlide:function(e){let t=X();return!!e&&!!t&&t.index===e.index},isTopMost:function(){return U()},off:function(e,t){return A.has(e)&&A.set(e,A.get(e).filter(e=>e!==t)),ed},on:function(e,t){return A.set(e,[...A.get(e)||[],t]),ed},toggleIdle(e){(M||!0===e)&&en(),M&&!1!==e||el()}};return ed})().init(e,t)},unbind:function(e,t,n){if(!g())return;let o=document.body,i=null,r="[data-fancybox]";e instanceof Element&&(o=e),l(e)&&l(t)?(i=e,r=t):l(t)&&l(n)?(i=t,r=n):l(t)?r=t:l(e)&&(r=e),function(e,t,n){if(!(e&&e instanceof Element)||!n)return;let o=tu.openers.get(e)||new Map,i=o.get(t)||new Map;i&&n&&i.delete(n),i.size&&n||o.delete(t),o.size||(tu.openers.delete(e),e.removeEventListener("click",tu.fromEvent))}(o,i,r)}};e.Arrows=ez,e.Autoplay=eq,e.Carousel=eb,e.CarouselSlideContentState=eh,e.CarouselState=ep,e.Fancybox=tu,e.FancyboxState=ti,e.Fullscreen=eJ,e.Html=eG,e.Lazyload=eR,e.PANZOOM_DEFAULT_POS=er,e.Panzoom=ed,e.PanzoomAction=eo,e.PanzoomState=el,e.PanzoomZoomLevel=ei,e.Sync=eL,e.Thumbs=eB,e.Toolbar=eV,e.ToolbarColumn=eF,e.Video=eU,e.Zoomable=ex});
// Модальное окно
document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const modal = document.getElementById('modal-call');
  const modalOverlay = modal?.querySelector('.modal__overlay');
  const modalClose = modal?.querySelector('.modal__close');
  const callButtons = document.querySelectorAll('[data-modal="call"]');
  const appointmentButtons = document.querySelectorAll('a[href="#appointment"], .hero__btn--primary, .prices__btn, .promotions__btn');
  
  const formCall = document.getElementById('modal-form-call');
  const formAppointment = document.getElementById('modal-form-appointment');
  
  // Открытие модального окна
  function openModal(type) {
    if (!modal) return;
    
    // Показываем нужную форму
    if (type === 'appointment') {
      formCall.style.display = 'none';
      formAppointment.style.display = 'block';
    } else {
      formCall.style.display = 'block';
      formAppointment.style.display = 'none';
    }
    
    modal.classList.add('modal--active');
    body.style.overflow = 'hidden';
  }
  
  // Закрытие модального окна
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('modal--active');
    body.style.overflow = '';
  }
  
  // Открытие по клику на кнопки "Заказать звонок"
  callButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('call');
    });
  });
  
  // Открытие по клику на кнопки "Записаться"
  appointmentButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('appointment');
    });
  });
  
  // Закрытие по клику на крестик
  if (modalClose) {
    modalClose.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Закрытие по клику на overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal?.classList.contains('modal--active')) {
      closeModal();
    }
  });
  
  // Предотвращение закрытия при клике на форму
  const modalContent = modal?.querySelector('.modal__content');
  if (modalContent) {
    modalContent.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Обработка отправки форм (без валидации)
  const modalForms = modal?.querySelectorAll('.modal__form');
  modalForms?.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Здесь можно добавить отправку данных на сервер
      console.log('Форма отправлена', new FormData(form));
      closeModal();
    });
  });
  
  // Мобильное меню
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.mobile-menu__toggle');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const overlay = document.querySelector('.mobile-menu__overlay');
  
  // Открытие меню
  function openMenu() {
    mobileMenu.classList.add('mobile-menu--active');
    burgerBtn.classList.add('header__burger--active');
    body.style.overflow = 'hidden';
  }
  
  // Закрытие меню
  function closeMenu() {
    mobileMenu.classList.remove('mobile-menu--active');
    burgerBtn.classList.remove('header__burger--active');
    body.style.overflow = '';
    
    // Закрываем все открытые подменю
    const openItems = mobileMenu.querySelectorAll('.mobile-menu__item--open, .mobile-menu__submenu-item--open');
    openItems.forEach(item => {
      item.classList.remove('mobile-menu__item--open', 'mobile-menu__submenu-item--open');
    });
  }
  
  // Открытие/закрытие по клику на бургер
  if (burgerBtn) {
    burgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (mobileMenu.classList.contains('mobile-menu--active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }
  
  // Закрытие по клику на крестик
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
    });
  }
  
  // Закрытие по клику на overlay
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      closeMenu();
    });
  }
  
  // Закрытие по ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--active')) {
      closeMenu();
    }
  });
  
  // Работа с выпадающими подменю
  const dropdownItems = mobileMenu.querySelectorAll('.mobile-menu__item--dropdown');
  dropdownItems.forEach(item => {
    const link = item.querySelector('.mobile-menu__link');
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        item.classList.toggle('mobile-menu__item--open');
      });
    }
  });
  
  // Работа с выпадающими подменю второго уровня
  const submenuDropdownItems = mobileMenu.querySelectorAll('.mobile-menu__submenu-item--dropdown');
  submenuDropdownItems.forEach(item => {
    const link = item.querySelector('.mobile-menu__submenu-link');
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        item.classList.toggle('mobile-menu__submenu-item--open');
      });
    }
  });
  
  // Закрытие меню при клике на ссылку (если это не выпадающее меню)
  const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link:not(.mobile-menu__submenu-link), .mobile-menu__submenu-link');
  menuLinks.forEach(link => {
    const parent = link.closest('.mobile-menu__item, .mobile-menu__submenu-item');
    const isDropdown = parent && (parent.classList.contains('mobile-menu__item--dropdown') || parent.classList.contains('mobile-menu__submenu-item--dropdown'));
    
    if (!isDropdown) {
      link.addEventListener('click', function() {
        closeMenu();
      });
    }
  });
  
  // Инициализация Hero слайдера
  // Swiper загружается из swiper-bundle.js и доступен глобально
  const heroSwiper = document.querySelector('.hero__swiper');
  if (heroSwiper && typeof Swiper !== 'undefined') {
    new Swiper('.hero__swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1000,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  
  // Плавная прокрутка к якорям
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Инициализация галереи слайдера
  const gallerySwiper = document.querySelector('.gallery__swiper');
  if (gallerySwiper && typeof Swiper !== 'undefined') {
    new Swiper('.gallery__swiper', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: false,
      watchSlidesProgress: false,
      centeredSlides: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: false
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 25,
          loop: false
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 30,
          loop: false
        }
      }
    });
  }
  
  // Инициализация Fancybox
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind("[data-fancybox='gallery']", {
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["slideshow", "download", "thumbs", "close"],
        },
      },
    });
  }
  
  // Инициализация Yandex Maps
  if (typeof ymaps !== 'undefined') {
    ymaps.ready(function() {
      const mapContainer = document.getElementById('yandex-map');
      if (mapContainer) {
        const map = new ymaps.Map('yandex-map', {
          center: [52.7233, 41.4506], 
          zoom: 16,
          controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
        });
        
        // Добавляем маркер
        const placemark = new ymaps.Placemark([52.7233, 41.4506], {
          balloonContent: '<strong>Стоматологическая клиника Авонстом</strong><br>392525 Тамбовская обл., Тамбовский р-н, пос. Строитель, мкр. Северный, д. 29Г',
          hintContent: 'Стоматологическая клиника Авонстом'
        }, {
          preset: 'islands#blueIcon'
        });
        
        map.geoObjects.add(placemark);
      }
    });
  }

  // Переключение категорий в секции цен
  const pricesMenuBtns = document.querySelectorAll('.prices__menu-btn');
  const pricesCategories = document.querySelectorAll('.prices__category');

  if (pricesMenuBtns.length > 0 && pricesCategories.length > 0) {
    pricesMenuBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');

        // Убираем активный класс у всех кнопок
        pricesMenuBtns.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс к текущей кнопке
        this.classList.add('active');

        // Скрываем все категории
        pricesCategories.forEach(cat => cat.classList.remove('active'));
        // Показываем выбранную категорию
        const selectedCategory = document.querySelector(`.prices__category[data-category="${category}"]`);
        if (selectedCategory) {
          selectedCategory.classList.add('active');
        }
      });
    });
  }
});
