import express from 'express';
import {connectDB} from "./config/database";
import sellerRoutes from './routes/sellerRoutes'
import clientRoutes from "./routes/customerRoutes";
import typesPaymentRoutes from "./routes/typesPaymentRoutes";
import saleRoutes from "./routes/saleRoutes";
import reportRoutes from "./routes/reportRoutes";
import dotenv from "dotenv";


const app = express();

dotenv.config()

const port = process.env.SERVER_PORT || 3000;

// connect to database
connectDB()

app.use(express.json());


// routes includes
app.use(sellerRoutes, clientRoutes, typesPaymentRoutes, saleRoutes, reportRoutes)

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});