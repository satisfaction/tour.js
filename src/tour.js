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

    var OVERLAY_ID, SVG_DOM, XMLNS, ID_COUNT;

    ID_COUNT = 0;
    OVERLAY_ID = 'tourjs-overlay';
    XMLNS = 'http://www.w3.org/2000/svg';

    function bind(fn, self) {
        return function () {
            return fn.apply(self, arguments);
        };
    }

    function addDropShadowFilter(svg, style) {
        var blend, blur, defs, filter, id, matrix, offset;

        id = (new Date()).getTime();
        defs = document.createElementNS(XMLNS, 'defs');

        filter = document.createElementNS(XMLNS, 'filter');
        filter.setAttributeNS(null, 'id', id);
        filter.setAttributeNS(null, 'x', '-50%');
        filter.setAttributeNS(null, 'y', '-50%');
        filter.setAttributeNS(null, 'width', '200%');
        filter.setAttributeNS(null, 'height', '200%');

        offset = document.createElementNS(XMLNS, 'feOffset');
        offset.setAttributeNS(null, 'dx', 1);
        offset.setAttributeNS(null, 'dy', 1);
        offset.setAttributeNS(null, 'in', 'SourceAlpha');
        offset.setAttributeNS(null, 'result', 'ShadowOffsetOuter');

        blur = document.createElementNS(XMLNS, 'feGaussianBlur');
        blur.setAttributeNS(null, 'stdDeviation', 2);
        blur.setAttributeNS(null, 'in', 'ShadowOffsetOuter');
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
        svg.setAttribute('style', 'filter: url(#' + id + ');');
    }

    // TODO: Make this a method of Step
    function addPagination(parentNode, step) {
        var label, next, nextChevron, pagination, previous, previousChevron;

        if (step.previous || step.next) {

            pagination = document.createElement('div');
            pagination.className = 'tourjs-pagination';

            if (step.next) {
                next = document.createElement('a');
                next.className = 'tourjs-next-step';
                next.setAttribute('href', '#');
                next.addEventListener('click', function (event) {
                    event.stopPropagation();
                    step.unload();
                    step.next.load(parentNode);
                });

                label = document.createElement('span');
                label.innerText = 'Next';
                next.appendChild(label);

                nextChevron = renderSVG('#tutjs-chevron-ltr g');
                next.appendChild(nextChevron);

                pagination.appendChild(next);
            }

            if (step.previous) {
                previous = document.createElement('a');
                previous.className = 'tourjs-previous-step';
                previous.setAttribute('href', '#');
                previous.addEventListener('click', function (event) {
                    event.stopPropagation();
                    step.unload();
                    step.previous.load(parentNode);
                });

                previousChevron = renderSVG('#tutjs-chevron-rtl g', { transform: 'translate(-10)' });
                previous.appendChild(previousChevron);

                label = document.createElement('span');
                label.innerText = 'Previous';
                previous.appendChild(label);

                pagination.appendChild(previous);
            }

            step.node.appendChild(pagination);
        }
    }

    function getId(prefix) {
        return 'tourjs-' + (prefix ? prefix + '-' : '') + ID_COUNT++;
    }

    function fetchSVG(options) {
        var httpRequest = new XMLHttpRequest();

        function load () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                SVG_DOM = document.createElement('div');
                SVG_DOM.innerHTML = httpRequest.responseText;

                if (options.success) {
                    options.success();
                }
            }
        }

        httpRequest.onreadystatechange = load;
        httpRequest.open('GET', (options.svg || 'dist/tour.js.svg'), true);
        httpRequest.send();
    }

    function getClientRect(node) {
        var rect = node.getBoundingClientRect(),
            size = getWindowSize();

        rect.right = size.width - rect.right;
        rect.bottom = size.height - rect.bottom;

        return rect;
    }

    function getWindowSize() {
        var doc = document.documentElement;

        return {
            width: window.innerWidth || doc.clientWidth,
            height: window.innerHeight || doc.clientHeight
        };
    }

    function hideOverlay() {
        document.getElementById(OVERLAY_ID).style.display = 'none';
    }

    function renderArrow(position) {
        var options = {};
        switch (position) {
            case 'top-left':
                options.transform = 'translate(11 -12) rotate(45)';
                break;
            case 'top':
                options.transform = 'translate(32) rotate(90)';
                break;
            case 'top-right':
                options.transform = 'translate(60 12) rotate(135)';
                break;
            case 'right':
                options.transform = 'translate(63 32) rotate(180)';
                break;
            case 'bottom-right':
                options.transform = 'translate(33 60) rotate(-135)';
                break;
            case 'bottom':
                options.transform = 'translate(0 64) rotate(-90)';
                break;
            case 'bottom-left':
                options.transform = 'translate(-11 38) rotate(-45)';
                break;
            case 'left':
                break;
        }
        return renderSVG('#tutjs-arrow g', options);
    }

    function renderOverlay() {
        var overlay;

        if (!document.getElementById(OVERLAY_ID)) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            document.body.appendChild(overlay);
        }

        document.getElementById(OVERLAY_ID).style.display = 'block';
    }

    function renderSVG(selector, options) {
        var svg, vector;

        options = options || {};

        vector = SVG_DOM.querySelector(selector).cloneNode(true);

        if (options.transform) {
            vector.setAttribute('transform', options.transform);
        }

        svg = document.createElementNS(XMLNS, 'svg');
        svg.setAttribute('class', 'tourjs-shape');

        addDropShadowFilter(svg);
        svg.appendChild(vector);

        return svg;
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
                this.node.classList.add('tourjs-' + this.options.position);
                this.node.classList.add('tourjs-' + this.options.type);
                this._renderTooltip();
                this._renderShape();
                if (!document.getElementById(this.id)) {
                    parentNode.appendChild(this.node);
                }
                this._setPosition();
            }

            window.addEventListener('resize', this._setPosition);

            if (this.options.highlight === true) {
                document.querySelector(this.options.target).classList.add('tourjs-highlight');
            } else if (typeof this.options.highlight === 'string') {
                document.querySelector(this.options.highlight).classList.add('tourjs-highlight');
            }
        },

        unload: function () {
            if (this.options.highlight === true) {
                document.querySelector(this.options.target).classList.remove('tourjs-highlight');
            } else if (typeof this.options.highlight === 'string') {
                document.querySelector(this.options.highlight).classList.remove('tourjs-highlight');
            }

            window.removeEventListener('resize', this._setPosition);
        },

        _setPosition: function () {
            var margin = 5,
                targetRect = getClientRect(document.querySelector(this.options.target)),
                rect = getClientRect(this.node);

            console.log(this.options.position, targetRect, rect);

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
                    this.node.style.left = targetRect.left + targetRect.width + 5 + 'px';
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
            var arrow = renderArrow(this.options.position);
            this.node.appendChild(arrow);
        },

        _renderTitle: function (parent) {
            var title = document.createElement('h2');
            title.innerText = this.options.title;
            parent.appendChild(title);
        },

        _renderTooltip: function () {
            var tooltip = document.createElement('div');
            tooltip.className = 'tourjs-tooltip';
            this._renderTitle(tooltip);
            this._renderDescription(tooltip);
            this.node.appendChild(tooltip);
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
            var description, title;

            if (!this.node) {
                this.node = document.createElement('div');
                this.node.id = this.id;
                this.node.className = 'tourjs-overview';

                title = document.createElement('h1');
                title.innerText = this.options.title;
                this.node.appendChild(title);

                if (this.options.description) {
                    description = document.createElement('div');
                    description.innerHTML = this.options.description;
                    this.node.appendChild(description);
                }

                if (!document.getElementById(this.id)) {
                    parentNode.appendChild(this.node);
                }
            }

            window.addEventListener('resize', this._setPosition);
            window.setTimeout(function () {
                this._setPosition();
            }.bind(this), 0);

            return this.node;
        },

        unload: function () {
            window.removeEventListener('resize', this._setPosition);
        },

        _setPosition: function () {
            var rect = getClientRect(this.node);
            this.node.style.marginLeft = -(rect.width / 2) + 'px';
            this.node.style.marginTop = -(rect.height / 2) + 'px';
        }
    };

    function Step(config) {
        if (!(this instanceof Step)) {
            return new Step(config);
        }

        this.id = getId('step');
        this.options = config.options || {};

        this._initOverview(this.options.overview);

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

                    addPagination(parentNode, this);

                    this._loadOverview();

                    this.hints.forEach(function (hint) {
                        hint.load(this.node);
                    }.bind(this));
                } else {
                    this.node.style.display = 'block';
                }

                if (callback) callback(this);

                // Trigger `afterLoad` callback
                if (typeof this.options.afterLoad === 'function') {
                    this.options.afterLoad();
                }
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
                // Check if the `this.node` is present. If the Step has never
                // been loaded then it won't exist yet.
                if (this.node) {
                    this.node.style.display = 'none';
                    this.hints.forEach(function (hint) {
                        hint.unload();
                    });
                }

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

        _initOverview: function (overview) {
            if (overview && !this.overview) {
                this.overview = new Overview(overview);
            }
        },

        _loadOverview: function () {
            if (this.overview) {
                this.node.appendChild(this.overview.load(this.node));
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
            renderOverlay(); // TODO: Make this a method

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

                // Trigger `afterLoad` callback
                if (typeof this.options.afterLoad === 'function') {
                    this.options.afterLoad();
                }
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

                hideOverlay();

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

        _initStep: function () {
            var previous, step;
            return function (config) {
                step = new Step(config);
                if (previous) {
                    step.previous = previous;
                    previous.next = step;
                }
                previous = step;
                this.steps.push(step);
            }.bind(this);
        },

        _initSteps: function (stepDefs) {
            if (stepDefs) {
                this.steps = [];
                stepDefs.forEach(this._initStep());
            }
        },

        _onKeyUp: function (event) {
            if (event.keyCode === 27) this.unload();
        },

        _onLoad: function () {
            document.addEventListener('keyup', this._onKeyUp);

            this._loadFirstStep();

            // Trigger `afterLoad` callback
            if (typeof this.options.afterLoad === 'function') {
                this.options.afterLoad();
            }
        },

        _loadFirstStep: function () {
            this._loadStep(0);
        },

        _loadStep: function (i) {
            var step = this.steps[i];
            step.load(this.node);
        }
    };

    return Tour;

}));

