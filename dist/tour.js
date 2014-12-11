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
   * * Add `shouldShow` to hints
   * * Add click event for highlights
   * * Passthrough clicks on highlights (optional)
   */
  'use strict';
  var DEFAULT_MARGIN, Highlight, Hint, Overlay, Overview, Step, Tour, VECTORS, XMLNS, addFilter, assign, buildID, fetchSVG, getWindowSize, isFunction, renderSVG;
  DEFAULT_MARGIN = 10;
  VECTORS = null;
  XMLNS = 'http://www.w3.org/2000/svg';

  /*
   * Adds drop shadow filter to an SVG image
   */
  addFilter = function(svg) {
    var blend, blur, defs, filter, id, matrix, offset;
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
    offset.setAttributeNS(null, 'in', 'SourceGraphic');
    offset.setAttributeNS(null, 'result', 'ShadowOffsetOuter');
    blur = document.createElementNS(XMLNS, 'feGaussianBlur');
    blur.setAttributeNS(null, 'in', 'ShadowOffsetOuter');
    blur.setAttributeNS(null, 'stdDeviation', 2);
    blur.setAttributeNS(null, 'result', 'ShadowBlurOuter');
    matrix = document.createElementNS(XMLNS, 'feColorMatrix');
    matrix.setAttributeNS(null, 'values', '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.3 0');
    matrix.setAttributeNS(null, 'in', 'ShadowBlurOuter');
    matrix.setAttributeNS(null, 'result', 'ShadowMatrixOuter');
    blend = document.createElementNS(XMLNS, 'feBlend');
    blend.setAttributeNS(null, 'in', 'ShadowMatrixOuter');
    blend.setAttributeNS(null, 'in2', 'SourceGraphic');
    blend.setAttributeNS(null, 'mode', 'normal');
    filter.appendChild(offset);
    filter.appendChild(blur);
    filter.appendChild(matrix);
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
  buildID = (function(idndx) {
    return function(prefix) {
      return "tourjs-" + (prefix ? "" + prefix + "-" : '') + (++idndx);
    };
  })(0);

  /*
   * Fetches SVGs symbols and appends them into the DOM
   */
  fetchSVG = function(options) {
    var render, req;
    if (options == null) {
      options = {};
    }
    req = new XMLHttpRequest();
    render = function() {
      if (req.readyState === 4 && req.status === 200) {
        VECTORS = document.createElement('div');
        VECTORS.innerHTML = req.responseText;
        if (options.success) {
          return options.success();
        }
      } else if (req.status > 400 && (typeof console !== "undefined" && console !== null ? console.error : void 0)) {
        return console.error('Couldn\'t load SVG definitions file');
      }
    };
    req.onreadystatechange = render;
    req.open('GET', options.svg || 'svg/defs.svg', true);
    return req.send();
  };
  getWindowSize = function() {
    return {
      height: window.innerHeight || document.documentElement.clientHeight,
      width: window.innerWidth || document.documentElement.clientWidth
    };
  };
  isFunction = function(f) {
    return typeof f === 'function';
  };
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
  Highlight = (function() {
    function Highlight(config) {
      this.config = config != null ? config : {};
      this._setPosition = __bind(this._setPosition, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('highlight');
    }

    Highlight.prototype.render = function(parent, state) {
      if (this.config.highlight === false) {
        return;
      }
      if (!this.node) {
        this.node = document.createElementNS(XMLNS, 'rect');
        this.node.id = this.id;
        this.node.setAttributeNS(null, 'style', 'stroke: none; fill: #000');
        parent.appendChild(this.node);
      }
      window.addEventListener('resize', this._setPosition);
      window.addEventListener('scroll', this._setPosition);
      return setTimeout(this._setPosition);
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
        target = document.querySelector(this.config.highlight || this.config.target);
        rect = target.getBoundingClientRect();
        padding = this.config.padding || 0;
        this.node.setAttributeNS(null, 'height', rect.height + padding * 2);
        this.node.setAttributeNS(null, 'width', rect.width + padding * 2);
        this.node.setAttributeNS(null, 'x', rect.left - padding);
        return this.node.setAttributeNS(null, 'y', rect.top - padding);
      }
    };

    return Highlight;

  })();
  Hint = (function() {
    function Hint(config, step) {
      this.config = config != null ? config : {};
      this.step = step;
      this._setPosition = __bind(this._setPosition, this);
      this._renderTooltip = __bind(this._renderTooltip, this);
      this._renderTitle = __bind(this._renderTitle, this);
      this._renderShape = __bind(this._renderShape, this);
      this._renderDescription = __bind(this._renderDescription, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('hint');
    }

    Hint.prototype.render = function(parent, state) {
      var className, width;
      if (!this.node) {
        this.node = document.createElement('div');
        this.node.id = this.id;
        className = ['tourjs-hint', "tourjs-" + this.config.position + (this.config.inverted ? '-inverted' : ''), "tourjs-" + this.config.type];
        this.node.className = className.join(' ');
        if (this.config.width) {
          width = "" + this.config.width + "px";
          this.node.style.maxWidth = width;
          this.node.style.width = width;
        }
        this.node.style.top = '-9999px';
        this.node.style.left = '-9999px';
        this._renderTooltip();
        this._renderShape();
        parent.appendChild(this.node);
      }
      window.addEventListener('resize', this._setPosition);
      window.addEventListener('scroll', this._setPosition);
      return setTimeout(this._setPosition);
    };

    Hint.prototype.unload = function() {
      if (this.node) {
        window.removeEventListener('resize', this._setPosition);
        window.removeEventListener('scroll', this._setPosition);
      }
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
      var id, vector;
      id = ['#tourjs-symbol', this.config.type, this.config.position];
      if (this.config.inverted) {
        id.push('inverted');
      }
      vector = renderSVG(id.join('-'));
      addFilter(vector);
      return this.node.appendChild(vector);
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
      switch (this.config.type) {
        case 'arrow':
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
          break;
        case 'curved-arrow':
          switch (this.config.position) {
            case 'top-left':
              this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
              return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
            case 'top':
              this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
              if (!this.config.inverted) {
                return this.node.style.left = "" + (targetRect.left + (targetRect.width / 2) - 16) + "px";
              } else {
                return this.node.style.left = "" + (targetRect.left + (targetRect.width / 2) - rect.width + 16) + "px";
              }
              break;
            case 'top-right':
              this.node.style.top = "" + (targetRect.top - rect.height - DEFAULT_MARGIN) + "px";
              return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
            case 'right':
              if (targetRect.height > rect.height) {
                if (!this.config.inverted) {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2) + "px";
                } else {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2 - rect.height + 16) + "px";
                }
              } else {
                if (!this.config.inverted) {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2 - 16) + "px";
                } else {
                  this.node.style.top = "" + (targetRect.top - targetRect.height / 2 - rect.height / 2 + 12) + "px";
                }
              }
              return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
            case 'bottom-right':
              this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
              return this.node.style.left = "" + (targetRect.left + targetRect.width + DEFAULT_MARGIN) + "px";
            case 'bottom':
              this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
              if (!this.config.inverted) {
                return this.node.style.left = "" + (targetRect.left + targetRect.width / 2 - rect.width + 16) + "px";
              } else {
                return this.node.style.left = "" + (targetRect.left + targetRect.width / 2 - 16) + "px";
              }
              break;
            case 'bottom-left':
              this.node.style.top = "" + (targetRect.bottom + DEFAULT_MARGIN) + "px";
              return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
            case 'left':
              if (targetRect.height > rect.height) {
                if (!this.config.inverted) {
                  this.node.style.top = "" + (targetRect.top - (rect.height - targetRect.height / 2) + 16) + "px";
                } else {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2 - 16) + "px";
                }
              } else {
                if (!this.config.inverted) {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2 - rect.height + 18) + "px";
                } else {
                  this.node.style.top = "" + (targetRect.top + targetRect.height / 2 - rect.height / 2 + 24) + "px";
                }
              }
              return this.node.style.left = "" + (targetRect.left - rect.width - DEFAULT_MARGIN) + "px";
          }
      }
    };

    return Hint;

  })();
  Overlay = (function() {
    function Overlay(config) {
      this.config = config != null ? config : {};
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('overlay');
    }

    Overlay.prototype.render = function(parent, hints, state) {
      var defs, h, hint, mask, opacity, rect, _i, _len;
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
        for (_i = 0, _len = hints.length; _i < _len; _i++) {
          hint = hints[_i];
          h = new Highlight(hint.config);
          this.highlights.push(h);
          h.render(mask, state);
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
        return parent.appendChild(this.node);
      }
    };

    Overlay.prototype.unload = function() {
      var h, _i, _len, _ref, _results;
      if (this.node) {
        _ref = this.highlights;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          h = _ref[_i];
          _results.push(h.unload());
        }
        return _results;
      }
    };

    return Overlay;

  })();
  Overview = (function() {
    function Overview(config) {
      this.config = config != null ? config : {};
      this._setPosition = __bind(this._setPosition, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('overview');
    }

    Overview.prototype.render = function(parent, state) {
      var description, line, title, width;
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
          line = document.createElement('div');
          line.className = 'tourjs-overview-line';
          line.appendChild(renderSVG('#tourjs-symbol-line'));
          this.node.appendChild(line);
          description = document.createElement('div');
          description.className = 'tourjs-overview-description';
          description.innerHTML = this.config.description;
          this.node.appendChild(description);
        }
        parent.appendChild(this.node);
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
  Step = (function() {
    function Step(config) {
      this.config = config != null ? config : {};
      this._renderOverview = __bind(this._renderOverview, this);
      this._renderPagination = __bind(this._renderPagination, this);
      this._renderOverlay = __bind(this._renderOverlay, this);
      this._renderHints = __bind(this._renderHints, this);
      this.unload = __bind(this.unload, this);
      this.render = __bind(this.render, this);
      this.id = buildID('step');
      this._active = false;
      this.hints = (function() {
        var _i, _len, _ref, _results;
        _ref = this.config.hints;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          config = _ref[_i];
          _results.push(new Hint(config));
        }
        return _results;
      }).call(this);
      this.overlay = new Overlay(this.config.overlay || {});
    }

    Step.prototype.render = function(parent, state) {
      var load;
      load = (function(_this) {
        return function() {
          if (!_this.node) {
            _this.node = document.createElement('div');
            _this.node.id = _this.id;
            _this.node.className = 'tourjs-step';
            parent.appendChild(_this.node);
          }
          _this._renderOverview(state);
          _this._renderHints(state);
          _this._renderOverlay(state);
          _this._renderPagination(parent, state);
          _this.node.style.display = 'block';
          state.step = _this;
          if (!state.started) {
            state.started = true;
          }
          if (!_this.next) {
            state.finished = true;
          }
          if (isFunction(_this.config.load) && !_this._active) {
            _this.config.load(state);
          }
          return _this._active = true;
        };
      })(this);
      if (isFunction(this.config.beforeLoad) && !this._active) {
        return this.config.beforeLoad(state, load);
      } else {
        return load();
      }
    };

    Step.prototype.unload = function(state) {
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
          if (isFunction(_this.config.unload) && _this._active) {
            _this.config.unload(state);
          }
          return _this._active = false;
        };
      })(this);
      if (isFunction(this.config.beforeUnload) && this._active) {
        return this.config.beforeUnload(state, unload);
      } else {
        return unload();
      }
    };

    Step.prototype._renderHints = function(state) {
      var hint, _i, _len, _ref, _results;
      _ref = this.hints;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hint = _ref[_i];
        _results.push(hint.render(this.node, state));
      }
      return _results;
    };

    Step.prototype._renderOverlay = function(state) {
      return this.overlay.render(this.node, this.hints, state);
    };

    Step.prototype._renderPagination = function(parent, state) {
      var next, pagination, previous, stepCount, wrapper;
      if (!(this.previous || this.next)) {
        return;
      }
      wrapper = document.createElement('div');
      wrapper.className = 'tourjs-pagination-wrapper';
      previous = document.createElement('div');
      previous.className = 'tourjs-previous-step';
      previous.appendChild(renderSVG('#tourjs-symbol-chevron-left'));
      if (this.previous) {
        previous.addEventListener('click', (function(_this) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            _this.unload(state);
            return _this.previous.render(parent, state);
          };
        })(this));
      } else {
        previous.className += ' tourjs-step-disabled';
      }
      wrapper.appendChild(previous);
      stepCount = document.createElement('div');
      stepCount.className = 'tourjs-step-count';
      stepCount.innerHTML = "Step " + this.index + " of " + state.steps.length;
      wrapper.appendChild(stepCount);
      next = document.createElement('div');
      next.className = 'tourjs-next-step';
      next.appendChild(renderSVG('#tourjs-symbol-chevron-right'));
      if (this.next) {
        next.addEventListener('click', (function(_this) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            _this.unload(state);
            return _this.next.render(parent, state);
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

    Step.prototype._renderOverview = function(state) {
      if (this.config.overview) {
        if (!this.overview) {
          this.overview = new Overview(this.config.overview);
        }
        return this.overview.render(this.node, state);
      }
    };

    return Step;

  })();
  Tour = (function() {
    function Tour(config) {
      this.config = config != null ? config : {};
      this._renderStep = __bind(this._renderStep, this);
      this._renderFirstStep = __bind(this._renderFirstStep, this);
      this._renderCloseBtn = __bind(this._renderCloseBtn, this);
      this._onLoad = __bind(this._onLoad, this);
      this._onKeyUp = __bind(this._onKeyUp, this);
      this._initSteps = __bind(this._initSteps, this);
      this._unloadCloseBtn = __bind(this._unloadCloseBtn, this);
      this.unload = __bind(this.unload, this);
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
            document.body.appendChild(_this.node);
            fetchSVG({
              svg: _this.config.svg,
              success: _this._onLoad
            });
          }
          return _this.node.style.display = 'block';
        };
      })(this);
      return this._initSteps((function(_this) {
        return function() {
          if (isFunction(_this.config.beforeLoad)) {
            return _this.config.beforeLoad(_this.state, load);
          } else {
            return load();
          }
        };
      })(this));
    };

    Tour.prototype.unload = function() {
      var unload;
      unload = (function(_this) {
        return function() {
          if (_this.node) {
            _this.node.style.display = 'none';
            _this.state.step.unload();
            _this._unloadCloseBtn();
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

    Tour.prototype._unloadCloseBtn = function() {
      var btn;
      btn = document.getElementById('tourjs-close');
      if (btn) {
        btn.style.display = 'none';
        return btn.removeEventListener('click', this.unload);
      }
    };

    Tour.prototype._initSteps = function(callback) {
      var allSteps, def, i, previous, step, wait, waitCount, _i, _len, _ref;
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
        step = new Step(def);
        allSteps.push(step);
        if (isFunction(step.config.shouldShow)) {
          (function(step) {
            return step.config.shouldShow(function(show) {
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
      if (isFunction(this.config.load)) {
        return this.config.load(this.state);
      }
    };

    Tour.prototype._renderCloseBtn = function() {
      var btn;
      btn = document.getElementById('tourjs-close');
      if (!btn) {
        btn = renderSVG('#tourjs-symbol-close');
        btn.id = 'tourjs-close';
        addFilter(btn);
        btn.addEventListener('click', this.unload);
        btn.style.display = 'block';
        return this.node.appendChild(btn);
      }
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
          _results.push(step.render(this.node, this.state));
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
