import mongoose, {Schema, Document} from 'mongoose';
import {ISale} from "./SaleModel";



export interface ISeller extends Document {
    name: string;
    dateAdmission: Date;
    entryTime: string;
    exitTime: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;


}

const SellerSchema: Schema<ISeller> = new Schema({
    name: { type: String, required: true, unique: true, minLength: 3 },
    dateAdmission: { type: Date, default: Date.now },
    entryTime: { type: String, required: true, validate: {
            validator: (value:string) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            message: props => `${props.value} Não é um formato valido! Formato esperado: "HH:mm"`
        }  },
    exitTime: { type: String, required: true, validate: {
            validator: (value:string) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
            message: props => `${props.value} Não é um formato valido! Formato esperado: "HH:mm"`
        }  },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

},{
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false
    }
    )

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
})

SellerSchema.set('toJSON', { virtuals: true });



const SellerModel = mongoose.model<ISeller>("Seller", SellerSchema);
export default SellerModel;