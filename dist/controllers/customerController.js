"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy = exports.update = exports.store = exports.show = exports.index = void 0;
const CustomerModel_1 = __importDefault(require("../models/CustomerModel"));
const mongoose_1 = require("mongoose");
const documentValidation_1 = require("../helpers/documentValidation");
const index = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", pageSize = "10", isActive } = request.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    const query = {
        isActive: true,
    };
    if (request.query.isActive) {
        query.isActive = Boolean(request.query.isActive);
    }
    try {
        const res = yield CustomerModel_1.default.find().skip(offset).limit(Number(pageSize));
        return response.status(200).json({
            data: res,
            meta: {
                current_page: Number(page),
                items_per_page: Number(pageSize),
            }
        });
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.index = index;
const show = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield CustomerModel_1.default.findOne({ _id: request.params.id });
        return response.status(200).json(res);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.show = show;
const store = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, documentValidation_1.documentValidation)(request.body.documentId))
            return response.status(400).json({ error: "documentId inválido" });
        const seller = new CustomerModel_1.default(request.body);
        yield seller.save();
        return response.status(201).json(seller);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.store = store;
const update = (request, response) => {
    console.log("METODO PARA ATUALIZAR UM REGISTRO ESPECIFICO");
};
exports.update = update;
const destroy = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CustomerModel_1.default.findByIdAndUpdate(request.params.id, { is_active: false });
        return response.status(200).send("Registro inativado com sucesso!");
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.destroy = destroy;
