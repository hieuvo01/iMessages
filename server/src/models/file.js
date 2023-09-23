const { Schema, model } = require("mongoose");

const FileSchema = new Schema({
	messageId: {
		type: Schema.Types.ObjectId,
		ref: "Message",
		required: true,
	},
	filename: {
		type: String,
		required: true,
	},
	size: {
		type: Number,
		required: true,
	},
}, {
	timestamps: true,
});

module.exports = model("File", FileSchema);