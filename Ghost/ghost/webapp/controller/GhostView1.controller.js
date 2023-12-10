sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ghost.controller.GhostView1", {
            onInit: function () {

                
            },           
            
            onAfterRendering: function () {
                var ghost = this.getView().getDomRef("-ghost");
                var ghostX = 0;
                var ghostY = 0;
        
                const handleMouseMove = (event) => {
                    ghost.classList.add("active");
        
                    event = event || window.event;    

                    if ((event.pageX > 320 && event.pageX < 1530) && ( event.pageY > 100 && event.pageY < 900)){
                        followCursor(event.pageX, event.pageY)
                    } 
                }

                const followCursor = (pageX, pageY) => {
        
                    const diffX = ( pageX - 350 ) - ghostX;
                    const diffY = ( pageY - 120 ) - ghostY;
        
                    ghostX += diffX;
                    ghostY += diffY;

                    ghost.style.transform = `translate(${ghostX}px, ${ghostY}px)`;
                }   

                document.addEventListener("mousemove", event => handleMouseMove(event));
        
                document.addEventListener("mouseleave", event => {
                    ghost.classList.remove('active');
                    ghost.style.animation = "none";
                });
            }
        });
    });
