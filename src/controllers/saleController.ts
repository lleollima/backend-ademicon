import {Request, Response} from "express";
import mongoose, {Error} from "mongoose";
import SaleModel from "../models/SaleModel";
import CustomerModel from "../models/CustomerModel";
import SellerModel from "../models/SellerModel";
import TypesPaymentModel from "../models/TypesPaymentModel";
import {documentValidation} from "../helpers/documentValidation";


const index = async (request: Request, response: Response) => {
    const {page = "1" , itemsPerPage = "10",  filters: filtersString  } = request.query;
    const offset: number = (Number(page) -1) * Number(itemsPerPage);
    const query: any = {
    }
    let filters;
    if (filtersString) {
        try {
            filters = JSON.parse(filtersString as string);
        } catch (err: any) {
            return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {'isActive': 'true'}", error: err.message});
        }
    }

    if (filters) {
        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
                if(key === 'name') {
                    const regex = new RegExp(filters['name'], 'i');
                    const customer: any = await CustomerModel.findOne({ name: { $regex: regex }});
                    if (customer) {
                        query['customer'] = new mongoose.Types.ObjectId(customer._id);
                    }else {
                        return response.status(404).json({ message: 'Cliente não encontrado' });
                    }
                }

                if(key === 'isActive') {
                    query['isActive'] = { $eq: filters['isActive'] === 'true' };
                }
            }
        }
    }



    try{
        const res = await SaleModel.aggregate([
            {$match: query},
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
                $project: {
                    _id: 1,
                    value: { $round: [{ $toDouble: "$value" }, 2] },
                    isActive: 1,
                    customer: {
                        _id: '$customer._id',
                        name: '$customer.name',
                    },



                }
            }
        ])
            .skip(offset)
            .limit(Number(itemsPerPage))

        const countRes = await SaleModel.aggregate([
            {$match: query},
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {$unwind: "$customer"},
            {$count: "total"}
        ]);



        return response.status(200).json({
            data: res,
            meta: {
                currentPage: Number(page ) || 1,
                itemsPerPage: Number(itemsPerPage) || 10,
                totalItems: countRes.length > 0 ? countRes[0].total : 0

            }
        })

    }catch(err: any) {

        response.status(500).send(err.message)
    }
}

const show = async (request: Request, response: Response) => {
    const id = request.params.id;
    try {
        const sale = await SaleModel.findById(id).select('-updatedAt -createdAt ').populate(['seller', 'customer', 'typePayment']);
        if (!sale) {
            return response.status(404).json({ message: 'Venda não encontrada' });
        }
        return response.status(200).json(sale);
    } catch (err: any) {
        response.status(500).send(err.message);
    }
}

const store = async (request: Request, response: Response) => {
    const {customer, seller, date, value, typePayment, isActive} = request.body;
    const customerExists: any = await CustomerModel.findOne({'documentId': customer})

    if(!customerExists) {
        return response.status(404).json({ message: 'Cliente não encontrado' });
    }

    const sellerExists =  await SellerModel.findById(seller)

    if(!sellerExists) {
        return response.status(404).json({ message: 'Vendedor não encontrado' });
    }

    const paymentExists: any = await TypesPaymentModel.findById(typePayment)

    if(!paymentExists) {
        return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
    }

    const validateDocumentId = documentValidation(customer)

    if(!validateDocumentId) {
        return response.status(400).json({ message: 'Número do documento inválido' });
    }

    const commissionPercentage = paymentExists.commissionPercentage;
    const commissionValue = value * (commissionPercentage / 100);

    try {
        const sale = new SaleModel({
            customer: customerExists._id,
            seller,
            date,
            value,
            commissionValue: commissionValue.toFixed(2),
            commissionPercentage,
            typePayment,
            isActive
        });

        const savedSale = await sale.save();

        return response.status(201).json(savedSale);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro encontrado';
        response.status(500).send(message);
    }
}

const update = async (request: Request, response: Response) => {

        const id = request.params.id;
        const {customer, seller, date, value, typePayment, isActive} = request.body;


        if(customer) {
            const customerExists: any = await CustomerModel.findOne({'documentId': customer})

            if(!customerExists) {
                return response.status(404).json({ message: 'Cliente não encontrado' });
            }
        }

        if(seller) {
            const sellerExists = await SellerModel.findById(seller)

            if(!sellerExists) {
                return response.status(404).json({ message: 'Vendedor não encontrado' });
            }
        }

        if(typePayment) {
            const paymentExists = await TypesPaymentModel.findById(typePayment)

            if(!paymentExists) {
                return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
            }
        }

        try {
            const sale: any = await SaleModel.findById(id);

            if (!sale) {
                return response.status(404).json({ message: 'Venda não encontrada' });
            }

            const validateDocumentId = documentValidation(customer)

            if(!validateDocumentId) {
                return response.status(400).json({ message: 'Número do documento inválido' });
            }



            sale.customer = await CustomerModel.findOne({'documentId': customer}).then((customer: any )=> customer._id);
            sale.seller = seller;
            sale.date = date;
            sale.value = value;
            sale.commissionValue = value ? ( value * (sale.commissionPercentage / 100) ) : sale.commissionValue;
            sale.commissionPercentage = typePayment ? await TypesPaymentModel.findById(typePayment).then((payment: any) => payment.commissionPercentage) : sale.commissionPercentage;
            sale.typePayment = typePayment;
            sale.isActive = isActive;

            const updatedSale = await SaleModel.findByIdAndUpdate(id,sale,{ new: true, runValidators: true })

            return response.status(200).json(updatedSale);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro encontrado';
            response.status(500).send(message);
        }

}

const destroy = async (request: Request, response: Response) => {

    try {
        const sale = await SaleModel.findByIdAndUpdate(request.params.id, {isActive: false}, {new: true});
        if (!sale) {
            return response.status(404).json({ message: 'Venda não encontrada' });
        }

        return response.status(200).send(sale);
    } catch (err: any) {
        response.status(500).send(err.message);
    }


}

export {index,show,store, update, destroy }