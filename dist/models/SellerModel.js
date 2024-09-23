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
const mongoose_1 = __importStar(require("mongoose"));
const SellerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    dateAdmission: { type: Date, default: Date.now },
    entryTime: { type: String, required: true },
    exitTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});
SellerSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.set({ updatedAt: new Date() });
    }
    next();
});
SellerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});
SellerSchema.virtual('Sale', {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'seller',
    justOne: false,
});
SellerSchema.set('toJSON', { virtuals: true });
const SellerModel = mongoose_1.default.model("Seller", SellerSchema);
exports.default = SellerModel;
