const express = require('express')
const SubjectController = require("../controllers/SubjectController");
const {checkAuth, checkAdmin} = require("../utils/AuthUtil");

const router = express.Router();

router.get('/subjects', SubjectController.getAll)//tested
router.get('/subjects/:id', SubjectController.getOne)//tested
router.post('/subjects',checkAuth, checkAdmin, SubjectController.create)//tested
router.delete('/subjects/:id',checkAuth, checkAdmin, SubjectController.deleteSubject)//tested
router.put('/subjects/:id',checkAuth, checkAdmin, SubjectController.update)//tested
router.post('/subjects/:id/assign', checkAuth, checkAdmin,SubjectController.assignSpecialist)//tested
router.get('/subjects/:id/assigned', checkAuth,SubjectController.getAssignedSpecialists)//tested

module.exports = router;