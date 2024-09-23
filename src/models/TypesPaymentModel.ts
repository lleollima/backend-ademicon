import mongoose, {Schema, Document} from 'mongoose';

export interface ITypesPayment extends Document {
    name: string;
    commissionPercentage: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TypesPaymentSchema: Schema<ITypesPayment> = new Schema({
    name: { type: String, required: true, unique: true },
    commissionPercentage: { type: Number, required: true },
    isActive: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

},
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false
    })

TypesPaymentSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.set({ updatedAt: new Date() });
    }
    next();
});

TypesPaymentSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

const TypesPaymentModel = mongoose.model<ITypesPayment>("TypesPayment", TypesPaymentSchema);
export default TypesPaymentModel;