var __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Tour = factory();
  }
})(this, function() {

  /*
   * TODOS:
   * ===========================================================================
   * * Add `shouldLoad` to hints
   * * Add click event for highlights
   * * Passthrough clicks on highlights (optional)
   */
  'use strict';
  var ARROW_SIZE, DEFAULT_MARGIN, Highlight, Hint, Overlay, Overview, PATHS, Spinner, Step, Tour, VECTORS, XMLNS, addFilter, assign, buildID, getWindowSize, isFunction, log, renderSVG, waitFor;
  ARROW_SIZE = 65;
  DEFAULT_MARGIN = 10;
  VECTORS = null;
  XMLNS = 'http://www.w3.org/2000/svg';
  PATHS = {
    arrow: 'M135.4,68.7c1.1,1.3,1.5,2.9,1.3,4.6c-0.2,1.7-1,3.1-2.4,4.2\nc-1.3,1.1-2.9,1.5-4.6,1.3c-1.7-0.2-3.1-1-4.2-2.4c-7.8-10.1-18.4-18.3-19-28.3c2.5,40.3,1.7,98.2-5.1,142.7\nc-1.1,1.5-2.5,2.3-4.2,2.5c-1.7,0.2-3.3-0.2-4.6-1.3c-1.4-1-2.2-2.4-2.4-4.1c-0.2-1.7,1.2-4.5,1.2-4.5c6.2-31.2,5.9-96.1,2.5-135.8\nc-4.7,9.8-11.4,18.7-20.1,26.7c-1.3,1.2-2.8,1.7-4.5,1.7c-1.7-0.1-3.2-0.7-4.4-2c-1.2-1.3-1.7-2.8-1.7-4.5c0.1-1.8,0.7-3.2,2-4.4\nc11.2-10.3,18.7-22.7,22.7-37c0.6-2.5,1.3-5.7,2.1-9.7l-0.4-2.2c-0.2-1.5,0-2.9,0.4-4c0.8-2.9,2.7-4.7,5.7-5.3\nc3.1-0.7,5.6,0.4,7.5,3.1c0.7,1,1.2,2.3,1.4,4c0.1,0.2,0.2,0.7,0.3,1.4l0.1,0.8c0.1,0.1,0.1,0.2,0.1,0.4c1.2,2.6,4.2,8.8,9,18.6\nC119,45.6,126.1,56.8,135.4,68.7L135.4,68.7z',
    chevronLeft: 'M3.8,6.3l4.1,4.1c0.2,0.2,0.2,0.5,0,0.7l-1.3,1.3c-0.2,0.2-0.5,0.2-0.7,0L0.1,6.6C0,6.5,0,6.1,0.1,5.9\nl5.8-5.8C6.1,0,6.5,0,6.6,0.1l1.3,1.3c0.2,0.2,0.2,0.5,0,0.7L3.8,6.3z',
    chevronRight: 'M2.1,12.4c-0.2,0.2-0.5,0.2-0.7,0l-1.3-1.3C0,11,0,10.6,0.1,10.4l4.1-4.1L0.1,2.1C0,2,0,1.6,0.1,1.4\nl1.3-1.3C1.6,0,2,0,2.1,0.1l5.8,5.8c0.2,0.2,0.2,0.5,0,0.7L2.1,12.4z',
    closeButton: 'M8,15.7c-4.3,0-7.7-3.5-7.7-7.7S3.7,0.3,8,0.3s7.7,3.5,7.7,7.7S12.3,15.7,8,15.7z M11.6,9.8L9.8,8l1.8-1.8\nc0.1-0.1,0.2-0.3,0.2-0.5c0-0.2-0.1-0.3-0.2-0.5l-0.9-0.9c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.3,0.1-0.5,0.2L8,6.2L6.2,4.4\nC6.1,4.2,5.9,4.2,5.7,4.2c-0.2,0-0.3,0.1-0.5,0.2L4.4,5.3C4.2,5.4,4.2,5.6,4.2,5.7c0,0.2,0.1,0.3,0.2,0.5L6.2,8L4.4,9.8\nc-0.1,0.1-0.2,0.3-0.2,0.5c0,0.2,0.1,0.3,0.2,0.5l0.9,0.9c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.3-0.1,0.5-0.2L8,9.8l1.8,1.8\nc0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.3-0.1,0.5-0.2l0.9-0.9c0.1-0.1,0.2-0.3,0.2-0.5C11.8,10.1,11.8,9.9,11.6,9.8z',
    curvedArrow: 'M135.4,68.7c1.1,1.3,1.5,2.9,1.3,4.6c-0.2,1.7-1,3.1-2.4,4.2\nc-1.3,1.1-2.9,1.5-4.6,1.3c-1.7-0.2-3.1-1-4.2-2.4c-7.8-10.1-15.8-18.8-19-28.3c15.1,44.8-0.2,112.9-32.1,142.7\nc-1.1,1.5-2.5,2.3-4.2,2.5c-1.7,0.2-3.3-0.2-4.6-1.3c-1.4-1-2.2-2.4-2.4-4.1c-0.2-1.7,1.2-4.5,1.2-4.5\nC94.9,155.9,109.7,86.1,94,47.5c-4.7,9.8-11.4,18.7-20.1,26.7c-1.3,1.2-2.8,1.7-4.5,1.7c-1.7-0.1-3.2-0.7-4.4-2\nc-1.2-1.3-1.7-2.8-1.7-4.5c0.1-1.8,0.7-3.2,2-4.4c11.2-10.3,18.7-22.7,22.7-37c0.6-2.5,1.3-5.7,2.1-9.7l-0.4-2.2\nc-0.2-1.5,0-2.9,0.4-4c0.8-2.9,2.7-4.7,5.7-5.3c3.1-0.7,5.6,0.4,7.5,3.1c0.7,1,1.2,2.3,1.4,4c0.1,0.2,0.2,0.7,0.3,1.4l0.1,0.8\nc0.1,0.1,0.1,0.2,0.1,0.4c1.2,2.6,4.2,8.8,9,18.6C119,45.6,126.1,56.8,135.4,68.7L135.4,68.7z',
    line: 'M332.8,1.2c1.8,0.1,2.3,0.6,2.5,1c0.2,0.4,0.1,2.1-3,1.8C322.7,3.4,32.8,2.3,3,4.1\nC-0.3,4.5-0.6,1,0.8,0.8c1-0.2,4.6-0.3,6.2-0.3c0.2,0,0.7-0.1,1.4-0.1l0.8,0c0.1,0,0.2,0,0.4,0C12.3,0,288.3-0.5,332.8,1.2z'
  };

  /*
   * Adds drop shadow filter to an SVG image
   */
  addFilter = function(svg) {
    var blend, blur, defs, filter, id, offset;
    return;
    id = "tourjs-filter-" + (new Date().getTime());
    defs = document.createElementNS(XMLNS, 'defs');
    filter = document.createElementNS(XMLNS, 'filter');
    filter.setAttributeNS(null, 'id', id);
    filter.setAttributeNS(null, 'height', '200%');
    filter.setAttributeNS(null, 'width', '200%');
    filter.setAttributeNS(null, 'x', '-50%');
    filter.setAttributeNS(null, 'y', '-50%');
    offset = document.createElementNS(XMLNS, 'feOffset');
    offset.setAttributeNS(null, 'dx', 1);
    offset.setAttributeNS(null, 'dy', 1);
    offset.setAttributeNS(null, 'in', 'SourceAlpha');
    offset.setAttributeNS(null, 'result', 'ShadowOffsetOuter');
    blur = document.createElementNS(XMLNS, 'feGaussianBlur');
    blur.setAttributeNS(null, 'in', 'ShadowOffsetOuter');
    blur.setAttributeNS(null, 'stdDeviation', 3);
    blur.setAttributeNS(null, 'result', 'ShadowBlurOuter');
    blend = document.createElementNS(XMLNS, 'feBlend');
    blend.setAttributeNS(null, 'in', 'SourceGraphic');
    blend.setAttributeNS(null, 'in2', 'ShadowBlurOuter');
    blend.setAttributeNS(null, 'mode', 'normal');
    filter.appendChild(offset);
    filter.appendChild(blur);
    filter.appendChild(blend);
    defs.appendChild(filter);
    svg.appendChild(defs);
    return svg.setAttribute('style', "filter: url(\#" + id + ");");
  };

  /*
   * Assigns properties from one or more objects into another one
   *
   * Example:
   *
   *   var a = { a: 'a'},
   *       b = { b: 'b'},
   *       c = { c: 'c'};
   *
   *   assign({}, a, b, c); // => { a: 'a', b: 'b', c: 'c' }
   *
   */
  assign = function() {
    var dest, key, source, sources, target, val, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (target === 'undefined' || target === null) {
      throw new TypeError('Cannot convert argument to object');
    }
    dest = Object(target);
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      if (typeof source !== 'undefined' && source !== null) {
        for (key in source) {
          val = source[key];
          if (source.hasOwnProperty(key)) {
            dest[key] = val;
          }
        }
      }
    }
    return dest;
  };

  /*
   * Builds an unique id for all DOM elements
   */
  buildID = (function(idndx) {
    return function(prefix) {
      return "tourjs-" + (prefix ? "" + prefix + "-" : '') + (++idndx);
    };
  })(0);
  getWindowSize = function() {
    return {
      height: window.innerHeight || document.documentElement.clientHeight,
      width: window.innerWidth || document.documentElement.clientWidth
    };
  };

  /*
   * Checks if parameter is a function
   */
  isFunction = function(f) {
    return typeof f === 'function';
  };

  /*
   * Logs messages in the console when available (IE)
   */
  log = function(message, type) {
    if (type == null) {
      type = 'warn';
    }
    if (console && console[type]) {
      return console[type](message);
    }
  };

  /*
   * Renders SVGs in the DOM
   */
  renderSVG = function(selector, options) {
    var vector;
    if (options == null) {
      options = {};
    }
    vector = VECTORS.querySelector(selector).cloneNode(true);
    vector.setAttribute('class', 'tourjs-shape');
    if (options.transform) {
      vector.setAttribute('transform', options.transform);
    }
    return vector;
  };

  /*
   * Waits for DOM elements to be present
   */
  waitFor = function(selector, timeout, done) {
    var error, found, wait;
    if (timeout == null) {
      timeout = 10000;
    }
    if (typeof timeout === 'function') {
      done = timeout;
      timeout = 10000;
    }
    found = document.querySelector(selector) != null;
    error = false;
    if (found) {
      done(found);
      return;
    }
    setTimeout((function() {
      found = document.querySelector(selector) != null;
      if (!found) {
        return error = true;
      }
    }), timeout);
    wait = function() {
      found = document.querySelector(selector) != null;
      if (!(found || error)) {
        return setTimeout(wait, 1);
      } else {
        return done(found);
      }
    };
    return wait();
  };
  Highlight = (function() {
    function Highlight(state, hint) {
      this.state = state;
      this.hint = hint;
      this._setPosition = __bind(this._setPosition, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('highlight');
    }

    Highlight.prototype.render = function(mask) {
      if (this.hint.config.highlight === false) {
        return;
      }
      return waitFor(this.hint.config.highlight || this.hint.config.target, this.hint.config.timeout, (function(_this) {
        return function(exist) {
          if (!exist) {
            if (_this.hint.config.highlight) {
              return log("[Tour.js] DOM selector didn't match any elements: " + _this.hint.config.highlight);
            }
          } else {
            if (!_this.node) {
              _this.node = document.createElementNS(XMLNS, 'rect');
              _this.node.id = _this.id;
              _this.node.setAttributeNS(null, 'style', 'stroke: none; fill: #000');
              mask.appendChild(_this.node);
            }
            window.addEventListener('resize', _this._setPosition);
            window.addEventListener('scroll', _this._setPosition);
            return setTimeout(_this._setPosition);
          }
        };
      })(this));
    };

    Highlight.prototype.unload = function() {
      if (this.node) {
        window.removeEventListener('resize', this._setPosition);
        return window.removeEventListener('scroll', this._setPosition);
      }
    };

    Highlight.prototype._setPosition = function() {
      var padding, rect, target;
      if (this.node) {
        target = document.querySelector(this.hint.config.highlight || this.hint.config.target);
        rect = target.getBoundingClientRect();
        padding = this.hint.config.padding || 0;
        this.node.setAttributeNS(null, 'height', rect.height + padding * 2);
        this.node.setAttributeNS(null, 'width', rect.width + padding * 2);
        this.node.setAttributeNS(null, 'x', rect.left - padding);
        return this.node.setAttributeNS(null, 'y', rect.top - padding);
      }
    };

    return Highlight;

  })();
  Hint = (function() {
    function Hint(state, step, config) {
      this.state = state;
      this.step = step;
      this.config = config != null ? config : {};
      this._setPosition = __bind(this._setPosition, this);
      this._renderTooltip = __bind(this._renderTooltip, this);
      this._renderTitle = __bind(this._renderTitle, this);
      this._renderShape = __bind(this._renderShape, this);
      this._renderDescription = __bind(this._renderDescription, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('hint');
    }

    Hint.prototype.render = function() {
      return waitFor(this.config.target, this.config.timeout, (function(_this) {
        return function(exist) {
          var className, width;
          if (!exist) {
            return log("[Tour.js] DOM selector didn't match any elements: " + _this.config.target);
          } else {
            if (!_this.node) {
              _this.node = document.createElement('div');
              _this.node.id = _this.id;
              className = ['tourjs-hint', "tourjs-" + _this.config.position + (_this.config.inverted ? '-inverted' : '')];
              _this.node.className = className.join(' ');
              if (_this.config.width) {
                width = "" + _this.config.width + "px";
                _this.node.style.maxWidth = width;
                _this.node.style.width = width;
              }
              _this.node.style.top = '-9999px';
              _this.node.style.left = '-9999px';
              _this._renderTooltip();
              _this._renderShape();
              _this.step.node.appendChild(_this.node);
              _this.node.addEventListener('click', _this._onClick);
            }
            window.addEventListener('resize', _this._setPosition);
            window.addEventListener('scroll', _this._setPosition);
            return setTimeout(_this._setPosition);
          }
        };
      })(this));
    };

    Hint.prototype.unload = function() {
      if (this.node) {
        window.removeEventListener('resize', this._setPosition);
        return window.removeEventListener('scroll', this._setPosition);
      }
    };

    Hint.prototype._onClick = function(event) {
      return event.stopPropagation();
    };

    Hint.prototype._renderDescription = function(parent) {
      var desc;
      if (this.config.description) {
        desc = document.createElement('div');
        desc.className = 'tourjs-description';
        desc.innerHTML = this.config.description;
        return parent.appendChild(desc);
      }
    };

    Hint.prototype._renderShape = function() {
      var path, shape, svg, transform;
      switch (this.config.position) {
        case 'top':
          path = PATHS['arrow'];
          transform = 'rotate(180, 100, 100)';
          break;
        case 'top-right':
          path = PATHS['curvedArrow'];
          transform = 'rotate(-135, 100, 100)';
          break;
        case 'right':
          path = PATHS['arrow'];
          transform = 'rotate(-90, 100, 100)';
          break;
        case 'bottom-right':
          path = PATHS['curvedArrow'];
          transform = 'rotate(-45, 100, 100) scale(-1, 1) translate(-200, 0)';
          break;
        case 'bottom':
          path = PATHS['arrow'];
          transform = null;
          break;
        case 'bottom-left':
          path = PATHS['curvedArrow'];
          transform = 'rotate(45, 100, 100)';
          break;
        case 'left':
          path = PATHS['arrow'];
          transform = 'rotate(90, 100, 100)';
          break;
        case 'top-left':
          path = PATHS['curvedArrow'];
          transform = 'rotate(135, 100, 100) scale(-1, 1) translate(-200, 0)';
      }
      shape = document.createElementNS(XMLNS, 'path');
      shape.setAttributeNS(null, 'fill', '#FFF');
      shape.setAttributeNS(null, 'd', path);
      if (transform) {
        shape.setAttributeNS(null, 'transform', transform);
      }
      svg = document.createElementNS(XMLNS, 'svg');
      svg.setAttributeNS(null, 'class', "tourjs-shape tourjs-" + this.config.position);
      svg.setAttributeNS(null, 'viewBox', '0 0 200 200');
      svg.appendChild(shape);
      addFilter(svg);
      return this.node.appendChild(svg);
    };

    Hint.prototype._renderTitle = function(parent) {
      var title;
      title = document.createElement('h2');
      title.innerHTML = this.config.title;
      return parent.appendChild(title);
    };

    Hint.prototype._renderTooltip = function() {
      var tooltip, width;
      tooltip = document.createElement('div');
      tooltip.className = 'tourjs-tooltip';
      if (this.config.width) {
        width = "" + this.config.width + "px";
        this.node.style.maxWidth = width;
        this.node.style.width = width;
      }
      this._renderTitle(tooltip);
      this._renderDescription(tooltip);
      return this.node.appendChild(tooltip);
    };

    Hint.prototype._setPosition = function() {
      var rect, targetRect;
      rect = this.node.getBoundingClientRect();
      targetRect = document.querySelector(this.config.target).getBoundingClientRect();
      switch (this.config.position) {
        case 'top-left':
          this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
        case 'top':
          this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left + (targetRect.width / 2) - rect.width / 2) + "px";
        case 'top-right':
          this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
        case 'right':
          if (targetRect.height > rect.height) {
            this.node.style.top = "" + (targetRect.top + ((targetRect.height - rect.height) / 2)) + "px";
          } else {
            this.node.style.top = "" + (targetRect.top - ((rect.height - targetRect.height) / 2)) + "px";
          }
          return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
        case 'bottom-right':
          this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
        case 'bottom':
          this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left + (targetRect.width / 2) - rect.width / 2) + "px";
        case 'bottom-left':
          this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
          return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
        case 'left':
          if (targetRect.height > rect.height) {
            this.node.style.top = "" + (targetRect.top + ((targetRect.height - rect.height) / 2)) + "px";
          } else {
            this.node.style.top = "" + (targetRect.top - ((rect.height - targetRect.height) / 2)) + "px";
          }
          return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
      }
    };

    return Hint;

  })();
  Overlay = (function() {
    function Overlay(state, step, config) {
      this.state = state;
      this.step = step;
      this.config = config != null ? config : {};
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('overlay');
    }

    Overlay.prototype.render = function() {
      var defs, h, hint, mask, opacity, rect, _i, _len, _ref;
      if (!this.node) {
        this.node = document.createElementNS(XMLNS, 'svg');
        this.node.setAttributeNS(null, 'id', this.id);
        this.node.setAttributeNS(null, 'class', 'tourjs-overlay');
        this.node.setAttributeNS(null, 'height', '100%');
        this.node.setAttributeNS(null, 'width', '100%');
        this.node.setAttributeNS(null, 'x', 0);
        this.node.setAttributeNS(null, 'y', 0);
        mask = document.createElementNS(XMLNS, 'mask');
        mask.setAttributeNS(null, 'id', "" + this.id + "-mask");
        mask.setAttributeNS(null, 'height', '100%');
        mask.setAttributeNS(null, 'width', '100%');
        mask.setAttributeNS(null, 'x', 0);
        mask.setAttributeNS(null, 'y', 0);
        rect = document.createElementNS(XMLNS, 'rect');
        rect.setAttributeNS(null, 'height', '100%');
        rect.setAttributeNS(null, 'style', 'stroke: none; fill: #FFF;');
        rect.setAttributeNS(null, 'width', '100%');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        mask.appendChild(rect);
        this.highlights = [];
        _ref = this.step.hints;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hint = _ref[_i];
          h = new Highlight(this.state, hint);
          this.highlights.push(h);
          h.render(mask);
        }
        defs = document.createElementNS(XMLNS, 'defs');
        defs.appendChild(mask);
        this.node.appendChild(defs);
        opacity = this.config.opacity || '0.8';
        rect = document.createElementNS(XMLNS, 'rect');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', '100%');
        rect.setAttributeNS(null, 'width', '100%');
        rect.setAttributeNS(null, 'style', "stroke:none;fill:rgba(0,0,0," + opacity + "); mask: url(#" + this.id + "-mask);");
        this.node.appendChild(rect);
        this.node.addEventListener('click', this.onClick);
        return this.step.node.appendChild(this.node);
      }
    };

    Overlay.prototype.unload = function() {
      var highlight, _i, _len, _ref;
      _ref = this.highlights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        highlight = _ref[_i];
        highlight.unload();
      }
      if (this.node) {
        return this.node.removeEventListener('click', this.onClick);
      }
    };

    Overlay.prototype.onClick = function(event) {
      return event.stopPropagation();
    };

    return Overlay;

  })();
  Overview = (function() {
    function Overview(state, step, config) {
      this.state = state;
      this.step = step;
      this.config = config != null ? config : {};
      this._setPosition = __bind(this._setPosition, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('overview');
    }

    Overview.prototype.render = function() {
      var description, line, shape, svg, title, width;
      if (!this.node) {
        this.node = document.createElement('div');
        this.node.id = this.id;
        this.node.className = 'tourjs-overview';
        if (this.config.width) {
          width = "" + this.config.width + "px";
          this.node.style.maxWidth = width;
          this.node.style.width = width;
        }
        this.node.style.top = '-9999px';
        this.node.style.left = '-9999px';
        title = document.createElement('h1');
        title.innerHTML = this.config.title;
        title.className = 'tourjs-overview-title';
        this.node.appendChild(title);
        if (this.config.description) {
          shape = document.createElementNS(XMLNS, 'path');
          shape.setAttributeNS(null, 'fill', '#FFF');
          shape.setAttributeNS(null, 'd', PATHS['line']);
          svg = document.createElementNS(XMLNS, 'svg');
          svg.setAttributeNS(null, 'viewBox', '0 0 335.4 4.1');
          svg.appendChild(shape);
          line = document.createElement('div');
          line.className = 'tourjs-overview-line';
          line.appendChild(svg);
          addFilter(svg);
          this.node.appendChild(line);
          description = document.createElement('div');
          description.className = 'tourjs-overview-description';
          description.innerHTML = this.config.description;
          this.node.appendChild(description);
        }
        this.step.node.appendChild(this.node);
      }
      setTimeout(this._setPosition);
      window.addEventListener('resize', this._setPosition);
      return window.addEventListener('scroll', this._setPosition);
    };

    Overview.prototype.unload = function() {
      if (this.node) {
        window.removeEventListener('resize', this._setPosition);
        return window.removeEventListener('scroll', this._setPosition);
      }
    };

    Overview.prototype._setPosition = function() {
      var margin, rect, wsize;
      margin = 100;
      rect = this.node.getBoundingClientRect();
      wsize = getWindowSize();
      switch (this.config.position) {
        case 'top':
          this.node.style.top = "" + margin + "px";
          return this.node.style.left = "" + (wsize.width / 2 - rect.width / 2) + "px";
        case 'top-right':
          this.node.style.top = "" + margin + "px";
          this.node.style.right = "" + margin + "px";
          return this.node.style.left = null;
        case 'right':
          this.node.style.top = "" + (wsize.height / 2 - rect.height / 2) + "px";
          this.node.style.right = "" + margin + "px";
          return this.node.style.left = null;
        case 'bottom-right':
          this.node.style.top = null;
          this.node.style.right = "" + margin + "px";
          this.node.style.bottom = "" + (margin * 1.5) + "px";
          return this.node.style.left = null;
        case 'bottom':
          this.node.style.top = null;
          this.node.style.bottom = "" + (margin * 1.5) + "px";
          return this.node.style.left = "" + (wsize.width / 2 - rect.width / 2) + "px";
        case 'bottom-left':
          this.node.style.top = null;
          this.node.style.bottom = "" + (margin * 1.5) + "px";
          return this.node.style.left = "" + margin + "px";
        case 'left':
          this.node.style.top = "" + (wsize.height / 2 - rect.height / 2) + "px";
          return this.node.style.left = "" + margin + "px";
        case 'top-left':
          this.node.style.top = "" + margin + "px";
          return this.node.style.left = "" + margin + "px";
        default:
          this.node.style.top = "" + (wsize.height / 2 - rect.height / 2) + "px";
          return this.node.style.left = "" + (wsize.width / 2 - rect.width / 2) + "px";
      }
    };

    return Overview;

  })();
  Spinner = (function() {
    function Spinner(tour, config) {
      this.tour = tour;
      this.config = config;
      this.unload = __bind(this.unload, this);
      this.load = __bind(this.load, this);
    }

    Spinner.prototype.load = function() {
      var anim, arc, circle, g, opacity, rect;
      if (!this.node) {
        this.node = document.createElementNS(XMLNS, 'svg');
        this.node.setAttributeNS(null, 'id', buildID('overlay'));
        this.node.setAttributeNS(null, 'class', 'tourjs-overlay');
        this.node.setAttributeNS(null, 'height', '100%');
        this.node.setAttributeNS(null, 'width', '100%');
        this.node.setAttributeNS(null, 'x', 0);
        this.node.setAttributeNS(null, 'y', 0);
        opacity = this.config.opacity || '0.8';
        rect = document.createElementNS(XMLNS, 'rect');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', '100%');
        rect.setAttributeNS(null, 'width', '100%');
        rect.setAttributeNS(null, 'style', "stroke:none;fill:rgba(0,0,0," + opacity + ");");
        circle = document.createElementNS(XMLNS, 'path');
        circle.setAttributeNS(null, 'd', 'M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4');
        circle.setAttributeNS(null, 'opacity', '0.25');
        circle.setAttributeNS(null, 'style', 'fill: white;');
        arc = document.createElementNS(XMLNS, 'path');
        arc.setAttributeNS(null, 'd', 'M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z');
        arc.setAttributeNS(null, 'style', 'fill: white;');
        anim = document.createElementNS(XMLNS, 'animateTransform');
        anim.setAttributeNS(null, 'attributeName', 'transform');
        anim.setAttributeNS(null, 'type', 'rotate');
        anim.setAttributeNS(null, 'from', '0 16 16');
        anim.setAttributeNS(null, 'to', '360 16 16');
        anim.setAttributeNS(null, 'dur', '0.6s');
        anim.setAttributeNS(null, 'repeatCount', 'indefinite');
        arc.appendChild(anim);
        g = document.createElementNS(XMLNS, 'g');
        g.appendChild(circle);
        g.appendChild(arc);
        this.node.appendChild(g);
        this.node.appendChild(rect);
        return this.tour.node.appendChild(this.node);
      } else {
        return this.node.style.display = 'block';
      }
    };

    Spinner.prototype.unload = function() {
      if (this.node != null) {
        return this.node.style.display = 'none';
      }
    };

    return Spinner;

  })();
  Step = (function() {
    function Step(state, tour, config) {
      this.state = state;
      this.tour = tour;
      this.config = config != null ? config : {};
      this._renderOverview = __bind(this._renderOverview, this);
      this._renderPagination = __bind(this._renderPagination, this);
      this._renderOverlay = __bind(this._renderOverlay, this);
      this._renderHints = __bind(this._renderHints, this);
      this._beforeLoad = __bind(this._beforeLoad, this);
      this.unload = __bind(this.unload, this);
      this.shouldLoad = __bind(this.shouldLoad, this);
      this.load = __bind(this.load, this);
      this.id = buildID('step');
      this.hints = (function() {
        var _i, _len, _ref, _results;
        _ref = this.config.hints || [];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          config = _ref[_i];
          _results.push(new Hint(this.state, this, config));
        }
        return _results;
      }).call(this);
    }

    Step.prototype.load = function() {
      var load;
      load = (function(_this) {
        return function() {
          if (!_this.node) {
            _this.node = document.createElement('div');
            _this.node.id = _this.id;
            _this.node.className = 'tourjs-step';
            _this.tour.node.appendChild(_this.node);
          }
          _this.tour.unloadSpinner();
          _this._renderOverview();
          _this._renderHints();
          _this._renderOverlay();
          _this._renderPagination();
          _this.node.style.display = 'block';
          if (_this.state.step && _this.state.step.index !== _this.index) {
            _this.state.step.unload();
          }
          _this.state.step = _this;
          if (!_this.state.started) {
            _this.state.started = true;
          }
          if (!_this.next) {
            _this.state.finished = true;
          }
          if (isFunction(_this.config.load)) {
            return _this.config.load(_this.state);
          }
        };
      })(this);
      return this.shouldLoad((function(_this) {
        return function(should) {
          if (should !== true) {
            return;
          }
          _this.tour.loadSpinner();
          return _this._beforeLoad(function() {
            return load();
          });
        };
      })(this));
    };

    Step.prototype.shouldLoad = function(callback) {
      if (isFunction(this.config.shouldLoad)) {
        return this.config.shouldLoad(this.state, callback);
      } else {
        return callback(true);
      }
    };

    Step.prototype.unload = function() {
      var unload;
      unload = (function(_this) {
        return function() {
          var hint, _i, _len, _ref;
          if (_this.node) {
            _this.node.style.display = 'none';
            _ref = _this.hints;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              hint = _ref[_i];
              hint.unload();
            }
            if (_this.overview) {
              _this.overview.unload();
            }
          }
          if (isFunction(_this.config.unload)) {
            return _this.config.unload(_this.state);
          }
        };
      })(this);
      if (isFunction(this.config.beforeUnload)) {
        return this.config.beforeUnload(this.state, unload);
      } else {
        return unload();
      }
    };

    Step.prototype._beforeLoad = function(callback) {
      if (isFunction(this.config.beforeLoad)) {
        return this.config.beforeLoad(this.state, callback);
      } else {
        return callback(true);
      }
    };

    Step.prototype._renderHints = function() {
      var hint, _i, _len, _ref, _results;
      _ref = this.hints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hint = _ref[_i];
        _results.push(hint.render());
      }
      return _results;
    };

    Step.prototype._renderOverlay = function() {
      if (this.overlay == null) {
        this.overlay = new Overlay(this.state, this, this.config.overlay || {});
      }
      return this.overlay.render();
    };

    Step.prototype._renderPagination = function() {
      var next, pagination, previous, shape, stepCount, svg, wrapper;
      if (!(this.previous || this.next)) {
        return;
      }
      shape = document.createElementNS(XMLNS, 'path');
      shape.setAttributeNS(null, 'fill', '#FFF');
      shape.setAttributeNS(null, 'd', PATHS['chevronLeft']);
      svg = document.createElementNS(XMLNS, 'svg');
      svg.setAttributeNS(null, 'viewBox', '0 0 8.1 12.6');
      svg.appendChild(shape);
      previous = document.createElement('div');
      previous.className = 'tourjs-previous-step';
      previous.appendChild(svg);
      if (this.previous) {
        previous.addEventListener('click', (function(_this) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            return _this.previous.load();
          };
        })(this));
      } else {
        previous.className += ' tourjs-step-disabled';
      }
      wrapper = document.createElement('div');
      wrapper.className = 'tourjs-pagination-wrapper';
      wrapper.appendChild(previous);
      stepCount = document.createElement('div');
      stepCount.className = 'tourjs-step-count';
      stepCount.innerHTML = "Step " + this.index + " of " + this.state.steps.length;
      wrapper.appendChild(stepCount);
      shape = document.createElementNS(XMLNS, 'path');
      shape.setAttributeNS(null, 'fill', '#FFF');
      shape.setAttributeNS(null, 'd', PATHS['chevronRight']);
      svg = document.createElementNS(XMLNS, 'svg');
      svg.setAttributeNS(null, 'viewBox', '0 0 8.1 12.6');
      svg.appendChild(shape);
      next = document.createElement('div');
      next.className = 'tourjs-next-step';
      next.appendChild(svg);
      if (this.next) {
        next.addEventListener('click', (function(_this) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            return _this.next.load();
          };
        })(this));
      } else {
        next.className += ' tourjs-step-disabled';
      }
      wrapper.appendChild(next);
      pagination = document.createElement('div');
      pagination.className = 'tourjs-pagination';
      pagination.appendChild(wrapper);
      return this.node.appendChild(pagination);
    };

    Step.prototype._renderOverview = function() {
      if (this.config.overview) {
        if (!this.overview) {
          this.overview = new Overview(this.state, this, this.config.overview);
        }
        return this.overview.render(this.node, this.state);
      }
    };

    return Step;

  })();
  Tour = (function() {
    Tour.waitFor = waitFor;

    function Tour(config) {
      this.config = config != null ? config : {};
      this._renderStep = __bind(this._renderStep, this);
      this._renderFirstStep = __bind(this._renderFirstStep, this);
      this._renderCloseBtn = __bind(this._renderCloseBtn, this);
      this._onLoad = __bind(this._onLoad, this);
      this._onKeyUp = __bind(this._onKeyUp, this);
      this._initSteps = __bind(this._initSteps, this);
      this.unloadSpinner = __bind(this.unloadSpinner, this);
      this.unload = __bind(this.unload, this);
      this.shouldLoad = __bind(this.shouldLoad, this);
      this.loadSpinner = __bind(this.loadSpinner, this);
      this.load = __bind(this.load, this);
      this.id = buildID();
      this.state = {
        tour: this,
        started: false,
        finished: false
      };
    }

    Tour.prototype.load = function() {
      var load;
      load = (function(_this) {
        return function() {
          if (!_this.node) {
            _this.node = document.createElement('div');
            _this.node.id = _this.id;
            _this.node.className = 'tourjs';
            _this.spinner = new Spinner(_this, _this.config.overlay || {});
            _this.spinner.load();
            document.body.appendChild(_this.node);
          }
          return _this._onLoad();
        };
      })(this);
      return this.shouldLoad((function(_this) {
        return function(should) {
          if (should === false) {
            return;
          }
          return _this._initSteps(function() {
            if (_this.state.steps.length === 0) {
              return;
            }
            if (isFunction(_this.config.beforeLoad)) {
              return _this.config.beforeLoad(_this.state, load);
            } else {
              return load();
            }
          });
        };
      })(this));
    };

    Tour.prototype.loadSpinner = function() {
      var _ref;
      return (_ref = this.spinner) != null ? _ref.load() : void 0;
    };

    Tour.prototype.shouldLoad = function(callback) {
      if (isFunction(this.config.shouldLoad)) {
        return this.config.shouldLoad(callback);
      } else {
        return callback(true);
      }
    };

    Tour.prototype.unload = function() {
      var unload;
      unload = (function(_this) {
        return function() {
          var step, _i, _len, _ref;
          if (_this.node) {
            _this.node.style.display = 'none';
          }
          _ref = _this.state.steps;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            step = _ref[_i];
            step.unload();
          }
          if (isFunction(_this.config.unload)) {
            return _this.config.unload(_this.state);
          }
        };
      })(this);
      if (isFunction(this.config.beforeUnload)) {
        return this.config.beforeUnload(this.state, unload);
      } else {
        return unload();
      }
    };

    Tour.prototype.unloadSpinner = function() {
      var _ref;
      return (_ref = this.spinner) != null ? _ref.unload() : void 0;
    };

    Tour.prototype._initSteps = function(callback) {
      var allSteps, def, i, previous, step, wait, waitCount, _i, _len, _ref;
      if (this.node) {
        return callback();
      }
      waitCount = this.config.steps.length;
      this.state.steps = [];
      allSteps = [];
      _ref = this.config.steps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        def = _ref[_i];
        if (!def.config) {
          def.config = {};
        }
        assign(def, {
          overlay: this.config.overlay
        });
        step = new Step(this.state, this, def);
        allSteps.push(step);
        if (isFunction(step.config.shouldLoad)) {
          (function(step) {
            return step.config.shouldLoad(function(show) {
              step.show = show || false;
              return waitCount--;
            });
          })(step);
        } else {
          step.show = true;
          waitCount--;
        }
      }
      i = 1;
      previous = null;
      wait = (function(_this) {
        return function() {
          var _j, _len1;
          if (waitCount) {
            return setTimeout(wait, 1);
          } else {
            for (_j = 0, _len1 = allSteps.length; _j < _len1; _j++) {
              step = allSteps[_j];
              if (step.show) {
                step.index = i;
                i++;
                if (previous) {
                  step.previous = previous;
                  previous.next = step;
                }
                _this.state.steps.push(step);
                previous = step;
              }
            }
            return callback();
          }
        };
      })(this);
      return wait();
    };

    Tour.prototype._onKeyUp = function(event) {
      if (event.keyCode === 27) {
        return this.unload();
      }
    };

    Tour.prototype._onLoad = function() {
      document.addEventListener('keyup', this._onKeyUp);
      this._renderCloseBtn();
      this._renderFirstStep();
      this.state.finished = false;
      this.node.style.display = 'block';
      if (isFunction(this.config.load)) {
        return this.config.load(this.state);
      }
    };

    Tour.prototype._renderCloseBtn = function() {
      var shape, svg;
      shape = document.createElementNS(XMLNS, 'path');
      shape.setAttributeNS(null, 'fill', '#FFF');
      shape.setAttributeNS(null, 'd', PATHS['closeButton']);
      svg = document.createElementNS(XMLNS, 'svg');
      svg.setAttributeNS(null, 'class', 'tourjs-close');
      svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
      svg.appendChild(shape);
      svg.addEventListener('click', this.unload);
      svg.style.display = 'block';
      addFilter(svg);
      return this.node.appendChild(svg);
    };

    Tour.prototype._renderFirstStep = function() {
      return this._renderStep(1);
    };

    Tour.prototype._renderStep = function(index) {
      var step, _i, _len, _ref, _results;
      _ref = this.state.steps;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        step = _ref[_i];
        if (step.index === index) {
          _results.push(step.load(this.node, this.state));
        } else {
          _results.push(step.unload());
        }
      }
      return _results;
    };

    return Tour;

  })();
  return Tour;
});
