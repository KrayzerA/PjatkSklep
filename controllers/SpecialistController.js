const SubjectModel = require("../models/SubjectModel");
const SpecialistModel = require("../models/SpecialistModel");
const {validateLastName, validateFirstName} = require("../validators/SpecialistValidator");
const mongoose = require("mongoose");
const PurchaseModel = require("../models/PurchaseModel");

/**
 * Creates a new specialist in the system.
 * Validates input data and ensures the specialist doesn't already exist.
 *
 * @param {Object} req - Express request object (expects `firstName` and `lastName` in req.body)
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
    try {
        const errors = await validateRequest(req);
        if (errors.length !== 0) {
            return res.status(400).json({errors: errors});
        }
        const isExists = await SpecialistModel.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        if (isExists) {
            return res.status(400).json({message: 'Specialist already exists.'})
        }

        const doc = new SpecialistModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const specialist = await doc.save();
        return res.json(specialist);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Cant create specialist.'})
    }
}

/**
 * Retrieves all specialists from the database with pagination.
 *
 * @param {Object} req - Express request object (expects `page` and `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [specialists, totalCount] = await Promise.all([
            SpecialistModel.find()
                .skip(skip)
                .limit(limit)
                .exec(),
            SpecialistModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            specialists,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all specialists.'})
    }
}

/**
 * Retrieves a specific specialist by ID, including associated subjects.
 *
 * @param {Object} req - Express request object (expects specialist ID in req.params)
 * @param {Object} res - Express response object
 */
const getOne = async (req, res) => {
    try {
        const specialist = await SpecialistModel.findById(req.params.id)
            .populate({path:'subjects', select:['name', 'abbreviation']})
            .exec();
        if (!specialist) {
            return res.status(404).json({message: 'Specialist doesnt exists.'})
        }
        return res.json({specialist:specialist});
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cant get all specialists.'})
    }
}

/**
 * Deletes a specialist and removes all related references from subjects and purchases.
 * Ensures atomicity using a database transaction.
 *
 * @param {Object} req - Express request object (expects specialist ID in req.params)
 * @param {Object} res - Express response object
 */
const deleteSpecialist = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const specialist = await SpecialistModel.findById(req.params.id);
        if (!specialist) {
            return res.status(404).json({message: 'Specialist doesnt exist.'});
        }
        await SubjectModel.updateMany({specialists: specialist._id}, {$pull: {specialist: specialist._id}}).session(session);
        await PurchaseModel.deleteMany({specialist: specialist._id}).session(session);
        await SpecialistModel.findByIdAndDelete(specialist._id).session(session);
        await session.commitTransaction()
        res.json({message: 'Specialist deleted.'});
    } catch (e) {
        await session.abortTransaction()
        console.log(e)
        res.status(500).json({message: 'Cant delete specialist.'})
    } finally {
        await session.endSession()
    }
}

/**
 * Updates the details of an existing specialist.
 * If no new values are provided, retains the existing values.
 *
 * @param {Object} req - Express request object (expects `firstName` and `lastName` in req.body, specialist ID in req.params)
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
    try {
        const specialist = await SpecialistModel.findById(req.params.id);
        if (!specialist) {
            return res.status(404).json({message: 'Specialist doesnt exist.'})
        }
        const {firstName, lastName} = req.body;
        const updatedFirstName = firstName.trim() ? firstName : specialist._doc.firstName;
        const updatedLastName = lastName.trim() ? lastName : specialist._doc.lastName;
        const t = await SpecialistModel.findByIdAndUpdate(req.params.id, {
            firstName: updatedFirstName,
            lastName: updatedLastName
        });
        return res.json({message: 'Successfully updated.'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cant update specialist.'})
    }
}

/**
 * Validates the request payload for creating or updating a specialist.
 *
 * @param {Object} req - Express request object (expects `firstName` and `lastName` in req.body)
 * @returns {Array} - Array of validation errors, if any
 */
const validateRequest = async (req) => {
    const {firstName, lastName} = req.body;
    const errors = [];
    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);

    firstNameError && errors.push(firstNameError);
    lastNameError && errors.push(lastNameError);

    return errors;
}

/**
 * Exports specialist-related functionality:
 * - `create`: Creates a new specialist.
 * - `getAll`: Retrieves all specialists with pagination.
 * - `getOne`: Retrieves details of a specific specialist.
 * - `deleteSpecialist`: Deletes a specialist and removes related references.
 * - `update`: Updates the details of an existing specialist.
 */
module.exports = {
    create,
    getAll,
    getOne,
    deleteSpecialist,
    update
}