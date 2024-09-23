import {Request,Response} from "express";
import SaleModel from "../models/SaleModel";


const salesByPaymentType = async (request: Request, response: Response) => {
    const { filters: filtersString  } = request.query;

    const match: any = {};
    let filters;
    if (filtersString) {
        try {
            filters = JSON.parse(filtersString as string);
        } catch (err: any) {
            return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {'isActive': 'true'}", error: err.message});
        }
    }

    if(filters) {
        if (filters?.startDate && filters?.endDate) {
            match.data = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

    }

    const matchSecond: any = {};
    if(filters.isActive) {
        matchSecond['paymentTypesJoined.isActive']  = { $eq: filters['isActive'] === 'true' };
    }

    try {

        const data = await SaleModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: 'typespayments',
                    localField: 'typePayment',
                    foreignField: '_id',
                    as: 'paymentTypesJoined',
                },
            },
            { $match: matchSecond },
            { $unwind: '$paymentTypesJoined' },
            {
                $group: {
                    _id: {
                        paymentTypes: '$paymentTypesJoined',
                        nome: '$paymentTypesJoined.name',
                    },
                    totalValue: { $sum: '$value' },
                },
            },
        ]);

        const dataMapped = data.map((item) => {
            return {
                paymentType: item._id.nome,
                totalValue: item.totalValue,
            };
        });




        return response.status(200).json({data: dataMapped})

    }catch( err: any) {
        return response.status(500).send({ message: "Erro interno do servidor", error: err.message });
    }



}

const salesBySeller = async (request: Request, response: Response) => {
    const { filters: filtersString  } = request.query;

    const match: any = {};
    let filters;
    if (filtersString) {
        try {
            filters = JSON.parse(filtersString as string);
        } catch (err: any) {
            return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {'isActive': 'true'}", error: err.message});
        }
    }

    if(filters) {
        if (filters?.startDate && filters?.endDate) {
            match.data = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

        if (filters?.isActive) {
            match.isActive = { $eq: filters['isActive'] === 'true' };
        }

    }

    try {

        const aggregateData =  await SaleModel.aggregate([
            { $match: match },
            { $unwind: '$seller' },
            {
                $lookup: {
                    from: 'sellers',
                    localField: 'seller',
                    foreignField: '_id',
                    as: 'sellerJoin',
                },
            },
            { $unwind: '$sellerJoin' },
            {
                $lookup: {
                    from: 'typespayments',
                    localField: 'typePayment',
                    foreignField: '_id',
                    as: 'paymentJoin'
                }
            },
            {
                $unwind: '$paymentJoin'
            },
            {
                $group: {
                    _id: {
                        name: '$sellerJoin.name',
                    },
                    totalCommission: {$sum: {$multiply: ['$value', {
                                $divide: ['$paymentJoin.commissionPercentage', 100]
                            }]} }
                },
            },
        ]);

        const data = aggregateData.map(item => ({

                name: item._id.name,
                totalCommission: item.totalCommission

        }));

        response.status(200).json({data: data})


    }catch( err: any) {
    return response.status(500).send({ message: "Erro interno do servidor", error: err.message });
}
}

const totalCustomer = async (request: Request, response: Response) => {
    const { filters: filtersString  } = request.query;

    const match: any = {};
    const addFields: any = {};


    let filters;
    if (filtersString) {
        try {
            filters = JSON.parse(filtersString as string);
        } catch (err: any) {
            return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {'isActive': 'true'}", error: err.message});
        }
    }

    if(filters) {
        if (filters?.startDate && filters?.endDate) {
            match.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate),
            };
        }

    }

    if (filters?.date) {
        match.date = new Date(filters.date);
    }

    if (filters?.month) {
        addFields.month = {
            $month: '$date',
        };
        match.month = Number(filters.month);
    }

    try {

        const data = await SaleModel.aggregate([
            { $addFields: addFields },
            { $match: match },
            {
                $group: {
                    _id: {
                        customer: '$customer',
                    },
                },
            },
            {
                $count: 'totalCustomer',
            },
        ]);

        response.status(200).json(data)

    }catch( err: any) {
        return response.status(500).send({ message: "Erro interno do servidor", error: err.message });
    }



}

export {salesByPaymentType, salesBySeller, totalCustomer}