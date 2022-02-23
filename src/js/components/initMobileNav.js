module.exports = function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener'
	});
}

let mobileNavPluginCall = require('./../plugins/mobileNavPlugin');
mobileNavPluginCall();
