const { default: mongoose } = require("mongoose");

const verifySchema = new mongoose.Schema({
   userId: {
    type: String,
   },
   otp: {
    type: String
   }
}, {
    timestamps: true
})

module.exports = mongoose.model("verifyaccount", verifySchema)