const express = require('express')
const authController = require('../controllers/AuthController')

const router = express.Router()
router.post('/register',authController.register)//tested
router.post('/login',authController.login)//tested

module.exports = router;