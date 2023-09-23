const { Schema, model } = require("mongoose");

const stickerSchema = new Schema({
	filename: {
		type: String,
		required: true,
	},
}, {
	timestamps: true,
});

module.exports = model("Sticker", stickerSchema);