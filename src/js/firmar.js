function modalFirmaSupervisor()
{        
  var modal = app.modal({
    title:'<canvas class="canvas" id="canvas"></canvas>',
    buttons: [
    {              
        text: '<span class="color-red">CANCELAR</span>'             
    },
    {
        text: ' Limpiar', 
        onClick: function(){     
           //Funcion para limpiar el canvas
           limpiarFirmaSupervisor();                            
        },
        close: false,         
    },
    {
        text: 'GUARDAR',
        bold: true, 
        onClick: function() {
           //Funcion para guardar la firma
           guardarFirmaSupervisor();
        }
     },
    ] 

    });

        //Example : https://codepen.io/honmanyau/pen/OoOMQR

        /*
        |--------------------------
        |  Globals
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        const canvas = document.getElementById('canvas');
        const canvasContext = canvas.getContext('2d');
        //const clearButton = document.getElementById('clear-button');
        const state = {
          mousedown: false
        };            

        /*
        |--------------------------
        |  Configuration
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        const lineWidth = 0.1;
        const halfLineWidth = lineWidth / 2;
        const fillStyle = '#003bb0';
        const strokeStyle = '#003bb0';
        const shadowColor = '#003bb0';
        const shadowBlur = lineWidth / 4;

        /*
        |--------------------------
        | Events Listeners
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        */
        canvas.addEventListener('mousedown', handleWritingStart);
        canvas.addEventListener('mousemove', handleWritingInProgress);
        canvas.addEventListener('mouseup', handleDrawingEnd);
        canvas.addEventListener('mouseout', handleDrawingEnd);

        canvas.addEventListener('touchstart', handleWritingStart);
        canvas.addEventListener('touchmove', handleWritingInProgress);
        canvas.addEventListener('touchend', handleDrawingEnd);

        //clearButton.addEventListener('click', handleClearButtonClick);
        

        /*
        |--------------------------
        |  Event Handlers
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function handleWritingStart(event) {

           event.preventDefault();

           const mousePos = getMosuePositionOnCanvas(event);
          
           canvasContext.beginPath();

           canvasContext.moveTo(mousePos.x, mousePos.y);

           canvasContext.lineWidth = lineWidth;
           canvasContext.strokeStyle = strokeStyle;
           canvasContext.shadowColor = null;
           canvasContext.shadowBlur = null;

           canvasContext.fill();
          
           state.mousedown = true;
        }

        
        /*
        |--------------------------
        |  Touch Move
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function handleWritingInProgress(event) {

           event.preventDefault();
          
           if (state.mousedown) {

              const mousePos = getMosuePositionOnCanvas(event);
              canvasContext.lineTo(mousePos.x, mousePos.y);
              canvasContext.stroke();

           }

        }
        
        /*
        |--------------------------
        |  Touch End
        |--------------------------
        | Al terminar de dibujar
        | crea automaticamente 
        | la imagen de la firma
        |
        |
        |
        |
        |
        */
        function handleDrawingEnd(event) {

           event.preventDefault();
          
           if (state.mousedown) {

              canvasContext.shadowColor = shadowColor;
              canvasContext.shadowBlur = shadowBlur;
              canvasContext.stroke();

           }
          
           state.mousedown = false;
           canvasURL();
        }
        
        /*
        |--------------------------
        |  Canvas URL
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function canvasURL() {

           var canvasURL = canvas.toDataURL('image/jpeg', 1.0); //Formato png
           $$('#string-firma').prop('innerHTML', '');
           $$('#string-firma').prop('innerHTML', canvasURL);

           $$('#imagen-firma').prop('src', '');
           $$('#imagen-firma').prop('src', canvasURL);

        }

        /*
        |--------------------------
        |  Handle Clear Button
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function limpiarFirmaSupervisor(event) {

           canvasContext.clearRect(0, 0, canvas.width, canvas.height);

           $$('#string-firma').prop('innerHTML', '');
           $$('#imagen-firma').prop('src', '');

        }

        /*
        |--------------------------
        |  Helper Functions
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function getMosuePositionOnCanvas(event) {

           const clientX = event.clientX || event.touches[0].clientX;
           const clientY = event.clientY || event.touches[0].clientY;
           const { offsetLeft, offsetTop } = event.target;
           const canvasX = clientX - offsetLeft;
           const canvasY = clientY - offsetTop;

           // change non-opaque pixels to white
           var imgData = canvasContext.getImageData(0,0,canvas.width,canvas.height);
           var data    = imgData.data;
          
           for(var i=0;i<data.length;i+=4){

              if(data[i+3]<255){

                 data[i]=255;
                 data[i+1]=255;
                 data[i+2]=255;
                 data[i+3]=255;

              }
           }

           canvasContext.putImageData(imgData,0,0);

           return { x: canvasX, y: canvasY };
        }

        /*
        |--------------------------
        |  Clear Canvas
        |--------------------------
        |
        |
        |
        |
        |
        |
        |
        |
        */
        function clearCanvas() {
           
        }

     }