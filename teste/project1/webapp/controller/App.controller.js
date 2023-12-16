sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("project1.controller.App", {
      onInit: function () {

        var oPessoaModel = new JSONModel({
          nome: "Jonathan",
          sobrenome: "José",
          habilitado: true,
          endereco: {
            rua: "Avenida Victor Hugo 156",
            cidade: "Paris",
            cep: "12345",
            pais: "Franca"
          }
        });

        this.getView().setModel(oPessoaModel, "pessoa");

        var oFuncionarios = {
          Funcionarios: [
            {
              nome: "Steven",
              sobrenome: "Job",
              habilitado: true
            },
            {
              nome: "Burt",
              sobrenome: "Preynolds",
              habilitado: false
            },
            {
              nome: "Maiqe",
              sobrenome: "Tailson",
              habilitado: false
            },
          ]
        }
        var oFunModel = new JSONModel(oFuncionarios);
        this.getView().setModel(oFunModel, "empregados");
      },

      onFuncionarioSelected: function(oEvent){
        var oSelectedItem = oEvent.getSource();
        var oContext = oSelectedItem.getBindingContext("empregados");
        var sPath = oContext.getPath();
        var oPanel = this.byId("detalhePanel");
        oPanel.bindElement({

          path: sPath,
          model: "empregados"
        })
      },

      onNavToClient: function(){
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("detailPage");
      }
    });
  }
);
