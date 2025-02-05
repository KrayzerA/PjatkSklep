const UserModel = require('../models/UserModel')
const RoleModel = require('../models/RoleModel')
const {validateLogin, validatePassword, validateEmail} = require('../validators/AuthValidator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Double} = require("mongodb");
const secret = 'DSJKLFHEGbdsalgjsadghNAFSJlfngasgjjlksDFNdsjkglhsdgbJKsfgjnJJFASbFliHgUYKFJVHYkYliuyUCVJDcVafFdsfsdfsdfHKGjtCKvKCUKGHvgtiCtclvTckvclvgVlHVYcKVlhvkchjhgBbhjasdfkhnAJLKFndsajlkansfsjlakfgGJmkgFGhjkkkmgGHjkHggjgbjflsasFJKNJKDGSjlsbgksGbaghlkasFJDLSGnealgsds';

/**
 * Authenticates a user by validating their login and password.
 * If successful, returns user details and a JWT token for authorization.
 *
 * @param {Object} req - Express request object (expects login and password in req.body)
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {

        const user = await UserModel.findOne({login: req.body.login}).populate('roles').exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid login or password.'
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid login or password",
            })
        }

        const {password, roles, ...userData} = user._doc;
        const token = jwt.sign({
                _id: user._id,
                roles: roles.map(role => role.name)
            },
            secret,
            {
                expiresIn: '1d'
                // expiresIn: '15m'
            });
        res.json({
            ...userData,
            roles: roles,
            token: token
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Cannot authorize.'
        })
    }
}

/**
 * Validates user input fields (login, email, password) during registration.
 * Checks for format correctness and ensures no duplicates exist in the database.
 *
 * @param {Object} req - Express request object (expects login, email, and password in req.body)
 * @returns {Array} - Array of validation errors, if any
 */
const register = async (req, res) => {
    try {
        const errors = await validateRequest(req);
        if (errors.length !== 0) {
            return res.status(400).json({success: false, errors})
        }

        const role = await RoleModel.findOne({name: 'user'});
        if (!role) {
            return res.status(500).json({
                success: false,
                message: "Role 'user' doesn't exist."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        const doc = new UserModel({
            login: req.body.login,
            email: req.body.email,
            password: passwordHash,
            money: new Double(0),
            roles: [role._id]
        });

        const user = await doc.save();
        role.users.push(user._id);
        await role.save();

        const token = jwt.sign({
                _id: user._id,
                roles: ['user']
            },
            secret,
            {
                expiresIn: '1d'
            });
        const {password, ...userData} = user._doc;
        res.json({
            ...userData,
            token: token
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Cannot register.'
        })
    }

}

const validateRequest = async (req) => {
    const {login, email, password} = req.body;
    const errors = [];

    const loginError = validateLogin(login);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const emailExists = await UserModel.findOne({email});
    const loginExists = await UserModel.findOne({login});

    loginError && errors.push({field: "login", message: loginError});
    emailError && errors.push({field: "email", message: emailError});
    passwordError && errors.push({field: "password", message: passwordError});
    emailExists && errors.push({field: "email", message: "Email already exists"});
    loginExists && errors.push({field: "login", message: "Login already exists"});

    return errors;
};

module.exports = {
    login,
    register,
    secret
}