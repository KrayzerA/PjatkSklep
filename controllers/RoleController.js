const RoleModel = require("../models/RoleModel");
const UserModel = require("../models/UserModel");

/**
 * Creates a new role in the system.
 * Ensures the role does not already exist and validates the input.
 *
 * @param {Object} req - Express request object (expects `name` in req.body)
 * @param {Object} res - Express response object
 */
const createRole = async (req, res) => {
    try {
        const isRoleExists = await RoleModel.findOne({name: req.body.name});
        if (isRoleExists) {
            return res.status(400).json({message: 'Role already exists.'});
        }
        const {name} = req.body;
        if (!name.trim()){
            return res.status(400).json({message: 'Incorrect role name.'})
        }
        const doc = new RoleModel({
            name: name.trim()
        });

        const role = await doc.save();
        res.json(role);
    } catch (e) {
        res.status(500).json({message: "Cannot add role."});
        console.log(e);
    }
};

/**
 * Assigns a role to a user and updates the role with the user reference.
 * Validates that the user and role exist and ensures the user doesn't already have the role.
 *
 * @param {Object} req - Express request object (expects `user` and `role` IDs in req.body)
 * @param {Object} res - Express response object
 */
const assignRole = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.user);
        const role = await RoleModel.findById(req.body.role);
        if (!user) {
            return res.status(404).json({message: `User not found.`})
        }
        if (!role) {
            return res.status(404).json({message: `Role not found.`})
        }
        if (user.roles.includes(role._id)) {
            return res.status(400).json({message: `User already has role ${role.name}.`})
        }

        user.roles.push(role._id);
        role.users.push(user._id);
        await user.save()
        await role.save()
        return res.json(user);
    } catch (e) {
        console.log(e);
        res.status(500).json('Something goes wrong.')
    }
};

/**
 * Retrieves all roles from the database with pagination.
 *
 * @param {Object} req - Express request object (expects `page` and `limit` in query parameters)
 * @param {Object} res - Express response object
 */
const getAllRoles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const [roles, totalCount] = await Promise.all([
            RoleModel.find()
                .skip(skip)
                .limit(limit)
                .exec(),
            RoleModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalCount / limit);

        return res.json({
            roles,
            pagination: {
                totalItems: totalCount,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Cant get all roles.'})
    }
}

/**
 * Exports role-related functionality:
 * - `createRole`: Creates a new role.
 * - `assignRole`: Assigns a role to a user.
 * - `getAllRoles`: Retrieves all roles with pagination.
 */
module.exports = {
    createRole,
    assignRole,
    getAllRoles
}