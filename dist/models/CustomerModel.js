"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.CustomerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    documentId: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    complement: {
        type: String,
    },
    district: {
        type: String,
    },
    locality: {
        type: String,
    },
    uf: {
        type: String,
    },
    ibge: {
        type: String,
    },
    ddd: {
        type: String,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }
});
exports.CustomerSchema.virtual('purchase', {
    ref: 'Sales',
    localField: '_id',
    foreignField: 'customer',
    justOne: false,
});
exports.CustomerSchema.set('toJSON', { virtuals: true });
const CustomerModel = mongoose_1.default.model("Customer", exports.CustomerSchema);
exports.default = CustomerModel;
