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
  # * Add `shouldShow` to hints
  # * Add click event for highlights
  # * Passthrough clicks on highlights (optional)
  ###

  'use strict'

  DEFAULT_MARGIN = 10
  VECTORS = null
  XMLNS = 'http://www.w3.org/2000/svg'

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
    offset.setAttributeNS null, 'in', 'SourceGraphic'
    offset.setAttributeNS null, 'result', 'ShadowOffsetOuter'

    blur = document.createElementNS XMLNS, 'feGaussianBlur'
    blur.setAttributeNS null, 'in', 'ShadowOffsetOuter'
    blur.setAttributeNS null, 'stdDeviation', 2
    blur.setAttributeNS null, 'result', 'ShadowBlurOuter'

    matrix = document.createElementNS XMLNS, 'feColorMatrix'
    matrix.setAttributeNS null, 'values', '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.3 0'
    matrix.setAttributeNS null, 'in', 'ShadowBlurOuter'
    matrix.setAttributeNS null, 'result', 'ShadowMatrixOuter'

    blend = document.createElementNS XMLNS, 'feBlend'
    blend.setAttributeNS null, 'in', 'ShadowMatrixOuter'
    blend.setAttributeNS null, 'in2', 'SourceGraphic'
    blend.setAttributeNS null, 'mode', 'normal'

    filter.appendChild offset
    filter.appendChild blur
    filter.appendChild matrix
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

  ###
  # Fetches SVGs symbols and appends them into the DOM
  ###
  fetchSVG = (options = {}) ->
    file = options.svg or 'svg/defs.svg'
    req = new XMLHttpRequest()
    render = ->
      if req.readyState is 4 and req.status is 200
        VECTORS = document.createElement 'div'
        VECTORS.innerHTML = req.responseText
        options.success() if options.success
      else if req.status > 400
        log "[Tour.js] Couldn\'t load SVG definitions file: #{file}"
    req.onreadystatechange = render
    req.open 'GET', file, true
    req.send()

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
  waitFor = (selector, timeout = 500, done) ->
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

    constructor: (@state, @config = {}) ->

      @id = buildID 'highlight'

    render: (parent) =>
      return if @config.highlight is false

      waitFor @config.highlight or @config.target, @config.timeout, (exist) =>

        unless exist
          if @config.highlight
            log "[Tour.js] DOM selector didn't match any elements: #{@config.highlight}"

        else
          unless @node
            @node = document.createElementNS XMLNS, 'rect'
            @node.id = @id
            @node.setAttributeNS null, 'style', 'stroke: none; fill: #000'
            parent.appendChild @node

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
        target = document.querySelector @config.highlight or @config.target
        rect = target.getBoundingClientRect()
        padding = @config.padding or 0

        @node.setAttributeNS null, 'height', rect.height + padding * 2
        @node.setAttributeNS null, 'width', rect.width + padding * 2
        @node.setAttributeNS null, 'x', rect.left - padding
        @node.setAttributeNS null, 'y', rect.top - padding

  class Hint

    constructor: (@state, @config = {}, @step) ->

      @id = buildID 'hint'

    render: (parent) =>

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
              "tourjs-#{@config.type}"
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

            parent.appendChild @node

          window.addEventListener 'resize', @_setPosition
          window.addEventListener 'scroll', @_setPosition

          # The timeout is to prevent setting the position
          # before the node is fully rendered
          setTimeout @_setPosition

    unload: =>
      if @node
        window.removeEventListener 'resize', @_setPosition
        window.removeEventListener 'scroll', @_setPosition
      return

    _renderDescription: (parent) =>
      if @config.description
        desc = document.createElement 'div'
        desc.className = 'tourjs-description'
        desc.innerHTML = @config.description
        parent.appendChild desc

    _renderShape: =>
      id = [
        '#tourjs-symbol'
        @config.type
        @config.position
      ]
      id.push 'inverted' if @config.inverted

      vector = renderSVG id.join '-'
      addFilter vector
      @node.appendChild vector

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

      switch @config.type

        when 'arrow'
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

        when 'curved-arrow'
          switch @config.position

            when 'top-left'
              @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
              @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

            when 'top'
              @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
              unless @config.inverted
                @node.style.left = "#{targetRect.left + (targetRect.width / 2) - 16}px"
              else
                @node.style.left = "#{targetRect.left + (targetRect.width / 2) - rect.width + 16}px"

            when 'top-right'
              @node.style.top = "#{targetRect.top - rect.height - DEFAULT_MARGIN}px"
              @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

            when 'right'
              if targetRect.height > rect.height
                unless @config.inverted
                  @node.style.top = "#{targetRect.top + targetRect.height / 2}px"
                else
                  @node.style.top = "#{targetRect.top + targetRect.height / 2 - rect.height + 16}px"
              else
                unless @config.inverted
                  @node.style.top = "#{targetRect.top + targetRect.height / 2 - 16}px"
                else
                  @node.style.top = "#{targetRect.top - targetRect.height / 2 - rect.height / 2 + 12}px"
              @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

            when 'bottom-right'
              @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
              @node.style.left = "#{targetRect.left + targetRect.width + DEFAULT_MARGIN}px"

            when 'bottom'
              @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
              unless @config.inverted
                @node.style.left = "#{targetRect.left + targetRect.width / 2 - rect.width + 16}px"
              else
                @node.style.left = "#{targetRect.left + targetRect.width / 2 - 16}px"

            when 'bottom-left'
              @node.style.top = "#{targetRect.bottom + DEFAULT_MARGIN}px"
              @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

            when 'left'
              if targetRect.height > rect.height
                unless @config.inverted
                  @node.style.top = "#{targetRect.top - (rect.height - targetRect.height / 2) + 16}px"
                else
                  @node.style.top = "#{targetRect.top + targetRect.height / 2 - 16}px"
              else
                unless @config.inverted
                  @node.style.top = "#{targetRect.top + targetRect.height / 2 - rect.height + 18}px"
                else
                  @node.style.top = "#{targetRect.top + targetRect.height / 2 - rect.height / 2 + 24}px"
              @node.style.left = "#{targetRect.left - rect.width - DEFAULT_MARGIN}px"

  class Overlay

    constructor: (@state, @config = {}) ->

      @id = buildID 'overlay'

    render: (parent, hints) =>

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
        for hint in hints
          h = new Highlight(@state, hint.config)
          @highlights.push h
          h.render mask, @state

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

        parent.appendChild @node

    unload: => h.unload() for h in @highlights if @node

  class Overview

    constructor: (@state, @config = {}) ->

      @id = buildID 'overview'

    render: (parent) =>

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
          line = document.createElement 'div'
          line.className = 'tourjs-overview-line'
          line.appendChild renderSVG '#tourjs-symbol-line'
          @node.appendChild line

          description = document.createElement 'div'
          description.className = 'tourjs-overview-description'
          description.innerHTML = @config.description
          @node.appendChild description

        parent.appendChild @node

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

    constructor: (@state, @config = {}) ->

      @id = buildID 'step'
      @_active = false

      @hints = (new Hint(@state, config) for config in @config.hints)
      @overlay = new Overlay(@state, @config.overlay or {})

    render: (parent) =>

      load = =>
        unless @node
          @node = document.createElement 'div'
          @node.id = @id
          @node.className = 'tourjs-step'

          parent.appendChild @node

        @_renderOverview @state
        @_renderHints @state
        @_renderOverlay @state
        @_renderPagination parent, @state

        @node.style.display = 'block'

        @state.step = this
        @state.started = true unless @state.started
        @state.finished = true unless @next

        # calls `load` callback if provided
        @config.load @state if isFunction(@config.load) and not @_active

        @_active = true

      # calls `beforeLoad` callback if provided
      if isFunction(@config.beforeLoad) and not @_active
        @config.beforeLoad @state, load

      # otherwise we start rendering the step immediately
      else load()

    unload: =>

      unload = =>
        if @node
          @node.style.display = 'none'
          hint.unload() for hint in @hints
          @overview.unload() if @overview

        if isFunction(@config.unload) and @_active
          @config.unload @state

        @_active = false

      if isFunction(@config.beforeUnload) and @_active
        @config.beforeUnload @state, unload
      else
        unload()

    _renderHints: =>
      hint.render(@node) for hint in @hints

    _renderOverlay: =>
      @overlay.render @node, @hints

    _renderPagination: (parent) =>
      return unless @previous or @next

      wrapper = document.createElement 'div'
      wrapper.className = 'tourjs-pagination-wrapper'

      previous = document.createElement 'div'
      previous.className = 'tourjs-previous-step'
      previous.appendChild renderSVG '#tourjs-symbol-chevron-left'

      if @previous
        previous.addEventListener 'click', (event) =>
          event.preventDefault()
          event.stopPropagation()
          @unload @state
          @previous.render parent
      else
        previous.className += ' tourjs-step-disabled'

      wrapper.appendChild previous

      stepCount = document.createElement 'div'
      stepCount.className = 'tourjs-step-count'
      stepCount.innerHTML = "Step #{@index} of #{@state.steps.length}"

      wrapper.appendChild stepCount

      next = document.createElement 'div'
      next.className = 'tourjs-next-step'
      next.appendChild renderSVG '#tourjs-symbol-chevron-right'

      if @next
        next.addEventListener 'click', (event) =>
          event.preventDefault()
          event.stopPropagation()
          @unload @state
          @next.render parent
      else
        next.className += ' tourjs-step-disabled'

      wrapper.appendChild next

      pagination = document.createElement 'div'
      pagination.className = 'tourjs-pagination'
      pagination.appendChild wrapper

      @node.appendChild pagination

    _renderOverview: =>
      if @config.overview
        @overview = new Overview(@state, @config.overview) unless @overview
        @overview.render @node, @state

  class Tour

    constructor: (@config = {}) ->

      @id = buildID()

      @state =
        tour: this
        started: false
        finished: false

    load: ->
      load = =>
        unless @node
          @node = document.createElement 'div'
          @node.id = @id
          @node.className = 'tourjs'

          document.body.appendChild @node

          fetchSVG
            svg: @config.svg
            success: @_onLoad

        @node.style.display = 'block'

      @_initSteps =>

        # Don't render if no steps are available
        return if @state.steps.length is 0

        if isFunction @config.beforeLoad
          @config.beforeLoad @state, load
        else
          load()

    unload: =>
      unload = =>
        if @node
          @node.style.display = 'none'
          @state.step.unload()
          @_unloadCloseBtn()

        @config.unload(@state) if isFunction @config.unload

      if isFunction @config.beforeUnload
        @config.beforeUnload @state, unload
      else
        unload()

    _unloadCloseBtn: =>
      btn = document.getElementById 'tourjs-close'

      if btn
        btn.style.display = 'none'
        btn.removeEventListener 'click', @unload

    _initSteps: (callback) =>

      waitCount = @config.steps.length

      @state.steps = []
      allSteps = []

      for def in @config.steps
        def.config = {} unless def.config
        assign def, overlay: @config.overlay
        step = new Step(@state, def)
        allSteps.push step

        if isFunction step.config.shouldShow
          do (step) ->
            step.config.shouldShow (show) ->
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

      # calls `load` callback if provided
      @config.load(@state) if isFunction @config.load

    _renderCloseBtn: =>
      btn = document.getElementById 'tourjs-close'

      unless btn
        btn = renderSVG '#tourjs-symbol-close'
        btn.id = 'tourjs-close'

        addFilter btn
        btn.addEventListener 'click', @unload

        # unhide the close button
        btn.style.display = 'block'

        @node.appendChild btn

    _renderFirstStep: => @_renderStep 1

    _renderStep: (index) =>
      for step in @state.steps
        if step.index is index
          step.render(@node, @state)
        else
          step.unload()

  # module export
  Tour

