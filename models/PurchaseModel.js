const mongoose = require('mongoose')

const PurchaseScheme = new mongoose.Schema({
        specialist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Specialist',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        purchaseDate: {
            type: Date
        },
    },
    {
        timestamps: true
    },
)

module.exports = mongoose.model("Purchase", PurchaseScheme);