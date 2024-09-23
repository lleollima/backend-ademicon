import SellerModel from "../models/SellerModel";
import {query, Request, Response} from "express";
import {Error} from "mongoose";
import SaleModel from "../models/SaleModel";


const index = async (request: Request, response: Response) => {
   const {page = "1" , itemPerPage = "10", filters: filtersString } = request.query;
const offset: number = (Number(page) -1) * Number(itemPerPage);
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

    // pegando hora atual

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;


    try{
      let sellers: any = await SellerModel.find(query).select('name entryTime exitTime isActive').skip(offset).limit(Number(itemPerPage))

        //converte os horários de entrada e saída para minutos


        sellers = sellers.map((seller: any) => {
            const [entryHour, entryMinute] = seller.entryTime.split(':').map(Number);
            const [exitHour, exitMinute] = seller.exitTime.split(':').map(Number);

            const entryTotalMinutes = entryHour * 60 + entryMinute;
            const exitTotalMinutes = exitHour * 60 + exitMinute;

            const isWorking = currentTotalMinutes >= entryTotalMinutes &&  currentTotalMinutes <= exitTotalMinutes;

            return {
                _id: seller.id,
                name: seller.name,
                isWorking,
                isActive: seller.isActive
            }

        })

        // filtro de retorna quando eu passo o isWorking na requisição

        if(filters?.isWorking !== undefined) {
            const isWorkingBool = JSON.parse(filters.isWorking);
            sellers = sellers.filter((seller: any) => seller.isWorking === isWorkingBool);
        }



        return response.status(200).json({
            data: sellers,
            meta: {
                currentPage: Number(page),
                itemsPerPage: Number(itemPerPage),

            }
        })

    }catch(err: any) {

        response.status(500).send(err.message)
    }
}

const show = async (request: Request, response: Response) => {

    try{
        const seller: any = await SellerModel.findOne({_id: request.params.id}).select('name entryTime exitTime isActive')

        if(!seller) {
            response.status(404).send("Vendedor não encontrado");
        }

        const sales = await SaleModel.aggregate([

            {
                $match: {
                       'seller': seller._id
                }
            },

            {
                $group: {
                    _id: {
                        yearMonth: {
                            $dateToString: {
                                format: '%Y-%m',
                                date: '$date',
                            }
                        }
                    },
                    totalValue: {$sum: '$value'},
                    totalSales: {$sum: 1},
                    totalCommission: {$sum: '$commissionValue' }

                }
            },
            {
                $sort: {
                    '_id.yearMonth': -1
                }
            }
        ])

        const details : any = seller.toJSON()
        details.sales = sales.map((sale) => {
            return {
                yearMonth: sale._id.yearMonth,
                totalSales: sale.totalSales,
                totalValue: sale.totalValue,
                totalCommission: parseFloat(sale.totalCommission.toString())
            }
        })

       return response.status(200).json(details)

    }catch(err: any) {
        response.status(500).send(err.message)
    }
}

const store = async (request: Request, response: Response) => {

    try {
        const seller = new SellerModel(request.body);
        await seller.save();
     return   response.status(201).json(seller);

    }catch(err: unknown) {
        const message = err instanceof Error  ? err.message : 'Erro encontrado'
        response.status(500).send(message)
    }


}

const update = async (request: Request, response: Response) => {

    try{

        const seller = await SellerModel.findByIdAndUpdate(request.params.id, {...request.body}, {
            new: true,
            runValidators: true,
        })

        if(!seller) {
            response.status(404).send("Vendedor não encontrado");
        }

        return response.status(200).json(seller);

    }catch(err: any) {

        response.status(500).send(err.message);
    }
}

const destroy =async  (request: Request, response: Response) => {
    try{
    const seller =  await SellerModel.findByIdAndUpdate(request.params.id, {isActive: false},
        {
            new: true
        })

        if(!seller) {
            response.status(404).send("Vendedor não encontrado");
        }

        return response.status(200).send(seller)

    }catch(err: any) {

        response.status(500).send(err.message);
    }
}

export {index, show,store,update,destroy}