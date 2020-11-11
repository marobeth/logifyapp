import $$ from "dom7";
import config from "./config";

var fnGral = {
    mostrarMenu: (iduser,restrict) => {
        if(iduser !='' && restrict==1){
            $$('.quitar').hide();
        }
    },
    btnLlamada:(location,llamada)=> {
        if(location !=''){
            $$('#divtoolbar').show();
            $$('#location').val(location);
        }else{
            $$('#divtoolbar').hide();
        }
    }

};
export default fnGral;