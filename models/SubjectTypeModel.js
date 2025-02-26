const mongoose = require('mongoose')

const SubjectTypeScheme = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
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

module.exports = mongoose.model("SubjectType", SubjectTypeScheme);