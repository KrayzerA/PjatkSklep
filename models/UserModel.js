const mongoose = require('mongoose')
const {Double} = require("mongodb");

const UserSchema = new mongoose.Schema({
        login: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        money: {
            type: Double,
            default: 0
        },
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        purchases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Purchase'
            }
        ],
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model('User', UserSchema);