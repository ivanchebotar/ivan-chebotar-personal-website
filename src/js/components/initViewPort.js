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
