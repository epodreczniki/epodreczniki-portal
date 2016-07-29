/*globals svgEditor*/

svgEditor.setConfig({

	noDefaultExtensions : true,
	extensions: [
	//	defaults
		'ext-overview_window.js',
		'ext-markers.js',
		'ext-connector.js',
		'ext-eyedropper.js',
		'ext-shapes.js',
	//	'ext-imagelib.js',
		'ext-grid.js',
		'ext-polygon.js',
		'ext-star.js',
		'ext-panning.js',
	//	'ext-storage.js'

	//	additional
	//	'ext-arrows.js',
	//	'ext-closepath.js',
	//	'ext-executablebuilder.js',
	//	'ext-foreignobject.js',
	//	'ext-helloworld.js',
		'ext-mathjax.js',
	//	'ext-server_moinsave.js',
	//	'ext-server_opensave.js',
	//	'ext-webappfind.js',
	//	'ext-xdomain-messaging.js',

	],


	dimensions: [320, 480],
	emptyStorageOnDecline: true,
	noStorageOnLoad : true,
	lockExtensions : true,
	showRulers : false,
	allowedOrigins: [window.location.origin] // May be 'null' (as a string) when used as a file:// URL
});
