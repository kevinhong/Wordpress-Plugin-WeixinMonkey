/**
 * noty - jQuery Notification Plugin v2.2.2
 * Contributors: https://github.com/needim/noty/graphs/contributors
 *
 * Examples and Documentation - http://needim.github.com/noty/
 *
 * Licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 **/

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

(function (jQuery) {

    var NotyObject = {

        init:function (options) {

            // Mix in the passed in options with the default options
            this.options = jQuery.extend({}, jQuery.noty.defaults, options);

            this.options.layout = (this.options.custom) ? jQuery.noty.layouts['inline'] : jQuery.noty.layouts[this.options.layout];

			if (jQuery.noty.themes[this.options.theme])
            	this.options.theme = jQuery.noty.themes[this.options.theme];
			else
				options.themeClassName = this.options.theme;

            delete options.layout;
            delete options.theme;

            this.options = jQuery.extend({}, this.options, this.options.layout.options);
            this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));

            this.options = jQuery.extend({}, this.options, options);

            // Build the noty dom initial structure
            this._build();

            // return this so we can chain/use the bridge with less code.
            return this;
        }, // end init

        _build:function () {

            // Generating noty bar
            var jQuerybar = jQuery('<div class="noty_bar noty_type_' + this.options.type + '"></div>').attr('id', this.options.id);
            jQuerybar.append(this.options.template).find('.noty_text').html(this.options.text);

            this.jQuerybar = (this.options.layout.parent.object !== null) ? jQuery(this.options.layout.parent.object).css(this.options.layout.parent.css).append(jQuerybar) : jQuerybar;

			if (this.options.themeClassName)
				this.jQuerybar.addClass(this.options.themeClassName).addClass('noty_container_type_' + this.options.type);

            // Set buttons if available
            if (this.options.buttons) {

                // If we have button disable closeWith & timeout options
                this.options.closeWith = [];
                this.options.timeout = false;

                var jQuerybuttons = jQuery('<div/>').addClass('noty_buttons');

                (this.options.layout.parent.object !== null) ? this.jQuerybar.find('.noty_bar').append(jQuerybuttons) : this.jQuerybar.append(jQuerybuttons);

                var self = this;

                jQuery.each(this.options.buttons, function (i, button) {
                    var jQuerybutton = jQuery('<button/>').addClass((button.addClass) ? button.addClass : 'gray').html(button.text).attr('id', button.id ? button.id : 'button-' + i)
                        .appendTo(self.jQuerybar.find('.noty_buttons'))
                        .bind('click', function () {
                            if (jQuery.isFunction(button.onClick)) {
                                button.onClick.call(jQuerybutton, self);
                            }
                        });
                });
            }

            // For easy access
            this.jQuerymessage = this.jQuerybar.find('.noty_message');
            this.jQuerycloseButton = this.jQuerybar.find('.noty_close');
            this.jQuerybuttons = this.jQuerybar.find('.noty_buttons');

            jQuery.noty.store[this.options.id] = this; // store noty for api

        }, // end _build

        show:function () {

            var self = this;

			(self.options.custom) ? self.options.custom.find(self.options.layout.container.selector).append(self.jQuerybar) : jQuery(self.options.layout.container.selector).append(self.jQuerybar);

			if (self.options.theme && self.options.theme.style)
            	self.options.theme.style.apply(self);

            (jQuery.type(self.options.layout.css) === 'function') ? this.options.layout.css.apply(self.jQuerybar) : self.jQuerybar.css(this.options.layout.css || {});

            self.jQuerybar.addClass(self.options.layout.addClass);

            self.options.layout.container.style.apply(jQuery(self.options.layout.container.selector));

            self.showing = true;

			if (self.options.theme && self.options.theme.style)
            	self.options.theme.callback.onShow.apply(this);

            if (jQuery.inArray('click', self.options.closeWith) > -1)
                self.jQuerybar.css('cursor', 'pointer').one('click', function (evt) {
                    self.stopPropagation(evt);
                    if (self.options.callback.onCloseClick) {
                        self.options.callback.onCloseClick.apply(self);
                    }
                    self.close();
                });

            if (jQuery.inArray('hover', self.options.closeWith) > -1)
                self.jQuerybar.one('mouseenter', function () {
                    self.close();
                });

            if (jQuery.inArray('button', self.options.closeWith) > -1)
                self.jQuerycloseButton.one('click', function (evt) {
                    self.stopPropagation(evt);
                    self.close();
                });

            if (jQuery.inArray('button', self.options.closeWith) == -1)
                self.jQuerycloseButton.remove();

            if (self.options.callback.onShow)
                self.options.callback.onShow.apply(self);

            self.jQuerybar.animate(
                self.options.animation.open,
                self.options.animation.speed,
                self.options.animation.easing,
                function () {
                    if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
                    self.showing = false;
                    self.shown = true;
                });

            // If noty is have a timeout option
            if (self.options.timeout)
                self.jQuerybar.delay(self.options.timeout).promise().done(function () {
                    self.close();
                });

            return this;

        }, // end show

        close:function () {

            if (this.closed) return;
            if (this.jQuerybar && this.jQuerybar.hasClass('i-am-closing-now')) return;

            var self = this;

            if (this.showing) {
              self.jQuerybar.queue(
                function () {
                  self.close.apply(self);
                }
              )
              return;
            }

            if (!this.shown && !this.showing) { // If we are still waiting in the queue just delete from queue
                var queue = [];
                jQuery.each(jQuery.noty.queue, function (i, n) {
                    if (n.options.id != self.options.id) {
                        queue.push(n);
                    }
                });
                jQuery.noty.queue = queue;
                return;
            }

            self.jQuerybar.addClass('i-am-closing-now');

            if (self.options.callback.onClose) {
                self.options.callback.onClose.apply(self);
            }

            self.jQuerybar.clearQueue().stop().animate(
                self.options.animation.close,
                self.options.animation.speed,
                self.options.animation.easing,
                function () {
                    if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
                })
                .promise().done(function () {

                    // Modal Cleaning
                    if (self.options.modal) {
                        jQuery.notyRenderer.setModalCount(-1);
                        if (jQuery.notyRenderer.getModalCount() == 0) jQuery('.noty_modal').fadeOut('fast', function () {
                            jQuery(this).remove();
                        });
                    }

                    // Layout Cleaning
                    jQuery.notyRenderer.setLayoutCountFor(self, -1);
                    if (jQuery.notyRenderer.getLayoutCountFor(self) == 0) jQuery(self.options.layout.container.selector).remove();

                    // Make sure self.jQuerybar has not been removed before attempting to remove it
                    if (typeof self.jQuerybar !== 'undefined' && self.jQuerybar !== null ) {
                        self.jQuerybar.remove();
                        self.jQuerybar = null;
                        self.closed = true;
                    }

                    delete jQuery.noty.store[self.options.id]; // deleting noty from store

                    if(self.options.theme.callback && self.options.theme.callback.onClose) {
                        self.options.theme.callback.onClose.apply(self);
                    }

                    if (!self.options.dismissQueue) {
                        // Queue render
                        jQuery.noty.ontap = true;

                        jQuery.notyRenderer.render();
                    }

					if (self.options.maxVisible > 0 && self.options.dismissQueue) {
						jQuery.notyRenderer.render();
					}
                })

        }, // end close

        setText:function (text) {
            if (!this.closed) {
                this.options.text = text;
                this.jQuerybar.find('.noty_text').html(text);
            }
            return this;
        },

        setType:function (type) {
            if (!this.closed) {
                this.options.type = type;
                this.options.theme.style.apply(this);
                this.options.theme.callback.onShow.apply(this);
            }
            return this;
        },

        setTimeout:function (time) {
            if (!this.closed) {
                var self = this;
                this.options.timeout = time;
                self.jQuerybar.delay(self.options.timeout).promise().done(function () {
                    self.close();
                });
            }
            return this;
        },

        stopPropagation:function (evt) {
            evt = evt || window.event;
            if (typeof evt.stopPropagation !== "undefined") {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        },

        closed:false,
        showing:false,
        shown:false

    }; // end NotyObject

    jQuery.notyRenderer = {};

    jQuery.notyRenderer.init = function (options) {

        // Renderer creates a new noty
        var notification = Object.create(NotyObject).init(options);

		if (notification.options.killer)
			jQuery.noty.closeAll();

        (notification.options.force) ? jQuery.noty.queue.unshift(notification) : jQuery.noty.queue.push(notification);

        jQuery.notyRenderer.render();

        return (jQuery.noty.returns == 'object') ? notification : notification.options.id;
    };

    jQuery.notyRenderer.render = function () {

        var instance = jQuery.noty.queue[0];

        if (jQuery.type(instance) === 'object') {
            if (instance.options.dismissQueue) {
				if (instance.options.maxVisible > 0) {
					if (jQuery(instance.options.layout.container.selector + ' li').length < instance.options.maxVisible) {
						jQuery.notyRenderer.show(jQuery.noty.queue.shift());
					} else {

					}
				} else {
					jQuery.notyRenderer.show(jQuery.noty.queue.shift());
				}
            } else {
                if (jQuery.noty.ontap) {
                    jQuery.notyRenderer.show(jQuery.noty.queue.shift());
                    jQuery.noty.ontap = false;
                }
            }
        } else {
            jQuery.noty.ontap = true; // Queue is over
        }

    };

    jQuery.notyRenderer.show = function (notification) {

        if (notification.options.modal) {
            jQuery.notyRenderer.createModalFor(notification);
            jQuery.notyRenderer.setModalCount(+1);
        }

        // Where is the container?
		if (notification.options.custom) {
			if (notification.options.custom.find(notification.options.layout.container.selector).length == 0) {
				notification.options.custom.append(jQuery(notification.options.layout.container.object).addClass('i-am-new'));
			} else {
				notification.options.custom.find(notification.options.layout.container.selector).removeClass('i-am-new');
			}
		} else {
			if (jQuery(notification.options.layout.container.selector).length == 0) {
				jQuery('body').append(jQuery(notification.options.layout.container.object).addClass('i-am-new'));
			} else {
				jQuery(notification.options.layout.container.selector).removeClass('i-am-new');
			}
		}

        jQuery.notyRenderer.setLayoutCountFor(notification, +1);

        notification.show();
    };

    jQuery.notyRenderer.createModalFor = function (notification) {
        if (jQuery('.noty_modal').length == 0) {
			var modal = jQuery('<div/>').addClass('noty_modal').addClass(notification.options.theme).data('noty_modal_count', 0);

			if (notification.options.theme.modal && notification.options.theme.modal.css)
				modal.css(notification.options.theme.modal.css);

			modal.prependTo(jQuery('body')).fadeIn('fast');
		}
    };

    jQuery.notyRenderer.getLayoutCountFor = function (notification) {
        return jQuery(notification.options.layout.container.selector).data('noty_layout_count') || 0;
    };

    jQuery.notyRenderer.setLayoutCountFor = function (notification, arg) {
        return jQuery(notification.options.layout.container.selector).data('noty_layout_count', jQuery.notyRenderer.getLayoutCountFor(notification) + arg);
    };

    jQuery.notyRenderer.getModalCount = function () {
        return jQuery('.noty_modal').data('noty_modal_count') || 0;
    };

    jQuery.notyRenderer.setModalCount = function (arg) {
        return jQuery('.noty_modal').data('noty_modal_count', jQuery.notyRenderer.getModalCount() + arg);
    };

    // This is for custom container
    jQuery.fn.noty = function (options) {
        options.custom = jQuery(this);
        return jQuery.notyRenderer.init(options);
    };

    jQuery.noty = {};
    jQuery.noty.queue = [];
    jQuery.noty.ontap = true;
    jQuery.noty.layouts = {};
    jQuery.noty.themes = {};
    jQuery.noty.returns = 'object';
    jQuery.noty.store = {};

    jQuery.noty.get = function (id) {
        return jQuery.noty.store.hasOwnProperty(id) ? jQuery.noty.store[id] : false;
    };

    jQuery.noty.close = function (id) {
        return jQuery.noty.get(id) ? jQuery.noty.get(id).close() : false;
    };

    jQuery.noty.setText = function (id, text) {
        return jQuery.noty.get(id) ? jQuery.noty.get(id).setText(text) : false;
    };

    jQuery.noty.setType = function (id, type) {
        return jQuery.noty.get(id) ? jQuery.noty.get(id).setType(type) : false;
    };

    jQuery.noty.clearQueue = function () {
        jQuery.noty.queue = [];
    };

    jQuery.noty.closeAll = function () {
        jQuery.noty.clearQueue();
        jQuery.each(jQuery.noty.store, function (id, noty) {
            noty.close();
        });
    };

    var windowAlert = window.alert;

    jQuery.noty.consumeAlert = function (options) {
        window.alert = function (text) {
            if (options)
                options.text = text;
            else
                options = {text:text};

            jQuery.notyRenderer.init(options);
        };
    };

    jQuery.noty.stopConsumeAlert = function () {
        window.alert = windowAlert;
    };

    jQuery.noty.defaults = {
        layout:'top',
        theme:'defaultTheme',
        type:'alert',
        text:'',
        dismissQueue:true,
        template:'<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
        animation:{
            open:{height:'toggle'},
            close:{height:'toggle'},
            easing:'swing',
            speed:500
        },
        timeout:false,
        force:false,
        modal:false,
        maxVisible:5,
		killer: false,
        closeWith:['click'],
        callback:{
            onShow:function () {
            },
            afterShow:function () {
            },
            onClose:function () {
            },
            afterClose:function () {
            },
            onCloseClick:function () {
            }
        },
        buttons:false
    };

    jQuery(window).resize(function () {
        jQuery.each(jQuery.noty.layouts, function (index, layout) {
            layout.container.style.apply(jQuery(layout.container.selector));
        });
    });

})(jQuery);

