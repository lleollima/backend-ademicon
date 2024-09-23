import express from 'express';
import {connectDB} from "./config/database";
import sellerRoutes from './routes/sellerRoutes'
import clientRoutes from "./routes/customerRoutes";
import typesPaymentRoutes from "./routes/typesPaymentRoutes";
import saleRoutes from "./routes/saleRoutes";
import reportRoutes from "./routes/reportRoutes";
const app = express();
const port = process.env.PORT || 3000;

// conectar ao banco de dados
connectDB()

app.use(express.json());


// rota dos comentarios
app.use(sellerRoutes, clientRoutes, typesPaymentRoutes, saleRoutes, reportRoutes)

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});