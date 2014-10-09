/* Global define */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Tour = factory();
  }
}(this, function () {

  'use strict';

  var idCount, margin, svgSymbols, xmlns;

  idCount = 0;
  margin = 10;
  xmlns = 'http://www.w3.org/2000/svg';

  function bind(fn, self) {
    return function () {
      return fn.apply(self, arguments);
    };
  }

  function addDropShadowFilter(svg, style) {
    var blend, blur, defs, filter, id, matrix, offset;

    id = (new Date()).getTime();
    defs = document.createElementNS(xmlns, 'defs');

    filter = document.createElementNS(xmlns, 'filter');
    filter.setAttributeNS(null, 'id', id);
    filter.setAttributeNS(null, 'x', '-50%');
    filter.setAttributeNS(null, 'y', '-50%');
    filter.setAttributeNS(null, 'width', '200%');
    filter.setAttributeNS(null, 'height', '200%');

    offset = document.createElementNS(xmlns, 'feOffset');
    offset.setAttributeNS(null, 'dx', 1);
    offset.setAttributeNS(null, 'dy', 1);
    offset.setAttributeNS(null, 'in', 'SourceAlpha');
    offset.setAttributeNS(null, 'result', 'ShadowOffsetOuter');

    blur = document.createElementNS(xmlns, 'feGaussianBlur');
    blur.setAttributeNS(null, 'stdDeviation', 2);
    blur.setAttributeNS(null, 'in', 'ShadowOffsetOuter');
    blur.setAttributeNS(null, 'result', 'ShadowBlurOuter');

    matrix = document.createElementNS(xmlns, 'feColorMatrix');
    matrix.setAttributeNS(null, 'values', '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.3 0');
    matrix.setAttributeNS(null, 'in', 'ShadowBlurOuter');
    matrix.setAttributeNS(null, 'result', 'ShadowMatrixOuter');

    blend = document.createElementNS(xmlns, 'feBlend');
    blend.setAttributeNS(null, 'in', 'ShadowMatrixOuter');
    blend.setAttributeNS(null, 'in2', 'SourceGraphic');
    blend.setAttributeNS(null, 'mode', 'normal');

    filter.appendChild(offset);
    filter.appendChild(blur);
    filter.appendChild(matrix);
    filter.appendChild(blend);

    defs.appendChild(filter);

    svg.appendChild(defs);
    svg.setAttribute('style', 'filter: url(#' + id + ');');
  }

  function getId(prefix) {
    return 'tourjs-' + (prefix ? prefix + '-' : '') + idCount++;
  }

  function fetchSVG(options) {
    var httpRequest = new XMLHttpRequest();

    function load () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        svgSymbols = document.createElement('div');
        svgSymbols.innerHTML = httpRequest.responseText;

        if (options.success) {
          options.success();
        }
      }
    }

    httpRequest.onreadystatechange = load;
    httpRequest.open('GET', (options.svg || 'dist/svg/defs.svg'), true);
    httpRequest.send();
  }

  function getClientRect(node) {
    var rect  = node.getBoundingClientRect(),
        wsize = getWindowSize();
    rect.right = wsize.width - rect.right;
    rect.bottom = wsize.height - rect.bottom;
    return rect;
  }

  function getWindowSize() {
    var doc = document.documentElement;

    return {
      width: window.innerWidth || doc.clientWidth,
        height: window.innerHeight || doc.clientHeight
    };
  }

  function renderSVG(selector, options) {
    options = options || {};
    var vector = svgSymbols.querySelector(selector).cloneNode(true);
    vector.setAttribute('class', 'tourjs-shape');
    if (options.transform) {
      vector.setAttribute('transform', options.transform);
    }
    return vector;
  }

  function Hint(options) {
    if (!(this instanceof Hint)) {
      return new Hint(options);
    }

    this.id = getId('hint');
    this.options = options || {};

    this._setPosition = bind(this._setPosition, this);
  }

  Hint.prototype = {

    load: function (parentNode) {

      if (!this.node) {
        this.node = document.createElement('div');
        this.node.id = this.id;
        this.node.className = 'tourjs-hint';
        this.node.classList.add('tourjs-' + this.options.position + (this.options.inverted ? '-inverted' : ''));
        this.node.classList.add('tourjs-' + this.options.type);

        if (this.options.width) {
          var customWidth = this.options.width + 'px';
          this.node.style.width = customWidth;
          this.node.style.maxWidth = customWidth;
        }

        this._renderTooltip();
        this._renderShape();

        if (!document.getElementById(this.id)) {
          parentNode.appendChild(this.node);
        }

        this._setPosition();
      }

      window.addEventListener('resize', this._setPosition);
      window.addEventListener('scroll', this._setPosition);
    },

    unload: function () {
      window.removeEventListener('resize', this._setPosition);
      window.removeEventListener('scroll', this._setPosition);
    },

    _setPosition: function () {
      var targetRect = getClientRect(document.querySelector(this.options.target)),
      rect = getClientRect(this.node);

      switch (this.options.type) {
      case 'arrow':

        switch (this.options.position) {
        case 'top-left':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        case 'top':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          this.node.style.left = targetRect.left + (targetRect.width / 2) - rect.width / 2 + 'px';
          break;
        case 'top-right':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'right':
          if (targetRect.height > rect.height) {
            this.node.style.top = targetRect.top + ((targetRect.height - rect.height) / 2) + 'px';
          } else {
            this.node.style.top = targetRect.top - ((rect.height - targetRect.height) / 2) + 'px';
          }
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'bottom-right':
          this.node.style.top = targetRect.bottom + margin + 'px';
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'bottom':
          this.node.style.top = targetRect.bottom + margin + 'px';
          this.node.style.left = targetRect.left + (targetRect.width / 2) - rect.width / 2 + 'px';
          break;
        case 'bottom-left':
          this.node.style.top = targetRect.bottom + margin + 'px';
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        case 'left':
          if (targetRect.height > rect.height) {
            this.node.style.top = targetRect.top + ((targetRect.height - rect.height) / 2) + 'px';
          } else {
            this.node.style.top = targetRect.top - ((rect.height - targetRect.height) / 2) + 'px';
          }
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        }
        break;

      case 'curved-arrow':

        switch (this.options.position) {
        case 'top-left':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        case 'top':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          if (!this.options.inverted) {
            this.node.style.left = targetRect.left + (targetRect.width / 2) - 16 + 'px';
          } else {
            this.node.style.left = targetRect.left + (targetRect.width / 2) - rect.width + 16 + 'px';
          }
          break;
        case 'top-right':
          this.node.style.top = targetRect.top - rect.height - margin + 'px';
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'right':
          if (targetRect.height > rect.height) {
            if (!this.options.inverted) {
              this.node.style.top = targetRect.top + targetRect.height / 2 + 'px';
            } else {
              this.node.style.top = targetRect.top + targetRect.height / 2 - rect.height + 16 + 'px';
            }
          } else {
            if (!this.options.inverted) {
              this.node.style.top = targetRect.top + targetRect.height / 2 -  16 + 'px';
            } else {
              this.node.style.top = targetRect.top - targetRect.height / 2 - rect.height / 2 + 12 + 'px';
            }
          }
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'bottom-right':
          this.node.style.top = targetRect.bottom + margin + 'px';
          this.node.style.left = targetRect.left + targetRect.width + margin + 'px';
          break;
        case 'bottom':
          this.node.style.top = targetRect.bottom + margin + 'px';
          if (!this.options.inverted) {
            this.node.style.left = targetRect.left + targetRect.width / 2 - rect.width + 16 + 'px';
          } else {
            this.node.style.left = targetRect.left + targetRect.width / 2 - 16 + 'px';
          }
          break;
        case 'bottom-left':
          this.node.style.top = targetRect.bottom + margin + 'px';
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        case 'left':
          if (targetRect.height > rect.height) {
            if (!this.options.inverted) {
              this.node.style.top = targetRect.top - (rect.height - targetRect.height / 2) + 16 + 'px';
            } else {
              this.node.style.top = targetRect.top + targetRect.height / 2 - 16 + 'px';
            }
          } else {
            if (!this.options.inverted) {
              this.node.style.top = targetRect.top + targetRect.height / 2 - rect.height + 18 + 'px';
            } else {
              this.node.style.top = targetRect.top + targetRect.height / 2 - rect.height / 2 + 24 + 'px';
            }
          }
          this.node.style.left = targetRect.left - rect.width - margin + 'px';
          break;
        }

        break;
      }
    },

    _renderDescription: function (parent) {
      var desc;
      if (this.options.description) {
        desc = document.createElement('div');
        desc.className = 'tourjs-description';
        desc.innerHTML = this.options.description;
        parent.appendChild(desc);
      }
    },

    _renderShape: function () {
      var vector = renderSVG(
        '#tourjs-symbol-' + this.options.type + '-' + this.options.position  + (this.options.inverted ? '-inverted' : '')
      );

      this.node.appendChild(vector);
    },

    _renderTitle: function (parent) {
      var title = document.createElement('h2');
      title.innerText = this.options.title;
      parent.appendChild(title);
    },

    _renderTooltip: function () {
      var tooltip = document.createElement('div');
      tooltip.className = 'tourjs-tooltip';
      if (this.options.width) {
        this.node.style.width = this.options.width + 'px';
        this.node.style.maxWidth = this.options.width + 'px';
      }
      this._renderTitle(tooltip);
      this._renderDescription(tooltip);
      this.node.appendChild(tooltip);
    }
  };

  function Highlight(hint) {
    this.hint = hint;
    this._setPosition = bind(this._setPosition, this);
  }

  Highlight.prototype = {

    load: function () {
      if (this.hint.highlight === false) return;

      if (!this.node) {
        this.node = document.createElementNS(xmlns, 'rect');
        this.node.setAttributeNS(
          null,
          'style',
          'stroke:none;fill:#000;'
        );
      }

      this._setPosition();

      window.addEventListener('resize', this._setPosition);
      window.addEventListener('scroll', this._setPosition);

      return this.node;
    },

    unload: function () {
      if (this.node) {
        window.removeEventListener('resize', this._setPosition);
        window.removeEventListener('scroll', this._setPosition);
      }
    },

    _setPosition: function () {
      var rect, target;

      if (this.node) {
        if (!this.hint.highlight) {
          target = document.querySelector(this.hint.target);
        } else {
          target = document.querySelector(this.hint.highlight);
        }

        rect = getClientRect(target);

        this.node.setAttributeNS(null, 'x', rect.left);
        this.node.setAttributeNS(null, 'y', rect.top);
        this.node.setAttributeNS(null, 'height', rect.height);
        this.node.setAttributeNS(null, 'width', rect.width);
      }
    }
  };

  function Overlay(hints) {
    this.id = getId();
    this.hints = hints;
    this.highlights = [];
    this.hints.forEach(function (hint) {
      this.highlights.push(new Highlight(hint));
    }.bind(this));
  }

  Overlay.prototype = {
    load: function (parentNode) {
      var defs, mask, rect;

      if (!this.node) {
        this.node = document.createElementNS(xmlns, 'svg');
        this.node.setAttributeNS(null, 'id', 'overlay-' + this.id);
        this.node.setAttributeNS(null, 'class', 'tourjs-overlay');
        this.node.setAttributeNS(null, 'x', 0);
        this.node.setAttributeNS(null, 'y', 0);
        this.node.setAttributeNS(null, 'height', '100%');
        this.node.setAttributeNS(null, 'width', '100%');

        defs = document.createElementNS(xmlns, 'defs');

        mask = document.createElementNS(xmlns, 'mask');
        mask.setAttributeNS(null, 'x', 0);
        mask.setAttributeNS(null, 'y', 0);
        mask.setAttributeNS(null, 'height', '100%');
        mask.setAttributeNS(null, 'width', '100%');
        mask.setAttributeNS(null, 'id', 'overlay-' + this.id + '-mask');

        rect = document.createElementNS(xmlns, 'rect');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', '100%');
        rect.setAttributeNS(null, 'width', '100%');
        rect.setAttributeNS(null, 'style', 'stroke:none;fill:#FFF;');

        mask.appendChild(rect);

        this.highlights.forEach(function (highlight) {
          if (highlight.load()) {
            mask.appendChild(highlight.load());
          }
        });

        defs.appendChild(mask);
        this.node.appendChild(defs);

        rect = document.createElementNS(xmlns, 'rect');
        rect.setAttributeNS(null, 'x', 0);
        rect.setAttributeNS(null, 'y', 0);
        rect.setAttributeNS(null, 'height', '100%');
        rect.setAttributeNS(null, 'width', '100%');
        rect.setAttributeNS(
          null,
          'style',
          'stroke:none;fill:rgba(0,0,0,0.6);mask:url(#overlay-' + this.id + '-mask);'
        );

        this.node.appendChild(rect);
        parentNode.appendChild(this.node);
      } else {
        this.node.style.display = 'block';
        this.highlights.forEach(function (highlight) {
          highlight.load();
        });
      }
    },

    unload: function () {
      if (this.node) {
        this.node.style.display = 'none';
        this.highlights.forEach(function (highlight) {
          highlight.unload();
        });
      }
    }
  };

  function Overview(config) {
    if (!(this instanceof Overview)) {
      return new Overview(config);
    }

    this.id = getId('overview');
    this.options = config || {};

    this._setPosition = bind(this._setPosition, this);
  }

  Overview.prototype = {

    load: function (parentNode) {
      var description, line, title;

      if (!this.node) {
        this.node = document.createElement('div');
        this.node.id = this.id;
        this.node.className = 'tourjs-overview';

        if (this.options.width) {
          var customWidth = this.options.width + 'px';
          this.node.style.width = customWidth;
          this.node.style.maxWidth = customWidth;
        }

        title = document.createElement('h1');
        title.innerText = this.options.title;
        title.className = 'tourjs-overview-title';
        this.node.appendChild(title);

        if (this.options.description) {
          line = document.createElement('div');
          line.className = 'tourjs-overview-line';
          line.appendChild(renderSVG('#tourjs-symbol-line'));
          this.node.appendChild(line);

          description = document.createElement('div');
          description.innerHTML = this.options.description;
          description.className = 'tourjs-overview-description';
          this.node.appendChild(description);
        }

        if (!document.getElementById(this.id)) {
          parentNode.appendChild(this.node);
        }
      }

      window.addEventListener('resize', this._setPosition);
      window.addEventListener('scroll', this._setPosition);

      window.setTimeout(function () {
        this._setPosition();
      }.bind(this), 0);

      return this.node;
    },

    unload: function () {
      window.removeEventListener('resize', this._setPosition);
      window.removeEventListener('scroll', this._setPosition);
    },

    _setPosition: function () {
      var margin = '100px',
          rect = getClientRect(this.node),
          wsize = getWindowSize();

      switch (this.options.position) {
        case 'top':
          this.node.style.left = wsize.width / 2 - rect.width / 2 + 'px';
          this.node.style.top = margin;
          break;
        case 'top-right':
          this.node.style.right = margin;
          this.node.style.top = margin;
          break;
        case 'right':
          this.node.style.right = margin;
          this.node.style.top = wsize.height / 2 - rect.height / 2 + 'px';
          break;
        case 'bottom-right':
          this.node.style.right = margin;
          this.node.style.bottom = margin;
          break;
        case 'bottom':
          this.node.style.left = wsize.width / 2 - rect.width / 2 + 'px';
          this.node.style.bottom = margin;
          break;
        case 'bottom-left':
          this.node.style.left = margin;
          this.node.style.bottom = margin;
          break;
        case 'left':
          this.node.style.left = margin;
          this.node.style.top = wsize.height / 2 - rect.height / 2 + 'px';
          break;
        case 'top-left':
          this.node.style.left = margin;
          this.node.style.top = margin;
          break;
        default:
          this.node.style.left = wsize.width / 2 - rect.width / 2 + 'px';
          this.node.style.top = wsize.height / 2 - rect.height / 2 + 'px';
          break;
      }
    }

  };

  function Step(config) {
    if (!(this instanceof Step)) {
      return new Step(config);
    }

    this.id = getId('step');
    this.options = config.options || {};

    this._initOverview(this.options.overview);

    this.overlay = new Overlay(config.hints);

    this.hints = [];
    config.hints.forEach(function (options) {
      this.hints.push(new Hint(options));
    }.bind(this));
  }

  Step.prototype = {

    load: function(parentNode, callback) {
      var asyncLoad = function () {
        if (!this.node) {
          this.node = document.createElement('div');
          this.node.id = this.id;
          this.node.className = 'tourjs-step';

          if (!document.getElementById(this.id)) {
            parentNode.appendChild(this.node);
          }

          this._paginate(parentNode);
          this._loadOverview();

        } else {
          this.node.style.display = 'block';
        }

        this.overlay.load(this.node);

        this.hints.forEach(function (hint) {
          hint.load(this.node);
        }.bind(this));

        if (callback) callback(this);

        // Trigger `afterLoad` callback
        if (typeof this.options.afterLoad === 'function' &! this.loaded) {
          this.options.afterLoad(this);
        }

        this.loaded = true;

      }.bind(this);

      if (typeof this.options.beforeLoad === 'function' &! this.loaded) {
        // Trigger `beforeLoad` callback
        this.options.beforeLoad(this, asyncLoad);
      } else {
        asyncLoad();
      }
    },

    unload: function () {
      var asyncUnload = function () {
        // Check if the `this.node` is present. If the Step has never
        // been loaded then it won't exist yet.
        if (this.node) {
          this.node.style.display = 'none';
          this.hints.forEach(function (hint) {
            hint.unload();
          });
        }

        // Trigger `afterUnload` callback
        if (typeof this.options.afterUnload === 'function' && this.loaded === true) {
          this.options.afterUnload(this);
        }

        this.loaded = false;

      }.bind(this);

      if (typeof this.options.beforeUnload === 'function' && this.loaded === true) {
        // Tigger `beforeUnload` callback
        this.options.beforeUnload(this, asyncUnload);
      } else {
        asyncUnload();
      }
    },

    _initOverview: function (overview) {
      if (overview && !this.overview) {
        this.overview = new Overview(overview);
      }
    },

    _loadOverview: function () {
      if (this.overview) {
        this.node.appendChild(this.overview.load(this.node));
      }
    },

    _paginate: function (parentNode) {
      var label, next, nextChevron, pagination, previous, previousChevron, wrapper;

      if (this.previous || this.next) {

        pagination = document.createElement('div');
        pagination.className = 'tourjs-pagination';

        wrapper = document.createElement('div');
        wrapper.className = 'tourjs-pagination-wrapper';

        previous = document.createElement('div');
        previous.className = 'tourjs-previous-step';

        if (this.previous) {
          previous.addEventListener('click', function (event) {
            event.stopPropagation();
            this.unload();
            this.previous.load(parentNode);
          }.bind(this));
        }

        previousChevron = renderSVG('#tourjs-symbol-chevron-left');
        previous.appendChild(previousChevron);
        wrapper.appendChild(previous);

        var stepCount = document.createElement('div');
        stepCount.className = 'tourjs-step-count';
        stepCount.innerText = 'Step ' + this.options.index + ' of ' + this.options.stepCount;
        wrapper.appendChild(stepCount);

        next = document.createElement('div');
        next.className = 'tourjs-next-step';

        if (this.next) {
          next.addEventListener('click', function (event) {
            event.stopPropagation();
            this.unload();
            this.next.load(parentNode);
          }.bind(this));
        }

        nextChevron = renderSVG('#tourjs-symbol-chevron-right');
        next.appendChild(nextChevron);
        wrapper.appendChild(next);

        pagination.appendChild(wrapper);
        this.node.appendChild(pagination);
      }
    }
  };

  function Tour(config) {

    if (!(this instanceof Tour)) {
      return new Tour(config);
    }

    this._onKeyUp = bind(this._onKeyUp, this);
    this._onLoad = bind(this._onLoad, this);
    this.unload = bind(this.unload, this);

    this.id = getId();
    this.options = config.options || {};

    this._initSteps(config.steps);
  }

  Tour.prototype = {
    load: function () {
      var asyncLoad = function () {
        if (!this.node) {
          this.node = document.createElement('div');
          this.node.id = this.id;
          this.node.className = 'tourjs';

          if (!document.getElementById(this.id)) {
            document.body.appendChild(this.node);
          }
        }

        fetchSVG({
          svg: this.options.svg,
          success: this._onLoad
        });

      }.bind(this);

      if (typeof this.options.beforeLoad === 'function') {
        // Trigger `beforeLoad` callback
        this.options.beforeLoad(asyncLoad);
      } else {
        asyncLoad();
      }
    },

    unload: function () {
      var asyncUnload = function () {
        document.removeEventListener('keyup', this._onKeyUp);

        this.steps.forEach(function (step) {
          step.unload();
        });

        this._unloadCloseButton();

        // Trigger `afterUnload` callback
        if (typeof this.options.afterUnload === 'function') {
          this.options.afterUnload();
        }
      }.bind(this);

      if (typeof this.options.beforeUnload === 'function') {
        // Tigger `beforeUnload` callback
        this.options.beforeUnload(asyncUnload);
      } else {
        asyncUnload();
      }
    },

    _initSteps: function (stepDefs) {
      var step,
          next,
          previous,
          stepIndex = 1,
          stepCount = stepDefs.length;

      if (stepDefs) {
        this.steps = [];

        stepDefs.forEach(function (def) {

          if (!def.options) def.options = {};

          def.options.index = stepIndex;
          def.options.stepCount = stepCount;

          step = new Step(def);
          this.steps.push(step);

          if (previous) {
            step.previous = previous;
            previous.next = step;
          }

          previous = step;
          stepIndex++;

        }.bind(this));
      }
    },

    _onKeyUp: function (event) {
      if (event.keyCode === 27) this.unload();
    },

    _onLoad: function () {
      document.addEventListener('keyup', this._onKeyUp);

      this._loadCloseButton();
      this._loadFirstStep();

      // Trigger `afterLoad` callback
      if (typeof this.options.afterLoad === 'function') {
        this.options.afterLoad();
      }
    },

    _loadFirstStep: function () {
      this.loadStep(1);
    },

    loadStep: function (i) {
      this.steps.forEach(function (step) {
        if (step.options.index === i) {
          step.load(this.node);
        } else {
          step.unload();
        }
      }.bind(this));
    },

    _loadCloseButton: function () {
      var button = document.getElementById('tourjs-close');

      if (!button) {
        button = renderSVG('#tourjs-symbol-close');
        button.id = 'tourjs-close';
        this.node.appendChild(button);
      }

      button.addEventListener('click', this.unload);

      button.style.display = 'block';
    },

    _unloadCloseButton: function () {
      var button = document.getElementById('tourjs-close');
      if (button) {
        button.style.display = 'none';
        button.removeEventListener('click', this.unload);
      }
    }
  };

  return Tour;

}));

