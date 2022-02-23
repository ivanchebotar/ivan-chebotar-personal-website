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
