"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const sellerRoutes_1 = __importDefault(require("./routes/sellerRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const typesPaymentRoutes_1 = __importDefault(require("./routes/typesPaymentRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// conectar ao banco de dados
(0, database_1.connectDB)();
app.use(express_1.default.json());
// rota dos comentarios
app.use(sellerRoutes_1.default, customerRoutes_1.default, typesPaymentRoutes_1.default, saleRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
