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
import fnGuias from './guias/fn-guias';
import config from './config';
import fotoacuse from './fotoacuse';
import funcionesCamara from "./funcionesCamara";
import fnGuiasHijos from "./guias/fnguiashijos";
import firma from "./firmar.js";

/**
 *
 * URL API
 */
var URL_WS = config.URL_WS;


/**
 *
 * @param num_guia
 * @returns {string}
 */
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
}*/
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
};

function imageCapture() {
    var options = {limit: 1};
    navigator.device.capture.captureImage(onSuccess, onError, options);
}
function onError(error) {
    //app.dialog.alert('Error code: ' + error.code, null, 'Capture Error');
}
function onSuccess(mediaFiles) {
    $$('#myCanvas1').show();
    var canvas = $$('#myCanvas1')[0];
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
    navigator.device.capture.captureImage(function captureSuccess(mediaFiles) {
        //navigator.camera.getPicture(function onSuccess(mediaFiles) {
        $$('#' + idCanvas).show();
        ///var canvas = $$('#' + idCanvas)[0];
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
    }, function captureError(error) {
        console.debug("No se puede obtener una foto openCamera: " + error, "app");
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
        //var canvas = $$('#' + idCanvas);
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
        console.debug("No se puede obtener una foto openFilePicker: " + error, "app");
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
            if (data[0].activo == 1) {
                app.preloader.hide();
                localStorage.setItem('auth', true);
                localStorage.setItem('apikey', data[0].apikey);
                localStorage.setItem('userid', data[0].user_id);
                localStorage.setItem('avatar', data[0].avatar);
                localStorage.setItem('nombre', data[0].nombre);
                localStorage.setItem('paterno', data[0].paterno);
                localStorage.setItem('correo', data[0].correo);
               // localStorage.setItem('calidad', data[0].calidad);
               // localStorage.setItem('ruta', data[0].ruta);
               // config.QUALITY = data[0].calidad;
               // config.URL_WS = data[0].ruta;
                app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
            } else {
                app.dialog.alert('Error: Permiso Denegado');
            }
        }, function (data) {
            app.preloader.hide();
            app.dialog.alert('Error: Datos incorrectos');
        }
    );
}
/**
 *
 * @param correo
 * @param pass
 * @constructor
 */
function ValidateApikeyNEW(correo, pass) {
    app.request.setup({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    app.request.postJSON(
        URL_NEW_WS + 'api/loginapp',
        {
            'email': correo,
            'pass': pass
        },
        function (data) {
            if (data.activo == 1) {
                app.preloader.hide();
                /*localStorage.setItem('auth', true);
                localStorage.setItem('apikeyy', data.apikey);*/
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user_id);
                if (data.verhj_gasto == 1) {
                    localStorage.getItem('verhj_gasto', 1);
                    $$(".HGastosViews").show();
                } else {
                    localStorage.getItem('verhj_gasto', 0);
                    $$(".HGastosViews").hide();
                }
                /* localStorage.setItem('avatar', data.avatar);
                 localStorage.setItem('nombre', data.nombre);
                 localStorage.setItem('paterno', data.paterno);
                 localStorage.setItem('email', data.email);*/
            } else {
                //  app.dialog.alert('Error: Permiso Denegado');
            }
        }, function (data) {
            //app.preloader.hide();
            //app.dialog.alert('Error: Datos incorrectos');
        }
    );
}
/**
 * DateActual
 * @param iddate
 */
function DateActual(iddate) {
    var fecha = new Date();
    var mes = fecha.getMonth() + 1;
    var dia = fecha.getDate();
    var ano = fecha.getFullYear();
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    document.getElementById(iddate).value = ano + "-" + mes + "-" + dia;
}
/**
 * DateGasto
 * @param DateGasto
 */
function DateGasto(CById, DateGasto) {
    document.getElementById(CById).value = DateGasto;
}
/**
 *
 * @param valor
 * @constructor
 */
function RsltsGastos(valor) {
    var Eselected;
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/gastos',
        function (data) {
            var gatosConceptos = '';
            gatosConceptos += '<option value="">Seleccionar</option>';
            data.forEach(function (gasto, index) {
                if (gasto.id == valor && gasto.id != '') {
                    Eselected = 'selected';
                } else {
                    Eselected = '';
                }
                gatosConceptos += '<option value="' + gasto.id + '"' + Eselected + '>' + gasto.concepto + '</option>';
            });
            $$('#ConceptoGasto').html(gatosConceptos);
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function NmPrvdr(CById, valor) {
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/proveedor-operador-nombre/' + valor,
        function (data) {
            data.forEach(function (val, index) {
                console.log(val);
                document.getElementById(CById).value = val.nombre;
                $$('#' + CById).data('idPrvdr', val.id);
            });
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
}
/**
 *
 * @param valor
 * @constructor
 */
function RsltsPrvdr(valor) {
    var autocompleteProveedor;
    autocompleteProveedor = app.autocomplete.create({
        inputEl: '#OprProve',
        openIn: 'dropdown',
        preloader: true,
        valueProperty: 'nombre',
        textProperty: 'nombre',
        limit: 20,
        typeahead: true,
        dropdownPlaceholderText: 'Buscar Proveedores',
        source: function (query, render) {
            var autocomplete = this;
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            autocomplete.preloaderShow();
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                }
            });

            app.request({
                url: URL_NEW_WS + 'api/v2/buscar/proveedor-operador/' + query,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].nombre === query) {
                            //console.log(data[i].id + '**' + data[i].nombre);
                            $$('#OprProve').data('idPrvdr', data[i].id);
                        }
                        if (data[i].nombre.toLowerCase().indexOf(query.toLowerCase()) === 0) results.push(data[i]);
                    }
                    autocomplete.preloaderHide();
                    render(results);
                }
            });
        }
    });
}
/**
 *
 * @param valor
 */
function validateMonto(valor) {
    var RE = /^\d*(\.\d{1})?\d{0,1}$/;
    if (RE.test(valor)) {
    } else {
        app.dialog.alert("El formato no corresponde Ej. 120.00 ó 23.65");
    }
}
/**
 *
 * @param valor
 */
function validatePrecio(CById,valor) {
    var RE = /^\d*(\.\d{1})?\d{0,1}$/;
    if (RE.test(valor)) {
    } else {
        document.getElementById(CById).value = "";
        app.dialog.alert("El formato no corresponde Ej. 120.00 ó 23.65");
    }
}
/**
 * @param CById
 * @param monto
 * @constructor
 */
function RsltsMonto(CById, monto) {
    document.getElementById(CById).value = monto;
}
/**
 *
 * @param CById
 * @param num
 * @constructor
 */
function RsltsNum(CById, num) {
    document.getElementById(CById).value = num;
}
/**
 *
 * @param CById
 * @param observaciones
 * @constructor
 */
function RsltsObservaciones(CById, observaciones) {
    document.getElementById(CById).value = observaciones;
}
/**
 *
 * @param CById
 * @param concepto
 * @param coment
 * @param kminicial
 * @param kmfinal
 * @constructor
 */
