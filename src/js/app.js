import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

//var URL_WS = "http://192.168.10.51/api.logify.com.mx/";
var URL_WS = "https://api.logify.com.mx/";
//var URL_WS = "https://desarrollo.api.logify.com.mx/";


/* TRADUCIR STATUS */
function traducirStatus(status) {
    switch (status) {
        case '1':
            //Solicitado
            return 'Solicitado';
        case '2':
            //Recolectado
            return 'Recolectado';
            break;
        case '3':
            //En ruta
            return 'En Ruta';
            break;
        case '4':
            //Entregado
            return 'Entregado';
            break;
        case '5':
            //Incidencia
            return 'Incidencia';
            break;
        case '6':
            //Devuelto
            return 'Devuelto';
            break;
        case '7':
            //Ocurre
            return 'Ocurre';
            break;
        case '8':
            //En almacén
            return 'En almacen';
            break;
    }
}

function detectarProyecto(num_guia) {
    if (num_guia.includes('BCL1234')) {
        return "Tokens";
    }
    if (num_guia.includes('BCL0001')) {
        return "Chequeras";
    }
    if (num_guia.includes('BCL0002')) {
        return "Tarjetas a domicilio";
    }
    if (num_guia.includes('BCL0003')) {
        return "Archivo Muerto";
    }
    if (num_guia.includes('BCL0004')) {
        return "PPF";
    }
    if (num_guia.includes('BCL0005')) {
        return "Marketing";
    }
    if (num_guia.includes('BCL0006')) {
        return "Tarjetas a sucursal";
    }
    if (num_guia.includes('VTA0001')) {
        return "Vidanta General";
    }
    if (num_guia.includes('ADM0001')) {
        return "Adamantium General";
    }
    if (num_guia.includes('NDR0001')) {
        return "Nadro General";
    }
    if (num_guia.includes('UP0001')) {
        return "UP General";
    }
    if (num_guia.includes('PML0001')) {
        return "Publimetro General";
    }
    if (num_guia.includes('RCH0001')) {
        return "Rich General";
    }
    if (num_guia.includes('DIA0001')) {
        return "Diageo General";
    }
}

/* GEOLOCATION */
function getLocation() {
    var geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(showLocation, errorHandler);
}

function showLocation(position) {
    $$('#latitud').val(position.coords.latitude);
    $$('#longitud').val(position.coords.longitude);
}

function errorHandler(error) {
    console.log(error);
}


