import * as sellerController from '../controllers/sellerController'
import express from "express";

const router = express.Router()

router.get('/sellers', sellerController.index)
router.post('/sellers', sellerController.store)
router.get('/sellers/:id', sellerController.show)
router.delete('/sellers/:id', sellerController.destroy)
router.patch('/sellers/:id', sellerController.update)

export default router;