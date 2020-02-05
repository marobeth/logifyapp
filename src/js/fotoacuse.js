import fnGuias from "./guias/fn-guias";

var fotoacuse = {
    index:(app)=>{
        var numGuia = app.view.main.router.currentRoute.params.numGuia;
        var codCliente = numGuia.substring(0,3);
        var braNumbre = numGuia.substring(3,7);
        var status = numGuia.substring(7,8);
        var tipo_aud = numGuia.substring(8,9);
        fnGuias.mostrarImagen(app,codCliente,braNumbre,status,tipo_aud);
    },
    fncreate:(app)=>{

    },
    fnstore:(app)=>{
        },
    fnedit:(app)=>{
        },
    fnupdate:(app)=>{
        },
    fndelete:(app)=>{
    }
};
export default fotoacuse;