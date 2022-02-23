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
