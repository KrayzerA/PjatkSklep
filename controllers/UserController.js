const UserModel = require('../models/UserModel')
const PurchaseModel = require("../models/PurchaseModel");

/**
 * Retrieves the details of the currently authenticated user.
 *
 * @param {Object} req - Express request object (expects `userId` in req.userId)
 * @param {Object} res - Express response object
 */
const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
            .populate([{
                path: 'roles',
                select: 'name'
            }]).exec();
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            })
        }

        const {password, ...userData} = user._doc;
        res.json(userData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Server error.'
        })
    }
}

/**
 * Retrieves all users from the database with pagination.
 *
 * @param {Object} req - Express request object (expects `page` and `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [users, totalCount] = await Promise.all([
            UserModel.find()
                .populate([
                    {
                        path: 'roles',
                        select: 'name'
                    },
                ])
                .skip(skip)
                .limit(limit)
                .exec(),
            UserModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            users,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all users.'})
    }
}

/**
 * Retrieves all purchases made by a specific user with pagination.
 *
 * @param {Object} req - Express request object (expects user ID in `req.params.id` and `page`, `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getPurchases = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalCount = await PurchaseModel.countDocuments({user: req.params.id});

        const purchases = await PurchaseModel.find({user: req.params.id})
            .populate([
                {
                    path: 'product',
                    select: ['subject', 'subjectType', 'price', 'availableAmount'],
                    populate: [
                        {
                            path: 'subject',
                            model: 'Subject',
                            select: 'name'
                        },
                        {
                            path: 'subjectType',
                            model: 'SubjectType',
                            select: 'name'
                        }]
                },
                {
                    path: 'user', select: ['roles', 'login'], populate: {path: 'roles', select: 'name'}
                },
                {
                    path: 'specialist', select: ['firstName', 'lastName']
                }])
            .skip(skip)
            .limit(limit)
            .exec();

        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            purchases,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all user purchases.'})
    }
}

/**
 * Adds a specified amount of money to a user's balance.
 * Validates the `amount` to ensure it's a positive number.
 *
 * @param {Object} req - Express request object (expects `amount` in req.body and user ID in req.params.id)
 * @param {Object} res - Express response object
 */
const donate = async (req, res) => {
    try {
        const amount = req.body.amount;
        if (!amount || isNaN(amount) || parseFloat(amount) < 0){
            return res.status(400).json({message:'Incorrect amount.'})
        }
        await UserModel.updateOne({_id: req.params.id}, {$inc: {money: amount}})
        return res.json({message:'User updated.'})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant donate.'})
    }
}

/**
 * Exports user-related functionality:
 * - `getUser`: Retrieves the details of the authenticated user.
 * - `getAllUsers`: Retrieves all users with pagination.
 * - `getPurchases`: Retrieves all purchases made by a specific user.
 * - `donate`: Adds money to a user's balance.
 */
module.exports = {
    getUser,
    getAllUsers,
    getPurchases,
    donate
}