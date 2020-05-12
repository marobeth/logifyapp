import $$ from "dom7";

var funcionesCamara = {
    openCamera: (idCanvas) => {
        var pictureSource = navigator.camera.PictureSourceType;
        var destinationType = navigator.camera.DestinationType;
        var srcType = pictureSource.CAMERA;
        navigator.camera.getPicture(function cameraSuccess(imageURI) {
            $$('#' + idCanvas).show();
            //var canvas = $$('#' + idCanvas);
            var canvass = document.getElementById(idCanvas);
            var context = canvass.getContext('2d');
            var img = new Image();
            img.onload = function () {
                canvass.width = img.width / 2;
                canvass.height = img.height / 2;
                //console.log( img.width +'revisando'+ img.height);
                context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvass.width, canvass.height);
            };
            img.src = imageURI;
            $$('#' + idCanvas).data("foto1", 1);
        }, function captureError(error) {
            console.debug("No se puede obtener una foto openCamera: " + error, "app");
        }, {
            limit: 1,
            quality: 60,
            targetWidth: 1200,
            targetHeight: 1200,
            destinationType: destinationType.FILE_URI,
            encodingType: navigator.camera.EncodingType.PNG,
            saveToPhotoAlbum:true,
            sourceType: srcType
        });
    }, openFilePicker: (idCanvas) => {
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
            quality: 60,
            targetWidth: 1200,
            targetHeight: 1200,
            destinationType: destinationType.FILE_URI,
            sourceType: srcType
        });
    },
    fnInput: (app,selector,data_id) => {
        // Vertical Buttons
        $$(selector).on('click', function (e) {
            var index = $$(this).attr(data_id);
            app.dialog.create({
                title: 'Foto '+index,
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
                        /*console.log('myCanvas1');*/
                        funcionesCamara.openCamera('myCanvas'+index);
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
                        funcionesCamara.openFilePicker('myCanvas'+index);
                    }
                }
            });
        });
    }
};

export default funcionesCamara;