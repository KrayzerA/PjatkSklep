const mongoose = require('mongoose')

const SubjectScheme = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        abbreviation: {
            type: String,
            required: true,
        },
        specialists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Specialist'
            }
        ],
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    },
    {
        timestamps: true
    },
)

module.exports = mongoose.model("Subject", SubjectScheme);