sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent"
], function(
	BaseController,
	JSONModel,
	formatter,
    History,
    UIComponent
) {
	"use strict";

	return BaseController.extend("customer.controller.Create", {
        formatter: formatter,

        onNavBack: function(){
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
        
            if(sPreviousHash !== undefined){
                window.history.go(-1);
            }else{
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("worklist", {}, true);
            }
        },

        onGravar: function(){

            var oModel = this.getView().getModel();
            var dados = {
                Nome: this.byId("inputNome").getValue(),
                Telefone: this.byId("inputTelefone").getValue(),
                UF: this.byId("inputUF").getValue(),
                Email: this.byId("inputEmail").getValue(),
                Status: "1"
            };
            
            oModel.create("/ClienteSet", dados, {
                success:function(dados, resposta){
                    sap.m.MessageToast.show("Client created");
                    var mensagem = JSON.parse(resposta.headers["sap-message"]);
                    var clienteID = "('"+dados.ClienteID+"')";
                    this.getRouter().navTo("object", {
                        objectId: clienteID
                    });
                }.bind(this),
                error:function(error){
                    console.error(error);
                }.bind(this)
            })
        }
	});
});