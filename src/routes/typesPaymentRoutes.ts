import express from 'express';
import * as typesPaymentController from '../controllers/typesPaymentController'

const router = express.Router();

router.get('/typesofpayment', typesPaymentController.index);
router.post('/typesofpayment', typesPaymentController.store);
router.get('/typesofpayment/:id', typesPaymentController.show);
router.patch('/typesofpayment/:id', typesPaymentController.update);
router.delete('/typesofpayment/:id', typesPaymentController.destroy);

export default router;
