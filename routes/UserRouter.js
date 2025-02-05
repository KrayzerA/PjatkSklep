const express = require('express')
const userController = require('../controllers/UserController')
const {checkAuth, checkAdmin} = require('../utils/AuthUtil')

const router = express.Router();
router.get('/user', checkAuth, userController.getUser)
router.get('/users/:id/purchases', checkAuth, userController.getPurchases)
router.get('/users', checkAuth, userController.getAllUsers)
router.post('/users/:id/donate', checkAuth, checkAdmin, userController.donate)

module.exports = router;