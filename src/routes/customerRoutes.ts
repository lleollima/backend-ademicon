import * as customerController from '../controllers/customerController'
import express from "express";

const router = express.Router()

router.get('/customers', customerController.index)
router.get('/customers/:id', customerController.show)
router.post('/customers', customerController.store)
router.delete('/customers/:id', customerController.destroy)
router.patch('/customers/:id', customerController.update)

export default router;