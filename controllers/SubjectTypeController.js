const SubjectTypeModel = require('../models/SubjectTypeModel')
const ProductModel = require('../models/ProductsModel')
const PurchaseModel = require('../models/PurchaseModel')
const {validateName} = require("../validators/SubjectValidator");
const SubjectModel = require("../models/SubjectModel");
const mongoose = require("mongoose");

/**
 * Creates a new subject type in the system.
 * Validates input data and ensures the subject type name is unique.
 *
 * @param {Object} req - Express request object (expects `name` in req.body)
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
    try {
        const errors = await validateRequest(req);
        if (errors.length !== 0) {
            return res.status(400).json({errors: errors});
        }

        const doc = new SubjectTypeModel({
            name: req.body.name
        })

        const SubjectTypeName = await doc.save();
        return res.json(SubjectTypeName);
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Cant create SubjectType."})
    }
}

/**
 * Retrieves all subject types from the database with pagination.
 *
 * @param {Object} req - Express request object (expects `page` and `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [subjectTypes, totalCount] = await Promise.all([
            SubjectTypeModel.find()
                .skip(skip)
                .limit(limit)
                .exec(),
            SubjectTypeModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            subjectTypes,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all subjectTypes.'})
    }
}

/**
 * Deletes a subject type and removes all associated products, purchases, and references.
 * Ensures atomicity using a database transaction.
 *
 * @param {Object} req - Express request object (expects subject type ID in req.params)
 * @param {Object} res - Express response object
 */
const deleteSubjectType = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const subject = await SubjectTypeModel.findOneAndDelete({_id: req.params.id});
        if (!subject) {
            await session.abortTransaction()
            await session.endSession()
            return res.status(404).json({message: 'SubjectType doesnt exist.'})
        }
        const productsToDelete = await ProductModel.find({subjectType: subject._id});
        const productsIds = productsToDelete.map(prod => prod._id);
        await ProductModel.deleteMany({_id: {$in: productsIds}}).session(session)
        await SubjectModel.updateMany(
            {products: {$in: productsIds}},
            {$pull: {products: {$in: productsIds}}}
        ).session(session)
        await PurchaseModel.deleteMany({product: {$in: productsIds}}).session(session);

        await session.commitTransaction()
        res.json({message: `Subject type deleted.`})
    } catch (e) {
        await session.abortTransaction()
        console.log(e)
        return res.status(500).json({message: 'Cant delete subject type.'})
    } finally {
        await session.endSession()
    }
}

/**
 * Retrieves a specific subject type by its ID.
 *
 * @param {Object} req - Express request object (expects subject type ID in req.params)
 * @param {Object} res - Express response object
 */
const getOne = async (req, res) => {
    try {
        const subjectType = await SubjectTypeModel.findById(req.params.id);
        if (!subjectType) {
            return res.status(404).json({message: 'Subject type doesnt exist.'});
        }
        res.json({subjectType:subjectType});
    } catch (e) {
        return res.status(500).json({message: 'Cant get subject type'})
    }
}

/**
 * Updates the name of an existing subject type.
 * Validates input and ensures the new name is unique.
 *
 * @param {Object} req - Express request object (expects `name` in req.body and subject type ID in req.params)
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
    try {
        const subjectType = await SubjectTypeModel.findById(req.params.id);
        if (!subjectType) {
            return res.status(404).json({message: 'Subject type doesnt exist.'})
        }

        const {name} = req.body;
        const nameExists = await SubjectTypeModel.findOne({name: name.trim()});
        const updatedName = nameExists ? subjectType.name : (name.trim() ? name : subjectType.name);
        await SubjectTypeModel.findByIdAndUpdate(req.params.id, {name: updatedName});
        return res.json({message: 'Successfully updated.'})
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Cant modify subject type.'})
    }
}

/**
 * Validates the request data for creating or updating a subject type.
 * Ensures the name is valid and unique.
 *
 * @param {Object} req - Express request object (expects `name` in req.body)
 * @returns {Array} - Array of validation errors, if any
 */
const validateRequest = async (req) => {
    const {name} = req.body;
    const errors = [];
    const nameError = validateName(name);
    const nameExists = await SubjectTypeModel.findOne({name: name});

    nameError && errors.push(nameError);
    nameExists && errors.push('SubjectType with this name already exist.')

    return errors;
}

/**
 * Exports subject type-related functionality:
 * - `create`: Creates a new subject type.
 * - `getAll`: Retrieves all subject types with pagination.
 * - `deleteSubjectType`: Deletes a subject type and removes associated references.
 * - `getOne`: Retrieves details of a specific subject type.
 * - `update`: Updates the name of an existing subject type.
 */
module.exports = {
    create,
    getAll,
    deleteSubjectType,
    getOne,
    update
}