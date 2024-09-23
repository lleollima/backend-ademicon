import mongoose, {Schema, Document, Types} from 'mongoose';


export interface ICustomer extends Document {
    name: string;
    documentId: string;
    cep: string;
    address: string;
    complement: string;
    district: string;
    locality: string;
    uf: string;
    ibge: string;
    ddd: string;
    seller: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

}

export const CustomerSchema : Schema<ICustomer> = new Schema({
    name: {
            type: String,
            required: true
        },
    documentId: {
            type: String,
        minlength: 11,
        maxlength: 14,
        required: true,
        unique: true
        },
    cep: {
        type: String,
        minlength: 8,
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
    locality:{
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
            type: Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
    isActive: {type: Boolean, default: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    id: false
})

CustomerSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.set({ updatedAt: new Date() });
    }
    next();
});

CustomerSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

CustomerSchema.virtual('purchases', {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'customer',
    justOne: true,
})

CustomerSchema.set('toJSON', { virtuals: true });

const CustomerModel = mongoose.model<ICustomer>("Customer", CustomerSchema);
export default CustomerModel;