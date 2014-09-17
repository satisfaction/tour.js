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

    var OVERLAY_ID, SVG_DOM, XMLNS, ID_COUNT;

    ID_COUNT = 0;
    OVERLAY_ID = 'tourjs-overlay';
    XMLNS = 'http://www.w3.org/2000/svg';

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

    function addPagination(step) {
        var label, next, nextChevron, pagination, previous;

        if (step.previous || step.next) {

            pagination = document.createElement('div');
            pagination.className = 'tourjs-pagination';

            if (step.next) {
                next = document.createElement('a');
                next.className = 'tourjs-next-step';
                next.setAttribute('href', '#');
                next.addEventListener('click', function (event) {
                    event.stopPropagation();
                    step.hide();
                    step.next.render();
                    step.next.render();
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
                    step.hide();
                    step.previous.render();
                    step.previous.render();
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

    function buildID() {
        return 'tourjs-' + ID_COUNT++;
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
        // TODO: Make the URL configurable
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
        var svg, options, vector;

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

        this.id = buildID();
        this.options = options || {};
    }

    Hint.prototype = {

        render: function render() {

            if (!this.node) {
                this.node = document.createElement('div');
                this.node.id = this.id;
                this._renderTooltip();
                this._renderShape();

                // TODO: Make sure to un-subscribe to the event
                window.addEventListener('resize', function () {
                    this._setPosition();
                }.bind(this));
            }

            this.node.className = 'tourjs-hint';
            this.node.classList.add('tourjs-' + this.options.position);
            this.node.classList.add('tourjs-' + this.options.type);

            this._setPosition();

            return this.node;
        },

        _setPosition: function _setPosition() {
            var margin = 5,
                targetRect = getClientRect(document.querySelector(this.options.target)),
                rect = getClientRect(this.node);

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

        _renderDescription: function _renderDescription(parent) {
            var desc;
            if (this.options.description) {
                desc = document.createElement('div');
                desc.className = 'tourjs-description';
                desc.innerHTML = this.options.description;
                parent.appendChild(desc);
            }
        },

        _renderShape: function _renderShape() {
            var arrow = renderArrow(this.options.position);
            this.node.appendChild(arrow);
        },

        _renderTitle: function _renderTitle(parent) {
            var title = document.createElement('h2');
            title.innerText = this.options.title;
            parent.appendChild(title);
        },

        _renderTooltip: function _renderTooltip() {
            var tooltip = document.createElement('div');
            tooltip.className = 'tourjs-tooltip';
            this._renderTitle(tooltip);
            this._renderDescription(tooltip);
            this.node.appendChild(tooltip);
        }
    };

    function Step(config) {
        if (!(this instanceof Step)) {
            return new Step(config);
        }

        this.id = buildID();
        this.options = config.options || {};
        this.hints = [];

        config.hints.forEach(function (options) {
            this.hints.push(new Hint(options));
        }.bind(this));
    }

    Step.prototype = {
        render: function render(callback) {

            var asyncRender = function () {

                if (!this.node) {
                    this.node = document.createElement('div');
                    this.node.id = this.id;
                    addPagination(this);
                } else {
                    this.node.style.display = 'block';
                }

                this.hints.forEach(function (hint) {
                    hint.render();
                    this.node.appendChild(hint.node);
                }.bind(this));

                this.node.className = 'tourjs-step';

                if (!document.getElementById(this.id)) {
                    document.body.appendChild(this.node);
                }

                if (callback) {
                    callback(this);
                }

            }.bind(this);

            if (typeof this.options.before === 'function') {
                this.options.before(asyncRender);
            } else {
                asyncRender();
            }

            if (typeof this.options.after === 'function') {
                this.options.after();
            }
        },
        hide: function () {
            this.node.style.display = 'none';
        }
    };

    function Tour(config) {
        var step, previous;

        if (!(this instanceof Tour)) {
            return new Tour(config);
        }

        this.id = buildID();
        this.options = config.options || {};
        this.steps = [];

        config.steps.forEach(function (stepConfig) {
            step = new Step(stepConfig);
            if (previous) {
                step.previous = previous;
                previous.next = step;
            }
            this.steps.push(step);
            previous = step;
        }.bind(this));
    }

    Tour.prototype = {
        render: function render() {
            if (!this.node) {
                this.node = document.createElement('div');
                this.node.id = this.id;
                this._frag = document.createDocumentFragment();
                this._frag.appendChild(this.node);
            }

            this.node.className = 'tourjs';
            renderOverlay();

            fetchSVG({
                svg: this.options.svg,
                success: function () {
                    this._renderStep(0);
                    if (!document.getElementById(this.id)) {
                        document.body.appendChild(this._frag);
                    }
                }.bind(this)
            });

            return this.node;
        },

        _renderStep: function _renderStep(i) {
            var step = this.steps[i];
            step.render(function (step) {
                this.node.appendChild(step.node);
            }.bind(this));
        }

    };

    return Tour;

}));