function RsltsConcepto(CById, concepto, coment, kminicial, kmfinal) {
    if (concepto == 12) {
        $$("#Gcomentario").show();
        document.getElementById('comentario').value = coment;
    }
    if (concepto == 3) {
        $$("#kmi").show();
        $$("#kmf").show();
        document.getElementById('kminicial').value = kminicial;
        document.getElementById('kmfinal').value = kmfinal;
    }
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsTpComprobante(CById, valor) {
    var TpoCmprbnt;
    var Eselected;
    var lista = ['Seleccionar', 'Nota', 'Factura', 'Recibo', 'Ticket'];
    lista.forEach(function (element, index) {
        if (index == valor) {
            Eselected = 'selected';
        } else {
            Eselected = '';
        }
        TpoCmprbnt += '<option value="' + index + '"' + Eselected + '>' + element + '</option>';
    });
    $$('#TpoCmprbnt').html(TpoCmprbnt);
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsFotoComprobante(CById, valor) {
    if (valor == undefined || valor == null || valor == '') {
        $$('#' + CById).data("status", 0);
        $$('#' + CById).html('');
    } else {
        $$('#' + CById).data("status", 1);
        $$('#' + CById).html('<img src="' + valor + '"/>');
    }
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsPDFComprobante(CById, valor) {
    if (valor == undefined || valor == null || valor == '') {
        $$('#pdfColocar').html('');
        $$('#pdfhrf').hide();
    } else {
        $$('#' + CById).data("status", 1);
        $$('#pdfColocar').data("file", valor);
        var splits = valor.split(['/']);
        splits = splits.pop();
        $$('#pdfColocar').html(splits);
    }
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsXMLComprobante(CById, valor) {
    if (valor === undefined || valor === null || valor === '') {
        $$('#xmlColocar').html('');
        $$('#xmlhrf').hide();
    } else {
        $$('#' + CById).data("status", 1);
        $$('#xmlColocar').data("file", valor);
        var splits = valor.split(['/']);
        splits = splits.pop();
        $$('#xmlColocar').html(splits);
    }
}
/**
 *
 * @param CById
 * @param CById2
 * @param type
 */
function convertToBase64(CById, CById2, type) {
    var selectedFile = document.getElementById(CById).files;
    var path = selectedFile[0].name;
    var path_splitted = path.split('.');

    if (path_splitted[1] == type) {
        if (selectedFile.length > 0) {
            var fileToLoad = selectedFile[0];
            var fileReader = new FileReader();
            var base64;
            fileReader.onload = function (fileLoadedEvent) {
                base64 = fileLoadedEvent.target.result;
                $$('#' + CById2).data("file", base64);
                $$('#' + CById2).data("status", 1);
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    } else {
        app.dialog.alert("El formato del archivo no corresponde, solo se permite " + type);
        document.getElementById(CById).value = null;
    }
}
/**
 *
 * @param CById
 * @param type
 * @param valor
 * @constructor
 */
function RsltsVehiculo(CById, type, valor) {
    var Eselected;
    var vehiculos = '';
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/consultar-vehiculo/' + type,
        function (data) {
            vehiculos = '<option value="">Seleccionar</option>';
            data.forEach(function (val, index) {
                if (val.id == valor && val.id != '') {
                    Eselected = 'selected';
                } else {
                    Eselected = '';
                }
                vehiculos += '<option value="' + val.id + '"' + Eselected + '>' + val.placa + '</option>';
            });
            $$('#' + CById).html(vehiculos);
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
}
/**
 *
 * @param CById
 * @param Id
 * @param valor
 * @constructor
 */
function RsltsAuto(CById, Id, valor) {
    var vehiculos = '<option value="' + Id + '">' + valor + '</option>';
    $$('#' + CById).html(vehiculos);
}
/**
 *
 * @param valor
 */
function validateNumero(CById) {
    var odometro = $$("#odometro").val();
    var RE = /^([0-9])*$/;
    if (!RE.test(odometro)) {
        document.getElementById(CById).value = "";
        app.dialog.alert("Solo se permiten numeros");
    }
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsMtdPago(CById, valor) {
    if(valor ==1){
        $$(".TMtdPago").show();
    } else {
        $$(".TMtdPago").hide();
    }
    var MtdPago;
    var Eselected;
    var lista = ['Seleccionar', 'Efectivo', 'Ticket Car'];
    lista.forEach(function (element, index) {
        if(valor == ''){ valor=0;}
        if (index == valor ) {
            Eselected = 'selected';
        } else {
            Eselected = '';
        }
        MtdPago += '<option value="' + index + '"' + Eselected + '>' + element + '</option>';
    });
    $$('#'+CById).html(MtdPago);
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function RsltsValor(CById, valor) {
    document.getElementById(CById).value = valor;
}
/**
 *
 * @param CById
 * @param valor
 * @constructor
 */
function EnviarEmail( valor,IdUser) {
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/enviar/msn/' + valor+'/'+IdUser,
        function (data) {
            app.dialog.alert(data.message);
        },
        function (data) {
            var mensaje = JSON.parse(data.responseText);
            app.dialog.alert(mensaje.message);
        },
        'json'
    );
}
/**
 *
 * @param CById
 * @param idauto
 * @param odometro
 */
function validateOdometro(CById, idauto, valor) {
    var result = false;
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/latestodometro/' + idauto,
        function (data) {
            var odometro = $$("#odometro").val();
            //console.log(odometro,data.odometro);
            if (odometro <= data.odometro) {
                result = true;
                document.getElementById(CById).value = "";
                app.dialog.alert("Error: Revisar el odómetro su valor debe ser mayor al ingresado");
            }
        },
        function (error) {
            console.log(error);
        },
        'json'
    );
    console.log("result:"+result);
    return result;
}

/**
 *
 * @param CById
 * @param Numguia
 */
function verBilletes(CById,Numguia) {
        app.request.setup({
        headers: {
            'apikey': localStorage.getItem('apikey')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        URL_WS + 'api/v2/consultar-ppfbilletes/' + Numguia,
        function (data) {
            if (data.length > 0) {
                var folio = '<div class="list accordion-list">\n' +
                    '<ul><li class="accordion-item"><a href="#" class="item-content item-link">\n' +
                    '<div class="item-inner"><div class="item-title">Billetes con serie</div></div></a>\n' +
                    '<div class="accordion-item-content"><div class="block"><p>\n' +
                    '<div class="list accordion-list"><ul>\n';
                data.forEach(function (val, index) {
                    folio += '<li> PPF: ' + val.valor + ' SERIE: ' + val.folio + '</li>';
                });
                folio+='<p></div>\n' +
                    '</div>\n' +
                    '</li>\n' +
                    '</ul>\n' +
                    '</div>\n'+
                    '</ul></div>';
                $$('#' + CById).html(folio);
            }
        },
        'json'
    );
}

/**
 *
 * @param CById
 * @param numguia
 */
function verTarjetas(CById, numguia) {
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
                localStorage.clear();
                app.preloader.hide();
            } else {
               // app.dialog.alert('Hubo un error, no hay información detallada en tarjetas', 'Error');
            }
        }
    });
    app.request.get(
        URL_WS + 'api/v2/consultar-tarjetas/' + numguia,
        function (data) {
            var tarjeta = '' + data.nombre_tarjeta + ' No.Lote: ' + data.numero_lote + ' Cantidad: ' + data.cantidad;
            $$('#' + CById).html(tarjeta);
        },
        'json'
    );
}
/**
 *
 * @param CById
 * @param Numguia
 */
function verAM(CById,Numguia) {
    app.request.setup({
        headers: {
            'apikey': localStorage.getItem('apikey')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }, error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 401) {
                localStorage.clear();
                app.preloader.hide();
            } else {
                // app.dialog.alert('Hubo un error, no hay información detallada en tarjetas', 'Error');
            }
        }
    });
    app.request.get(
        URL_WS + 'api/v2/consultar-archivomuerto/' + Numguia,
        function (data) {
            if(data.cajas !=''){
                var tarjeta = '' + data.gerencia + ' Zona: ' + data.zona + ' Cajas: ' + data.cajas;
                $$('#' + CById).html(tarjeta);
            }
        },
        'json'
    );
}

/**
 *
 * @type {Framework7}
 */

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
/**
 *
 */
$$('#btn_iniciar_sesion').on('click', function () {
    //app.preloader.show();
    var username = $$('#input_username').val();
    var password = $$('#input_password').val();

    ValidateApikey(username, password);
});
$$(document).on('page:init', '.page[data-name="inicio"]', function (e) {
    $$('#nombre_usuario').html(localStorage.getItem('nombre') + ' ' + localStorage.getItem('paterno'));
    /*logisticus
    ValidateApikeyNEW(localStorage.getItem('userid'), localStorage.getItem('apikey'));
    if (localStorage.getItem('verhj_gasto') == 1) {
        $$(".HGastosViews").show();
    } else {
        $$(".HGastosViews").hide();
    }
    */
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

/**
 ** Guia
 **/
$$(document).on('page:reinit', '.page[data-name="checkin"]', function (e) {
    $$('#btn_buscar_sucursal').click();
});
$$(document).on('page:init', '.page[data-name="checkin"]', function (e) {
    $$('#mostrarDivHijos').hide();
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

                    /*if(data_am.length > 0 ) {*/
                        var input_num_sucursal = $$('#input_num_sucursal_checkin').val();
                        $$("#numguiaPadre").attr("href", "/asignarhijos/"+ input_num_sucursal);
                        $$('#mostrarDivHijos').show();
                   /* }else{
                        $$('#mostrarDivHijos').hide();
                    }*/
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
                } else {
                    app.dialog.alert('Hubo un error, inténtelo de nuevo', 'Error');
                }
            }
        });

        app.request.get(
            URL_WS + 'consulta/' + num_guias[0],
            function (data) {
                fnGuias.mostrarSttus(app, data['guia'][0].branch_number, data['guia'][0].client_code, 'status');
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
                    verBilletes('fbillete', num_guias[0]);
                }

                if (data['guia'][0].branch_number == '0003' || data['guia'][0].branch_number == '0006') {
                    $$('#cont_paquete').html(data['guia'][0].cont_paquete);
                    $$('#cont_paquete').append('<br>');
                    if (data['guia'][0].branch_number == '0006' && data['guia'][0].num_guia != '') {
                        verTarjetas('verTarjeta', data['guia'][0].num_guia);
                    }
                   if (data['guia'][0].branch_number == '0003' && data['guia'][0].num_guia != '') {
                       verAM('verTarjeta', data['guia'][0].num_guia);
                           fnGuiasHijos.btnScanHjs(app,data['guia'][0].num_guia);
                    }
                }
                fnGuiasHijos.MostrarNGH(app,'NGHijos', data['guia'][0].num_guia);
                fnGuias.LogIncidencias(app, data['guia'][0].client_code, data['guia'][0].id);
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
                    openCamera('myCanvas1');
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
                    openFilePicker('myCanvas1');
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
    $$('.open-foto-3').on('click', function () {
        app.dialog.create({
            title: 'Foto 3 Guía logify',
            text: 'Elegir opcion:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara_3'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria_3'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar_3'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara_3').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }
            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas3');
                }
            }
        });
        $$('.id_cancelar_3').on('click', function (e) {
            app.dialog.close();
        });
        $$('.id_galeria_3').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas3');
                }
            }
        });
    });
    $$('.open-foto-4').on('click', function () {
        app.dialog.create({
            title: 'Foto 4 Firma de acuse',
            text: 'Elegir opcion:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara_4'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria_4'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar_4'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara_4').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }
            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas4');
                }
            }
        });
        $$('.id_cancelar_4').on('click', function (e) {
            app.dialog.close();
        });
        $$('.id_galeria_4').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas4');
                }
            }
        });
    });
    $$('.open-foto-5').on('click', function () {
        app.dialog.create({
            title: 'Foto 5 Selfie en sucursal',
            text: 'Elegir opcion:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_camara_5'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_galeria_5'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cancelar_5'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_camara_5').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvas5');
                }
            }
        });
        $$('.id_cancelar_5').on('click', function (e) {
            app.dialog.close();
        });
        $$('.id_galeria_5').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvas5');
                }
            }
        });
    });

    $$('#status').on('change', function (e) {
        $$('#mostarfotos').html('');
        $$('#totalImg').val('');
        $$('.ocultar_campos').hide();
        var status = $$('#status').val();
        //console.log(status+num_guias);
        var numeroguia=num_guias[0];
        var codCliente = numeroguia.substring(0,3);
        var braNumbre = numeroguia.substring(3,7);
        //console.log("engtre mostrarCampos"+status);
        var tipoFimg=codCliente+'-'+braNumbre+'-'+status;
        //console.log("status:"+status);
        switch (status) {
            case '2':
                //Recolectado
                //console.log("Recolectado");
                $$('.ocultar_campos').hide();
                $$('.mostrar_recolectado').show();
                fnGuias.fnmostrarCampos(app,codCliente,braNumbre,status,tipoFimg);
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
                fnGuias.fnmostrarCampos(app,codCliente,braNumbre,status,tipoFimg);
                break;
            case '5':
                //Incidencia
                $$('.ocultar_campos').hide();
                $$('.mostrar_incidencia').show();
                fnGuias.fnmostrarCampos(app,codCliente,braNumbre,status,tipoFimg);
                break;
            case '6':
                //Devuelto
                $$('.ocultar_campos').hide();
                $$('.mostrar_devuelto').show();
                //console.log(codCliente+"entre");
                if(codCliente === 'CVD'){
                    fnGuias.fnmostrarCampos(app,codCliente,braNumbre,status,tipoFimg);
                }
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
            case '12':
                //En conectado
                $$('.ocultar_campos').hide();
                $$('.mostrar_conectado').show();
                break;
            default:
                $$('.ocultar_campos').hide();
                break;
        }
    });

    $$('#btn_cambiar_status').on('click', function (e) {
        var foto1, foto2, foto3, foto4, foto5;
        var canvas1, canvas2, canvas3, canvas4, canvas5;
        var statusFoto, statusFoto2, statusFoto3, statusFoto4, statusFoto5;
        var persona_recibe, incidencia, comentarios,status;
        var proveedor_ocurre, guia_ocurre,latitud,longitud;

        latitud = $$('#latitud').val();
        longitud = $$('#longitud').val();
        status = $$('#status').val();

        var validado = false;

        if(status == ''){
            validado = false;
            app.dialog.alert('Seleccione un status');
        }
        switch (status) {
            case 'Seleccionar':
                app.dialog.alert('Seleccione un status');
                break;
            case '2':
                //Recolectado
                persona_recibe = $$('#persona_recibe').val();
                if (persona_recibe == "") {
                    app.dialog.alert('La persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '3':
                //Ruta
                validado = true;
                break;
            case '4':
                //Entregado
                persona_recibe = $$('#persona_recibe').val();
                if (persona_recibe == "") {
                    app.dialog.alert('la persona que recibe / entrega son obligatorios');
                } else {
                    validado = true;
                }
                break;
            case '5':
                //Incidencia
                incidencia = $$('#incidencia').val();
                if (incidencia == 0) {
                    app.dialog.alert('Seleccionar el tipo incidencia es obligatorio');
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
            case '12':
                proveedor_ocurre = $$('#proveedor_ocurre').val();
                guia_ocurre = $$('#guia_ocurre').val();
                if (proveedor_ocurre != '' && guia_ocurre != '') {
                    validado = true;
                } else {
                    app.dialog.alert('El proveedor ocurre y la guía ocurre son obligatorios');
                }
                break;
            default:
                if(status > 12){
                    validado = true;
                }
                break;
        }
        var totalImg = $$('#totalImg').val();
        if(totalImg > 0) {
            for (var i = 1; i <= totalImg; i++) {
                var sttsFoto = $$('#myCanvas' + i).data("foto1");
                var canvas_img = $$('#myCanvas' + i)[0];
                var foto = canvas_img.toDataURL();
                if (foto == '' || sttsFoto == 0) {
                    app.dialog.alert('Foto '+ i + ' esta vacío');
                    validado = false;
                }
            }
        }

        if (validado == true) {
            statusFoto = $$('#myCanvas1').data("foto1");
            if (statusFoto == 1) {
                canvas1 = $$('#myCanvas1')[0];
                foto1 = canvas1.toDataURL();
            } else {
                foto1 = '';
            }
            statusFoto2 = $$('#myCanvas2').data("foto1");
            if (statusFoto2 == 1) {
                canvas2 = $$('#myCanvas2')[0];
                foto2 = canvas2.toDataURL();
            } else {
                foto2 = '';
            }
            statusFoto3 = $$('#myCanvas3').data("foto1");
            if (statusFoto3 == 1) {
                canvas3 = $$('#myCanvas3')[0];
                foto3 = canvas3.toDataURL();
            } else {
                foto3 = '';
            }
            statusFoto4 = $$('#myCanvas4').data("foto1");
            if (statusFoto4 == 1) {
                canvas4 = $$('#myCanvas4')[0];
                foto4 = canvas4.toDataURL();
            } else {
                foto4 = '';
            }
            statusFoto5 = $$('#myCanvas5').data("foto1");
            if (statusFoto5 == 1) {
                canvas5 = $$('#myCanvas5')[0];
                foto5 = canvas5.toDataURL();
            } else {
                foto5 = '';
            }

            persona_recibe = $$('#persona_recibe').val();
            incidencia = $$('#incidencia').val();
            if (incidencia == 0 && status!= 5) {
                incidencia = null;
            }
            comentarios = $$('#comentarios').val();
            proveedor_ocurre = $$('#proveedor_ocurre').val();
            if (proveedor_ocurre == 0) {
                proveedor_ocurre = '';
            }
            guia_ocurre = $$('#guia_ocurre').val();

            var guiaslista=$$('#num_gias').val();
            guiaslista = guiaslista.split("|");
            var TtlLista=guiaslista.length;

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
            if (TtlLista == 1) {
                
                    app.request.postJSON(
                        URL_WS + 'changestatus/' + $$('#num_gias').val(),
                        {
                            status: status,
                            latlong: latitud + ',' + longitud,
                            foto1: foto1,
                            foto2: foto2,
                            foto3: foto3,
                            foto4: foto4,
                            foto5: foto5,
                            persona_recibe: persona_recibe,
                            comentarios: comentarios,
                            incidencia:incidencia,
                            proveedor_ocurre: proveedor_ocurre,
                            guia_ocurre: guia_ocurre
                        },
                        function (data) {
                            app.preloader.hide();
                            app.dialog.alert("Datos guardados correctamente", function () {
                                $$('#btn_buscar_sucursal').click();
                            });
                            app.views.main.router.back();
                        }, function (error) {
                            app.preloader.hide();
                            
                            app.dialog.alert("Error: "+error, function () {
                                $$('#btn_buscar_sucursal').click();
                            });

                        },
                        'json'
                    );
                
            } else {
                guiaslista.forEach(function (v, i) {
                    var guiaMasivaInd = v;
                    app.request.postJSON(
                        URL_WS + 'changestatus/' + guiaMasivaInd,
                        {
                            status: status,
                            latlong: latitud + ',' + longitud,
                            foto1: foto1,
                            foto2: foto2,
                            foto3: foto3,
                            foto4: foto4,
                            foto5: foto5,
                            persona_recibe: persona_recibe,
                            comentarios: comentarios,
                            incidencia:incidencia,
                            proveedor_ocurre: proveedor_ocurre,
                            guia_ocurre: guia_ocurre
                        },
                        function (data) {
                            app.preloader.hide();
                            app.dialog.alert("Datos guardados correctamente " + guiaMasivaInd, function () {
                            });
                            //app.views.main.router.back();
                        }, function (error) {
                            app.preloader.hide();
                        },
                        'json'
                    );
                    app.views.main.router.navigate('/escanear/', {reloadCurrent: false});
                });
            }
        }
    });
});
$$(document).on('page:init', '.page[data-name="escanear"]', function (e) {
    $$('#btn_escanear').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    if (num_guia.length <= 17) {
                        app.dialog.alert("Guía no válida: Las guías logify tienen más caracteres");
                    }else {
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
                           // console.log(guias);
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
        var tel_dest='';
        var info_comp_dest='';
        var dir2_dest='';
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia = result.text;
                    $$('#num_guia_consulta').html(num_guia);
                    app.request.get(
                        URL_WS + 'guideinfo/' + num_guia,
                        function (data) {
                            if( data[0].tel_dest != ''  && !!data[0].tel_dest){
                                 tel_dest= 'Tel.: '+ data[0].tel_dest + '<br>';
                            }
                            if( data[0].info_comp_dest != '' && !!data[0].info_comp_dest){
                                info_comp_dest= 'Referencias: '+ data[0].info_comp_dest + '<br>';
                            }

                            if( data[0].dir2_dest != ''  && !!data[0].dir2_dest){
                                dir2_dest= 'Dirección alternativa: '+ data[0].dir2_dest + '<br>';
                            }
                            $$('#status_guia_consulta').html(fnGuias.traducirStatus(data[0].status));
                            $$('#espacio_proyecto').html(detectarProyecto(num_guia));
                            $$('#espacio_destinatario').html(
                                data[0].nombre_dest + ' ' +
                                data[0].paterno_dest + ' ' +
                                data[0].materno_dest + '<br>' +
                                data[0].dir1_dest + '<br>' +
                                data[0].asent_dest + '<br>' +
                                data[0].mun_dest + ', ' +
                                data[0].edo_dest + ', ' +
                                data[0].cp_dest + '<br>'+
                                tel_dest + info_comp_dest +dir2_dest
                            );
                            fnGuias.LogComentarios(app,data[0].id);
                            fnGuias.LogIncidencias(app,data[0].client_code,data[0].id);
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

/**
 ** Control Gastos
 **/
$$(document).on('page:init', '.page[data-name="hojagastos"]', function (e) {
    DateActual('calendardefault');
    //ValidateApikeyNEW(localStorage.getItem('userid'),localStorage.getItem('apikey'));
    var id_operador = localStorage.getItem('user_id');
    var periodo = $$('#calendardefault').val();

    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/consultar/gastos-operador/' + id_operador + '/' + periodo + '/' + periodo,
        function (data) {
            var gatosConsulta = '';
            if (data != '') {
                data.forEach(function (cslt_gsto_opr, index) {
                    var fotoExit = cslt_gsto_opr.foto_comprobante;
                    var pdfExit = cslt_gsto_opr.pdf_comprobante;
                    var xmlExit = cslt_gsto_opr.xml_comprobante;
                    if (fotoExit === undefined || fotoExit === null || fotoExit === '') {
                        var colorFoto = '';
                    } else {
                        var colorFoto = ' color-verde';
                    }
                    if (pdfExit === undefined || pdfExit === null || pdfExit === '') {
                        var colorPDF = '';
                    } else {
                        var colorPDF = ' color-verde';
                    }
                    if (xmlExit === undefined || xmlExit === null || xmlExit === '') {
                        var colorXML = ' color-gray';
                    } else {
                        var colorXML = ' color-verde';
                    }
                    gatosConsulta += '<tr><td class="label-cell">' + cslt_gsto_opr.concepto + '</td><td class="numeric-cell">' + cslt_gsto_opr.monto + '</td><td class="actions-cell"><a href="/editgastos/' + cslt_gsto_opr.id + '" class="link icon-only" id="btn_edit_gastos"><i class="icon f7-icons color-azul">compose</i></a><a href="/deletegastos/' + cslt_gsto_opr.id + '" class="link icon-only" id="btn_delete_gastos"><i class="icon f7-icons color-azul">trash</i></a><a href="#" class="link icon-only" id="viewLinkIMG"><i class="material-icons' + colorFoto + '">photo</i></a><a href="#" class="link icon-only" id="viewLinkPDF"><i class="material-icons ' + colorPDF + '">picture_as_pdf</i></a><a href="#" class="link icon-only" id="viewLinkXML"><i class="icon f7-icons ' + colorXML + '">document_fill</i></a></td></tr>';
                });
            } else {
                gatosConsulta += '<tr><td class="label-cell"></td><td class="label-cell colors" colspan="3">No hay Información</td></tr>';
            }
            $$('#tbcoperadores').html(gatosConsulta);
        },
        function (error) {
            var gatosConsulta = '<tr><td class="label-cell"></td><td class="label-cell colors" colspan="3">No hay Información</td></tr>';
            $$('#tbcoperadores').html(gatosConsulta);
        },
        'json'
    );

    $$('#btn_add_gastos').on('click', function (e) {
        app.views.main.router.navigate('/addgastos/', {reloadCurrent: false});
    });

    $$('#btn_delete_gastos').on('click', function (e) {
        app.views.main.router.navigate('/deletegastos/', {reloadCurrent: false});
    });
});
$$(document).on('page:init', '.page[data-name="addgastos"]', function (e) {
    $$("#Gcomentario").hide();
    $$("#kmi").hide();
    $$("#kmf").hide();
    DateActual('fgasto');
    RsltsGastos('');
    RsltsPrvdr('');

    $$('#openFotoGasto').on('click', function () {
        app.dialog.create({
            title: 'Comprobate',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_cmpbnt_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_cmpbnt_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cmpbnt_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_cmpbnt_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasGastos');
                }
            }
        });

        $$('.id_cmpbnt_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_cmpbnt_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasGastos');
                }
            }
        });
    });

    $$('#ConceptoGasto').on('change', function () {
        var ConceptoGasto = $$('#ConceptoGasto').val();
        if (ConceptoGasto == 3) {
            $$("#kmi").show();
            $$("#kmf").show();
        } else {
            $$("#kmi").hide();
            $$("#kmf").hide();
        }
        if (ConceptoGasto == 12) {
            $$("#Gcomentario").show();
        } else {
            $$("#Gcomentario").hide();
        }
    });

    $$('#PFDGastos').on('change', function () {
        convertToBase64('PFDGastos', 'pdfColocar', 'pdf');
    });

    $$('#XMLGastos').on('change', function () {
        convertToBase64('XMLGastos', 'xmlColocar', 'xml');
    });

    $$('#btn_form_add_gastos').on('click', function (e) {
        var id_operador = localStorage.getItem('user_id');
        var fgasto = $$('#fgasto').val();
        var ConceptoGasto = $$('#ConceptoGasto').val();
        var concepto = $$('#comentario').val();
        var OprProve = $$('#OprProve').data("idPrvdr");
        var monto = $$('#monto').val();
        var TpoCmprbnt = $$('#TpoCmprbnt').val();
        var numticket = $$('#numticket').val();
        var FotoStatus = $$('#myCanvasGastos').data("foto1");
        var PDFStatus = $$('#pdfColocar').data("status");
        var XMLStatus = $$('#xmlColocar').data("status");
        var kminicial = $$('#kminicial').val();
        var kmfinal = $$('#kmfinal').val();
        var observaciones = $$('#observaciones').val();
        var comentario = $$('#comentario').val();

        validateMonto(monto);

        if (FotoStatus == 0) {
            var FotoGastos = '';
        } else {
            var cnvsGasto = $$('#myCanvasGastos')[0];
            var FotoGastos = cnvsGasto.toDataURL();
        }

        if (PDFStatus == 0) {
            var PFDGastos = '';
        } else {
            var PFDGastos = $$('#pdfColocar').data("file");
        }

        if (XMLStatus == 0) {
            var XMLGastos = '';
        } else {
            var XMLGastos = $$('#xmlColocar').data("file");
        }

        if (fgasto == "") {
            app.dialog.alert("El campo de Fecha está vacío");
        } else if (id_operador == '') {
            app.dialog.alert("Operador no existe");
        } else if (ConceptoGasto == '') {
            app.dialog.alert("El campo de Concepto está vacío");
        } else if (ConceptoGasto == 12 && comentario == '') {
            app.dialog.alert("Explicar en el campo concepto que tipo de concepto");
        } else if (ConceptoGasto == 3 && kminicial == '') {
            app.dialog.alert("El campo de kminicial está vacío");
        } else if (ConceptoGasto == 3 && kmfinal == '') {
            app.dialog.alert("El campo de kmfinal está vacío");
        } else if (OprProve == 0) {
            app.dialog.alert("El campo de Proveedor está vacío");
        } else if (monto == '') {
            app.dialog.alert("El campo de Monto está vacío");
        } else if (numticket == '') {
            app.dialog.alert("El campo de No.Ticket o Folio está vacío");
        } else if (TpoCmprbnt == '' || TpoCmprbnt == 0) {
            app.dialog.alert("El campo de Tipo de Comprobante está vacío");
        } else if (FotoStatus == 0) {
            app.dialog.alert("El campo Foto del Comprobante está vacío");
        } else if (observaciones == "" && PDFStatus == 0) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF no se enviara");
        } else if (observaciones == "" && XMLStatus == 0) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF no se enviara");
        } else {
            //alert(OprProve);
            //console.log(FotoGastos+'**'+PFDGastos+'**'+XMLGastos+'**');
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });


            app.request.postJSON(
                URL_NEW_WS + 'api/v2/gastos-operador/' + id_operador,
                {
                    id_operador: id_operador,
                    id_concepto: ConceptoGasto,
                    comentarios: concepto,
                    id_proveedor: OprProve,
                    monto: monto,
                    num_comprobante: numticket,
                    tipo_comprobante: TpoCmprbnt,
                    fecha_gasto: fgasto,
                    foto_comprobante: FotoGastos,
                    pdf_comprobante: PFDGastos,
                    xml_comprobante: XMLGastos,
                    observaciones: observaciones,
                    kminicial: kminicial,
                    kmfinal: kmfinal
                },
                function (data) {
                    app.dialog.alert("El gasto se agrego correctamente");
                    app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        }
    });

});
$$(document).on('page:init', '.page[data-name="editgastos"]', function (e) {
    $$("#Gcomentario").hide();
    $$("#kmi").hide();
    $$("#kmf").hide();
    RsltsPrvdr('');
    var idGasto = app.view.main.router.currentRoute.params.idGasto;

    $$('#ConceptoGasto').on('change', function () {
        var ConceptoGasto = $$('#ConceptoGasto').val();
        if (ConceptoGasto == 3) {
            $$("#kmi").show();
            $$("#kmf").show();
        } else {
            $$("#kmi").hide();
            $$("#kmf").hide();
        }
        if (ConceptoGasto == 12) {
            $$("#Gcomentario").show();
        } else {
            $$("#Gcomentario").hide();
        }
    });

    $$('#openFotoGasto').on('click', function () {
        app.dialog.create({
            title: 'Comprobate',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_cmpbnt_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_cmpbnt_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cmpbnt_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();

        $$('.id_cmpbnt_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasGastos');
                }
            }
        });

        $$('.id_cmpbnt_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_cmpbnt_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasGastos');
                }
            }
        });

    });

    $$('#PFDGastos').on('change', function () {
        convertToBase64('PFDGastos', 'pdfColocar', 'pdf');
    });
    $$('#pdfColocar').on('click', function () {
        var PDFStatus = $$('#pdfColocar').data("file");
        cordova.InAppBrowser.open(PDFStatus, '_system', 'location=yes');
    });
    $$('#XMLGastos').on('change', function () {
        convertToBase64('XMLGastos', 'xmlColocar', 'xml');
    });
    $$('#xmlColocar').on('click', function () {
        var XMLStatus = $$('#xmlColocar').data("file");
        cordova.InAppBrowser.open(XMLStatus, '_blank', 'location=yes');
    });
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        },
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/consultar-gasto/' + idGasto,
        function (data) {
            data.forEach(function (Oprgasto, index) {
                DateGasto('fgasto', Oprgasto.fecha_gasto);
                RsltsGastos(Oprgasto.id_concepto);
                NmPrvdr('OprProve', Oprgasto.id_proveedor);
                RsltsConcepto('comentario', Oprgasto.id_concepto, Oprgasto.comentarios, Oprgasto.incil_klmtrj, Oprgasto.final_klmtrj);
                RsltsMonto('monto', Oprgasto.monto);
                RsltsNum('numticket', Oprgasto.num_comprobante);
                RsltsTpComprobante('TpoCmprbnt', Oprgasto.tipo_comprobante);
                RsltsFotoComprobante('mediaColocar', Oprgasto.foto_comprobante);
                RsltsPDFComprobante('PFDGastos', Oprgasto.pdf_comprobante);
                RsltsXMLComprobante('XMLGastos', Oprgasto.xml_comprobante);
                RsltsObservaciones('observaciones', Oprgasto.observaciones);
            });
        },
        function (error) {
            console.log(error);
        },
        'json'
    );

    $$('#btn_form_add_gastos').on('click', function (e) {
        //console.log("btn_form_add_gastos");
        var id_operador = localStorage.getItem('user_id');
        var fgasto = $$('#fgasto').val();
        var ConceptoGasto = $$('#ConceptoGasto').val();
        var concepto = $$('#comentario').val();
        var OprProve = $$('#OprProve').data("idPrvdr");
        var monto = $$('#monto').val();
        var numticket = $$('#numticket').val();
        var TpoCmprbnt = $$('#TpoCmprbnt').val();
        var FotoStatus = $$('#myCanvasGastos').data("foto1");
        var FotoStatusBD = $$('#mediaColocar').data("status");
        var PDFStatus = $$('#pdfColocar').data("status");
        var PDFStatusBD = $$('#PFDGastos').data("status");
        var XMLStatus = $$('#xmlColocar').data("status");
        var XMLStatusBD = $$('#XMLGastos').data("status");
        var kminicial = $$('#kminicial').val();
        var kmfinal = $$('#kmfinal').val();
        var observaciones = $$('#observaciones').val();

        validateMonto(monto);

        if (FotoStatus == 0 && FotoStatusBD == 1) {
            var FotoGastos = '';
        } else {
            var cnvsGasto = $$('#myCanvasGastos')[0];
            var FotoGastos = cnvsGasto.toDataURL();
        }

        if (PDFStatus == 0) {
            var PFDGastos = '';
        } else {
            var PFDGastos = $$('#pdfColocar').data("file");
        }

        if (XMLStatus == 0) {
            var XMLGastos = '';
        } else {
            var XMLGastos = $$('#xmlColocar').data("file");
        }

        if (fgasto == "") {
            app.dialog.alert("El campo de Fecha está vacío");
        } else if (id_operador == '') {
            app.dialog.alert("Operador no existe");
        } else if (ConceptoGasto == '') {
            app.dialog.alert("El campo de Concepto está vacío");
        } else if (ConceptoGasto == 12 && comentario == '') {
            app.dialog.alert("Explicar en el campo concepto que tipo de concepto");
        } else if (ConceptoGasto == 3 && kminicial == '') {
            app.dialog.alert("El campo de kminicial está vacío");
        } else if (ConceptoGasto == 3 && kmfinal == '') {
            app.dialog.alert("El campo de kmfinal está vacío");
        } else if (OprProve == 0) {
            app.dialog.alert("El campo de Proveedor está vacío");
        } else if (monto == '') {
            app.dialog.alert("El campo de Monto está vacío");
        } else if (TpoCmprbnt == '' || TpoCmprbnt == 0) {
            app.dialog.alert("El campo de Tipo de Comprobante está vacío");
        } else if (numticket == '') {
            app.dialog.alert("El campo de No.Tickeet o Folio está vacío");
        } else if (FotoStatus == 0 && FotoStatusBD == 0) {
            app.dialog.alert("El campo Foto del Comprobante está vacío");
        } else if (observaciones == "" && PDFStatus == 0 && PDFStatusBD == 0) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF no se enviara");
        } else if (observaciones == "" && XMLStatus == 0 && XMLStatusBD == 0) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF no se enviara");
        } else {
            if (ConceptoGasto != 12) {
                concepto = '';
            }
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });

            app.request.postJSON(
                URL_NEW_WS + 'api/v2/editar/gastos-operador/' + idGasto,
                {
                    id_operador: id_operador,
                    id_concepto: ConceptoGasto,
                    comentarios: concepto,
                    id_proveedor: OprProve,
                    monto: monto,
                    num_comprobante: numticket,
                    tipo_comprobante: TpoCmprbnt,
                    fecha_gasto: fgasto,
                    foto_comprobante: FotoGastos,
                    pdf_comprobante: PFDGastos,
                    xml_comprobante: XMLGastos,
                    observaciones: observaciones,
                    kminicial: kminicial,
                    kmfinal: kmfinal
                },
                function (data) {
                    app.dialog.alert("El gasto se actualizo correctamente");
                    app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );

        }
    });
});
$$(document).on('page:init', '.page[data-name="addproveedor"]', function (e) {
    $$('#btn_add_proveedor').on('click', function (e) {
        var name_proveedor = $$('#nameprvdr').val();
        if (name_proveedor != '') {
            name_proveedor = name_proveedor.toUpperCase();
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });

            app.request.postJSON(
                URL_NEW_WS + 'api/v2/proveedor-operador/nuevo',
                {
                    nombre: name_proveedor
                },
                function (data) {
                    app.dialog.alert("El proveedor  se  agrego correctamente");
                    app.views.main.router.navigate('/addgastos/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        } else {
            app.dialog.alert("El campo del proveedor esta vacío");
        }
    });
});
$$(document).on('page:init', '.page[data-name="deletegastos"]', function (e) {
    var idGasto = app.view.main.router.currentRoute.params.idGasto;
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                localStorage.clear();
                app.preloader.hide();
                window.location.reload();
            }
        }
    });

    app.request.get(
        URL_NEW_WS + 'api/v2/delete/gastos-operador/' + idGasto,
        function (data) {
            app.views.main.router.navigate('/hojagastos/', {reloadCurrent: false});
            app.dialog.alert("El Gasto se elimino correctamente");
        }, function (error) {
            console.log(error);
        },
        'json'
    );
});

