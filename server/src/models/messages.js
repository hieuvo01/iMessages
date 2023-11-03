const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	content: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	attachments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Attachment",
		},
	],
}, {
	timestamps: true,
});

module.exports = model("Message", messageSchema);