sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                
            //Lógica quagga
            //Disable the scan barcode button by default
            oModel.setProperty("/barcodeScanEnabled", false);

            if(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true}).then(function (stream) {
                    //device supports video, which means will enable the scan button
                    oModel.setProperty("/barcodeScanEnabled", true);
                }).catch(function (err) {
                    // not supported, barcodeScanEnabled already default to false
                });
            }
            return oModel;
        }
    };
});