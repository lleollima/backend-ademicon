"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentValidation = void 0;
const cnpjValidation_1 = require("./cnpjValidation");
const cpfValidation_1 = require("./cpfValidation");
const documentValidation = (id) => {
    // Remove todos os caracteres não numéricos
    id = id.replace(/\D+/g, '');
    // não aceita números repetidos
    if (/^(\d)\1+$/.test(id)) {
        return false;
    }
    if (id.length === 11) {
        return (0, cpfValidation_1.cpfValidation)(id);
    }
    else if (id.length === 14) {
        return (0, cnpjValidation_1.cnpjValidation)(id);
    }
    else {
        return false;
    }
};
exports.documentValidation = documentValidation;
