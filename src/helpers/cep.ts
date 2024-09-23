import axios from 'axios';

interface ICEP {
    status: boolean;
    data?: any;
    error?: string;
}

export const ApiCep = async (cep: string): Promise<ICEP> => {

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return {
            status: true,
            data: response.data,
            error: ''
        };
    } catch (err: any) {
        return {
            status: false,
            data: undefined,
            error: err.message
        };
    }

}