const express = require('express')
const {assignRole, createRole, getAllRoles} = require("../controllers/RoleController");
const {checkAdmin, checkAuth} = require('../utils/AuthUtil')

const router = express.Router();

router.post('/assignRole', checkAuth, checkAdmin, assignRole)
router.post('/roles', checkAuth, checkAdmin, createRole)
router.get('/roles', checkAuth, checkAdmin, getAllRoles)

module.exports = router;