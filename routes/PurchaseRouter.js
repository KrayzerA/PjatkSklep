const express = require('express')
const {checkAdmin, checkAuth} = require('../utils/AuthUtil')
const PurchaseController = require('../controllers/PurchaseController')

const router = express.Router();

router.get('/purchases', checkAuth, checkAdmin, PurchaseController.getAll)//tested
router.get('/purchases/:id',checkAuth, PurchaseController.getOne)//tested
router.post('/purchases', checkAuth, PurchaseController.create)//tested
router.delete('/purchases/:id', checkAuth, PurchaseController.deletePurchase)//tested

module.exports = router;