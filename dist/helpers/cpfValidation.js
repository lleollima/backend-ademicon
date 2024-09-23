"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cpfValidation = void 0;
const cpfValidation = (cpf) => {
    // Função auxiliar para calcular os dígitos verificadores
    const calcDigit = (cpfPartial) => {
        const length = cpfPartial.length;
        let sum = 0;
        // Calcular a soma dos produtos
        for (let i = 0; i < length; i++) {
            sum += parseInt(cpfPartial.charAt(i)) * (length + 1 - i);
        }
        // Calcular o dígito verificador
        const rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
    };
    // Separar os 9 primeiros dígitos e calcular o primeiro dígito verificador
    const cpfPartial = cpf.substring(0, 9);
    const digitOne = calcDigit(cpfPartial);
    // Calcular o segundo dígito verificador
    const digitTwo = calcDigit(cpfPartial + digitOne);
    // Verificar se os dígitos verificadores batem
    return cpf === cpfPartial + digitOne.toString() + digitTwo.toString();
};
exports.cpfValidation = cpfValidation;
