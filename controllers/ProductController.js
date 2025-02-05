const ProductsModel = require('../models/ProductsModel')
const SubjectModel = require("../models/SubjectModel");
const SubjectTypeModel = require("../models/SubjectTypeModel");
const PurchaseModel = require("../models/PurchaseModel");
const {validatePrice, validateAmount} = require("../validators/ProductValidator");
const mongoose = require("mongoose");

/**
 * Retrieves all products with pagination.
 * Populates subject and subject type details for each product.
 *
 * @param {Object} req - Express request object (expects page and limit in query parameters)
 * @param {Object} res - Express response object
 */
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            ProductsModel.find()
                .populate([
                    {
                        path: 'subject',
                        model: 'Subject',
                        select: ['name', 'abbreviation']
                    },
                    {
                        path: 'subjectType',
                        model: 'SubjectType',
                        select: 'name'
                    }
                ])
                .skip(skip)
                .limit(limit)
                .exec(),
            ProductsModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            products,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all products.'})
    }
}

/**
 * Creates a new product and associates it with the specified subject and subject type.
 * Updates related models to include the new product.
 *
 * @param {Object} req - Express request object (expects subject, subjectType, price, and availableAmount in req.body)
 * @param {Object} res - Express response object
 */
const createNewProduct = async (req, res) => {
    const errors = await validateRequest(req);
    if (errors.length !== 0) {
        return res.status(400).json({errors: errors});
    }

    const doc = new ProductsModel({
        subject: req.body.subject,
        subjectType: req.body.subjectType,
        price: req.body.price,
        availableAmount: req.body.availableAmount
    });

    const product = await doc.save();
    const subject = await SubjectModel.findById(req.body.subject);
    const subjectType = await SubjectTypeModel.findById(req.body.subjectType);
    subject.products.push(product);
    subjectType.products.push(product);
    await subject.save();
    await subjectType.save();

    return res.json(product)
}

/**
 * Retrieves a product by its ID, including populated subject and subject type details.
 *
 * @param {Object} req - Express request object (expects product ID in req.params)
 * @param {Object} res - Express response object
 */
const getProductById = async (req, res) => {
    try {
        const product = await ProductsModel.findById(req.params.id).populate([
            {
                path: 'subject',
                model: 'Subject',
                select: ['name', 'abbreviation']
            },
            {
                path: 'subjectType',
                model: 'SubjectType',
                select: 'name'
            }]).exec()
        if (!product) {
            return res.status(404).json({message: `Product with id ${req.params.id} does not exists`})
        }
        res.json({product: product})
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Cant get product.'})
    }
}

/**
 * Updates the price and available amount of a product.
 *
 * @param {Object} req - Express request object (expects price and availableAmount in req.body, product ID in req.params)
 * @param {Object} res - Express response object
 */
const updateProduct = async (req, res) => {
    try {
        const errors = [];
        const {price, availableAmount} = req.body;
        const priceError = validatePrice(price);
        const amountError = validateAmount(availableAmount);
        priceError && errors.push(priceError);
        amountError && errors.push(amountError);
        if (errors.length !== 0) {
            return res.status(400).json({errors: errors})
        }

        const product = await ProductsModel.findByIdAndUpdate(req.params.id, {
            price: price,
            availableAmount: availableAmount
        });
        if (!product) {
            return res.status(404).json({message: `Product with id ${req.params.id} does not exists`})
        }
        return res.json({message: 'Product is updated.'})
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Cant update product.'})
    }
}

/**
 * Deletes a product and removes its associations from related models (subject, subject type, purchases).
 *
 * @param {Object} req - Express request object (expects product ID in req.params)
 * @param {Object} res - Express response object
 */
const deleteProduct = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const product = await ProductsModel.findByIdAndDelete(req.params.id);
        if (!product) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(404).json({message: `Product with id ${req.params.id} does not exists`});
        }
        await SubjectTypeModel.updateMany({products: product._id}, {$pull: {products: product._id}}).session(session)
        await SubjectModel.updateMany({products: product._id}, {$pull: {products: product._id}}).session(session)
        await PurchaseModel.deleteMany({product: product._id}).session(session)
        await session.commitTransaction()
        res.json({message: "Product deleted."})
    } catch (e) {
        await session.abortTransaction()
        console.log(e);
        return res.status(500).json({message: 'Cant delete product.'})
    } finally {
        await session.endSession()
    }
}

/**
 * Validates the request payload for creating or updating a product.
 * Checks for valid price, available amount, and existence of subject and subject type.
 *
 * @param {Object} req - Express request object (expects subject, subjectType, price, and availableAmount in req.body)
 * @returns {Array} - Array of validation errors, if any
 */
const validateRequest = async (req) => {
    const {subject, subjectType, price, availableAmount} = req.body;
    const errors = [];
    const priceError = validatePrice(price);
    const amountError = validateAmount(availableAmount);
    const subjectExists = await SubjectModel.findById(subject);
    const subjectTypeExists = await SubjectTypeModel.findById(subjectType);

    priceError && errors.push(priceError);
    amountError && errors.push(amountError);
    !subjectExists && errors.push('Subject doesnt exist.')
    !subjectTypeExists && errors.push('SubjectType doesnt exist.')

    return errors;
}

module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProduct
}