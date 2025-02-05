const jwt = require('jsonwebtoken')
const {secret} = require('../controllers/AuthController')
const RoleModel = require("../models/RoleModel");

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            if (!decoded._id || !decoded.roles) {
                return res.status(403).json({message: 'No access.'})
            }
            req.userId = decoded._id;
            req.userRoles = decoded.roles;
            next()
        } catch (err) {
            return res.status(403).json({
                message: 'No access.'
            })
        }
    } else {
        return res.status(403).json({
            message: 'No access.'
        })
    }
}

const checkAdmin = async (req, res, next) => {
    if (!req.userRoles.includes('admin')) {
        return res.status(403).json({message: 'Access only for admins.'});
    }
    next()
}

const checkUser = async (req, res, next) => {
    if (req.userRoles.includes('admin')) {
        next()
    }
    if (!req.userRoles.includes('user')) {
        return res.status(403).json({message: 'Access only for authorized users.'});
    }
    next()
}

module.exports = {
    checkAuth,
    checkAdmin,
    checkUser
}