import * as reportController from '../controllers/reportController'
import express from "express";

const router = express.Router()

router.get('/reports/sales-by-payments-type', reportController.salesByPaymentType)
router.get('/reports/total-customer', reportController.totalCustomer)
router.get('/reports/sales-by-seller', reportController.salesBySeller)


export default router;