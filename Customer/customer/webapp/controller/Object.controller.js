sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, History, formatter, MessageToast) {
    "use strict";

    return BaseController.extend("customer.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit : function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page shows busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                    busy : true,
                    delay : 0
                });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
        },
        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        onGravar: function(){

            var oModel = this.getView().getModel();
            var path = this.getView().getBindingContext().getPath();
            var obj = {
                Nome: this.byId("inputNome").getValue(),
                Telefone: "44566545",
                UF: "PR",
                Email: "oi@tchau.fui",
                Status: "1"
            };

            oModel.update(path, obj, {
                success: function(oDados, resposta){

                },
                error: function(oError){

                }
            })
        },

        onGravar2: function(){

            var oModel = this.getView().getModel();

            oModel.submitChanges( {
                success: function(oDados, resposta){
                    MessageToast.show("Data saved")
                },
                error: function(oError){
                    MessageToast.show("Failed")
                }
            })
        },

        onCancelar: function(oEvent){         
            
            var m = this.getView().getModel();

            if(m.hasPendingChanges()){
                MessageToast.show("Changes reset");
            } else{
                MessageToast.show("No changes to reset");
                return
            }

            m.resetChanges();
        },

        /**
         * Event handler  for navigating back.
         * It there is a history entry we go one step back in the browser history
         * If not, it will replace the current entry of the browser history with the worklist route.
         * @public
         */
        onNavBack : function() {
            var sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                // eslint-disable-next-line fiori-custom/sap-no-history-manipulation
                history.go(-1);
            } else {
                this.getRouter().navTo("worklist", {}, true);
            }
        },

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched : function (oEvent) {
            var sObjectId =  oEvent.getParameter("arguments").objectId;
            this._bindView("/ClienteSet" + sObjectId);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        _bindView : function (sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange : function () {
            var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.ClienteID,
                sObjectName = oObject.ClienteSet;

                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/shareSendEmailSubject",
                    oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
                oViewModel.setProperty("/shareSendEmailMessage",
                    oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        }
    });

});