/*
function screenshot(){
     navigator.screenshot.URI(function(error,res){
        if(error){
            console.error(error);
        }else{
            app.request.setup({
                headers: {
                    'apikey': localStorage.getItem('apikey')     
                }
            });
            app.request.postJSON(
                URL_WS + 'guardar_screenshot',
                { 
                    correo : localStorage.getItem('correo'),
                    screenshot : res.URI,
                },function(data){},function(error){}, 'json'
            );
        }
    },50);
}
*/
function enviarUbicacion() {
    getLocation();
    app.request.setup({
        headers: {
            'apikey': localStorage.getItem('apikey')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.postJSON(
        URL_WS + 'location',
        {
            latitud: $$('#latitud').val(),
            longitud: $$('#longitud').val(),
            id_usuario: localStorage.getItem('userid')
        },
        function (data) {
        }, function (error) {
        },
        'json'
    );
}

/* GEOLOCATION */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //cordova.plugins.backgroundMode.enable();
    //cordova.plugins.backgroundMode.setEnabled(true);
    getLocation();
    //setInterval(enviarUbicacion, 10000);
    //setTimeout(function(){ cordova.plugins.backgroundMode.enable(); }, 3000);
}


var resize_image = function (img, canvas, max_width, max_height) {
    var ctx = canvas.getContext("2d");
    var canvasCopy = document.createElement("canvas");
    var copyContext = canvasCopy.getContext("2d");
    var ratio = 1;
    if (img.width > max_width) {
        ratio = max_width / img.width;
    } else if (img.height > max_height) {
        ratio = max_height / img.height;
    }
    canvasCopy.width = img.width;
    canvasCopy.height = img.height;
    copyContext.drawImage(img, 0, 0);
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
}


function imageCapture() {
    var options = {limit: 1};
    navigator.device.capture.captureImage(onSuccess, onError, options);
}


function onError(error) {
    //app.dialog.alert('Error code: ' + error.code, null, 'Capture Error');
}

function onSuccess(mediaFiles) {
    $$('#myCanvas').show();
    var canvas = $$('#myCanvas')[0];
    var img = new Image();
    img.src = mediaFiles[0].fullPath;
    img.onload = function () {
        resize_image(this, canvas, 800, 1200);
    };
}

function imageCapture2() {
    var options = {limit: 1};
    navigator.device.capture.captureImage(onSuccess2, onError2, options);
}

function onError2(error) {
    //navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
}

function onSuccess2(mediaFiles) {
    $$('#myCanvas2').show();
    var canvas = $$('#myCanvas2')[0];
    var img = new Image();
    img.src = mediaFiles[0].fullPath;
    img.onload = function () {
        resize_image(this, canvas, 800, 1200);
    };
}

/**
 * Cargar desde Camara
 * @param idCanvas
 */
function openCamera(idCanvas) {
    var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;
    var srcType = pictureSource.CAMERA;
    navigator.device.capture.captureImage(function onSuccess(mediaFiles) {
        //navigator.camera.getPicture(function onSuccess(mediaFiles) {
        $$('#' + idCanvas).show();
        var canvas = $$('#' + idCanvas)[0];
        var canva = document.getElementById(idCanvas);
        var con = canva.getContext('2d');
        var img = new Image();
        img.onload = function () {
            canva.width = img.width / 6;
            canva.height = img.height / 6;
            con.drawImage(img, 0, 0, img.width, img.height, 0, 0, canva.width, canva.height);
        };
        img.src = mediaFiles[0].fullPath;
        $$('#' + idCanvas).data("foto1", 1);
        navigator.camera.cleanup();
    }, function cameraError(error) {
        console.debug("No se puede obtener una foto: " + error, "app");

    }, {
        limit: 1,
        quality: 50,
        targetWidth: 800,
        targetHeight: 1200,
        destinationType: destinationType.DATA_URL,
        encodingType: navigator.camera.EncodingType.PNG,
        sourceType: srcType
    });
}

/**
 * Cargar desde galeria
 * @param idCanvas
 */
function openFilePicker(idCanvas) {
    var pictureSource = navigator.camera.PictureSourceType;
    var destinationType = navigator.camera.DestinationType;
    var srcType = pictureSource.SAVEDPHOTOALBUM;

    navigator.camera.getPicture(function cameraSuccess(imageURI) {
        $$('#' + idCanvas).show();
        var canvas = $$('#' + idCanvas);
        var canvass = document.getElementById(idCanvas);
        var context = canvass.getContext('2d');
        var img = new Image();
        img.onload = function () {
            canvass.width = img.width / 2;
            canvass.height = img.height / 2;
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvass.width, canvass.height);
        };
        img.src = imageURI;
        $$('#' + idCanvas).data("foto1", 1);
    }, function cameraError(error) {
        console.debug("No se puede obtener una foto: " + error, "app");

    }, {
        quality: 50,
        targetWidth: 800,
        targetHeight: 1200,
        destinationType: destinationType.FILE_URI,
        sourceType: srcType
    });
}

/**
 * Apikey
 * @param correo
 * @param pass
 */
function ValidateApikey(correo, pass) {
    //console.log('entre');
    app.request.setup({
        headers: {
            'email': correo,
            'pass': pass
        }
    });
    app.request.postJSON(
        URL_WS + 'login',
        function (data) {
             if(data[0].activo ==1){
                 app.preloader.hide();
                localStorage.setItem('auth', true);
                localStorage.setItem('apikey', data[0].apikey);
                localStorage.setItem('userid', data[0].user_id);
                localStorage.setItem('avatar', data[0].avatar);
                localStorage.setItem('nombre', data[0].nombre);
                localStorage.setItem('paterno', data[0].paterno);
                localStorage.setItem('correo', data[0].correo);
                app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
             }else{
                 app.dialog.alert('Error: Permiso Denegado');
             }
        }, function (data) {
            app.preloader.hide();
            app.dialog.alert('Error: Datos incorrectos');
        }
    );
}


var app = new Framework7({
    root: '#app', // App root element
    id: 'com.graphicsandcode.logify', // App bundle ID
    name: 'Logify', // App name
    theme: 'auto', // Automatic theme detection
    // App root data
    data: function () {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },

        };
    },
    // App root methods
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    // App routes
    routes: routes,
    // Enable panel left visibility breakpoint
    panel: {
        leftBreakpoint: 960,
    },


    // Input settings
    input: {
        scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
        scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
    },
    // Cordova Statusbar settings
    statusbar: {
        overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
    },
    on: {
        init: function () {
            var f7 = this;
            if (f7.device.cordova) {
                // Init cordova APIs (see cordova-app.js)
                cordovaApp.init(f7);
            }
        },
    },
});


