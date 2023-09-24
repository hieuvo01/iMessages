const Group = require('../../models/groups')
const Message = require('../../models/messages')
const User = require('../../models/users')

const groupController = {
	createGroup: async (req, res) => {
		try {
			const { name } = req.body;
			const group = await Group.create({ name });
			res.status(201).json(group);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi tạo nhóm chat" });
		}
	},
	joinGroup: async (req, res) => {
		try {
			const { groupId } = req.params;
			const { userId } = req.body;
			const group = await Group.findByIdAndUpdate(
				groupId,
				{ $addToSet: { members: userId } },
				{ new: true }
			);
			res.json(group);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi gia nhập nhóm chat" });
		}
	},
	leaveGroup: async (req, res) => {
		try {
			const { groupId } = req.params;
			const { userId } = req.body;
			const group = await Group.findByIdAndUpdate(
				groupId,
				{ $pull: { members: userId } },
				{ new: true }
			);
			res.json(group);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi rời khỏi nhóm chat" });
		}
	},
	getAll: async (req, res) => {
		try {
			const groups = await Group.find();
			res.json(groups);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi lấy danh sách nhóm chat" });
		}
	},
	sendMessage: async (req, res) => {
		try {
			const { groupId } = req.params;
			const { senderId, content, type } = req.body;

			// Kiểm tra xem nhóm chat có tồn tại không
			const group = await Group.findById(groupId);
			if (!group) {
				return res.status(404).json({ error: "Nhóm chat không tồn tại" });
			}

			// Tạo tin nhắn mới
			const message = await Message.create({
				sender: senderId,
				content,
				type,
			});

			// Cập nhật danh sách tin nhắn của nhóm chat
			group.messages.push(message._id);
			await group.save();

			res.status(201).json(message);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi gửi tin nhắn" });
		}
	},
	sendMessageOne: async (req, res) => {
		try {
			const { senderId, receiverId, content, type } = req.body;

			// Kiểm tra xem người gửi và người nhận có tồn tại không
			const sender = await User.findById(senderId);
			const receiver = await User.findById(receiverId);
			if (!sender || !receiver) {
				return res.status(404).json({ error: "Người gửi hoặc người nhận không tồn tại" });
			}

			// Tạo tin nhắn mới
			const message = await Message.create({
				sender: senderId,
				receiver: receiverId,
				content,
				type,
			});

			res.status(201).json(message);
		} catch (error) {
			res.status(500).json({ error: "Lỗi khi gửi tin nhắn" });
		}
	}
}
module.exports = groupController