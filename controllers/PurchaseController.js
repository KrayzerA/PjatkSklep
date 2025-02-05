const SpecialistModel = require("../models/SpecialistModel");
const PurchaseModel = require("../models/PurchaseModel");
const ProductModel = require("../models/ProductsModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

/**
 * Creates a new purchase and updates related models (specialist, product, user).
 * Validates the input data and ensures the user has enough money and the product is available.
 *
 * @param {Object} req - Express request object (expects specialist, product in req.body, userId in req.userId)
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
    try {
        const errors = await validateRequest(req);
        if (errors.length !== 0) {
            return res.status(400).json({errors: errors});
        }

        const doc = new PurchaseModel({
            specialist: req.body.specialist,
            product: req.body.product,
            user: req.userId,
            purchaseDate: new Date(),
        })
        const purchase = await doc.save();
        const product = await ProductModel.findById(req.body.product);

        await SpecialistModel.findByIdAndUpdate(req.body.specialist, {
            $push: {purchases: purchase._id},
        })
        await ProductModel.findByIdAndUpdate(req.body.product, {
            $push: {purchases: purchase._id},
            $inc: {availableAmount: -1}
        });
        await UserModel.findByIdAndUpdate(req.userId, {
            $push: {purchases: purchase._id},
            $inc: {money: -product._doc.price}
        })

        return res.json(purchase);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Cant create purchase."})
    }
}

/**
 * Retrieves all purchases from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAll = async (req, res) => {
    try {
        const purchases = await PurchaseModel.find();
        res.json(purchases);
    } catch (e) {
        return res.status(500).json({message: 'Cant get all purchases '})
    }
}

/**
 * Deletes a purchase and removes its associations from related models (product, user, specialist).
 * Ensures only the owner of the purchase or an admin can delete it.
 *
 * @param {Object} req - Express request object (expects purchase ID in req.params, userId and userRoles for authorization)
 * @param {Object} res - Express response object
 */
const deletePurchase = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const purchase = await PurchaseModel.findById(req.params.id);
        if (!purchase) {
            await session.abortTransaction()
            return res.status(404).json({message: 'Purchase doesnt exist.'})
        }
        if (purchase._doc.user._id.toString() !== req.userId && !req.userRoles?.includes('admin')){
            return res.status(403).json({message: 'You cant delete not your purchase.'})
        }
        await ProductModel.updateMany(
            {purchases: purchase._id},
            {$pull: {purchases: purchase._id}}
        ).session(session)
        await UserModel.updateMany(
            {purchases: purchase._id},
            {$pull: {purchases: purchase._id}}
        ).session(session)
        await SpecialistModel.updateMany(
            {purchases: purchase._id},
            {$pull: {purchases: purchase._id}}
        ).session(session)
        await PurchaseModel.findByIdAndDelete(req.params.id);

        await session.commitTransaction()
        res.json({message: `Purchase deleted.`})
    } catch (e) {
        await session.abortTransaction()
        console.log(e)
        return res.status(500).json({message: 'Cant delete purchase.'})
    } finally {
        await session.endSession()
    }
}

/**
 * Retrieves a single purchase by ID, including product, user, and specialist details.
 * Ensures only the owner of the purchase or an admin can view it.
 *
 * @param {Object} req - Express request object (expects purchase ID in req.params, userId and userRoles for authorization)
 * @param {Object} res - Express response object
 */
const getOne = async (req, res) => {
    try {
        const purchase = await PurchaseModel.findById(req.params.id)
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
            .exec();
        if (purchase._doc.user._id.toString() !== req.userId && !req.userRoles?.includes('admin')){
            return res.status(403).json({message: 'You cant see not your purchase.'})
        }
        if (!purchase) {
            return res.status(404).json({message: 'Purchase doesnt exist.'});
        }
        res.json({purchase:purchase});
    } catch (e) {
        return res.status(500).json({message: 'Cant get purchase.'})
    }
}

/**
 * Validates the request data for creating a purchase.
 * Checks for the existence of the specialist, product, and user, and ensures business rules are met.
 *
 * @param {Object} req - Express request object (expects specialist, product in req.body, userId in req.userId)
 * @returns {Array} - Array of validation errors, if any
 */
const validateRequest = async (req) => {
    const {specialist, product} = req.body;
    const errors = [];
    const specialistExists = await SpecialistModel.findById(specialist);
    const productExists = await ProductModel.findById(product);
    const userExists = await UserModel.findById(req.userId);

    !specialistExists && errors.push('Specialist doesnt exist.')
    !productExists && errors.push('Product doesnt exist.')
    !userExists && errors.push('User doesnt exist.')

    if (errors.length === 0) {
        productExists._doc.availableAmount <= 0 && errors.push('Product is over.')
        userExists._doc.money < productExists._doc.price && errors.push('User dont have enough money.')
        !specialistExists._doc.subjects.includes(productExists._doc.subject.toString()) && errors.push('Specialist dont assigned to this subject.')
    }

    return errors;
}

/**
 * Exports purchase-related functionality:
 * - `create`: Creates a new purchase.
 * - `getAll`: Retrieves all purchases.
 * - `deletePurchase`: Deletes a specific purchase.
 * - `getOne`: Retrieves detailed information about a specific purchase.
 */
module.exports = {
    create,
    getAll,
    deletePurchase,
    getOne,
}