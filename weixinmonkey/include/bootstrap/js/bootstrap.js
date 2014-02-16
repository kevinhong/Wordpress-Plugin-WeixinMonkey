/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    jQuery(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var jQuerythis    = jQuery(this)
    var selector = jQuerythis.attr('data-target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*jQuery)/, '') // strip for ie7
    }

    var jQueryparent = jQuery(selector)

    if (e) e.preventDefault()

    if (!jQueryparent.length) {
      jQueryparent = jQuerythis.hasClass('alert') ? jQuerythis : jQuerythis.parent()
    }

    jQueryparent.trigger(e = jQuery.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    jQueryparent.removeClass('in')

    function removeElement() {
      jQueryparent.trigger('closed.bs.alert').remove()
    }

    jQuery.support.transition && jQueryparent.hasClass('fade') ?
      jQueryparent
        .one(jQuery.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = jQuery.fn.alert

  jQuery.fn.alert = function (option) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.alert')

      if (!data) jQuerythis.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call(jQuerythis)
    })
  }

  jQuery.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  jQuery.fn.alert.noConflict = function () {
    jQuery.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  jQuery(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.jQueryelement = jQuery(element)
    this.options  = jQuery.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var jQueryel  = this.jQueryelement
    var val  = jQueryel.is('input') ? 'val' : 'html'
    var data = jQueryel.data()

    state = state + 'Text'

    if (!data.resetText) jQueryel.data('resetText', jQueryel[val]())

    jQueryel[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        jQueryel.addClass(d).attr(d, d) :
        jQueryel.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var jQueryparent = this.jQueryelement.closest('[data-toggle="buttons"]')
    var changed = true

    if (jQueryparent.length) {
      var jQueryinput = this.jQueryelement.find('input')
      if (jQueryinput.prop('type') === 'radio') {
        // see if clicking on current one
        if (jQueryinput.prop('checked') && this.jQueryelement.hasClass('active'))
          changed = false
        else
          jQueryparent.find('.active').removeClass('active')
      }
      if (changed) jQueryinput.prop('checked', !this.jQueryelement.hasClass('active')).trigger('change')
    }

    if (changed) this.jQueryelement.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = jQuery.fn.button

  jQuery.fn.button = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  jQuery.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  jQuery.fn.button.noConflict = function () {
    jQuery.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  jQuery(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var jQuerybtn = jQuery(e.target)
    if (!jQuerybtn.hasClass('btn')) jQuerybtn = jQuerybtn.closest('.btn')
    jQuerybtn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.jQueryelement    = jQuery(element)
    this.jQueryindicators = this.jQueryelement.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.jQueryactive     =
    this.jQueryitems      = null

    this.options.pause == 'hover' && this.jQueryelement
      .on('mouseenter', jQuery.proxy(this.pause, this))
      .on('mouseleave', jQuery.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval(jQuery.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.jQueryactive = this.jQueryelement.find('.item.active')
    this.jQueryitems  = this.jQueryactive.parent().children()

    return this.jQueryitems.index(this.jQueryactive)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.jQueryitems.length - 1) || pos < 0) return

    if (this.sliding)       return this.jQueryelement.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', jQuery(this.jQueryitems[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.jQueryelement.find('.next, .prev').length && jQuery.support.transition.end) {
      this.jQueryelement.trigger(jQuery.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var jQueryactive   = this.jQueryelement.find('.item.active')
    var jQuerynext     = next || jQueryactive[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!jQuerynext.length) {
      if (!this.options.wrap) return
      jQuerynext = this.jQueryelement.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = jQuery.Event('slide.bs.carousel', { relatedTarget: jQuerynext[0], direction: direction })

    if (jQuerynext.hasClass('active')) return

    if (this.jQueryindicators.length) {
      this.jQueryindicators.find('.active').removeClass('active')
      this.jQueryelement.one('slid.bs.carousel', function () {
        var jQuerynextIndicator = jQuery(that.jQueryindicators.children()[that.getActiveIndex()])
        jQuerynextIndicator && jQuerynextIndicator.addClass('active')
      })
    }

    if (jQuery.support.transition && this.jQueryelement.hasClass('slide')) {
      this.jQueryelement.trigger(e)
      if (e.isDefaultPrevented()) return
      jQuerynext.addClass(type)
      jQuerynext[0].offsetWidth // force reflow
      jQueryactive.addClass(direction)
      jQuerynext.addClass(direction)
      jQueryactive
        .one(jQuery.support.transition.end, function () {
          jQuerynext.removeClass([type, direction].join(' ')).addClass('active')
          jQueryactive.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.jQueryelement.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.jQueryelement.trigger(e)
      if (e.isDefaultPrevented()) return
      jQueryactive.removeClass('active')
      jQuerynext.addClass('active')
      this.sliding = false
      this.jQueryelement.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = jQuery.fn.carousel

  jQuery.fn.carousel = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.carousel')
      var options = jQuery.extend({}, Carousel.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) jQuerythis.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  jQuery.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  jQuery.fn.carousel.noConflict = function () {
    jQuery.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  jQuery(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var jQuerythis   = jQuery(this), href
    var jQuerytarget = jQuery(jQuerythis.attr('data-target') || (href = jQuerythis.attr('href')) && href.replace(/.*(?=#[^\s]+jQuery)/, '')) //strip for ie7
    var options = jQuery.extend({}, jQuerytarget.data(), jQuerythis.data())
    var slideIndex = jQuerythis.attr('data-slide-to')
    if (slideIndex) options.interval = false

    jQuerytarget.carousel(options)

    if (slideIndex = jQuerythis.attr('data-slide-to')) {
      jQuerytarget.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  jQuery(window).on('load', function () {
    jQuery('[data-ride="carousel"]').each(function () {
      var jQuerycarousel = jQuery(this)
      jQuerycarousel.carousel(jQuerycarousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    jQuery(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var jQuerythis = jQuery(this)

    if (jQuerythis.is('.disabled, :disabled')) return

    var jQueryparent  = getParent(jQuerythis)
    var isActive = jQueryparent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !jQueryparent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        jQuery('<div class="dropdown-backdrop"/>').insertAfter(jQuery(this)).on('click', clearMenus)
      }

      jQueryparent.trigger(e = jQuery.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      jQueryparent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      jQuerythis.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var jQuerythis = jQuery(this)

    e.preventDefault()
    e.stopPropagation()

    if (jQuerythis.is('.disabled, :disabled')) return

    var jQueryparent  = getParent(jQuerythis)
    var isActive = jQueryparent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) jQueryparent.find(toggle).focus()
      return jQuerythis.click()
    }

    var jQueryitems = jQuery('[role=menu] li:not(.divider):visible a', jQueryparent)

    if (!jQueryitems.length) return

    var index = jQueryitems.index(jQueryitems.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < jQueryitems.length - 1) index++                        // down
    if (!~index)                                      index=0

    jQueryitems.eq(index).focus()
  }

  function clearMenus() {
    jQuery(backdrop).remove()
    jQuery(toggle).each(function (e) {
      var jQueryparent = getParent(jQuery(this))
      if (!jQueryparent.hasClass('open')) return
      jQueryparent.trigger(e = jQuery.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      jQueryparent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent(jQuerythis) {
    var selector = jQuerythis.attr('data-target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*jQuery)/, '') //strip for ie7
    }

    var jQueryparent = selector && jQuery(selector)

    return jQueryparent && jQueryparent.length ? jQueryparent : jQuerythis.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = jQuery.fn.dropdown

  jQuery.fn.dropdown = function (option) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.dropdown')

      if (!data) jQuerythis.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call(jQuerythis)
    })
  }

  jQuery.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  jQuery.fn.dropdown.noConflict = function () {
    jQuery.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  jQuery(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.jQueryelement  = jQuery(element)
    this.jQuerybackdrop =
    this.isShown   = null

    if (this.options.remote) this.jQueryelement.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = jQuery.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.jQueryelement.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.jQueryelement.on('click.dismiss.modal', '[data-dismiss="modal"]', jQuery.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = jQuery.support.transition && that.jQueryelement.hasClass('fade')

      if (!that.jQueryelement.parent().length) {
        that.jQueryelement.appendTo(document.body) // don't move modals dom position
      }

      that.jQueryelement.show()

      if (transition) {
        that.jQueryelement[0].offsetWidth // force reflow
      }

      that.jQueryelement
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = jQuery.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.jQueryelement.find('.modal-dialog') // wait for modal to slide in
          .one(jQuery.support.transition.end, function () {
            that.jQueryelement.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.jQueryelement.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = jQuery.Event('hide.bs.modal')

    this.jQueryelement.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    jQuery(document).off('focusin.bs.modal')

    this.jQueryelement
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    jQuery.support.transition && this.jQueryelement.hasClass('fade') ?
      this.jQueryelement
        .one(jQuery.support.transition.end, jQuery.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    jQuery(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', jQuery.proxy(function (e) {
        if (this.jQueryelement[0] !== e.target && !this.jQueryelement.has(e.target).length) {
          this.jQueryelement.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.jQueryelement.on('keyup.dismiss.bs.modal', jQuery.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.jQueryelement.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.jQueryelement.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.jQueryelement.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.jQuerybackdrop && this.jQuerybackdrop.remove()
    this.jQuerybackdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.jQueryelement.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = jQuery.support.transition && animate

      this.jQuerybackdrop = jQuery('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.jQueryelement.on('click.dismiss.modal', jQuery.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.jQueryelement[0].focus.call(this.jQueryelement[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.jQuerybackdrop[0].offsetWidth // force reflow

      this.jQuerybackdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.jQuerybackdrop
          .one(jQuery.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.jQuerybackdrop) {
      this.jQuerybackdrop.removeClass('in')

      jQuery.support.transition && this.jQueryelement.hasClass('fade')?
        this.jQuerybackdrop
          .one(jQuery.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = jQuery.fn.modal

  jQuery.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.modal')
      var options = jQuery.extend({}, Modal.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)

      if (!data) jQuerythis.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  jQuery.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  jQuery.fn.modal.noConflict = function () {
    jQuery.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  jQuery(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var jQuerythis   = jQuery(this)
    var href    = jQuerythis.attr('href')
    var jQuerytarget = jQuery(jQuerythis.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+jQuery)/, ''))) //strip for ie7
    var option  = jQuerytarget.data('modal') ? 'toggle' : jQuery.extend({ remote: !/#/.test(href) && href }, jQuerytarget.data(), jQuerythis.data())

    e.preventDefault()

    jQuerytarget
      .modal(option, this)
      .one('hide', function () {
        jQuerythis.is(':visible') && jQuerythis.focus()
      })
  })

  jQuery(document)
    .on('show.bs.modal',  '.modal', function () { jQuery(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { jQuery(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.jQueryelement   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.jQueryelement = jQuery(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.jQueryelement.on('click.' + this.type, this.options.selector, jQuery.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.jQueryelement.on(eventIn  + '.' + this.type, this.options.selector, jQuery.proxy(this.enter, this))
        this.jQueryelement.on(eventOut + '.' + this.type, this.options.selector, jQuery.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = jQuery.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = jQuery.extend({}, this.getDefaults(), this.jQueryelement.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && jQuery.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : jQuery(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : jQuery(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = jQuery.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.jQueryelement.trigger(e)

      if (e.isDefaultPrevented()) return

      var jQuerytip = this.tip()

      this.setContent()

      if (this.options.animation) jQuerytip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, jQuerytip[0], this.jQueryelement[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      jQuerytip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? jQuerytip.appendTo(this.options.container) : jQuerytip.insertAfter(this.jQueryelement)

      var pos          = this.getPosition()
      var actualWidth  = jQuerytip[0].offsetWidth
      var actualHeight = jQuerytip[0].offsetHeight

      if (autoPlace) {
        var jQueryparent = this.jQueryelement.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : jQueryparent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : jQueryparent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : jQueryparent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        jQuerytip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.jQueryelement.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var jQuerytip   = this.tip()
    var width  = jQuerytip[0].offsetWidth
    var height = jQuerytip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt(jQuerytip.css('margin-top'), 10)
    var marginLeft = parseInt(jQuerytip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    jQuerytip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = jQuerytip[0].offsetWidth
    var actualHeight = jQuerytip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        jQuerytip.offset(offset)

        actualWidth  = jQuerytip[0].offsetWidth
        actualHeight = jQuerytip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) jQuerytip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var jQuerytip  = this.tip()
    var title = this.getTitle()

    jQuerytip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    jQuerytip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var jQuerytip = this.tip()
    var e    = jQuery.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') jQuerytip.detach()
    }

    this.jQueryelement.trigger(e)

    if (e.isDefaultPrevented()) return

    jQuerytip.removeClass('in')

    jQuery.support.transition && this.jQuerytip.hasClass('fade') ?
      jQuerytip
        .one(jQuery.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.jQueryelement.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var jQuerye = this.jQueryelement
    if (jQuerye.attr('title') || typeof(jQuerye.attr('data-original-title')) != 'string') {
      jQuerye.attr('data-original-title', jQuerye.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.jQueryelement[0]
    return jQuery.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.jQueryelement.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var jQuerye = this.jQueryelement
    var o  = this.options

    title = jQuerye.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call(jQuerye[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.jQuerytip = this.jQuerytip || jQuery(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.jQueryarrow = this.jQueryarrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.jQueryelement[0].parentNode) {
      this.hide()
      this.jQueryelement = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? jQuery(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().jQueryelement.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = jQuery.fn.tooltip

  jQuery.fn.tooltip = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  jQuery.fn.tooltip.noConflict = function () {
    jQuery.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!jQuery.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = jQuery.extend({} , jQuery.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = jQuery.extend({}, jQuery.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var jQuerytip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    jQuerytip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    jQuerytip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    jQuerytip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!jQuerytip.find('.popover-title').html()) jQuerytip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var jQuerye = this.jQueryelement
    var o  = this.options

    return jQuerye.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call(jQuerye[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.jQueryarrow = this.jQueryarrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.jQuerytip) this.jQuerytip = jQuery(this.options.template)
    return this.jQuerytip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = jQuery.fn.popover

  jQuery.fn.popover = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  jQuery.fn.popover.noConflict = function () {
    jQuery.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = jQuery(element)
  }

  Tab.prototype.show = function () {
    var jQuerythis    = this.element
    var jQueryul      = jQuerythis.closest('ul:not(.dropdown-menu)')
    var selector = jQuerythis.data('target')

    if (!selector) {
      selector = jQuerythis.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*jQuery)/, '') //strip for ie7
    }

    if (jQuerythis.parent('li').hasClass('active')) return

    var previous = jQueryul.find('.active:last a')[0]
    var e        = jQuery.Event('show.bs.tab', {
      relatedTarget: previous
    })

    jQuerythis.trigger(e)

    if (e.isDefaultPrevented()) return

    var jQuerytarget = jQuery(selector)

    this.activate(jQuerythis.parent('li'), jQueryul)
    this.activate(jQuerytarget, jQuerytarget.parent(), function () {
      jQuerythis.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var jQueryactive    = container.find('> .active')
    var transition = callback
      && jQuery.support.transition
      && jQueryactive.hasClass('fade')

    function next() {
      jQueryactive
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      jQueryactive
        .one(jQuery.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    jQueryactive.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = jQuery.fn.tab

  jQuery.fn.tab = function ( option ) {
    return this.each(function () {
      var jQuerythis = jQuery(this)
      var data  = jQuerythis.data('bs.tab')

      if (!data) jQuerythis.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  jQuery.fn.tab.noConflict = function () {
    jQuery.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  jQuery(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    jQuery(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = jQuery.extend({}, Affix.DEFAULTS, options)
    this.jQuerywindow = jQuery(window)
      .on('scroll.bs.affix.data-api', jQuery.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  jQuery.proxy(this.checkPositionWithEventLoop, this))

    this.jQueryelement = jQuery(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout(jQuery.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.jQueryelement.is(':visible')) return

    var scrollHeight = jQuery(document).height()
    var scrollTop    = this.jQuerywindow.scrollTop()
    var position     = this.jQueryelement.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.jQueryelement.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.jQueryelement.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.jQueryelement.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.jQueryelement.offset({ top: document.body.offsetHeight - offsetBottom - this.jQueryelement.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = jQuery.fn.affix

  jQuery.fn.affix = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  jQuery.fn.affix.noConflict = function () {
    jQuery.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  jQuery(window).on('load', function () {
    jQuery('[data-spy="affix"]').each(function () {
      var jQueryspy = jQuery(this)
      var data = jQueryspy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      jQueryspy.affix(data)
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.jQueryelement      = jQuery(element)
    this.options       = jQuery.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.jQueryparent = jQuery(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.jQueryelement.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.jQueryelement.hasClass('in')) return

    var startEvent = jQuery.Event('show.bs.collapse')
    this.jQueryelement.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.jQueryparent && this.jQueryparent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.jQueryelement
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.jQueryelement
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.jQueryelement.trigger('shown.bs.collapse')
    }

    if (!jQuery.support.transition) return complete.call(this)

    var scrollSize = jQuery.camelCase(['scroll', dimension].join('-'))

    this.jQueryelement
      .one(jQuery.support.transition.end, jQuery.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.jQueryelement[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.jQueryelement.hasClass('in')) return

    var startEvent = jQuery.Event('hide.bs.collapse')
    this.jQueryelement.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.jQueryelement
      [dimension](this.jQueryelement[dimension]())
      [0].offsetHeight

    this.jQueryelement
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.jQueryelement
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!jQuery.support.transition) return complete.call(this)

    this.jQueryelement
      [dimension](0)
      .one(jQuery.support.transition.end, jQuery.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.jQueryelement.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = jQuery.fn.collapse

  jQuery.fn.collapse = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.collapse')
      var options = jQuery.extend({}, Collapse.DEFAULTS, jQuerythis.data(), typeof option == 'object' && option)

      if (!data) jQuerythis.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  jQuery.fn.collapse.noConflict = function () {
    jQuery.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  jQuery(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var jQuerythis   = jQuery(this), href
    var target  = jQuerythis.attr('data-target')
        || e.preventDefault()
        || (href = jQuerythis.attr('href')) && href.replace(/.*(?=#[^\s]+jQuery)/, '') //strip for ie7
    var jQuerytarget = jQuery(target)
    var data    = jQuerytarget.data('bs.collapse')
    var option  = data ? 'toggle' : jQuerythis.data()
    var parent  = jQuerythis.attr('data-parent')
    var jQueryparent = parent && jQuery(parent)

    if (!data || !data.transitioning) {
      if (jQueryparent) jQueryparent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not(jQuerythis).addClass('collapsed')
      jQuerythis[jQuerytarget.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    jQuerytarget.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = jQuery.proxy(this.process, this)

    this.jQueryelement       = jQuery(element).is('body') ? jQuery(window) : jQuery(element)
    this.jQuerybody          = jQuery('body')
    this.jQueryscrollElement = this.jQueryelement.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = jQuery.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = jQuery(element).attr('href')) && href.replace(/.*(?=#[^\s]+jQuery)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = jQuery([])
    this.targets        = jQuery([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.jQueryelement[0] == window ? 'offset' : 'position'

    this.offsets = jQuery([])
    this.targets = jQuery([])

    var self     = this
    var jQuerytargets = this.jQuerybody
      .find(this.selector)
      .map(function () {
        var jQueryel   = jQuery(this)
        var href  = jQueryel.data('target') || jQueryel.attr('href')
        var jQueryhref = /^#\w/.test(href) && jQuery(href)

        return (jQueryhref
          && jQueryhref.length
          && [[ jQueryhref[offsetMethod]().top + (!jQuery.isWindow(self.jQueryscrollElement.get(0)) && self.jQueryscrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.jQueryscrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.jQueryscrollElement[0].scrollHeight || this.jQuerybody[0].scrollHeight
    var maxScroll    = scrollHeight - this.jQueryscrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    jQuery(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = jQuery(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = jQuery.fn.scrollspy

  jQuery.fn.scrollspy = function (option) {
    return this.each(function () {
      var jQuerythis   = jQuery(this)
      var data    = jQuerythis.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) jQuerythis.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  jQuery.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  jQuery.fn.scrollspy.noConflict = function () {
    jQuery.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  jQuery(window).on('load', function () {
    jQuery('[data-spy="scroll"]').each(function () {
      var jQueryspy = jQuery(this)
      jQueryspy.scrollspy(jQueryspy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function (jQuery) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  jQuery.fn.emulateTransitionEnd = function (duration) {
    var called = false, jQueryel = this
    jQuery(this).one(jQuery.support.transition.end, function () { called = true })
    var callback = function () { if (!called) jQuery(jQueryel).trigger(jQuery.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  jQuery(function () {
    jQuery.support.transition = transitionEnd()
  })

}(jQuery);
