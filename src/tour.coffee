((root, factory) ->
  if typeof define is 'function' and define.amd
    define [], factory
  else if typeof exports is 'object'
    module.exports = factory()
  else
    root.Tour = factory()
  return
) this, ->

  ###
  # TODOS:
  # ===========================================================================
  # * Add `shouldLoad` to hints
  # * Add click event for highlights
  # * Passthrough clicks on highlights (optional)
  ###

  'use strict'

  ARROW_SIZE = 65
  DEFAULT_MARGIN = 10
  VECTORS = null
  XMLNS = 'http://www.w3.org/2000/svg'

  PATHS =

    arrow:
      '''
      M135.4,68.7c1.1,1.3,1.5,2.9,1.3,4.6c-0.2,1.7-1,3.1-2.4,4.2
      c-1.3,1.1-2.9,1.5-4.6,1.3c-1.7-0.2-3.1-1-4.2-2.4c-7.8-10.1-18.4-18.3-19-28.3c2.5,40.3,1.7,98.2-5.1,142.7
      c-1.1,1.5-2.5,2.3-4.2,2.5c-1.7,0.2-3.3-0.2-4.6-1.3c-1.4-1-2.2-2.4-2.4-4.1c-0.2-1.7,1.2-4.5,1.2-4.5c6.2-31.2,5.9-96.1,2.5-135.8
      c-4.7,9.8-11.4,18.7-20.1,26.7c-1.3,1.2-2.8,1.7-4.5,1.7c-1.7-0.1-3.2-0.7-4.4-2c-1.2-1.3-1.7-2.8-1.7-4.5c0.1-1.8,0.7-3.2,2-4.4
      c11.2-10.3,18.7-22.7,22.7-37c0.6-2.5,1.3-5.7,2.1-9.7l-0.4-2.2c-0.2-1.5,0-2.9,0.4-4c0.8-2.9,2.7-4.7,5.7-5.3
      c3.1-0.7,5.6,0.4,7.5,3.1c0.7,1,1.2,2.3,1.4,4c0.1,0.2,0.2,0.7,0.3,1.4l0.1,0.8c0.1,0.1,0.1,0.2,0.1,0.4c1.2,2.6,4.2,8.8,9,18.6
      C119,45.6,126.1,56.8,135.4,68.7L135.4,68.7z
      '''

    chevronLeft:
      '''
      M3.8,6.3l4.1,4.1c0.2,0.2,0.2,0.5,0,0.7l-1.3,1.3c-0.2,0.2-0.5,0.2-0.7,0L0.1,6.6C0,6.5,0,6.1,0.1,5.9
      l5.8-5.8C6.1,0,6.5,0,6.6,0.1l1.3,1.3c0.2,0.2,0.2,0.5,0,0.7L3.8,6.3z
      '''

    chevronRight:
      '''
      M2.1,12.4c-0.2,0.2-0.5,0.2-0.7,0l-1.3-1.3C0,11,0,10.6,0.1,10.4l4.1-4.1L0.1,2.1C0,2,0,1.6,0.1,1.4
      l1.3-1.3C1.6,0,2,0,2.1,0.1l5.8,5.8c0.2,0.2,0.2,0.5,0,0.7L2.1,12.4z
      '''

    closeButton:
      '''
      M8,15.7c-4.3,0-7.7-3.5-7.7-7.7S3.7,0.3,8,0.3s7.7,3.5,7.7,7.7S12.3,15.7,8,15.7z M11.6,9.8L9.8,8l1.8-1.8
      c0.1-0.1,0.2-0.3,0.2-0.5c0-0.2-0.1-0.3-0.2-0.5l-0.9-0.9c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.3,0.1-0.5,0.2L8,6.2L6.2,4.4
      C6.1,4.2,5.9,4.2,5.7,4.2c-0.2,0-0.3,0.1-0.5,0.2L4.4,5.3C4.2,5.4,4.2,5.6,4.2,5.7c0,0.2,0.1,0.3,0.2,0.5L6.2,8L4.4,9.8
      c-0.1,0.1-0.2,0.3-0.2,0.5c0,0.2,0.1,0.3,0.2,0.5l0.9,0.9c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.3-0.1,0.5-0.2L8,9.8l1.8,1.8
      c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.3-0.1,0.5-0.2l0.9-0.9c0.1-0.1,0.2-0.3,0.2-0.5C11.8,10.1,11.8,9.9,11.6,9.8z
      '''

    curvedArrow:
      '''
      M135.4,68.7c1.1,1.3,1.5,2.9,1.3,4.6c-0.2,1.7-1,3.1-2.4,4.2
      c-1.3,1.1-2.9,1.5-4.6,1.3c-1.7-0.2-3.1-1-4.2-2.4c-7.8-10.1-15.8-18.8-19-28.3c15.1,44.8-0.2,112.9-32.1,142.7
      c-1.1,1.5-2.5,2.3-4.2,2.5c-1.7,0.2-3.3-0.2-4.6-1.3c-1.4-1-2.2-2.4-2.4-4.1c-0.2-1.7,1.2-4.5,1.2-4.5
      C94.9,155.9,109.7,86.1,94,47.5c-4.7,9.8-11.4,18.7-20.1,26.7c-1.3,1.2-2.8,1.7-4.5,1.7c-1.7-0.1-3.2-0.7-4.4-2
      c-1.2-1.3-1.7-2.8-1.7-4.5c0.1-1.8,0.7-3.2,2-4.4c11.2-10.3,18.7-22.7,22.7-37c0.6-2.5,1.3-5.7,2.1-9.7l-0.4-2.2
      c-0.2-1.5,0-2.9,0.4-4c0.8-2.9,2.7-4.7,5.7-5.3c3.1-0.7,5.6,0.4,7.5,3.1c0.7,1,1.2,2.3,1.4,4c0.1,0.2,0.2,0.7,0.3,1.4l0.1,0.8
      c0.1,0.1,0.1,0.2,0.1,0.4c1.2,2.6,4.2,8.8,9,18.6C119,45.6,126.1,56.8,135.4,68.7L135.4,68.7z
      '''

    line:
      '''
      M333,2.4c1.5,0.5,2.3,1.2,2.5,2.1c0.2,0.9,0.1,3.5-5.4,3.5
      C320.5,6.2,35.3,4.5,5.5,8.1C3.2,8.3,0.8,6.8,0.2,5.3c-0.7-1.6,0.4-2.8,3.1-3.7c1-0.3,2.3-0.6,4-0.7c0.2-0.1,0.7-0.1,1.4-0.1
      l0.8-0.1c0.1,0,0.2,0,0.4,0C12.4,0,288.5-1,333,2.4z
      '''

  ###
  # Adds drop shadow filter to an SVG image
  ###
  addFilter = (svg) ->
    id = "tourjs-filter-#{new Date().getTime()}"
    defs = document.createElementNS XMLNS, 'defs'

    filter = document.createElementNS XMLNS, 'filter'
    filter.setAttributeNS null, 'id', id
    filter.setAttributeNS null, 'height', '200%'
    filter.setAttributeNS null, 'width', '200%'
    filter.setAttributeNS null, 'x', '-50%'
    filter.setAttributeNS null, 'y', '-50%'

    offset = document.createElementNS XMLNS, 'feOffset'
    offset.setAttributeNS null, 'dx', 1
    offset.setAttributeNS null, 'dy', 1
    offset.setAttributeNS null, 'in', 'SourceAlpha'
    offset.setAttributeNS null, 'result', 'ShadowOffsetOuter'

    blur = document.createElementNS XMLNS, 'feGaussianBlur'
    blur.setAttributeNS null, 'in', 'ShadowOffsetOuter'
    blur.setAttributeNS null, 'stdDeviation', 3
    blur.setAttributeNS null, 'result', 'ShadowBlurOuter'

    blend = document.createElementNS XMLNS, 'feBlend'
    blend.setAttributeNS null, 'in', 'SourceGraphic'
    blend.setAttributeNS null, 'in2', 'ShadowBlurOuter'
    blend.setAttributeNS null, 'mode', 'normal'

    filter.appendChild offset
    filter.appendChild blur
    filter.appendChild blend

    defs.appendChild filter

    svg.appendChild defs
    svg.setAttribute 'style', "filter: url(\##{id});"

  ###
  # Assigns properties from one or more objects into another one
  #
  # Example:
  #
  #   var a = { a: 'a'},
  #       b = { b: 'b'},
  #       c = { c: 'c'};
  #
  #   assign({}, a, b, c); // => { a: 'a', b: 'b', c: 'c' }
  #
  ###
  assign = (target, sources...) ->

    if target is 'undefined' or target is null
      throw new TypeError 'Cannot convert argument to object'

    dest = Object target

    for source in sources when typeof source isnt 'undefined' and source isnt null
      for key, val of source
        if source.hasOwnProperty key
          dest[key] = val

    dest

  ###
  # Builds an unique id for all DOM elements
  ###
  buildID = do (idndx = 0) ->
    (prefix) -> "tourjs-#{if prefix then "#{prefix}-" else ''}#{++idndx}"

  getWindowSize = ->
    height: window.innerHeight or document.documentElement.clientHeight
    width: window.innerWidth or document.documentElement.clientWidth

  ###
  # Checks if parameter is a function
  ###
  isFunction = (f) -> typeof f is 'function'

  ###
  # Logs messages in the console when available (IE)
  ###
  log = (message, type = 'warn') ->
    console[type](message) if console and console[type]

  ###
  # Renders SVGs in the DOM
  ###
  renderSVG = (selector, options = {}) ->
    vector = VECTORS.querySelector(selector).cloneNode true
    vector.setAttribute 'class', 'tourjs-shape'
    if options.transform
      vector.setAttribute 'transform', options.transform
    vector

  ###
  # Waits for DOM elements to be present
  ###
  waitFor = (selector, timeout = 10000, done) ->

    if typeof timeout is 'function'
      done = timeout
      timeout = 10000

    found = document.querySelector(selector)?
    error = false

    if found
      done found
      return

    setTimeout (->
      found = document.querySelector(selector)?
      error = true unless found
    ), timeout

    wait = ->
      found = document.querySelector(selector)?
      unless found or error
        setTimeout wait, 1
      else
        done(found)

    wait()

  class Highlight

    constructor: (@state, @hint) ->

      @id = buildID 'highlight'

    render: (mask) =>
      return if @hint.config.highlight is false

      waitFor @hint.config.highlight or @hint.config.target, @hint.config.timeout, (exist) =>

        unless exist
          if @hint.config.highlight
            log "[Tour.js] DOM selector didn't match any elements: #{@hint.config.highlight}"

        else
          unless @node
            @node = document.createElementNS XMLNS, 'rect'
            @node.id = @id
            @node.setAttributeNS null, 'style', 'stroke: none; fill: #000'
            mask.appendChild @node

          window.addEventListener 'resize', @_setPosition
          window.addEventListener 'scroll', @_setPosition

          # The timeout is to prevent setting the position
          # before the node is fully rendered
          setTimeout @_setPosition

    unload: =>
      if @node
        window.removeEventListener 'resize', @_setPosition
        window.removeEventListener 'scroll', @_setPosition

    _setPosition: =>
      if @node
        target = document.querySelector @hint.config.highlight or @hint.config.target
        rect = target.getBoundingClientRect()
        padding = @hint.config.padding or 0

        @node.setAttributeNS null, 'height', rect.height + padding * 2
        @node.setAttributeNS null, 'width', rect.width + padding * 2
        @node.setAttributeNS null, 'x', rect.left - padding
        @node.setAttributeNS null, 'y', rect.top - padding

  class Hint

    constructor: (@state, @step, @config = {}) ->

      @id = buildID 'hint'

    render: =>

      waitFor @config.target, @config.timeout, (exist) =>

        unless exist
          log "[Tour.js] DOM selector didn't match any elements: #{@config.target}"

        else
          unless @node
            @node = document.createElement 'div'
            @node.id = @id

            className = [
              'tourjs-hint'
              "tourjs-#{@config.position}#{if @config.inverted then '-inverted' else ''}"
            ]

            @node.className = className.join(' ')

            if @config.width
              width = "#{@config.width}px"
              @node.style.maxWidth = width
              @node.style.width = width

            # avoid flicker by positioning off the page
            @node.style.top = '-9999px'
            @node.style.left = '-9999px'

            @_renderTooltip()
            @_renderShape()

            @step.node.appendChild @node

            @node.addEventListener 'click', @_onClick

          window.addEventListener 'resize', @_setPosition
          window.addEventListener 'scroll', @_setPosition

          # The timeout is to prevent setting the position
          # before the node is fully rendered
          setTimeout @_setPosition

    unload: =>
      if @node
        window.removeEventListener 'resize', @_setPosition
        window.removeEventListener 'scroll', @_setPosition

    _onClick: (event) -> event.stopPropagation()

    _renderDescription: (parent) =>
      if @config.description
        desc = document.createElement 'div'
        desc.className = 'tourjs-description'
        desc.innerHTML = @config.description
        parent.appendChild desc

    _renderShape: =>
      switch @config.position

        when 'top'
          path = PATHS['arrow']
          transform = 'rotate(180, 100, 100)'

        when 'top-right'
          path = PATHS['curvedArrow']
          transform = 'rotate(-135, 100, 100)'

        when 'right'
          path = PATHS['arrow']
          transform = 'rotate(-90, 100, 100)'

        when 'bottom-right'
          path = PATHS['curvedArrow']
          transform = 'rotate(-45, 100, 100) scale(-1, 1) translate(-200, 0)'

        when 'bottom'
          path = PATHS['arrow']
          transform = null

        when 'bottom-left'
          path = PATHS['curvedArrow']
          transform = 'rotate(45, 100, 100)'

        when 'left'
          path = PATHS['arrow']
          transform = 'rotate(90, 100, 100)'

        when 'top-left'
          path = PATHS['curvedArrow']
          transform = 'rotate(135, 100, 100) scale(-1, 1) translate(-200, 0)'

      shape = document.createElementNS XMLNS, 'path'
      shape.setAttributeNS null, 'fill', '#FFF'
      shape.setAttributeNS null, 'd', path
      shape.setAttributeNS null, 'transform', transform if transform

      svg = document.createElementNS XMLNS, 'svg'
      svg.setAttributeNS null, 'class', "tourjs-shape tourjs-#{@config.position}"
      svg.setAttributeNS null, 'viewBox', '0 0 200 200'
      svg.appendChild shape

      addFilter svg

      @node.appendChild svg

    _renderTitle: (parent) =>
      title = document.createElement 'h2'
      title.innerHTML = @config.title
      parent.appendChild title

    _renderTooltip: =>
      tooltip = document.createElement 'div'
      tooltip.className = 'tourjs-tooltip'
      if @config.width
        width = "#{@config.width}px"
        @node.style.maxWidth = width
        @node.style.width = width
      @_renderTitle tooltip
      @_renderDescription tooltip
      @node.appendChild tooltip

    _setPosition: =>
      rect = @node.getBoundingClientRect()
      targetRect = document.querySelector(@config.target).getBoundingClientRect()

      switch @config.position

        when 'top-left'
          @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

        when 'top'
          @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left + (targetRect.width / 2) - rect.width / 2}px"

        when 'top-right'
          @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

        when 'right'
          if targetRect.height > rect.height
            @node.style.top = "#{targetRect.top + ((targetRect.height - rect.height) / 2)}px"
          else
            @node.style.top = "#{targetRect.top - ((rect.height - targetRect.height) / 2)}px"
          @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

        when 'bottom-right'
          @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

        when 'bottom'
          @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left + (targetRect.width / 2) - rect.width / 2}px"

        when 'bottom-left'
          @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
          @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

        when 'left'
          if targetRect.height > rect.height
            @node.style.top = "#{targetRect.top + ((targetRect.height - rect.height) / 2)}px"
          else
            @node.style.top = "#{targetRect.top - ((rect.height - targetRect.height) / 2)}px"
          @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

  class Overlay

    constructor: (@state, @step, @config = {}) -> @id = buildID 'overlay'

    render: =>

      unless @node
        @node = document.createElementNS XMLNS, 'svg'
        @node.setAttributeNS null, 'id', @id
        @node.setAttributeNS null, 'class', 'tourjs-overlay'
        @node.setAttributeNS null, 'height', '100%'
        @node.setAttributeNS null, 'width', '100%'
        @node.setAttributeNS null, 'x', 0
        @node.setAttributeNS null, 'y', 0

        mask = document.createElementNS XMLNS, 'mask'
        mask.setAttributeNS null, 'id', "#{@id}-mask"
        mask.setAttributeNS null, 'height', '100%'
        mask.setAttributeNS null, 'width', '100%'
        mask.setAttributeNS null, 'x', 0
        mask.setAttributeNS null, 'y', 0

        # This rect must be rendered first inside the mask
        # (before the highlights) otherwise it won't work
        rect = document.createElementNS XMLNS, 'rect'
        rect.setAttributeNS null, 'height', '100%'
        rect.setAttributeNS null, 'style', 'stroke: none; fill: #FFF;'
        rect.setAttributeNS null, 'width', '100%'
        rect.setAttributeNS null, 'x', 0
        rect.setAttributeNS null, 'y', 0
        mask.appendChild rect

        @highlights = []
        for hint in @step.hints
          h = new Highlight(@state, hint)
          @highlights.push h
          h.render mask

        defs = document.createElementNS XMLNS, 'defs'
        defs.appendChild mask
        @node.appendChild defs

        opacity = @config.opacity or '0.8'
        rect = document.createElementNS(XMLNS, 'rect')
        rect.setAttributeNS null, 'x', 0
        rect.setAttributeNS null, 'y', 0
        rect.setAttributeNS null, 'height', '100%'
        rect.setAttributeNS null, 'width', '100%'
        rect.setAttributeNS null, 'style', "stroke:none;fill:rgba(0,0,0,#{opacity}); mask: url(##{@id}-mask);"
        @node.appendChild rect

        @node.addEventListener 'click', @onClick

        @step.node.appendChild @node

    unload: =>
      highlight.unload() for highlight in @highlights
      @node.removeEventListener 'click', @onClick if @node

    onClick: (event) -> event.stopPropagation()


  class Overview

    constructor: (@state, @step, @config = {}) ->

      @id = buildID 'overview'

    render: =>

      unless @node
        @node = document.createElement 'div'
        @node.id = @id
        @node.className = 'tourjs-overview'

        if @config.width
          width = "#{@config.width}px"
          @node.style.maxWidth = width
          @node.style.width = width

        # avoid flicker by positioning off the page
        @node.style.top = '-9999px'
        @node.style.left = '-9999px'

        title = document.createElement 'h1'
        title.innerHTML = @config.title
        title.className = 'tourjs-overview-title'
        @node.appendChild title

        if @config.description
          shape = document.createElementNS XMLNS, 'path'
          shape.setAttributeNS null, 'fill', '#FFF'
          shape.setAttributeNS null, 'd', PATHS['line']

          svg = document.createElementNS XMLNS, 'svg'
          svg.setAttributeNS null, 'viewBox', '0 0 335.5 8.2'
          svg.appendChild shape

          line = document.createElement 'div'
          line.className = 'tourjs-overview-line'
          line.appendChild svg

          addFilter svg

          @node.appendChild line

          description = document.createElement 'div'
          description.className = 'tourjs-overview-description'
          description.innerHTML = @config.description
          @node.appendChild description

        @step.node.appendChild @node

      # The timeout is to prevent setting the position
      # before the node is fully rendered
      setTimeout @_setPosition

      window.addEventListener 'resize', @_setPosition
      window.addEventListener 'scroll', @_setPosition

    unload: =>
      if @node
        window.removeEventListener 'resize', @_setPosition
        window.removeEventListener 'scroll', @_setPosition

    _setPosition: =>
      margin = 100
      rect = @node.getBoundingClientRect()
      wsize = getWindowSize()

      switch @config.position

        when 'top'
          @node.style.top = "#{margin}px"
          @node.style.left = "#{wsize.width / 2 - rect.width / 2}px"

        when 'top-right'
          @node.style.top = "#{margin}px"
          @node.style.right = "#{margin}px"
          @node.style.left = null

        when 'right'
          @node.style.top = "#{wsize.height / 2 - rect.height / 2}px"
          @node.style.right = "#{margin}px"
          @node.style.left = null

        when 'bottom-right'
          @node.style.top = null
          @node.style.right = "#{margin}px"
          @node.style.bottom = "#{margin * 1.5}px"
          @node.style.left = null

        when 'bottom'
          @node.style.top = null
          @node.style.bottom = "#{margin * 1.5}px"
          @node.style.left = "#{wsize.width / 2 - rect.width / 2}px"

        when 'bottom-left'
          @node.style.top = null
          @node.style.bottom = "#{margin * 1.5}px"
          @node.style.left = "#{margin}px"

        when 'left'
          @node.style.top = "#{wsize.height / 2 - rect.height / 2}px"
          @node.style.left = "#{margin}px"

        when 'top-left'
          @node.style.top = "#{margin}px"
          @node.style.left = "#{margin}px"

        else
          @node.style.top = "#{wsize.height / 2 - rect.height / 2}px"
          @node.style.left = "#{wsize.width / 2 - rect.width / 2}px"

  class Step

    constructor: (@state, @tour, @config = {}) ->
      @id = buildID 'step'
      @hints = (new Hint(@state, this, config) for config in @config.hints or [])

    load: =>

      load = =>
        unless @node
          @node = document.createElement 'div'
          @node.id = @id
          @node.className = 'tourjs-step'

          @tour.node.appendChild @node

        @_renderOverview()
        @_renderHints()
        @_renderOverlay()
        @_renderPagination()

        @node.style.display = 'block'

        if @state.step and @state.step.index isnt @index
          @state.step.unload()

        @state.step = this
        @state.started = true unless @state.started
        @state.finished = true unless @next

        # calls `load` callback if provided
        @config.load @state if isFunction(@config.load)

      @shouldLoad (should) ->
        return  if should if false
        load()

    shouldLoad: (callback) =>
      if isFunction(@config.beforeLoad)
        @config.beforeLoad @state, callback
      else
        callback true

    unload: =>
      unload = =>
        if @node
          @node.style.display = 'none'
          hint.unload() for hint in @hints
          @overview.unload() if @overview

        @config.unload @state if isFunction(@config.unload)

      if isFunction(@config.beforeUnload)
        @config.beforeUnload @state, unload
      else
        unload()

    _renderHints: =>
      hint.render() for hint in @hints

    _renderOverlay: =>
      @overlay ?= new Overlay(@state, this, @config.overlay or {})
      @overlay.render()

    _renderPagination: =>
      return unless @previous or @next

      shape = document.createElementNS XMLNS, 'path'
      shape.setAttributeNS null, 'fill', '#FFF'
      shape.setAttributeNS null, 'd', PATHS['chevronLeft']

      svg = document.createElementNS XMLNS, 'svg'
      svg.setAttributeNS null, 'viewBox', '0 0 8.1 12.6'
      svg.appendChild shape

      previous = document.createElement 'div'
      previous.className = 'tourjs-previous-step'
      previous.appendChild svg

      if @previous
        previous.addEventListener 'click', (event) =>
          event.preventDefault()
          event.stopPropagation()
          @previous.load()
      else
        previous.className += ' tourjs-step-disabled'

      wrapper = document.createElement 'div'
      wrapper.className = 'tourjs-pagination-wrapper'
      wrapper.appendChild previous

      stepCount = document.createElement 'div'
      stepCount.className = 'tourjs-step-count'
      stepCount.innerHTML = "Step #{@index} of #{@state.steps.length}"

      wrapper.appendChild stepCount

      shape = document.createElementNS XMLNS, 'path'
      shape.setAttributeNS null, 'fill', '#FFF'
      shape.setAttributeNS null, 'd', PATHS['chevronRight']

      svg = document.createElementNS XMLNS, 'svg'
      svg.setAttributeNS null, 'viewBox', '0 0 8.1 12.6'
      svg.appendChild shape

      next = document.createElement 'div'
      next.className = 'tourjs-next-step'
      next.appendChild svg

      if @next
        next.addEventListener 'click', (event) =>
          event.preventDefault()
          event.stopPropagation()
          @next.load()
      else
        next.className += ' tourjs-step-disabled'

      wrapper.appendChild next

      pagination = document.createElement 'div'
      pagination.className = 'tourjs-pagination'
      pagination.appendChild wrapper

      @node.appendChild pagination

    _renderOverview: =>
      if @config.overview
        @overview = new Overview(@state, this, @config.overview) unless @overview
        @overview.render @node, @state

  class Tour

    @waitFor: waitFor

    constructor: (@config = {}) ->

      @id = buildID()

      @state =
        tour: this
        started: false
        finished: false

    load: =>
      load = =>
        unless @node
          @node = document.createElement 'div'
          @node.id = @id
          @node.className = 'tourjs'

          document.body.appendChild @node

        @_onLoad()

      @shouldLoad (should)=>
        return if should is false

        @_initSteps =>

          # Don't render if no steps are available
          return if @state.steps.length is 0

          if isFunction @config.beforeLoad
            @config.beforeLoad @state, load
          else
            load()

    shouldLoad: (callback) =>
      if isFunction @config.shouldLoad
        @config.shouldLoad(callback)
      else
        callback true

    unload: =>
      unload = =>
        if @node
          @node.style.display = 'none'

        step.unload() for step in @state.steps

        @config.unload(@state) if isFunction @config.unload

      if isFunction @config.beforeUnload
        @config.beforeUnload @state, unload
      else
        unload()


    _initSteps: (callback) =>

      return callback() if @node

      waitCount = @config.steps.length

      @state.steps = []
      allSteps = []

      for def in @config.steps
        def.config = {} unless def.config
        assign def, overlay: @config.overlay
        step = new Step(@state, this, def)
        allSteps.push step

        if isFunction step.config.shouldLoad
          do (step) ->
            step.config.shouldLoad (show) ->
              step.show = show or false
              waitCount--
        else
          step.show = true
          waitCount--

      i = 1
      previous = null

      # wait for step callbacks
      wait = =>
        if waitCount
          setTimeout wait, 1

        else
          for step in allSteps
            if step.show
              step.index = i
              i++

              if previous
                step.previous = previous
                previous.next = step

              @state.steps.push step
              previous = step

          # initialization of steps is done
          callback()

      wait()

    _onKeyUp: (event) => @unload() if event.keyCode is 27

    _onLoad: =>
      document.addEventListener 'keyup', this._onKeyUp
      @_renderCloseBtn()
      @_renderFirstStep()

      @state.finished = false
      @node.style.display = 'block'

      # calls `load` callback if provided
      @config.load(@state) if isFunction @config.load

    _renderCloseBtn: =>
      shape = document.createElementNS XMLNS, 'path'
      shape.setAttributeNS null, 'fill', '#FFF'
      shape.setAttributeNS null, 'd', PATHS['closeButton']

      svg = document.createElementNS XMLNS, 'svg'
      svg.setAttributeNS null, 'class', 'tourjs-close'
      svg.setAttributeNS null, 'viewBox', '0 0 16 16'
      svg.appendChild shape
      svg.addEventListener 'click', @unload
      svg.style.display = 'block'

      addFilter svg

      @node.appendChild svg

    _renderFirstStep: => @_renderStep 1

    _renderStep: (index) =>
      for step in @state.steps
        if step.index is index
          step.load(@node, @state)
        else
          step.unload()

  # module export
  Tour

