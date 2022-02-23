(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function initAnchors() {
	new SmoothScroll({
		anchorLinks: 'a[href^="#"]:not([href="#"])',
		extraOffset: 100,
		wheelBehavior: 'none',
		activeClasses: 'link',
		animMode: 'duration',
		animDuration: 1000
	});
}

let  anchorsPlugin = require ('../plugins/anchorsPlugin');
anchorsPlugin();

},{"../plugins/anchorsPlugin":7}],2:[function(require,module,exports){
module.exports = function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}

let mobileNavPluginCall = require('./../plugins/mobileNavPlugin');
mobileNavPluginCall();

},{"./../plugins/mobileNavPlugin":8}],3:[function(require,module,exports){
module.exports = function initPreloader() {
  document.body.onload = function() {
    
    setTimeout( function () {
      var preloader = document.getElementById('page-preloader');
      if (!preloader.classList.contains('done')) {
        preloader.classList.add('done')
      }
    }, 1000)

  }
}
},{}],4:[function(require,module,exports){
module.exports = function initProgressBar() {
  $(document).ready(() => {
    $(window).scroll(() => {
      let docHeight = $('body').height();
      let winHeight = $(window).height();
      let viewport = docHeight - winHeight;
      let scrollPos = $(window).scrollTop();
      let scrollPercent = (scrollPos / viewport) * 100;
        
      $('.top-scroll-holder-indicator').css('width', scrollPercent +'%');
    });
  });     
}

},{}],5:[function(require,module,exports){
module.exports = function initInViewPort () {
  jQuery('.viewport-section').itemInViewport({
    visibleMode: 100
  });
  jQuery('.viewport-animation').itemInViewport({
    visibleMode: 3
  });
  let timer;
  const win = jQuery(window);
  win.on('scroll', function() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      win.trigger('resize')
    }, 200)
  })
}

