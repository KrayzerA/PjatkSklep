const express = require('express')
const ProductsController = require('../controllers/ProductController')
const {checkAuth, checkAdmin} = require("../utils/AuthUtil");

const router = express.Router()
router.get('/products', ProductsController.getAllProducts)//tested
router.get('/products/:id', ProductsController.getProductById)//tested
router.post('/products', checkAuth, checkAdmin, ProductsController.createNewProduct)//tested
router.put('/products/:id', checkAuth, checkAdmin, ProductsController.updateProduct)//tested
router.delete('/products/:id', checkAuth, checkAdmin, ProductsController.deleteProduct)//tested

module.exports = router;