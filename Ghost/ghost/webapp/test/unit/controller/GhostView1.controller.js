/*global QUnit*/

sap.ui.define([
	"ghost/controller/GhostView1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("GhostView1 Controller");

	QUnit.test("I should test the GhostView1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
