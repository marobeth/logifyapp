import $$ from "dom7";
import config from "./config";

var fnOcurre = {
    mostrarLista: (app, iduser) => {
        var total = '';
        var listado = '';
        var DataTable = '';
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
            config.URL_WS + '/api/v2/ocurre/proveedor/' + iduser + '/perfil',
            function (datos) {
                total = datos.total;
                listado = datos.listado;
                if (total > 0 && listado != '') {
                    $$("#totalOcurre").html('<br>Total: '+ total);
                    listado.forEach(function (valor, index) {
                        DataTable += '<tr><td class="label-cell">' + valor.num_guia +
                            '</td><td class="numeric-cell">' +valor.proveedor_ocurre +
                            '</td><td class="numeric-cell">' +valor.ocurre_proveedor +
                            '</td><td class="numeric-cell">' +valor.dias +
                            '</td></tr>';
                        $$("#tbocurre").html(DataTable);
                    });
                } else {
                    DataTable += '<tr><td class="label-cell"></td><td class="label-cell colors" colspan="4">No hay Información</td></tr>';
                    $$("#tbocurre").html(DataTable);
                }
            },
            'json'
        );
    }
};
export default fnOcurre;