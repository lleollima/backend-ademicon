import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();


export const connectDB = async () => {

    const URI: string = process.env.MONGODB_URI as string

    try {
        await mongoose.connect(URI)

    }catch(err) {
        console.error('Erro ao conectar ao MongoDB', err)
        process.exit(1)
    }
}

