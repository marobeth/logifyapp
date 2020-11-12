import $$ from "dom7";
import config from "./config";

var fnGral = {
    mostrarMenu: (iduser,restrict) => {
        if(iduser !='' && restrict==1){
            $$('.quitar').hide();
        }
    }

};
export default fnGral;