let inViewPortPlugin = require('../plugins/viewPortPlugin');
inViewPortPlugin();

},{"../plugins/viewPortPlugin":9}],6:[function(require,module,exports){
const initAnchors = require('./components/initAnchors')

const initPreloader = require('./components/initPreloader')

const initMobileNav = require('./components/initMobileNav')

const initProgressBar = require('./components/initProgressBar')

const initViewPort = require('./components/initViewPort')


initAnchors()
initPreloader()
initMobileNav()
initProgressBar()
initViewPort()
},{"./components/initAnchors":1,"./components/initMobileNav":2,"./components/initPreloader":3,"./components/initProgressBar":4,"./components/initViewPort":5}],7:[function(require,module,exports){
module.exports = function anchorPlugin () {
  ;(function($, exports) {
    var page,
      win = $(window),
      activeBlock, activeWheelHandler,
      wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

    function scrollTo(offset, options, callback) {
      var scrollBlock;
      if (document.body) {
        if (typeof options === 'number') {
          options = {
            duration: options
          };
        } else {
          options = options || {};
        }
        page = page || $('html, body');
        scrollBlock = options.container || page;
      } else {
        return;
      }

      if (typeof offset === 'number') {
        offset = {
          top: offset
        };
      }

      if (activeBlock && activeWheelHandler) {
        activeBlock.off(wheelEvents, activeWheelHandler);
      }
      if (options.wheelBehavior && options.wheelBehavior !== 'none') {
        activeWheelHandler = function(e) {
          if (options.wheelBehavior === 'stop') {
            scrollBlock.off(wheelEvents, activeWheelHandler);
            scrollBlock.stop();
          } else if (options.wheelBehavior === 'ignore') {
            e.preventDefault();
          }
        };
        activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
      }

      scrollBlock.stop().animate({
        scrollLeft: offset.left,
        scrollTop: offset.top
      }, options.duration, function() {
        if (activeWheelHandler) {
          scrollBlock.off(wheelEvents, activeWheelHandler);
        }
        if ($.isFunction(callback)) {
          callback();
        }
      });
    }

    function SmoothScroll(options) {
      this.options = $.extend({
        anchorLinks: 'a[href^="#"]',
        container: null,
        extraOffset: null,
        activeClasses: null,
        easing: 'swing',
        animMode: 'duration', 
        animDuration: 800,
        animSpeed: 1500,
        anchorActiveClass: 'anchor-active',
        sectionActiveClass: 'section-active',
        wheelBehavior: 'stop',
        useNativeAnchorScrolling: false
      }, options);
      this.init();
    }
    SmoothScroll.prototype = {
      init: function() {
        this.initStructure();
        this.attachEvents();
        this.isInit = true;
      },
      initStructure: function() {
        var self = this;

        this.container = this.options.container ? $(this.options.container) : $('html,body');
        this.scrollContainer = this.options.container ? this.container : win;
        this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
          return jQuery(self.getAnchorTarget(jQuery(this))).length;
        });
      },
      getId: function(str) {
        try {
          return '#' + str.replace(/^.*?(#|$)/, '');
        } catch (err) {
          return null;
        }
      },
      getAnchorTarget: function(link) {
        var targetId = this.getId($(link).attr('href'));
        return $(targetId.length > 1 ? targetId : 'html');
      },
      getTargetOffset: function(block) {
        var blockOffset = block.offset().top;
        if (this.options.container) {
          blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
        }

        if (typeof this.options.extraOffset === 'number') {
          blockOffset -= this.options.extraOffset;
        } else if (typeof this.options.extraOffset === 'function') {
          blockOffset -= this.options.extraOffset(block);
        }
        return {
          top: blockOffset
        };
      },
      attachEvents: function() {
        var self = this;

        if (this.options.activeClasses && this.anchorLinks.length) {
          this.anchorData = [];

          for (var i = 0; i < this.anchorLinks.length; i++) {
            var link = jQuery(this.anchorLinks[i]),
              targetBlock = self.getAnchorTarget(link),
              anchorDataItem = null;

            $.each(self.anchorData, function(index, item) {
              if (item.block[0] === targetBlock[0]) {
                anchorDataItem = item;
              }
            });

            if (anchorDataItem) {
              anchorDataItem.link = anchorDataItem.link.add(link);
            } else {
              self.anchorData.push({
                link: link,
                block: targetBlock
              });
            }
          };

          this.resizeHandler = function() {
            if (!self.isInit) return;
            self.recalculateOffsets();
          };
          this.scrollHandler = function() {
            self.refreshActiveClass();
          };

          this.recalculateOffsets();
          this.scrollContainer.on('scroll', this.scrollHandler);
          win.on('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
        }

        this.clickHandler = function(e) {
          self.onClick(e);
        };
        if (!this.options.useNativeAnchorScrolling) {
          this.anchorLinks.on('click', this.clickHandler);
        }
      },
      recalculateOffsets: function() {
        var self = this;
        $.each(this.anchorData, function(index, data) {
          data.offset = self.getTargetOffset(data.block);
          data.height = data.block.outerHeight();
        });
        this.refreshActiveClass();
      },
      toggleActiveClass: function(anchor, block, state) {
        anchor.toggleClass(this.options.anchorActiveClass, state);
        block.toggleClass(this.options.sectionActiveClass, state);
      },
      refreshActiveClass: function() {
        var self = this,
          foundFlag = false,
          containerHeight = this.container.prop('scrollHeight'),
          viewPortHeight = this.scrollContainer.height(),
          scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

        if (this.options.customScrollHandler) {
          this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
          return;
        }

        this.anchorData.sort(function(a, b) {
          return a.offset.top - b.offset.top;
        });

        $.each(this.anchorData, function(index) {
          var reverseIndex = self.anchorData.length - index - 1,
            data = self.anchorData[reverseIndex],
            anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

          if (scrollTop >= containerHeight - viewPortHeight) {
    
            if (reverseIndex === self.anchorData.length - 1) {
              self.toggleActiveClass(anchorElement, data.block, true);
            } else {
              self.toggleActiveClass(anchorElement, data.block, false);
            }
          } else {
            
            if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
              foundFlag = true;
              self.toggleActiveClass(anchorElement, data.block, true);
            } else {
              self.toggleActiveClass(anchorElement, data.block, false);
            }
          }
        });
      },
      calculateScrollDuration: function(offset) {
        var distance;
        if (this.options.animMode === 'speed') {
          distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
          return (distance / this.options.animSpeed) * 1000;
        } else {
          return this.options.animDuration;
        }
      },
      onClick: function(e) {
        var targetBlock = this.getAnchorTarget(e.currentTarget),
          targetOffset = this.getTargetOffset(targetBlock);

        e.preventDefault();
        scrollTo(targetOffset, {
          container: this.container,
          wheelBehavior: this.options.wheelBehavior,
          duration: this.calculateScrollDuration(targetOffset)
        });
        this.makeCallback('onBeforeScroll', e.currentTarget);
      },
      makeCallback: function(name) {
        if (typeof this.options[name] === 'function') {
          var args = Array.prototype.slice.call(arguments);
          args.shift();
          this.options[name].apply(this, args);
        }
      },
      destroy: function() {
        var self = this;

        this.isInit = false;
        if (this.options.activeClasses) {
          win.off('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
          this.scrollContainer.off('scroll', this.scrollHandler);
          $.each(this.anchorData, function(index) {
            var reverseIndex = self.anchorData.length - index - 1,
              data = self.anchorData[reverseIndex],
              anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

            self.toggleActiveClass(anchorElement, data.block, false);
          });
        }
        this.anchorLinks.off('click', this.clickHandler);
      }
    };

    $.extend(SmoothScroll, {
      scrollTo: function(blockOrOffset, durationOrOptions, callback) {
        scrollTo(blockOrOffset, durationOrOptions, callback);
      }
    });

    exports.SmoothScroll = SmoothScroll;
  }(jQuery, this));
}

},{}],8:[function(require,module,exports){
module.exports = function mobileNavPlugin() {
  ;(function($) {
    function MobileNav(options) {
      this.options = $.extend({
        container: null,
        hideOnClickOutside: false,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-opener',
        menuDrop: '.nav-drop',
        toggleEvent: 'click',
        outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
      }, options);
      this.initStructure();
      this.attachEvents();
    }
    MobileNav.prototype = {
      initStructure: function() {
        this.page = $('html');
        this.container = $(this.options.container);
        this.opener = this.container.find(this.options.menuOpener);
        this.drop = this.container.find(this.options.menuDrop);
      },
      attachEvents: function() {
        var self = this;
  
        if(activateResizeHandler) {
          activateResizeHandler();
          activateResizeHandler = null;
        }
  
        this.outsideClickHandler = function(e) {
          if(self.isOpened()) {
            var target = $(e.target);
            if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
              self.hide();
            }
          }
        };
  
        this.openerClickHandler = function(e) {
          e.preventDefault();
          self.toggle();
        };
  
        this.opener.on(this.options.toggleEvent, this.openerClickHandler);
      },
      isOpened: function() {
        return this.container.hasClass(this.options.menuActiveClass);
      },
      show: function() {
        this.container.addClass(this.options.menuActiveClass);
        if(this.options.hideOnClickOutside) {
          this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
        }
      },
      hide: function() {
        this.container.removeClass(this.options.menuActiveClass);
        if(this.options.hideOnClickOutside) {
          this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
      },
      toggle: function() {
        if(this.isOpened()) {
          this.hide();
        } else {
          this.show();
        }
      },
      destroy: function() {
        this.container.removeClass(this.options.menuActiveClass);
        this.opener.off(this.options.toggleEvent, this.clickHandler);
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    };
  
    var activateResizeHandler = function() {
      var win = $(window),
        doc = $('html'),
        resizeClass = 'resize-active',
        flag, timer;
      var removeClassHandler = function() {
        flag = false;
        doc.removeClass(resizeClass);
      };
      var resizeHandler = function() {
        if(!flag) {
          flag = true;
          doc.addClass(resizeClass);
        }
        clearTimeout(timer);
        timer = setTimeout(removeClassHandler, 500);
      };
      win.on('resize orientationchange', resizeHandler);
    };
  
    $.fn.mobileNav = function(opt) {
      var args = Array.prototype.slice.call(arguments);
      var method = args[0];
  
      return this.each(function() {
        var $container = jQuery(this);
        var instance = $container.data('MobileNav');
  
        if (typeof opt === 'object' || typeof opt === 'undefined') {
          $container.data('MobileNav', new MobileNav($.extend({
            container: this
          }, opt)));
        } else if (typeof method === 'string' && instance) {
          if (typeof instance[method] === 'function') {
            args.shift();
            instance[method].apply(instance, args);
          }
        }
      });
    };
  }(jQuery));
}

},{}],9:[function(require,module,exports){
module.exports = function inViewPortPlugin() {
  ;(function($, $win) {
    'use strict';
  
    var ScrollDetector = (function() {
      var data = {};
  
      return {
        init: function() {
          var self = this;
  
          this.addHolder('win', $win);
  
          $win.on('load.blockInViewport resize.blockInViewport orientationchange.blockInViewport', function() {
            $.each(data, function(holderKey, holderData) {
              self.calcHolderSize(holderData);
  
              $.each(holderData.items, function(itemKey, itemData) {
                self.calcItemSize(itemKey, itemData);
              });
            });
          });
        },
  
        addHolder: function(holderKey, $holder) {
          var self = this;
          var holderData =  {
            holder: $holder,
            items: {},
            props: {
              height: 0,
              scroll: 0
            }
          };
  
          data[holderKey] = holderData;
  
          $holder.on('scroll.blockInViewport', function() {
            self.calcHolderScroll(holderData);
  
            $.each(holderData.items, function(itemKey, itemData) {
              self.calcItemScroll(itemKey, itemData);
            });
          });
  
          this.calcHolderSize(data[holderKey]);
        },
  
        calcHolderSize: function(holderData) {
          var holderOffset = window.self !== holderData.holder[0] ? holderData.holder.offset() : 0;
  
          holderData.props.height = holderData.holder.get(0) === window ? (window.innerHeight || document.documentElement.clientHeight) : holderData.holder.outerHeight();
          holderData.props.offset = holderOffset ? holderOffset.top : 0;
  
          this.calcHolderScroll(holderData);
        },
  
        calcItemSize: function(itemKey, itemData) {
          itemData.offset = itemData.$el.offset().top - itemData.holderProps.props.offset;
          itemData.height = itemData.$el.outerHeight();
  
          this.calcItemScroll(itemKey, itemData);
        },
  
        calcHolderScroll: function(holderData) {
          holderData.props.scroll = holderData.holder.scrollTop();
        },
  
        calcItemScroll: function(itemKey, itemData) {
          var itemInViewPortFromUp;
          var itemInViewPortFromDown;
          var itemOutViewPort;
          var holderProps = itemData.holderProps.props;
  
          switch (itemData.options.visibleMode) {
            case 1:
              itemInViewPortFromDown = itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height < holderProps.scroll + holderProps.height;
              itemInViewPortFromUp   = itemData.offset > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2;
              break;
  
            case 2:
              itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + itemData.height / 2 < holderProps.scroll + holderProps.height);
              itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height / 2 > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
              break;
  
            case 3:
              itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset < holderProps.scroll + holderProps.height);
              itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
              break;
  
            default:
              itemInViewPortFromDown = itemInViewPortFromDown || (itemData.offset < holderProps.scroll + holderProps.height / 2 || itemData.offset + Math.min(itemData.options.visibleMode, itemData.height) < holderProps.scroll + holderProps.height);
              itemInViewPortFromUp   = itemInViewPortFromUp || (itemData.offset + itemData.height - Math.min(itemData.options.visibleMode, itemData.height) > holderProps.scroll || itemData.offset + itemData.height > holderProps.scroll + holderProps.height / 2);
              break;
          }
  
  
          if (itemInViewPortFromUp && itemInViewPortFromDown) {
            if (!itemData.state) {
              itemData.state = true;
              itemData.$el.addClass(itemData.options.activeClass)
                  .trigger('in-viewport', true);
  
              if (itemData.options.once || ($.isFunction(itemData.options.onShow) && itemData.options.onShow(itemData))) {
                delete itemData.holderProps.items[itemKey];
              }
            }
          } else {
            itemOutViewPort = itemData.offset < holderProps.scroll + holderProps.height && itemData.offset + itemData.height > holderProps.scroll;
  
            if ((itemData.state || isNaN(itemData.state)) && !itemOutViewPort) {
              itemData.state = false;
              itemData.$el.removeClass(itemData.options.activeClass)
                  .trigger('in-viewport', false);
            }
          }
        },
  
        addItem: function(el, options) {
          var itemKey = 'item' + this.getRandomValue();
          var newItem = {
            $el: $(el),
            options: options
          };
          var holderKeyDataName = 'in-viewport-holder';
  
          var $holder = newItem.$el.closest(options.holder);
          var holderKey = $holder.data(holderKeyDataName);
  
          if (!$holder.length) {
            holderKey = 'win';
          } else if (!holderKey) {
            holderKey = 'holder' + this.getRandomValue();
            $holder.data(holderKeyDataName, holderKey);
  
            this.addHolder(holderKey, $holder);
          }
  
          newItem.holderProps = data[holderKey];
  
          data[holderKey].items[itemKey] = newItem;
  
          this.calcItemSize(itemKey, newItem);
        },
  
        getRandomValue: function() {
          return (Math.random() * 100000).toFixed(0);
        },
  
        destroy: function() {
          $win.off('.blockInViewport');
  
          $.each(data, function(key, value) {
            value.holder.off('.blockInViewport');
  
            $.each(value.items, function(key, value) {
              value.$el.removeClass(value.options.activeClass);
              value.$el.get(0).itemInViewportAdded = null;
            });
          });
  
          data = {};
        }
      };
    }());
  
    ScrollDetector.init();
  
    $.fn.itemInViewport = function(options) {
      options = $.extend({
        activeClass: 'in-viewport',
        once: true,
        holder: '',
        visibleMode: 1
      }, options);
  
      return this.each(function() {
        if (this.itemInViewportAdded) {
          return;
        }
  
        this.itemInViewportAdded = true;
  
        ScrollDetector.addItem(this, options);
      });
    };
  }(jQuery, jQuery(window)));
}

},{}]},{},[6]);