/**
 ** Solicitud Combustible
 **/
$$(document).on('page:init', '.page[data-name="solicitudes"]', function (e) {
    var SlctdConsulta = '';
    var status, ClassRlts;
    DateActual('calendardefault');
    var id_operador = localStorage.getItem('user_id');
    var periodo = $$('#calendardefault').val();
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        }, beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/consultar/solicitud/' + id_operador + '/' + periodo,
        function (data) {
            SlctdConsulta += '<div class="list accordion-list">\n' + '<ul>';
            if (data != '') {
                data.forEach(function (cslt_slctds_opr, index) {
                    if (cslt_slctds_opr.observaciones == '' ||
                        cslt_slctds_opr.observaciones == undefined ||
                        cslt_slctds_opr.observaciones == null) {
                        var observaciones = "";
                    } else {
                        var observaciones = cslt_slctds_opr.observaciones;
                    }
                    if (cslt_slctds_opr.status_solicitud == 1) {
                        ClassRlts = "class='alert alert-primary'";
                        status = 'Solicitado';
                    } else if (cslt_slctds_opr.status_solicitud == 2) {
                        ClassRlts = "class='alert alert-info'";
                        status = 'Autorizado';
                    } else if (cslt_slctds_opr.status_solicitud == 3) {
                        ClassRlts = "class='alert alert-warning'";
                        status = 'Anomalía';
                    } else if (cslt_slctds_opr.status_solicitud == 4) {
                        ClassRlts = "class='alert alert-success'";
                        status = 'Proceso Terminado';
                    }
                    var msn_enviar = cslt_slctds_opr.status_msn_recibido;
                    //console.log(msn_enviar);
                    SlctdConsulta +=
                        '    <li class="accordion-item"><a href="#" class="item-content item-link">\n' +
                        '        <div class="item-inner">' +
                        '          <div class="item-title"> <span>Folio: ' + cslt_slctds_opr.id + '</span>' +
                        '<span> Placas: ' + cslt_slctds_opr.placa + '</span></div>' +
                        '        </div></a>' +
                        '      <div class="accordion-item-content">\n' +
                        '        <div class="block">' +
                        '          <p>Status: <span ' + ClassRlts + '>' + status + '</span></p>';
                    if (cslt_slctds_opr.status_solicitud > 1 && cslt_slctds_opr.status_solicitud < 4) {
                        SlctdConsulta +=
                            '          <p>Observaciones: ' + observaciones + '</p>';
                        if (msn_enviar == 0) {
                            SlctdConsulta += '          <p>Enviar correo de enterado: <i class="material-icons color-gray clickemail" data-folio="' + cslt_slctds_opr.id + '">email</i></p>';
                        }
                        if(cslt_slctds_opr.metodo_pago <=1 &&  cslt_slctds_opr.vigencia_solicitud >=periodo && (cslt_slctds_opr.pdf_comprobante ==null || cslt_slctds_opr.pdf_comprobante == undefined) && (cslt_slctds_opr.xml_comprobante ==null || cslt_slctds_opr.xml_comprobante == undefined)) {
                            SlctdConsulta += '          <p class="alert alert-warning">Subir Ticket, PDF y XML antes del '+cslt_slctds_opr.vigencia_solicitud+'</p>';
                            SlctdConsulta += '          <p><a href="/solicitudgasto/' + cslt_slctds_opr.id + '"><i class="icon f7-icons">arrow_up_doc_fill</i>Subir datos de TICKET</a></p>';
                        }else{
                            SlctdConsulta += '          <p><a href="/solicitudgasto/' + cslt_slctds_opr.id + '"><i class="icon f7-icons">arrow_up_doc_fill</i>Subir datos de TICKET</a></p>';

                        }
                    }
                    SlctdConsulta += '</div>' +
                        '      </div>' +
                        '    </li>';
                });
                SlctdConsulta += '</ul></div>';
                $$('#tbcoperadores').html(SlctdConsulta);
                $$(".clickemail").on('click', function () {
                    //console.log("folio:"+$$(this).data('folio'));
                    var folio = $$(this).data('folio');
                    EnviarEmail(folio, id_operador);
                });
            } else {
                SlctdConsulta += '<div class="label-cell colors">No hay Información</div>';
                $$('#tbcoperadores').html(SlctdConsulta);
            }
        },
        function (error) {
            var gatosConsulta = '<tr><td class="label-cell"></td><td class="label-cell colors" colspan="3">No hay Información</td></tr>';
            $$('#tbcoperadores').html(SlctdConsulta);
        },
        'json'
    );
    $$('#btn_add_solicitud').on('click', function (e) {
        app.views.main.router.navigate('/addsolicitud/', {reloadCurrent: false});
    });

});
$$(document).on('page:init', '.page[data-name="addsolicitud"]', function (e) {
    DateActual('fsolicitud');
    $$('#TpoUnidad').on('change', function () {
        var TpoUnidad = $$('#TpoUnidad').val();
        RsltsVehiculo('vehiculo', TpoUnidad);
    });
    $$('#openFotoOdometro').on('click', function () {
        app.dialog.create({
            title: 'Foto',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_ftodometro_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_ftodometro_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_ftodometro_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();
        $$('.id_ftodometro_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasOdometro');
                }
            }
        });

        $$('.id_ftodometro_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_ftodometro_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasOdometro');
                }
            }
        });
    });

    $$('#btnsolicitud').on('click', function (e) {
        var id_operador = localStorage.getItem('user_id');
        var fsolicitud = $$('#fsolicitud').val();
        var id_auto = $$('#vehiculo').val();
        var odometro = $$('#odometro').val();
        var monto = $$('#monto').val();
        var FotoStatus = $$('#myCanvasOdometro').data("foto1");
        var foto_odometro,cnvsOdometro;

        validatePrecio('monto', monto);
        validateNumero('odometro');
        validateOdometro('odometro',id_auto);



        if (FotoStatus == 0) {
            foto_odometro = '';
        } else {
            cnvsOdometro = $$('#myCanvasOdometro')[0];
            foto_odometro = cnvsOdometro.toDataURL();
        }
        if (fsolicitud == '') {
            app.dialog.alert("El campo de Fecha está vacío");
        } else if (id_auto == '' || id_auto == 0) {
            app.dialog.alert("El campo Tipo de vehículo está vacío");
        } else if (monto == '') {
            app.dialog.alert("El campo monto está vacío");
        } else if (odometro == '') {
            app.dialog.alert("El campo odómetro está vacío");
        } else if (FotoStatus == 0) {
            app.dialog.alert("El campo Foto de Odómetro está vacío");
        } else {
            //console.log(id_operador + '**' + fsolicitud + '**' + id_auto + '**' + odometro + '**' + monto + '**' + FotoStatus + '**' + foto_odometro);
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });
            app.request.get(
                URL_NEW_WS + 'api/v2/latestodometro/' + id_auto,
                function (data) {
                    var odometro = $$("#odometro").val();
                    console.log(odometro,data.odometro);
                    if (odometro <= data.odometro) {
                        document.getElementById("odometro").value = "";
                        app.dialog.alert("Error: Revisar el odómetro "+odometro+", su valor debe ser mayor al ingresado");
                    }else{
                        app.request.postJSON(
                            URL_NEW_WS + 'api/v2/agregar-combustible',
                            {
                                fecha: fsolicitud,
                                id_operador: id_operador,
                                id_auto: id_auto,
                                monto: monto,
                                foto_odometro: foto_odometro,
                                odometro: odometro
                            },
                            function (data) {
                                app.dialog.alert("La solicitud ha sido enviada pronto recibirá un correo");
                                app.views.main.router.navigate('/solicitudes/', {reloadCurrent: false});
                            }, function (error) {
                                console.log(error);
                            },
                            'json'
                        );
                    }
                },
                function (error) {
                    console.log(error);
                },
                'json'
            );
        }
    });
});
$$(document).on('page:init', '.page[data-name="solicitudgasto"]', function (e) {
    var idSolicitud = app.view.main.router.currentRoute.params.idSolicitud;
    var id_operador = localStorage.getItem('user_id');
    var metodo_pago = $$('#MtdPago').val();
    RsltsMtdPago('metodo_pago', metodo_pago);

    $$('#MtdPago').on('change', function () {
        var metodo_pago = $$('#MtdPago').val();
        if (metodo_pago == 1) {
            $$(".TMtdPago").show();
        } else {
            document.getElementById('PFDGastos').value = null;
            document.getElementById('XMLGastos').value = null;
            document.getElementById('obs_comprobante').value = null;
            $$('#pdfColocar').data("status", 0);
            $$('#xmlColocar').data("status", 0);
            $$(".TMtdPago").hide();
        }
    });
    $$('#openFotoGasto').on('click', function () {
        app.dialog.create({
            title: 'Comprobate',
            text: 'Elegir opción:',
            buttons: [
                {
                    text: 'Camara',
                    cssClass: 'id_cmpbnt_camara'
                },
                {
                    text: 'Galeria',
                    cssClass: 'id_cmpbnt_galeria'
                },
                {
                    text: 'Cancelar',
                    cssClass: 'id_cmpbnt_cancelar'
                },
            ],
            verticalButtons: true,
        }).open();

        $$('.id_cmpbnt_camara').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openCamera('myCanvasGastos');
                }
            }
        });

        $$('.id_cmpbnt_cancelar').on('click', function (e) {
            app.dialog.close();
        });

        $$('.id_cmpbnt_galeria').on('click', function (e) {
            var permissions = cordova.plugins.permissions;
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

            function error() {
                app.dialog.alert('Necesitas permiso de: WRITE_EXTERNAL_STORAGE ');
            }

            function success(status) {
                if (!status.hasPermission) {
                    error();
                } else {
                    openFilePicker('myCanvasGastos');
                }
            }
        });

    });
    $$('#PFDGastos').on('change', function () {
        convertToBase64('PFDGastos', 'pdfColocar', 'pdf');
    });
    $$('#pdfColocar').on('click', function () {
        var PDFStatus = $$('#pdfColocar').data("file");
        cordova.InAppBrowser.open(PDFStatus, '_system', 'location=yes');
    });
    $$('#XMLGastos').on('change', function () {
        convertToBase64('XMLGastos', 'xmlColocar', 'xml');
    });
    $$('#xmlColocar').on('click', function () {
        var XMLStatus = $$('#xmlColocar').data("file");
        cordova.InAppBrowser.open(XMLStatus, '_blank', 'location=yes');
    });
    app.request.setup({
        headers: {
            'Authorization': "bearer " + localStorage.getItem('token')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        },
    });
    app.request.get(
        URL_NEW_WS + 'api/v2/consultar/combustible/' + idSolicitud,
        function (data) {
            data.forEach(function (Oprsolicitud, index) {
                DateGasto('fgasto', Oprsolicitud.fecha);
                RsltsValor('monto', Oprsolicitud.monto);
                RsltsValor('prcltrs', Oprsolicitud.precio_combustible);
                RsltsValor('ltsttls', Oprsolicitud.ttltrs_combustible);
                RsltsAuto('vehiculo', Oprsolicitud.id_auto, Oprsolicitud.placa);
                RsltsValor('nameprovedor', Oprsolicitud.name_proveedor);
                RsltsValor('numticket', Oprsolicitud.num_comprobante);
                RsltsValor('odometro', Oprsolicitud.odometro);
                RsltsMtdPago('MtdPago', Oprsolicitud.metodo_pago);
                RsltsFotoComprobante('mediaColocar', Oprsolicitud.foto_comprobante);
                RsltsPDFComprobante('PFDGastos', Oprsolicitud.pdf_comprobante);
                RsltsXMLComprobante('XMLGastos', Oprsolicitud.xml_comprobante);
                RsltsValor('obs_comprobante', Oprsolicitud.obs_comprobante);
            });
        },
        function (error) {
            console.log(error);
        },
        'json'
    );

    $$('#btn_gastos_solicitud').on('click', function (e) {
        var id_operador = localStorage.getItem('user_id');
        var fgasto = $$('#fgasto').val();
        var id_auto = $$('#vehiculo').val();
        var monto = $$('#monto').val();
        var odometro = $$('#odometro').val();
        var precio = $$('#prcltrs').val();
        var total = $$('#ltsttls').val();
        var name_proveedor = $$('#nameprovedor').val();
        var metodo_pago = $$('#MtdPago').val();
        var numticket = $$('#numticket').val();
        var TpoCmprbnt = $$('#TpoCmprbnt').val();
        var FotoStatus = $$('#myCanvasGastos').data("foto1");
        var FotoStatusBD = $$('#mediaColocar').data("status");
        var PDFStatus = $$('#pdfColocar').data("status");
        var PDFStatusBD = $$('#PFDGastos').data("status");
        var XMLStatus = $$('#xmlColocar').data("status");
        var XMLStatusBD = $$('#XMLGastos').data("status");
        var observaciones = $$('#obs_comprobante').val();

        validatePrecio('monto', monto);
        validatePrecio('prcltrs', precio);
        validatePrecio('ltsttls', total);

        if (FotoStatus == 0 && FotoStatusBD == 1) {
            var FotoGastos = '';
        } else {
            var cnvsGasto = $$('#myCanvasGastos')[0];
            var FotoGastos = cnvsGasto.toDataURL();
        }

        if (PDFStatus == 0) {
            var PFDGastos = '';
        } else {
            var PFDGastos = $$('#pdfColocar').data("file");
        }

        if (XMLStatus == 0) {
            var XMLGastos = '';
        } else {
            var XMLGastos = $$('#xmlColocar').data("file");
        }

        if (fgasto == "") {
            app.dialog.alert("El campo de Fecha está vacío");
        } else if (id_operador == '') {
            app.dialog.alert("Operador no existe");
        } else if (id_auto == "") {
            app.dialog.alert("El campo de vehículo está vacío");
        } else if (monto == '') {
            app.dialog.alert("El campo de Monto está vacío");
        } else if (odometro == '') {
            app.dialog.alert("El campo de Odómetro está vacío");
        } else if (precio == '') {
            app.dialog.alert("El campo de Precios x Litros está vacío");
        } else if (total == '') {
            app.dialog.alert("El campo de Total Litros Cargados está vacío");
        } else if (name_proveedor == "") {
            app.dialog.alert("El campo de Proveedor está vacío");
        } else if (metodo_pago == '' || metodo_pago == 0) {
            app.dialog.alert("El campo de Método de Pago está vacío");
        } else if (TpoCmprbnt == '' || TpoCmprbnt == 0) {
            app.dialog.alert("El campo de Tipo de Comprobante está vacío");
        } else if (numticket == '') {
            app.dialog.alert("El campo de No.Ticket está vacío");
        } else if (FotoStatus == 0 && FotoStatusBD == 0) {
            app.dialog.alert("El campo Foto del Comprobante está vacío");
        } else if (observaciones == "" && PDFStatus == 0 && metodo_pago == 1 ) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF o XML no se enviara");
        } else if (observaciones == "" && XMLStatus == 0 && metodo_pago == 1) {
            app.dialog.alert("Explicar brevemente porque el archivo PDF o XML no se enviara");
        } else {
            app.request.setup({
                headers: {
                    'Authorization': "bearer " + localStorage.getItem('token')
                },
                beforeSend: function () {
                    app.preloader.show();
                },
                complete: function () {
                    app.preloader.hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 404) {
                        localStorage.clear();
                        app.preloader.hide();
                        window.location.reload();
                    }
                }
            });
            app.request.postJSON(
                URL_NEW_WS + 'api/v2/update-combustible/' + idSolicitud,
                {
                    fecha: fgasto,
                    id_operador: id_operador,
                    id_auto: id_auto,
                    monto: monto,
                    name_proveedor: name_proveedor,
                    metodo_pago: metodo_pago,
                    tipo_comprobante: TpoCmprbnt,
                    num_comprobante: numticket,
                    foto_comprobante: FotoGastos,
                    pdf_comprobante: PFDGastos,
                    xml_comprobante: XMLGastos,
                    obs_comprobante: observaciones,
                    precio_combustible: precio,
                    ttltrs_combustible: total
                },
                function (data) {
                    app.dialog.alert("Se actualizo correctamente");
                    app.views.main.router.navigate('/solicitudes/', {reloadCurrent: false});
                }, function (error) {
                    console.log(error);
                },
                'json'
            );
        }
    });

});

