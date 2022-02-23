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
