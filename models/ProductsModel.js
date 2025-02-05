const mongoose = require('mongoose')
const {Double} = require("mongodb");

const ProductScheme = new mongoose.Schema({
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        subjectType: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        price: {
            type: Double,
            required: true
        },
        availableAmount: {
            type: Number,
            required: true
        },
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

module.exports = mongoose.model('Product', ProductScheme);