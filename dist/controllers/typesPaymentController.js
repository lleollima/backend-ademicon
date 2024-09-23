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
const TypesPaymentModel_1 = __importDefault(require("../models/TypesPaymentModel"));
const mongoose_1 = require("mongoose");
const index = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", itemsPerPage = "10", isActive } = request.query;
    const offset = (Number(page) - 1) * Number(itemsPerPage);
    const query = {};
    if (typeof isActive !== 'undefined') {
        query.isActive = isActive === 'true';
    }
    try {
        const res = yield TypesPaymentModel_1.default.find(query).select('name commissionPercentage isActive').skip(offset).limit(Number(itemsPerPage));
        return response.status(200).json({
            data: res,
            meta: {
                currentPage: Number(page) | 1,
                itemsPerPage: Number(itemsPerPage) | 10,
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
        const res = yield TypesPaymentModel_1.default.findById(request.params.id).select('name commissionPercentage isActive');
        if (!res) {
            return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
        }
        return response.status(200).json(res);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.show = show;
const store = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, commissionPercentage } = request.body;
    try {
        const typesPayment = new TypesPaymentModel_1.default({
            name,
            commissionPercentage,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const res = yield typesPayment.save();
        return response.status(201).json(res);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});
exports.store = store;
const update = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield TypesPaymentModel_1.default.findByIdAndUpdate(request.params.id, Object.assign({}, request.body), {
            new: true,
            runValidators: true,
        });
        if (!res) {
            return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
        }
        return response.status(200).json(res);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.update = update;
const destroy = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield TypesPaymentModel_1.default.findByIdAndUpdate(request.params.id, { isActive: false }, {
            new: true
        });
        return response.status(200).send(res);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.destroy = destroy;
