const mongoose = require("mongoose");

const RoleScheme = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    },
);

module.exports = mongoose.model('Role', RoleScheme);