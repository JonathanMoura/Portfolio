sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(
    Controller,
    HistoryChannel
) {
    "use strict";

    return Controller.extend("fiorinet.template.controller.Object", {
        
        onNavBack:function(){
            var oHistory, sPreviousHash;
            oHistory = HistoryChannel.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if( sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("appHome", {}, true);
            }
        }
    })
}
)