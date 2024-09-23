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
exports.store = exports.index = void 0;
const mongoose_1 = require("mongoose");
const SaleModel_1 = __importDefault(require("../models/SaleModel"));
const index = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "1", itemsPerPage = "10", isActive } = request.query;
    const offset = (Number(page) - 1) * Number(itemsPerPage);
    const match = {};
    if (typeof isActive !== 'undefined') {
        match.isActive = isActive === 'true';
    }
    try {
        const res = yield SaleModel_1.default.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $unwind: "$customer"
            },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'seller',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            {
                $unwind: "$seller"
            },
            {
                $lookup: {
                    from: 'typespayments',
                    localField: 'typePayment',
                    foreignField: '_id',
                    as: 'typePayment'
                }
            },
            {
                $unwind: "$typePayment"
            },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    value: { $round: [{ $toDouble: "$value" }, 2] },
                    isActive: 1,
                    customer: {
                        _id: '$customer._id',
                        name: '$customer.name',
                    },
                    seller: {
                        _id: '$seller._id',
                        name: '$seller.name',
                    },
                    typePayment: {
                        _id: '$typePayment._id',
                        name: '$typePayment.name',
                    }
                }
            }
        ])
            .skip(offset)
            .limit(Number(itemsPerPage));
        return response.status(200).json({
            data: res,
            meta: {
                currentPage: Number(page) || 1,
                itemsPerPage: Number(itemsPerPage) || 10,
            }
        });
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});
exports.index = index;
const store = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer, seller, date, value, typePayment, isActive } = request.body;
    try {
        const sale = new SaleModel_1.default({
            customer,
            seller,
            date,
            value,
            typePayment,
            isActive
        });
        const savedSale = yield sale.save();
        return response.status(201).json(savedSale);
    }
    catch (err) {
        const message = err instanceof mongoose_1.Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
});
exports.store = store;
