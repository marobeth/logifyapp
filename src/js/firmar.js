
import $$ from "dom7";
import config from "./config";
import {$,jQuery} from "jquery";

//window.$ = $;
//window.jQuery = jQuery;




var firmarAcuse = {
    
    status_mouse : false,
    canvass : {},
    canvasContext:{},
    points: [],
    canvasfront : {},
    AceptarFirma:(app)=>{
        firmarAcuse.canvasURL(app, firmarAcuse.canvass, firmarAcuse.canvasContext);
        $$("#btn_guardar").show();

    },
    LimpiarFirma:(app)=>{
        firmarAcuse.limpiarFirma(app, firmarAcuse.canvass, firmarAcuse.canvasContext);
        $$("#btn_guardar").hide();
    },
    firmaModal:(app)=>{ 
          
            var params = {
              reset : $$('#LimpiarFirma'),
              lineWidth : 3,
              height : 50,
              width : 50
            };
           
            var canvasObject = $$('#myCanvas'); 
            
            params.width = canvasObject.width();
            params.height = canvasObject.height();

            var canvas = canvasObject[0];
            
            var lineWidth = params.lineWidth;
            
            var context = canvas.getContext('2d');
           
            context.lineJoin = context.lineCap = 'round';
          
            var fixFingerPosition = 15;            

           // canvasObject.attr("width",params.width);
           // canvasObject.attr("height", params.height); 

            
            firmarAcuse.points = [];
            var last = {x:null,y:null};
            var holdClick = false;

            firmarAcuse.canvass = canvas;
            firmarAcuse.canvasContext = context;
   
            var touch = function(e)
            {
                
                var touch = null;
                if (e.type !== 'click' && e.type !== 'mousedown' && e.type !== 'mousemove') {
                   
                    touch = e.touches[0] || e.changedTouches[0];
                } else {
                    
                    touch = e;
                }
                
                return ({x: touch.pageX, y: touch.pageY});
            }

            var getMousePosition = function(canvas, evt)
            {
              
                var rect = canvas.getBoundingClientRect();
                 
                var pos = touch(evt);
               
                return {
                    x: pos.x + rect.left - fixFingerPosition,
                    y: pos.y - rect.top - fixFingerPosition
                };
            }

            var draw = function(ctx, x, y)
            {
                firmarAcuse.points.push({x: x, y: y, break: false});
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                var p1 = firmarAcuse.points[0];
                var p2 = firmarAcuse.points[1];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);  
  
                for (var i = 1; i < firmarAcuse.points.length; i++) {
                    var midPoint = calculateMiddlePoint(p1, p2);
                    if (p1.break) {
                        ctx.moveTo(p2.x, p2.y); 
                    } else {
                        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                    }
                    p1 = firmarAcuse.points[i];
                    p2 = firmarAcuse.points[i+1];
                }
                
                ctx.lineWidth = lineWidth;
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }

            var calculateMiddlePoint = function(pointStart, pointEnd)
            {
                return {
                    x: pointStart.x + (pointEnd.x - pointStart.x) / 2 ,
                    y: pointStart.y + (pointEnd.y - pointStart.y) / 2
                }
            }

            // Mouse & touch events
            canvasObject.on('touchstart mousedown', function(e) {
               
                holdClick = true;
                var mousePosition = getMousePosition(canvas, e);  
                               
                firmarAcuse.points.push({x: mousePosition.x, y: mousePosition.y, break: false});

/*
                var options = {
                    cameraFacing: 'front',
                    width: 400,
                    height: 600,
                    canvas: {
                      width: 400,
                      height: 600
                    },
                    capture: {
                      width: 400,
                      height: 600
                    }
                };
                */
                var options = {
                    cameraFacing: 'front',
                    width: 450,
                    height: 675,
                    canvas: {
                        width: 450,
                        height: 675
                    },
                    capture: {
                        width: 450,
                        height: 675
                    }
                };
                window.plugin.CanvasCamera.start(options);
                 
                return false;
            }).on('touchmove mousemove', function(e)
            {
                //app.dialog.alert('touchmove');
                if (holdClick) {
                    var mousePosition = getMousePosition(canvas, e);                    
                    draw(context, mousePosition.x, mousePosition.y);
                }
                return false;
            }).on('touchend mouseup', function(e) {
                
                e.preventDefault();
                holdClick = false;
                firmarAcuse.points[firmarAcuse.points.length - 1].break = true;

                var canvas_Foto = $$('#myCanvasRealtime')[0];


               //firmarAcuse.canvasfront = firmarAcuse.ResizeImage(app,canvas_Foto.toDataURL());

               firmarAcuse.ResizeImage(app,canvas_Foto.toDataURL());

               // app.dialog.alert('stop');
                
                return false;
            });

            // Reset canvas
            var reset = function()
            {
                context.clearRect(0, 0, canvas.width(), canvas.height());
                firmarAcuse.points.length = 0;
            }

            if (params.reset !== null) {
                params.reset.on('click touchend', function()
                {
                   // reset();
                });
            }  
       
    },
     canvasURL:(app, canvas, canvasContext) => {
       //app.dialog.alert('canvasURL');
       var canvasURL = canvas.toDataURL(); //Formato png
       //app.dialog.alert('canvasURL 2');
      // $$('#string-firma').prop('innerHTML', '');
      // $$('#string-firma').prop('innerHTML', canvasURL);

       $$('#imagen-firma').prop('src', '');
       $$('#imagen-firma').prop('src', canvasURL);

    },
    limpiarFirma(app,canvas, canvasContext) {

       canvasContext.clearRect(0, 0, canvas.width, canvas.height);
       firmarAcuse.points.length = 0;
      // $$('#string-firma').prop('innerHTML', '');
       $$('#imagen-firma').prop('src', '');

    },
    ResizeImage:(app,base64Str) =>
    {

      
        var img = new Image();//create a image
        img.src = base64Str;//result is base64-encoded Data URI
        //img.name = event.target.name;//set name (optional)
        //img.size = event.target.size;//set size (optional)
        var resize_width = 600;
        img.onload = function(el) {
              var elem = document.createElement('canvas');//create a canvas

              //scale the image to 600 (width) and keep aspect ratio
              var scaleFactor = resize_width / el.target.width;
              elem.width = resize_width;
              elem.height = el.target.height * scaleFactor;

              //draw in canvas
              var ctx = elem.getContext('2d');
              ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

              //get the base64-encoded Data URI from the resize image
              var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

              firmarAcuse.canvasfront = srcEncoded;
            //  app.dialog.alert(srcEncoded);
              //Valor = srcEncoded;

              //$("#imagen").prop('src', Valor);
             // alert('Imagen');
         
        }
    }

};

export default firmarAcuse;
