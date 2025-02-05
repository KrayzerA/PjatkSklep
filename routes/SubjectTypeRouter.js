const express = require('express')
const SubjectTypeController = require("../controllers/SubjectTypeController");
const {checkAuth, checkAdmin} = require("../utils/AuthUtil");

const router = express.Router();

router.get('/subjectTypes', SubjectTypeController.getAll);//tested
router.get('/subjectTypes/:id', SubjectTypeController.getOne);//tested
router.post('/subjectTypes', checkAuth, checkAdmin, SubjectTypeController.create);//tested
router.delete('/subjectTypes/:id', checkAuth, checkAdmin, SubjectTypeController.deleteSubjectType);//deleted
router.put('/subjectTypes/:id', checkAuth, checkAdmin, SubjectTypeController.update);//tested

module.exports = router