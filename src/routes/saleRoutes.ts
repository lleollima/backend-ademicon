import express from "express";
import * as saleController from "../controllers/saleController";

const router = express.Router()

router.get("/sales", saleController.index);
router.post('/sales', saleController.store);
router.get('/sales/:id', saleController.show);
router.patch('/sales/:id', saleController.update);
router.delete('/sales/:id', saleController.destroy);


export default router;