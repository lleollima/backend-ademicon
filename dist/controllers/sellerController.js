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
const SellerModel_1 = __importDefault(require("../models/SellerModel"));
const mongoose_1 = require("mongoose");
const index = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", itemPerPage = "10", isActive } = request.query;
    const offset = (Number(page) - 1) * Number(itemPerPage);
    const query = {};
    if (typeof isActive !== 'undefined') {
        query.isActive = isActive === 'true';
    }
    // pegando hora atual
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    try {
        let sellers = yield SellerModel_1.default.find(query).select('name entryTime exitTime isActive').skip(offset).limit(Number(itemPerPage));
        //converte os horários de entrada e saída para minutos
        sellers = sellers.map((seller) => {
            const [entryHour, entryMinute] = seller.entryTime.split(':').map(Number);
            const [exitHour, exitMinute] = seller.exitTime.split(':').map(Number);
            const entryTotalMinutes = entryHour * 60 + entryMinute;
            const exitTotalMinutes = exitHour * 60 + exitMinute;
            const isWorking = currentTotalMinutes >= entryTotalMinutes && currentTotalMinutes <= exitTotalMinutes;
            return {
                _id: seller.id,
                name: seller.name,
                isWorking,
                isActive: seller.isActive
            };
        });
        return response.status(200).json({
            data: sellers,
            meta: {
                currentPage: Number(page),
                itemsPerPage: Number(itemPerPage),
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
        // const seller = await SellerModel.findOne({_id: request.params.id}).select('name entryTime exitTime isActive').populate('Sale', 'customer date value typePayment')
        const seller = yield SellerModel_1.default.aggregate([
            { $match: { _id: request.params.id } },
            {
                $lookup: {
                    from: "sales",
                    localField: "_id",
                    foreignField: "seller",
                    as: "sales"
                }
            },
            {
                $unwind: "$sales"
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "sales.customer",
                    foreignField: "_id",
                    as: "sales.customer"
                }
            },
            {
                $unwind: "$sales.customer"
            },
            {
                $project: {
                    "name": 1,
                    "entryTime": 1,
                    "exitTime": 1,
                    "isActive": 1,
                    "sales.customer": "$sales.customer.name",
                    "sales.date": 1,
                    "sales.value": 1,
                    "sales.typePayment": 1
                }
            }
        ]);
        return response.status(200).json(seller);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.show = show;
const store = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = new SellerModel_1.default(request.body);
        yield seller.save();
        return response.status(201).json(seller);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.store = store;
const update = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield SellerModel_1.default.findByIdAndUpdate(request.params.id, Object.assign({}, request.body), {
            new: true,
            runValidators: true,
        });
        if (!seller) {
            response.status(404).send("Vendedor não encontrado");
        }
        return response.status(200).json(seller);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.update = update;
const destroy = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield SellerModel_1.default.findByIdAndUpdate(request.params.id, { isActive: false }, {
            new: true
        });
        if (!seller) {
            response.status(404).send("Vendedor não encontrado");
        }
        return response.status(200).send(seller);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.destroy = destroy;