$$('#btn_iniciar_sesion').on('click', function () {
    //app.preloader.show();
    var username = $$('#input_username').val();
    var password = $$('#input_password').val();

    ValidateApikey(username, password);
});

$$(document).on('page:init', '.page[data-name="inicio"]', function (e) {
    $$('#nombre_usuario').html(localStorage.getItem('nombre') + ' ' + localStorage.getItem('paterno'));
});

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    $$('#btn_iniciar_sesion').on('click', function () {
        //app.preloader.show();
        var username = $$('#input_username').val();
        var password = $$('#input_password').val();

        ValidateApikey(username, password);
    });

    $$('#btn_olvide').on('click', function () {
        cordova.InAppBrowser.open('https://admin.logify.com.mx/restablecer-contrasena', '_blank', 'location=yes');
    });
});

$$(document).on('page:afterin', '.page[data-name="home"]', function (e) {
    if (localStorage.getItem('auth') == 'true') {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    }
});


$$(document).on('page:init', '.page[data-name="logout"]', function (e) {
    localStorage.clear();
    app.preloader.hide();
    window.location.reload();
});

$$(document).on('page:reinit', '.page[data-name="checkin"]', function (e) {
    $$('#btn_buscar_sucursal').click();
});

$$(document).on('page:init', '.page[data-name="checkin"]', function (e) {
    $$('#btn_buscar_sucursal').on('click', function () {
        if ($$('#input_num_sucursal_checkin').val() == "") {
            app.dialog.alert('Escriba el número de sucursal');
        } else {
             app.request.setup({
                headers: {
                    'apikey': localStorage.getItem('apikey')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        localStorage.clear(); //quita todas las variables de local storage
                        app.preloader.hide(); // esconde el spinner
                        //app.dialog.alert('Tu sesión expiró, inicia sesión de nuevo');
                        window.location.reload(); // recarga la página (y te va a mandar a la página de login)
                    }
                }
            });
            app.request.get(
                URL_WS + 'consulta_material_sucursal/' + $$('#input_num_sucursal_checkin').val(),
                function (data) {
                    var data_tienda = data[0][0];
                    var data_billetes = data[1];
                    var data_am = data[2];
                    var data_ts = data[3];
                    var data_mkt = data[4];

                    var output_billetes = '';
                    data_billetes.forEach(function (v, i) {
                        output_billetes += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_billetes').html(output_billetes);

                    var output_am = '';
                    data_am.forEach(function (v, i) {
                        output_am += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_am').html(output_am);

                    var output_ts = '';
                    data_ts.forEach(function (v, i) {
                        output_ts += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_ts').html(output_ts);

                    var output_mkt = '';
                    data_mkt.forEach(function (v, i) {
                        output_mkt += '<li><a href="/cambiarstatus/' + v.num_guia + '">' + v.num_guia + '</a></li>';
                    });
                    $$('#lista_mkt').html(output_mkt);

                    $$('#nombre_tienda').html(data_tienda.nombre);
                    $$('#edo_mun_tienda').html(data_tienda.estado + ' ' + data_tienda.municipio);
                    $$('#direccion_tienda').html(data_tienda.calle + ' ' + data_tienda.no_ext + ' ' + data_tienda.colonia);
                    app.preloader.hide();
                },
                function (error) {
                    app.dialog.alert('Hubo un error, inténtelo de nuevo');
                    app.preloader.hide();
                },
                'json'
            );
        }
    });

});

//Cambiar de estatus

$$(document).on('page:init', '.page[data-name="cambiarstatus"]', function (e) {
    var num_guias = app.view.main.router.currentRoute.params.numGuia;
    //alert(num_guias);
    num_guias = num_guias.split("|");
    if (num_guias.length == 1) {
        $$('#num_gias').val(num_guias);
        //app.preloader.show();
        //alert(localStorage.getItem('apikey'));
        app.request.setup({
            headers: {
                'apikey': localStorage.getItem('apikey')
            },
            beforeSend: function () {
                app.preloader.show();
            },
            complete: function () {
                app.preloader.hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 401) {
                    localStorage.clear(); //quita todas las variables de local storage
                    app.preloader.hide(); // esconde el spinner
                    //app.dialog.alert('Tu sesión expiró, inicia sesión de nuevo','Aviso');
                    window.location.reload();
                }else{
                    app.dialog.alert('Hubo un error, inténtelo de nuevo','Error');
                }
            }
        });

        app.request.get(
            URL_WS + 'consulta/' + num_guias[0],
            function (data) {
                //console.log(data['guia'][0].num_guia);
                $$('#num_guia').html(data['guia'][0].num_guia);
                if (data['guia'][0].branch_number == '0004') {
                    var ouput_parsear_billetes = '';
                    var parsear_billetes = data['guia'][0].cont_paquete.split("|");
                    parsear_billetes.forEach(function (v, i) {
                        var parsear_billetes2 = v.split(': ');
                        if (parsear_billetes2[1] > 0) {
                            ouput_parsear_billetes += v + '<br>';
                        } else {
                            if (v.includes("Reportó")) {
                                ouput_parsear_billetes += v + '<br>';
                            }
                        }
                    });
                    $$('#cont_paquete').html(ouput_parsear_billetes);
                }
                if (data['guia'][0].branch_number == '0003' || data['guia'][0].branch_number == '0006') {
                    $$('#cont_paquete').html(data['guia'][0].cont_paquete);
                    $$('#cont_paquete').append('<br>');
                    $$('#cont_paquete').append(data['guia'][0].ids_tokens);
                }
                app.preloader.hide();
            },
            'json'
        );
    } else {
        var new_num_guias = '';
        num_guias.forEach(function (v, i) {
            $$('#lista_multiples_guias').append('<li>' + v + '</li>');
            new_num_guias += v + '|';
        });
        var new_num_guias = new_num_guias.substr(0, new_num_guias.length - 1);
        $$('#num_gias').val(new_num_guias);
    }
    // Vertical Buttons
    $$('.open-foto-1').on('click', function () {
        app.dialog.create({
            title: 'Foto 1',
            text: 'Elegir opcion:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas');
                }
            }
        });

        $$('.id_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas');
                }
            }
        });
    });

    $$('.open-foto-2').on('click', function () {
        app.dialog.create({
            title: 'Foto 2',
            text: 'Elegir opcion:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara_2'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria_2'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar_2'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara_2').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas2');
                }
            }
        });

        $$('.id_cancelar_2').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_galeria_2').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas2');
                }
            }
        });
    });

    $$('#status').on('change', function (e) {
        var status = $$(this).val();
        switch (status) {
            case '2':
                //Recolectado
                $$('.ocultar_campos').hide();
                $$('.mostrar_recolectado').show();
                break;
            case '3':
                //En ruta
                $$('.ocultar_campos').hide();
                $$('.mostrar_enruta').show();
                break;
            case '4':
                //Entregado
                $$('.ocultar_campos').hide();
                $$('.mostrar_entregado').show();
                break;
            case '5':
                //Incidencia
                $$('.ocultar_campos').hide();
                $$('.mostrar_incidencia').show();
                break;
            case '6':
                //Devuelto
                $$('.ocultar_campos').hide();
                $$('.mostrar_devuelto').show();
                break;
            case '7':
                //Ocurre
                $$('.ocultar_campos').hide();
                $$('.mostrar_ocurre').show();
                break;
            case '8':
                //En almacén
                $$('.ocultar_campos').hide();
                $$('.mostrar_enalmacen').show();
                break;
        }
    });

    $$('#btn_cambiar_status').on('click', function (e) {
        var latitud = $$('#latitud').val();
        var longitud = $$('#longitud').val();
        var status = $$('#status').val();
        var validado = false;
        switch (status) {
            case 'Seleccione':
                app.dialog.alert('Seleccione un status');
                break;
            case '2':
                //Recolectado
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var persona_recibe = $$('#persona_recibe').val();

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || persona_recibe == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '3':
                validado = true
                break;
            case '4':
                //Entregado
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var persona_recibe = $$('#persona_recibe').val();

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || persona_recibe == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '5':
                //Incidencia
                var statusFoto = $$('#myCanvas').data("foto1");
                var statusFoto2 = $$('#myCanvas2').data("foto1");
                var incidencia = $$('#incidencia').val();

                if (statusFoto != 0) {
                    var canvas1 = $$('#myCanvas')[0];
                    var foto1 = canvas1.toDataURL();
                } else {
                    foto1 = '';
                }
                if (statusFoto2 != 0) {
                    var canvas2 = $$('#myCanvas2')[0];
                    var foto2 = canvas2.toDataURL();
                } else {
                    foto2 = '';
                }

                if (foto1 == "" || foto2 == "" || incidencia == "") {
                    app.dialog.alert('La foto 1, la foto 2 y la incidencia son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '6':
                //Devuelto
                validado = true;
                break;
            case '7':
                //Ocurre
                validado = true;
                break;
            case '8':
                //En almacén
                validado = true;
                break;
        }
        if (validado == true) {
            var canvas1 = $$('#myCanvas')[0];
            var foto1 = canvas1.toDataURL();
            var canvas2 = $$('#myCanvas2')[0];
            var foto2 = canvas2.toDataURL();
            var persona_recibe = $$('#persona_recibe').val();
            var incidencia = $$('#incidencia').val();
            var comentarios = $$('#comentarios').val();

            // hacer request:
            //app.preloader.show();
            app.request.setup({
                headers: {
                    'apikey': localStorage.getItem('apikey')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        localStorage.clear(); //quita todas las variables de local storage
                        app.preloader.hide(); // esconde el spinner
                        //app.dialog.alert('Tu sesión expiró, inicia sesión de nuevo');
                        window.location.reload(); // recarga la página (y te va a mandar a la página de login)
                    }
                }
            });
            app.request.postJSON(
                URL_WS + 'changestatus/' + $$('#num_gias').val(),
                {
                    status: status,
                    latlong: latitud + ',' + longitud,
                    foto1: foto1,
                    foto2: foto2,
                    persona_recibe: persona_recibe,
                    comentarios: comentarios
                },
                function (data) {
                    app.preloader.hide();
                    app.dialog.alert("Datos guardados correctamente", function () {
                        $$('#btn_buscar_sucursal').click();
                    });
                    app.views.main.router.back();
                }, function (error) {
                    app.preloader.hide();
                },
                'json'
            );
        }
    });
});

