const express = require('express')
const SpecialistController = require("../controllers/SpecialistController");
const {checkAuth, checkAdmin} = require("../utils/AuthUtil");

const router = express.Router();

router.get('/specialists', SpecialistController.getAll);//tested
router.get('/specialists/:id', SpecialistController.getOne);//tested
router.post('/specialists', checkAuth, checkAdmin, SpecialistController.create);//tested
router.delete('/specialists/:id', checkAuth, checkAdmin, SpecialistController.deleteSpecialist);//tested
router.put('/specialists/:id', checkAuth, checkAdmin, SpecialistController.update);//tested

module.exports = router