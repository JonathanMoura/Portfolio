sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("dev401imagesearch.imagesearch.controller.View1", {
            onInit: function () {
                
                var oImageList = {
                    Images: []
                };

                var oImageModel = new JSONModel(oImageList);
                this.getView().setModel(oImageModel,"ImageModelAlias");
            },

            onSearchImage: function (oEvent) {
                var sQuery = oEvent.getParameters().query;

                if(!sQuery || sQuery.lenght == 0){
                    MessageBox.error("Enter a search term!");
                } else {
                    var oRequest = this.ajaxRequest(sQuery);
                    oRequest.then( function (data, textStatus, jqXHR) {

                        var oImageModel = this.getView().getModel("ImageModelAlias");

                        //Refresh list
                        var oImageList = {
                            Images: []
                        }
                        oImageModel.setData(oImageList);

                        //Get result
                        var images = data[0].response.images;

                        for(var i = 0; i < images.length; i++){
                            var image = images[i];
                            oImageList.Images.push(image);
                        }
                        oImageModel.refresh();

                    }.bind(this))
                }
            },

            ajaxRequest: function (sQuery) {

                return new Promise((resolve,reject) => {
                    $.ajax({
                        //endpoint
                        url:'https://image-search13.p.rapidapi.com/',
                        method: 'GET',
                        assync: true,
                        crossDomain: true,
                        jsonpCallback: 'getJSON',
                        contentType: 'application/json',
                        
                        headers: {
                            'X-RapidAPI-Key': 'b0a4b91909msh84a5065c38258b1p186783jsnf26f529efd97',
		                    'X-RapidAPI-Host': 'image-search13.p.rapidapi.com'
                        },

                        data : {
                            'query': sQuery,
                            'limit': 10
                        },

                        //callback
                        success: (...args) => {
                            resolve(args)
                        },

                        error: (...args) => {
                            reject(args)
                        }
                    })
                })  
            }
        });
    });