// Helpers
window.noty = function noty(options) {
    return jQuery.notyRenderer.init(options);
};

(function(jQuery) {

	jQuery.noty.layouts.bottom = {
		name: 'bottom',
		options: {},
		container: {
			object: '<ul id="noty_bottom_layout_container" />',
			selector: 'ul#noty_bottom_layout_container',
			style: function() {
				jQuery(this).css({
					bottom: 0,
					left: '5%',
					position: 'fixed',
					width: '90%',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 9999999
				});
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.bottomCenter = {
		name: 'bottomCenter',
		options: { // overrides options

		},
		container: {
			object: '<ul id="noty_bottomCenter_layout_container" />',
			selector: 'ul#noty_bottomCenter_layout_container',
			style: function() {
				jQuery(this).css({
					bottom: 20,
					left: 0,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				jQuery(this).css({
					left: (jQuery(window).width() - jQuery(this).outerWidth(false)) / 2 + 'px'
				});
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);

(function(jQuery) {

	jQuery.noty.layouts.bottomLeft = {
		name: 'bottomLeft',
		options: { // overrides options
			
		},
		container: {
			object: '<ul id="noty_bottomLeft_layout_container" />',
			selector: 'ul#noty_bottomLeft_layout_container',
			style: function() {
				jQuery(this).css({
					bottom: 20,
					left: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				if (window.innerWidth < 600) {
					jQuery(this).css({
						left: 5
					});
				}
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.bottomRight = {
		name: 'bottomRight',
		options: { // overrides options
			
		},
		container: {
			object: '<ul id="noty_bottomRight_layout_container" />',
			selector: 'ul#noty_bottomRight_layout_container',
			style: function() {
				jQuery(this).css({
					bottom: 20,
					right: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				if (window.innerWidth < 600) {
					jQuery(this).css({
						right: 5
					});
				}
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.center = {
		name: 'center',
		options: { // overrides options
			
		},
		container: {
			object: '<ul id="noty_center_layout_container" />',
			selector: 'ul#noty_center_layout_container',
			style: function() {
				jQuery(this).css({
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				// getting hidden height
				var dupe = jQuery(this).clone().css({visibility:"hidden", display:"block", position:"absolute", top: 0, left: 0}).attr('id', 'dupe');
				jQuery("body").append(dupe);
				dupe.find('.i-am-closing-now').remove();
				dupe.find('li').css('display', 'block');
				var actual_height = dupe.height();
				dupe.remove();

				if (jQuery(this).hasClass('i-am-new')) {
					jQuery(this).css({
						left: (jQuery(window).width() - jQuery(this).outerWidth(false)) / 2 + 'px',
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					});
				} else {
					jQuery(this).animate({
						left: (jQuery(window).width() - jQuery(this).outerWidth(false)) / 2 + 'px',
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					}, 500);
				}
				
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.centerLeft = {
		name: 'centerLeft',
		options: { // overrides options

		},
		container: {
			object: '<ul id="noty_centerLeft_layout_container" />',
			selector: 'ul#noty_centerLeft_layout_container',
			style: function() {
				jQuery(this).css({
					left: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				// getting hidden height
				var dupe = jQuery(this).clone().css({visibility:"hidden", display:"block", position:"absolute", top: 0, left: 0}).attr('id', 'dupe');
				jQuery("body").append(dupe);
				dupe.find('.i-am-closing-now').remove();
				dupe.find('li').css('display', 'block');
				var actual_height = dupe.height();
				dupe.remove();

				if (jQuery(this).hasClass('i-am-new')) {
					jQuery(this).css({
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					});
				} else {
					jQuery(this).animate({
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					}, 500);
				}

				if (window.innerWidth < 600) {
					jQuery(this).css({
						left: 5
					});
				}

			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);

(function(jQuery) {

	jQuery.noty.layouts.centerRight = {
		name: 'centerRight',
		options: { // overrides options

		},
		container: {
			object: '<ul id="noty_centerRight_layout_container" />',
			selector: 'ul#noty_centerRight_layout_container',
			style: function() {
				jQuery(this).css({
					right: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				// getting hidden height
				var dupe = jQuery(this).clone().css({visibility:"hidden", display:"block", position:"absolute", top: 0, left: 0}).attr('id', 'dupe');
				jQuery("body").append(dupe);
				dupe.find('.i-am-closing-now').remove();
				dupe.find('li').css('display', 'block');
				var actual_height = dupe.height();
				dupe.remove();

				if (jQuery(this).hasClass('i-am-new')) {
					jQuery(this).css({
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					});
				} else {
					jQuery(this).animate({
						top: (jQuery(window).height() - actual_height) / 2 + 'px'
					}, 500);
				}

				if (window.innerWidth < 600) {
					jQuery(this).css({
						right: 5
					});
				}

			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);

(function(jQuery) {

	jQuery.noty.layouts.inline = {
		name: 'inline',
		options: {},
		container: {
			object: '<ul class="noty_inline_layout_container" />',
			selector: 'ul.noty_inline_layout_container',
			style: function() {
				jQuery(this).css({
					width: '100%',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 9999999
				});
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.top = {
		name: 'top',
		options: {},
		container: {
			object: '<ul id="noty_top_layout_container" />',
			selector: 'ul#noty_top_layout_container',
			style: function() {
				jQuery(this).css({
					top: 0,
					left: '5%',
					position: 'fixed',
					width: '90%',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 9999999
				});
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.topCenter = {
		name: 'topCenter',
		options: { // overrides options

		},
		container: {
			object: '<ul id="noty_topCenter_layout_container" />',
			selector: 'ul#noty_topCenter_layout_container',
			style: function() {
				jQuery(this).css({
					top: 20,
					left: 0,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				jQuery(this).css({
					left: (jQuery(window).width() - jQuery(this).outerWidth(false)) / 2 + 'px'
				});
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);

(function(jQuery) {

	jQuery.noty.layouts.topLeft = {
		name: 'topLeft',
		options: { // overrides options
			
		},
		container: {
			object: '<ul id="noty_topLeft_layout_container" />',
			selector: 'ul#noty_topLeft_layout_container',
			style: function() {
				jQuery(this).css({
					top: 20,
					left: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				if (window.innerWidth < 600) {
					jQuery(this).css({
						left: 5
					});
				}
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.layouts.topRight = {
		name: 'topRight',
		options: { // overrides options
			
		},
		container: {
			object: '<ul id="noty_topRight_layout_container" />',
			selector: 'ul#noty_topRight_layout_container',
			style: function() {
				jQuery(this).css({
					top: 40,
					right: 20,
					position: 'fixed',
					width: '310px',
					height: 'auto',
					margin: 0,
					padding: 0,
					listStyleType: 'none',
					zIndex: 10000000
				});

				if (window.innerWidth < 600) {
					jQuery(this).css({
						right: 5
					});
				}
			}
		},
		parent: {
			object: '<li />',
			selector: 'li',
			css: {}
		},
		css: {
			display: 'none',
			width: '310px'
		},
		addClass: ''
	};

})(jQuery);
(function(jQuery) {

	jQuery.noty.themes.defaultTheme = {
		name: 'defaultTheme',
		helpers: {
			borderFix: function() {
				if (this.options.dismissQueue) {
					var selector = this.options.layout.container.selector + ' ' + this.options.layout.parent.selector;
					switch (this.options.layout.name) {
						case 'top':
							jQuery(selector).css({borderRadius: '0px 0px 0px 0px'});
							jQuery(selector).last().css({borderRadius: '0px 0px 5px 5px'}); break;
						case 'topCenter': case 'topLeft': case 'topRight':
						case 'bottomCenter': case 'bottomLeft': case 'bottomRight':
						case 'center': case 'centerLeft': case 'centerRight': case 'inline':
							jQuery(selector).css({borderRadius: '0px 0px 0px 0px'});
							jQuery(selector).first().css({'border-top-left-radius': '5px', 'border-top-right-radius': '5px'});
							jQuery(selector).last().css({'border-bottom-left-radius': '5px', 'border-bottom-right-radius': '5px'}); break;
						case 'bottom':
							jQuery(selector).css({borderRadius: '0px 0px 0px 0px'});
							jQuery(selector).first().css({borderRadius: '5px 5px 0px 0px'}); break;
						default: break;
					}
				}
			}
		},
		modal: {
			css: {
				position: 'fixed',
				width: '100%',
				height: '100%',
				backgroundColor: '#000',
				zIndex: 10000,
				opacity: 0.6,
				display: 'none',
				left: 0,
				top: 0
			}
		},
		style: function() {

			this.jQuerybar.css({
				overflow: 'hidden',
				background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNq81tsOgjAMANB2ov7/7ypaN7IlIwi9rGuT8QSc9EIDAsAznxvY4pXPKr05RUE5MEVB+TyWfCEl9LZApYopCmo9C4FKSMtYoI8Bwv79aQJU4l6hXXCZrQbokJEksxHo9KMOgc6w1atHXM8K9DVC7FQnJ0i8iK3QooGgbnyKgMDygBWyYFZoqx4qS27KqLZJjA1D0jK6QJcYEQEiWv9PGkTsbqxQ8oT+ZtZB6AkdsJnQDnMoHXHLGKOgDYuCWmYhEERCI5gaamW0bnHdA3k2ltlIN+2qKRyCND0bhqSYCyTB3CAOc4WusBEIpkeBuPgJMAAX8Hs1NfqHRgAAAABJRU5ErkJggg==') repeat-x scroll left top #fff"
			});

			this.jQuerymessage.css({
				fontSize: '13px',
				lineHeight: '16px',
				textAlign: 'center',
				padding: '8px 10px 9px',
				width: 'auto',
				position: 'relative'
			});

			this.jQuerycloseButton.css({
				position: 'absolute',
				top: 4, right: 4,
				width: 10, height: 10,
				background: "url(data:image/png;base64,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)",
				display: 'none',
				cursor: 'pointer'
			});

			this.jQuerybuttons.css({
				padding: 5,
				textAlign: 'right',
				borderTop: '1px solid #ccc',
				backgroundColor: '#fff'
			});

			this.jQuerybuttons.find('button').css({
				marginLeft: 5
			});

			this.jQuerybuttons.find('button:first').css({
				marginLeft: 0
			});

			this.jQuerybar.bind({
				mouseenter: function() { jQuery(this).find('.noty_close').stop().fadeTo('normal',1); },
				mouseleave: function() { jQuery(this).find('.noty_close').stop().fadeTo('normal',0); }
			});

			switch (this.options.layout.name) {
				case 'top':
					this.jQuerybar.css({
						borderRadius: '0px 0px 5px 5px',
						borderBottom: '2px solid #eee',
						borderLeft: '2px solid #eee',
						borderRight: '2px solid #eee',
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
					});
				break;
				case 'topCenter': case 'center': case 'bottomCenter': case 'inline':
					this.jQuerybar.css({
						borderRadius: '5px',
						border: '1px solid #eee',
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
					});
					this.jQuerymessage.css({fontSize: '13px', textAlign: 'center'});
				break;
				case 'topLeft': case 'topRight':
				case 'bottomLeft': case 'bottomRight':
				case 'centerLeft': case 'centerRight':
					this.jQuerybar.css({
						borderRadius: '5px',
						border: '1px solid #eee',
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
					});
					this.jQuerymessage.css({fontSize: '13px', textAlign: 'left'});
				break;
				case 'bottom':
					this.jQuerybar.css({
						borderRadius: '5px 5px 0px 0px',
						borderTop: '2px solid #eee',
						borderLeft: '2px solid #eee',
						borderRight: '2px solid #eee',
						boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)"
					});
				break;
				default:
					this.jQuerybar.css({
						border: '2px solid #eee',
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
					});
				break;
			}

			switch (this.options.type) {
				case 'alert': case 'notification':
					this.jQuerybar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'}); break;
				case 'warning':
					this.jQuerybar.css({backgroundColor: '#FFEAA8', borderColor: '#FFC237', color: '#826200'});
					this.jQuerybuttons.css({borderTop: '1px solid #FFC237'}); break;
				case 'error':
					this.jQuerybar.css({backgroundColor: 'red', borderColor: 'darkred', color: '#FFF'});
					this.jQuerymessage.css({fontWeight: 'bold'});
					this.jQuerybuttons.css({borderTop: '1px solid darkred'}); break;
				case 'information':
					this.jQuerybar.css({backgroundColor: '#57B7E2', borderColor: '#0B90C4', color: '#FFF'});
					this.jQuerybuttons.css({borderTop: '1px solid #0B90C4'}); break;
				case 'success':
					this.jQuerybar.css({backgroundColor: 'lightgreen', borderColor: '#50C24E', color: 'darkgreen'});
					this.jQuerybuttons.css({borderTop: '1px solid #50C24E'});break;
				default:
					this.jQuerybar.css({backgroundColor: '#FFF', borderColor: '#CCC', color: '#444'}); break;
			}
		},
		callback: {
			onShow: function() { jQuery.noty.themes.defaultTheme.helpers.borderFix.apply(this); },
			onClose: function() { jQuery.noty.themes.defaultTheme.helpers.borderFix.apply(this); }
		}
	};

})(jQuery);
