/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"dev401_image_search/image_search/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
