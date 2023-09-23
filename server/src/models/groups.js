const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "Message",
		},
	],
}, {
	timestamps: true,
});

module.exports = model("Group", groupSchema);