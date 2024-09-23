import { cnpjValidation } from "./cnpjValidation";
import {cpfValidation} from "./cpfValidation";

export const documentValidation = (id: string) => {

    // Remove todos os caracteres não numéricos
    id = id.replace(/\D+/g, '');

    // não aceita números repetidos
    if (/^(\d)\1+$/.test(id)) {
        return false;
    }


    if(id.length === 11) {
      return   cpfValidation(id);
    }else if(id.length === 14) {
        return cnpjValidation(id);
    }else {
        return false
    }





}