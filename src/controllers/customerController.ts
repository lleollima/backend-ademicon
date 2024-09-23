import CustomerModel from "../models/CustomerModel";
import {Request, Response} from "express";
import {Error} from "mongoose";
import {documentValidation} from "../helpers/documentValidation";
import {ApiCep} from "../helpers/cep";
import SaleModel from "../models/SaleModel";


const index = async (request: Request, response: Response) => {
    const {page = "1" , pageSize = "10",  filters: filtersString  } = request.query;
    const offset: number = (Number(page) -1) * Number(pageSize);
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

    if(filters) {

        if(filters.isActive) {
            query.isActive = filters.isActive
        }

        if (filters.nome) {
            query.nome = { $regex: filters.nome, $options: 'i' };
        }
        if (filters.documentId) {
            query.documentId = filters.documentId;
        }
        if (filters.cep) {
            query.cep = filters.cep;
        }
        if(filters.seller) {
            query.seller = filters.seller;
        }
    }

    try{
        const customers: any = await CustomerModel.find(query).select('name').populate('seller', 'name').skip(offset).limit(Number(pageSize))


       const res = await Promise.all(
           customers.map(async(customer: any) => {
               const lastSale = await SaleModel.findOne({ customer: customer._id })
                   .sort({ date: 'desc' }) || null;

               return {
                   ...customer.toJSON(),
                   lastPurchaseDate: lastSale ? lastSale.date : null
               };
           })
       )

        return response.status(200).json({
            data: res,
            meta: {
                current_page: Number(page),
                items_per_page: Number(pageSize),

            }
        })

    }catch(err: any) {
        response.status(500).send(err.message)
    }
}

    const show = async (request: Request, response: Response) => {
        const {page = "1" , pageSize = "10",  filters: filtersString  } = request.query;
        const offset: number = (Number(page) -1) * Number(pageSize);
        const query: any = {
            customer: request.params.id
        }
        let filters;
        if (filtersString) {
            try {
                filters = JSON.parse(filtersString as string);
            } catch (err: any) {
                return response.status(400).send({message: "Formtato do filtro inválido! Formato esperado : {'isActive': 'true'}", error: err.message});
            }
        }

        if(filters ) {
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                const endDate = filters?.endDate ? new Date(filters.endDate) : new Date();
                query.date = { $gte: startDate, $lte: endDate };
            }
        }


        const customer: any = await CustomerModel.findOne({_id: request.params.id}).select('-updatedAt').populate('seller', 'name')


        if(!customer) {
            return response.status(404).json({ error: "Cliente não encontrado" });
        }


        const purchases =  {
            data: await SaleModel.find(query).select('value date typePayment').populate('typePayment', 'name').skip(offset).limit(Number(pageSize)).lean(),
            meta: {
                page: Number(page),
                itemPerPage: Number(pageSize),
            },

        }

        customer.purchases = purchases;
        try{


            return response.status(200).json(customer)

        }catch(err: any) {

            response.status(500).send(err.message)
        }
    }

const store = async (request: Request, response: Response) => {
const data = request.body

    try {
        if (!documentValidation(data.documentId)) return response.status(400).json({ error: "documentId inválido" });

        const sellerExists = await CustomerModel.findOne({ documentId: data.documentId });
        if (sellerExists) {
          return response.status(400).json({ error: "Já existe um cadastro com esse número de documento" });
        }

        const searchCep: any = await ApiCep(data.cep)

        if(!searchCep.status) {
            return response.status(500).send(searchCep.error)
        }

        const newCustomer = new CustomerModel({
            name: data.name,
            documentId: data.documentId,
            cep: data.cep,
            address: searchCep.data.logradouro,
            complement: searchCep.data.complemento,
            district: searchCep.data.bairro,
            locality: searchCep.data.localidade,
            uf: searchCep.data.uf,
            ibge: searchCep.data.ibge,
            ddd: searchCep.data.ddd,
            seller: data.seller
        })

        await newCustomer.save();
        return   response.status(201).json(newCustomer);

    }catch(err: any) {

        response.status(500).send(err.message)
    }


}

const update = async (request: Request, response: Response) => {
    const data = request.body
    const id = request.params.id

    const customer = await CustomerModel.findById(id);
    if (!customer) {
        return response.status(404).json({ error: "Cliente não encontrado" });
    }
    try {
        if (data.documentId && !documentValidation(data.documentId)) {
            return response.status(400).json({ error: "Número do documento inválido!" });
        }
        if (data.documentId) {
            const customerExists: any = await CustomerModel.findOne({ documentId: data.documentId });
            if (customerExists && customerExists._id.toString() !== id) {
                return response.status(400).json({ error: "Já existe um cadastro com esse número de documento" });
            }
        }
        if (data.cep) {
            const searchCep: any = await ApiCep(data.cep);
            if (!searchCep.status) {
                return response.status(500).send(searchCep.error);
            }
            data.address = searchCep.data.logradouro;
            data.complement = searchCep.data.complemento;
            data.district = searchCep.data.bairro;
            data.locality = searchCep.data.localidade;
            data.uf = searchCep.data.uf;
            data.ibge = searchCep.data.ibge;
            data.ddd = searchCep.data.ddd;
        }
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return response.status(200).json(updatedCustomer);
    } catch (err: any) {
        response.status(500).send(err.message);
    }



}

const destroy =async  (request: Request, response: Response) => {
    try{

       const customer =  await CustomerModel.findByIdAndUpdate(request.params.id, {isActive: false}, { new: true})

        if (!customer) {
            return response.status(404).json({ error: "Cliente não encontrado" });
        }

        return response.status(200).send(customer)

    }catch(err: any) {

        response.status(500).send(err.message);
    }
}

export {index, show,store,update,destroy}