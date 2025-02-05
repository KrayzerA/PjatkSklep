const mongoose = require('mongoose')

const SpecialistScheme = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        subjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject'
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
)

module.exports = mongoose.model("Specialist", SpecialistScheme);