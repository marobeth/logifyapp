import $$ from "dom7";
import config from "./config";

var fnGral = {
    mostrarMenu: (iduser,center) => {
        console.log("entre"+iduser+'**'+center);
        if(iduser !='' && center=='ALPES'){
            $$('.quitar').hide();
        }
    }

};
export default fnGral;