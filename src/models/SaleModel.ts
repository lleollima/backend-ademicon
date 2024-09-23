import mongoose, {Schema, Types, Document} from 'mongoose';


export interface ISale extends Document {
    customer: Types.ObjectId;
    seller: Types.ObjectId;
    date: Date;
    value: number;
    typePayment: Types.ObjectId;
    commissionValue: number;
    commissionPercentage: number;
    isActive: boolean,
    createdAt: Date;
    updatedAt: Date;

}

const SaleSchema : Schema<ISale> = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true,

    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    value: {
        type: Number,
        required: true
    },
    commissionValue: {
        type: Number,
        required: true

    },
    commissionPercentage: {
        type: Number,
        required: true
    },
    typePayment: {
        type: Schema.Types.ObjectId,
        ref: 'TypesPayment',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

},    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false
    })

const SaleModel = mongoose.model<ISale>("Sale", SaleSchema);
export default SaleModel;