/**Fotografias**/
$$(document).on('page:init', '.page[data-name="fotoacuse"]', function (e) {
    var numGuia = app.view.main.router.currentRoute.params.numGuia;
    //console.log(numGuia);
    fotoacuse.index(app,numGuia);
});
/**GuiasHijos**/
$$(document).on('page:init', '.page[data-name="cambiarstatushijos"]', function (e) {
    $$('#mostrarResutl').hide();
    var id_operador = localStorage.getItem('user_id');
    $$('#btn_escanear_hjs').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_hijo = result.text;
                    if(num_guia_hijo.length > 17){
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia_hijo)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan_hjs').append('<li>' + num_guia_hijo + '</li>');
                            $$('#hidden_guias_scan').val(num_guia_hijo + '|' + $$('#hidden_guias_scan').val());
                            var guiasHjs = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$("#guiasscan").val(guiasHjs);
                        }
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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
    $$('#btn_cambiar_status_guias').on('click', function () {
        var idoperador = localStorage.getItem('userid');
        var selectStatus= $$('#selectStatus').val();
        var guiasHjs= $$("#guiasscan").val();
        var latitud= $$("#latitud").val();
        var longitud= $$("#longitud").val();
        var lanlog=(latitud +','+ longitud);
        fnGuiasHijos.ValidarNGHJIDV(app,idoperador,guiasHjs,lanlog,selectStatus);
    });
    $$('#btn_regresar').on('click', function () {
        app.views.main.router.navigate('/opcionesguiashjs/', {reloadCurrent: false});
    });

});
$$(document).on('page:init', '.page[data-name="asignarguiahijo"]', function (e) {
    //var sucursal = app.view.main.router.currentRoute.params.numGuia;
    $$('#mostrarQRSR').show();
    $$('#mostrarQRJR').hide();
    $$('#mostrarResutl').hide();
    $$('#btnValidarNGP').on('click',function () {
        var valor = $$('#NGuiaPadre').val();
        fnGuiasHijos.validarNG(app,valor);
    });
    $$('#btn_escanear_papa').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_padre = result.text;
                    if(num_guia_padre.length > 17){
                        fnGuiasHijos.validarNG(app,num_guia_padre);
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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
    $$('#btn_escanear_hjs').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_hijo = result.text;
                    if(num_guia_hijo.length > 17){
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia_hijo)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan_hjs').append('<li>' + num_guia_hijo + '</li>');
                            $$('#hidden_guias_scan').val(num_guia_hijo + '|' + $$('#hidden_guias_scan').val());
                            var guiasHjs = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$("#guiasscan").val(guiasHjs);
                        }
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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
    $$('#btn_asignar_guias').on('click', function () {
        var idoperador = localStorage.getItem('userid');
        var guiasHjs= $$("#guiasscan").val();
        var guiapadre= $$("#infoguiapadre").val();
        var latitud= $$("#latitud").val();
        var longitud= $$("#longitud").val();
        var lanlog=(latitud +','+ longitud);
        fnGuiasHijos.ValidarNGHJ(app,idoperador,guiapadre,guiasHjs,lanlog);
    });
    $$('#btn_regresar_guias').on('click', function () {
        var guiapadre= $$("#infoguiapadre").val();
        app.views.main.router.navigate('/cambiarstatus/'+guiapadre, {reloadCurrent: false});
    });
    $$('#btnregresarguias').on('click', function () {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    });


});
$$(document).on('page:init', '.page[data-name="asignarhijos"]', function (e) {
    var sucursal = app.view.main.router.currentRoute.params.numsucursal;
    var id_operador = localStorage.getItem('user_id');
    $$('#numSucursal').val(sucursal);
    $$('#mostrarResutl').hide();
    $$('#btn_escanear_hjs').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_hijo = result.text;
                    if(num_guia_hijo.length > 17){
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia_hijo)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan_hjs').append('<li>' + num_guia_hijo + '</li>');
                            $$('#hidden_guias_scan').val(num_guia_hijo + '|' + $$('#hidden_guias_scan').val());
                            var guiasHjs = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$("#guiasscan").val(guiasHjs);
                        }
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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
    $$('#btn_cambiar_status_guias').on('click', function () {
        var idoperador = localStorage.getItem('userid');
        var selectStatus= $$('#selectStatus').val();
        var guiasHjs= $$("#guiasscan").val();
        var latitud= $$("#latitud").val();
        var longitud= $$("#longitud").val();
        var lanlog=(latitud +','+ longitud);
        fnGuiasHijos.ValidarNGHJIDV(app,idoperador,guiasHjs,lanlog,selectStatus,sucursal);
    });
    $$('#btn_regresar').on('click', function () {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    });
});
$$(document).on('page:init', '.page[data-name="asignarpadre"]', function (e) {
    var guiapadre = app.view.main.router.currentRoute.params.numGuia;
    $$('#NGuiaPadre').val(guiapadre);
    $$('#mostrarResutl').hide();

    $$('#btn_escanear_hjs').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_hijo = result.text;
                    if(num_guia_hijo.length > 17){
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia_hijo)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan_hjs').append('<li>' + num_guia_hijo + '</li>');
                            $$('#hidden_guias_scan').val(num_guia_hijo + '|' + $$('#hidden_guias_scan').val());
                            var guiasHjs = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$("#guiasscan").val(guiasHjs);
                        }
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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
    $$('#btn_asignar_guias').on('click', function () {
        var idoperador = localStorage.getItem('userid');
        var guiasHjs= $$("#guiasscan").val();
        //var guiapadre= $$("#infoguiapadre").val();
        var latitud= $$("#latitud").val();
        var longitud= $$("#longitud").val();
        var lanlog=(latitud +','+ longitud);
        fnGuiasHijos.ValidarNGHJ(app,idoperador,guiapadre,guiasHjs,lanlog);
    });
    $$('#btn_regresar_guias').on('click', function () {
        app.views.main.router.navigate('/cambiarstatus/'+guiapadre, {reloadCurrent: false});
    });
    $$('#btnregresarguias').on('click', function () {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    });


});
$$(document).on('page:init', '.page[data-name="asignarsucursalhijos"]', function (e) {
    $$('#btnmostrarQR').hide();
    $$('#mostrarResutl').hide();
    var id_operador = localStorage.getItem('user_id');

    $$('#btn_validar_sucursal').on('click', function (){
        var numSucursal = $$('#numSucursal').val();
        fnGuiasHijos.validarSucursalNGHJ(app,numSucursal);
    });

    $$('#btn_escanear_hjs').on('click', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    var num_guia_hijo = result.text;
                    if(num_guia_hijo.length > 17){
                        var guias_actuales = $$('#hidden_guias_scan').val();
                        if (guias_actuales.includes(num_guia_hijo)) {
                            app.dialog.alert("Ya habías agregado esta guía");
                        } else {
                            var cantidad_guias = parseInt($$('#total_guias_escaneadas').html());
                            cantidad_guias++;
                            $$('#total_guias_escaneadas').html(cantidad_guias);
                            $$('#total_guias_escaneadas').html();
                            $$('#lista_guias_scan_hjs').append('<li>' + num_guia_hijo + '</li>');
                            $$('#hidden_guias_scan').val(num_guia_hijo + '|' + $$('#hidden_guias_scan').val());
                            var guiasHjs = $$('#hidden_guias_scan').val().substr(0, $$('#hidden_guias_scan').val().length - 1);
                            $$("#guiasscan").val(guiasHjs);
                        }
                    }else{
                        app.dialog.alert("Guía no válida: no tiene los caracteres permitidos");
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

    $$('#btn_cambiar_status_guias').on('click', function () {
        var idoperador = localStorage.getItem('userid');
        var sucursal= $$("#numSucursal").val();
        var selectStatus= $$('#selectStatus').val();
        var guiasHjs= $$("#guiasscan").val();
        var latitud= $$("#latitud").val();
        var longitud= $$("#longitud").val();
        var lanlog=(latitud +','+ longitud);
        fnGuiasHijos.ValidarNGHJIDV(app,idoperador,guiasHjs,lanlog,selectStatus,sucursal);
    });
    /*$$('#btn_regresar').on('click', function () {
        app.views.main.router.navigate('/inicio/', {reloadCurrent: false});
    });*/
});
$$(document).on('page:init', '.page[data-name="firmarfoto"]', function (e) {
    $$('#btn_firmar').on('click', function () {
        modalFirmaSupervisor();
    });

});

function monstrarImagenes(codCliente,braNumbre,status,tipoFimg){
    $$('#mostarfotos').html('');
    var fotos ='';
    app.request.setup({
        headers: {
            'apikey': localStorage.getItem('apikey')
        },
        beforeSend: function () {
            app.preloader.show();
        },
        complete: function () {
            app.preloader.hide();
        }
    });
    app.request.get(
        config.URL_WS + 'api/v2/permiso/operador/proyecto/' + codCliente + '/' + braNumbre + '/' + status,
        function (data) {
            //console.log("#totalImg:"+data.length);
            if (data.length > 0) {
                //console.log("default campos");
                data.forEach((val, index) => {
                    fotos = '<li>\n' +
                        '                            <div class="item-content item-input">\n' +
                        '                                <div class="item-inner">\n' +
                        '                                    <div class="item-title item-label"></div>\n' +
                        '                                    <div class="item-input-wrap">\n' +
                        '                                        <table class="tablefoto">\n' +
                        '                                            <tr>\n' +
                        '                                                <td>\n' +
                        '                                                    <button class="button open-foto" data-id="' + (index + 1) + '">' + val.nombre + '</button>\n' +
                        '                                                </td>\n' +
                        '                                                <td>\n' +
                        '                                                    <a href="/fotoacuse/' + tipoFimg + val.tipo_aud + '">\n' +
                        '                                                        <i class="material-icons">info</i>\n' +
                        '                                                    </a>\n' +
                        '                                                </td>\n' +
                        '                                            </tr>\n' +
                        '                                        </table>\n' +
                        '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"></canvas>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </li>';
                    //console.log((index + 1));

                    $$('#mostarfotos').append(fotos);
                });
                var nav = navigator;
                funcionesCamara.fnInput(app,'.open-foto');
                $$('#totalImg').val(data.length);
            }else{
                //console.log('default campos');
                var val=5;
                data.forEach((val, index) => {
                    fotos += '<li>\n' +
                        '                            <div class="item-content item-input">\n' +
                        '                                <div class="item-inner">\n' +
                        '                                    <div class="item-title item-label"></div>\n' +
                        '                                    <div class="item-input-wrap">\n' +
                        '                                        <table class="tablefoto">\n' +
                        '                                            <tr>\n' +
                        '                                                <td>\n' +
                        '                                                    <button class="button open-foto-' + (index + 1) + '" data-id="' + (index + 1) + '">' + val.nombre + '</button>\n' +
                        '                                                </td>\n' +
                        '                                                <td>\n' +
                        '                                                    <a href="/fotoacuse/' + tipoFimg + val.tipo_aud + '">\n' +
                        '                                                        <i class="material-icons">info</i>\n' +
                        '                                                    </a>\n' +
                        '                                                </td>\n' +
                        '                                            </tr>\n' +
                        '                                        </table>\n' +
                        '                                        <canvas id="myCanvas' + (index + 1) + '" data-foto1="0"></canvas>\n' +
                        '                                    </div>\n' +
                        '                                </div>\n' +
                        '                            </div>\n' +
                        '                        </li>';

                    $$('#mostarfotos').append(fotos);
                });
                $$('#totalImg').val(data.length);
                funcionesCamara.fnInput(app,'.open-foto');
               // console.log('#totalImg:'+data.length);
            }
        },
        'json'
    );
}