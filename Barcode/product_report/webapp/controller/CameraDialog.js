sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/m/MessageBox",
    'sap/m/MessageToast'
], function (
    ManagedObject, MessageBox, MessageToast
) {
    "use strict";

    return ManagedObject.extend("barcodescan.controller.CameraDialog", {

        constructor: function (oView) {
            this._oView = oView;
        },

        open: function () {

            return new Promise((resolve, reject) => {
                this.oController = this._oView.getController();
                this.resolve = resolve;
                this.reject = reject;
                this._oScanDialog = sap.ui.getCore().byId("cameraScanDialog");
                this.scan1 == "";
                this.scan2 == "";
                this.scan3 == "";

                if (!this._oScanDialog) {
                    this._oScanDialog = new sap.m.Dialog({
                        id: "cameraScanDialog",
                        title: "Scan barcode",
                        contentWidth: "640px",
                        contentHeight: "480px",
                        horizontalScrolling: false,
                        verticalScrolling: false,
                        stretchOnPhone: true,
                        content: [new sap.ui.core.HTML({
                            id: this.oController.createId("scanContainer"),
                            content: "<div />"
                        })],
                        beginButton: new sap.m.Button({
                            text: "Insert Code",
                            press: function (oEvent) {
                                this._oScanDialog.close();
                                //this.reject("Insert Code");
                                var input = this._onInputValue();

                                input.then(function (text) {
                                    resolve(text);
                                });


                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: function (oEvent) {
                                this._oScanDialog.close();
                            }.bind(this)
                        }),
                        afterOpen: function () {
                            this._initQuagga(this.oController.getView().byId("scanContainer").getDomRef()).done(function () {
                                // Initialisation done, start Quagga
                                Quagga.start();
                            }).fail(function (oError) {
                                // Failed to initialise, show message and close dialog...this should not happen as we have
                                // already checked for camera device ni /model/models.js and hidden the scan button if none detected

                                MessageBox.error(oError.message.length ? oError.message : ("Failed to initialise Quagga with reason code " + oError.name), {
                                    onClose: function () {
                                        this._oScanDialog.close();
                                        this._onInputValue();
                                        var input = this._onInputValue();

                                        input.then(function (text) {
                                            resolve(text);
                                        });

                                        //this.reject(oError.message.length ? oError.message : ("Failed to initialise Quagga with reason code " + oError.name));
                                    }.bind(this)
                                });



                            }.bind(this));




                        }.bind(this),
                        afterClose: function () {
                            // Dialog closed, stop Quagga
                            Quagga.stop();
                            //this._oView.removeAllDependents();
                            this._oScanDialog.destroy();


                        }.bind(this)
                    });
                    //this._oView.removeAllDependents();
                    this._oView.addDependent(this._oScanDialog);
                }

                this._oScanDialog.open();
            });
        },

        _initQuagga: function (oTarget) {
            var oDeferred = jQuery.Deferred();

            // Initialise Quagga plugin - see https://serratus.github.io/quaggaJS/#configobject for details
            Quagga.init({
                inputStream: {
                    type: "LiveStream",
                    target: oTarget,
                    constraints: {
                        width: { min: 640 },
                        height: { min: 480 },
                        facingMode: "environment"
                    }
                },
                //  locator: {
                //    patchSize: "medium",
                //  halfSample: true
                // },
                //numOfWorkers: 2,
                //requency: 10,
                decoder: {
                    readers: [{
                        format: "code_128_reader",
                        config: {}
                    }],
                    debug: {
                        drawBoundingBox: true,
                        showFrequency: true,
                        drawScanline: true,
                        showPattern: true,

                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true
                        }
                    }
                },
                locate: true
            }, function (error) {
                if (error) {
                    oDeferred.reject(error);
                } else {
                    oDeferred.resolve();
                }
            });

            if (!this._oQuaggaEventHandlersAttached) {
                // Attach event handlers...

                Quagga.onProcessed(function (result) {
                    var drawingCtx = Quagga.canvas.ctx.overlay,
                        drawingCanvas = Quagga.canvas.dom.overlay;

                    if (result) {
                        // The following will attempt to draw boxes around detected barcodes
                        if (result.boxes) {
                            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                            result.boxes.filter(function (box) {
                                return box !== result.box;
                            }).forEach(function (box) {
                                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                            });
                        }

                        if (result.box) {
                            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                        }

                        if (result.codeResult && result.codeResult.code) {
                            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                        }
                    }
                }.bind(this));

                Quagga.onDetected(function (result) {
                    // Barcode has been detected, value will be in result.codeResult.code. If requierd, validations can be done 
                    // on result.codeResult.code to ensure the correct format/type of barcode value has been picked up

                    // Set barcode value in input field
                    //this.getView().byId("scannedValue").setValue(result.codeResult.code);     
                    if (this.scan1 == "")
                        this.scan1 = result.codeResult.code;

                    if (this.scan1 !== "")
                        this.scan2 = result.codeResult.code;

                    if (this.scan2 !== "")
                        this.scan3 = result.codeResult.code;
                    if (this.scan1 == this.scan2 && this.scan1 == this.scan3) {

                        // Close dialog
                        var state = sap.ui.getCore().byId("cameraScanDialog").isOpen();
                        sap.ui.getCore().byId("cameraScanDialog").close();
                        //this._oScanDialog.destroy();

                        this.resolve(result.codeResult.code);
                    } else {
                        this.scan1 = "";
                        this.scan2 = "";
                        this.scan3 = "";

                    }
                }.bind(this));

                // Set flag so that event handlers are only attached once...
                this._oQuaggaEventHandlersAttached = true;
            }

            return oDeferred.promise();
        },
        _onInputValue: function () {

            return new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
                if (!this._InputDialog) {
                    this._InputDialog = new sap.m.Dialog({
                        title: "Insert barcode",
                        contentWidth: "600px",
                        contentHeight: "10px",
                        horizontalScrolling: false,
                        verticalScrolling: false,
                        stretchOnPhone: true,
                        content: [new sap.m.Input("inpDialog", { value: "" })],
                        beginButton: new sap.m.Button({
                            text: "OK",
                            press: function (oEvent) {

                                try {
                                    let inp = sap.ui.getCore().byId("inpDialog");
                                    let value = inp.getValue();

                                    if (value == "" || value == undefined) {
                                        MessageBox.error(
                                            "Enter the code!"
                                        );
                                    } else {
                                        this._InputDialog.close();
                                        MessageToast.show(value);
                                        this.resolve(value);
                                    }
                                } catch (e) {

                                }



                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            press: function (oEvent) {
                                this._InputDialog.close();
                            }.bind(this)
                        }),
                        afterOpen: function () {

                        }.bind(this),
                        afterClose: function () {

                        }.bind(this)
                    });

                    this._oView.addDependent(this._InputDialog);
                }

                try {
                    let i = sap.ui.getCore().byId("inpDialog");
                    i.setValue("");

                } catch (e) {

                }
                this._InputDialog.open();
            })
        }
    });
});