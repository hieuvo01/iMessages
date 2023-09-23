const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    fullname: {
        type: String,
        require: true,
        maxlength: 50
    },
    gender: {
        type: String,
        require: true,
    },
    dob: {
        type: String,
        require: true,
    },
    admin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)