$$(document).on('page:init', '.page[data-name="escanear"]', function (e) {
    $$('#btn_escanear').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    if (num_guia.length != 18) {
                        app.dialog.alert("Guía no válida: Las guías logify tienen 18 caracteres");
                    } else {
                        //Váido
                        //Revisar si ya está agregada esa guía:
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan').append('<li>' + num_guia + ' - ' + detectarProyecto(num_guia) + '</li>');
                            $$('#hidden_guias_scan').val(num_guia + '|' + $$('#hidden_guias_scan').val());
                            var guias = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$('#btn_ir_cambiar_status').attr('href', '/cambiarstatus/' + guias);
                        }
                        $$('#btn_ir_cambiar_status').show();
                    }
                } else {
                    app.dialog.alert('El scan fue cancelado');
                }
            }, function (error) {
                app.dialog.alert("El scan falló: " + error);
            },
            {
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Ponga el código QR dentro del área de escaneo" // Android
            }
        );
    });
});

$$(document).on('page:init', '.page[data-name="consultar"]', function (e) {
    $$('#btn_escanear_consulta').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    $$('#num_guia_consulta').html(num_guia);
                    app.request.get(
                        URL_WS + 'guideinfo/' + num_guia,
                        function (data) {
                            $$('#status_guia_consulta').html(traducirStatus(data[0].status));
                            $$('#espacio_proyecto').html(detectarProyecto(num_guia));
                            $$('#espacio_destinatario').html(data[0].nombre_dest + ' ' + data[0].paterno_dest + ' ' + data[0].materno_dest + '<br>' + data[0].edo_dest + ' ' + data[0].mun_dest + ' ' + data[0].asent_dest);
                            $$('#testigoreal1').attr('src', URL_WS + data[0].foto1);
                            $$('#testigoreal2').attr('src', URL_WS + data[0].foto2);
                            if (detectarProyecto(num_guia) == 'PPF') {
                                var ouput_parsear_billetes = '';
                                var parsear_billetes = data[0].cont_paquete.split("|");
                                parsear_billetes.forEach(function (v, i) {
                                    var parsear_billetes2 = v.split(': ');
                                    if (parsear_billetes2[1] > 0) {
                                        ouput_parsear_billetes += v + '<br>';
                                    } else {
                                        if (v.includes("Reportó")) {
                                            ouput_parsear_billetes += v + '<br>';
                                        }
                                    }
                                });
                                $$('#cont_paquete').html(ouput_parsear_billetes);
                            } else {
                                $$('#cont_paquete').html(data[0].cont_paquete);
                                $$('#cont_paquete').append('<br>');
                                $$('#cont_paquete').append('Lote/id/etc: ' + data[0].ids_tokens);
                            }

                        },
                        function (error) {
                            console.log(error);
                        },
                        'json'
                    );
                } else {
                    app.dialog.alert('El scan fue cancelado');
                }
            }, function (error) {
                app.dialog.alert("El scan falló: " + error);
            },
            {
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Ponga el código QR dentro del área de escaneo" // Android
            }
        );
    });
});