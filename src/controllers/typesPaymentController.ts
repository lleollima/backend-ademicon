import TypesPaymentModel from "../models/TypesPaymentModel";
import {Request, Response} from "express";

const index = async (request: Request, response: Response) => {
    const {page = "1" , itemsPerPage = "10", filters: filtersString } = request.query;
    const offset: number = (Number(page) -1) * Number(itemsPerPage);
   const query: any = {}

    let filters;
    if (filtersString) {
        try {
            filters = JSON.parse(filtersString as string);
        } catch (err: any) {
            return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {isActive: true}", error: err.message});
        }
    }

    if(filters) {

        if(filters.isActive) {
            query.isActive = filters.isActive
        }

        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }
    }

    try{
        const res = await TypesPaymentModel.find(query).select('name commissionPercentage isActive') .skip(offset).limit(Number(itemsPerPage))

        return response.status(200).json({
            data: res,
            meta: {
                currentPage: Number(page ) || 1,
                itemsPerPage: Number(itemsPerPage) || 10,

            }
        })

    }catch(err: any) {
        response.status(500).send(err.message)
    }
}

const show = async (request: Request, response: Response) => {

    try {
        const res = await TypesPaymentModel.findById(request.params.id).select('name commissionPercentage isActive');

        if (!res) {
            return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
        }

        return response.status(200).json(res);
    } catch (err: any) {
        response.status(500).send(err.message);
    }
}


    const store = async (request: Request, response: Response) => {
        const { name, commissionPercentage } = request.body;

        try {
            const typesPayment = new TypesPaymentModel({
                name,
                commissionPercentage,
                createdAt: new Date(),
                updatedAt: new Date(),
            }, );

            const res = await typesPayment.save();

            return response.status(201).json(res);
        } catch (err: any) {
            response.status(500).send(err.message);
        }
    }
const update = async (request: Request, response: Response) => {
    try {
        const res = await TypesPaymentModel.findByIdAndUpdate(request.params.id, {...request.body}, {
            new: true,
            runValidators: true,
        })

        if (!res) {
            return response.status(404).json({ message: 'Tipo de pagamento não encontrado' });
        }

        return response.status(200).json(res);

    }catch(err: any) {

        response.status(500).send(err.message);
    }
}


const destroy =async  (request: Request, response: Response) => {
    try{
       const res =  await TypesPaymentModel.findByIdAndUpdate(request.params.id, {isActive: false}, {
           new: true
       })
        return response.status(200).send(res)
    }catch(err: any) {
        response.status(500).send(err.message);
    }
}




export {index, show,store,update,destroy}