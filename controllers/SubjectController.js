const SubjectModel = require("../models/SubjectModel");
const SubjectTypeModel = require("../models/SubjectTypeModel");
const SpecialistModel = require("../models/SpecialistModel");
const ProductModel = require("../models/ProductsModel");
const {validateName, validateAbbreviation} = require("../validators/SubjectValidator");
const mongoose = require("mongoose");
const PurchaseModel = require("../models/PurchaseModel");

/**
 * Creates a new subject in the system.
 * Validates input data and ensures the subject doesn't already exist.
 *
 * @param {Object} req - Express request object (expects `name` and `abbreviation` in req.body)
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
    try {
        const errors = await validateRequest(req);
        if (errors.length !== 0) {
            return res.status(400).json({errors: errors});
        }

        const doc = new SubjectModel({
            name: req.body.name,
            abbreviation: req.body.abbreviation
        });

        const subject = await doc.save();
        return res.json(subject);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Cant create subject.'})
    }
}

/**
 * Retrieves all subjects from the database with pagination.
 *
 * @param {Object} req - Express request object (expects `page` and `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [subjects, totalCount] = await Promise.all([
            SubjectModel.find()
                .skip(skip)
                .limit(limit)
                .exec(),
            SubjectModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            subjects,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all subjects.'})
    }
}

/**
 * Retrieves a specific subject by its ID.
 *
 * @param {Object} req - Express request object (expects subject ID in req.params)
 * @param {Object} res - Express response object
 */
const getOne = async (req, res) => {
    try {
        const subject = await SubjectModel.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({message: 'Subject doesnt exists.'})
        }
        return res.json({subject: subject});
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cant get all subjects.'})
    }
}

/**
 * Deletes a subject and its associated products and references.
 * Ensures atomicity using a transaction.
 *
 * @param {Object} req - Express request object (expects subject ID in req.params)
 * @param {Object} res - Express response object
 */
const deleteSubject = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const subject = await SubjectModel.findById(req.params.id);
        if (!subject) {
            await session.abortTransaction()
            return res.status(404).json({message: 'Subject doesnt exist.'});
        }
        const productsToDelete = await ProductModel.find({subject: subject._id});
        const productsIds = productsToDelete.map(prod => prod._id);

        await ProductModel.deleteMany({_id: {$in: productsIds}}).session(session);
        await PurchaseModel.deleteMany({product: {$in: productsIds}}).session(session);
        await SpecialistModel.updateMany(
            {subjects: subject._id},
            {$pull: {subjects: subject._id}}
        ).session(session);
        await SubjectTypeModel.updateMany(
            {products: {$in: productsIds}},
            {$pull: {products: {$in: productsIds}}}
        ).session(session)
        await SubjectModel.findByIdAndDelete(subject._id).session(session);
        await session.commitTransaction()
        res.json({message: 'Subject deleted.'});
    } catch (e) {
        await session.abortTransaction()
        console.log(e)
        res.status(500).json({message: 'Cant delete subject.'})
    } finally {
        await session.endSession();
    }
}

/**
 * Updates the details of an existing subject.
 * Validates input and ensures no duplication of names or abbreviations.
 *
 * @param {Object} req - Express request object (expects `name` and `abbreviation` in req.body, subject ID in req.params)
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
    try {
        const subject = await SubjectModel.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({message: 'Subject doesnt exist.'})
        }

        const {name, abbreviation} = req.body;
        const nameExists = await SubjectModel.findOne({name: name});
        const abbreviationExists = await SubjectModel.findOne({abbreviation: abbreviation});

        const updatedName = nameExists ? subject.name : (name.trim() ? name : subject.name);
        const updatedAbbreviation = abbreviationExists ? subject.abbreviation : (abbreviation.trim() ? abbreviation : subject.abbreviation);

        await SubjectModel.findByIdAndUpdate(req.params.id, {
            name: updatedName,
            abbreviation: updatedAbbreviation
        });
        return res.json({message: 'Successfully updated.'})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: 'Cant update subject.'})
    }
}

/**
 * Assigns a specialist to a subject.
 * Validates input and ensures the specialist isn't already assigned.
 *
 * @param {Object} req - Express request object (expects specialist ID in req.body and subject ID in req.params)
 * @param {Object} res - Express response object
 */
const assignSpecialist = async (req, res) => {
    try {
        const subject = await SubjectModel.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({message: 'Subject doesnt exist.'})
        }
        const specialist = await SpecialistModel.findById(req.body.specialist);
        if (!specialist) {
            return res.status(404).json({message: 'Specialist doesnt exist.'})
        }
        if (subject._doc.specialists.includes(specialist._id.toString())) {
            return res.status(400).json({message: 'Specialist already assign to this subject.'})
        }
        subject._doc.specialists.push(specialist._id);
        specialist._doc.subjects.push(subject._id);
        await subject.save();
        await specialist.save();
        return res.json({message: "Specialist successfully assigned."});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Cant create subject.'})
    }
}

/**
 * Retrieves specialists assigned to a specific subject with pagination.
 *
 * @param {Object} req - Express request object (expects subject ID in req.params and `page`, `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAssignedSpecialists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalCount = await SpecialistModel.countDocuments({ subjects: req.params.id });

        const specialists = await SpecialistModel.find({ subjects: req.params.id })
            .skip(skip)
            .limit(limit)
            .exec();

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
        return res.status(500).json({message: 'Cant get all assigned specialists.'})
    }
}

/**
 * Validates the input data for creating or updating a subject.
 * Ensures the name and abbreviation are valid and unique.
 *
 * @param {Object} req - Express request object (expects `name` and `abbreviation` in req.body)
 * @returns {Array} - Array of validation errors, if any
 */
const validateRequest = async (req) => {
    const {name, abbreviation} = req.body;
    const errors = [];
    const nameError = validateName(name);
    const abbreviationError = validateAbbreviation(abbreviation);
    const nameExists = await SubjectModel.findOne({name: name});
    const abbreviationExists = await SubjectModel.findOne({abbreviation: abbreviation});

    nameError && errors.push(nameError);
    abbreviationError && errors.push(abbreviationError);
    nameExists && errors.push('Subject with this name already exists.')
    abbreviationExists && errors.push('Subject with this abbreviation already exists.')

    return errors;
}

/**
 * Exports subject-related functionality:
 * - `create`: Creates a new subject.
 * - `getAll`: Retrieves all subjects with pagination.
 * - `getOne`: Retrieves a specific subject by its ID.
 * - `deleteSubject`: Deletes a subject and its associated references.
 * - `update`: Updates the details of an existing subject.
 * - `assignSpecialist`: Assigns a specialist to a subject.
 * - `getAssignedSpecialists`: Retrieves specialists assigned to a subject with pagination.
 */
module.exports = {
    create,
    getAll,
    getOne,
    deleteSubject,
    update,
    assignSpecialist,
    getAssignedSpecialists
}