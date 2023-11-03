const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const connectDb = require('./src/config/connectdb')
const cookieParser = require('cookie-parser')
const routeUser = require('./src/routes/users/users')
const routeGroup = require('./src/routes/group/group')
const Message = require('./src/models/messages');

const io = require('socket.io')(3002,
	{
		cors: {
			origin: "*",
			method: ['GET', 'POST']
		}
	}
);
dotenv.config()
const port = process.env.PORT
connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/user', routeUser)
app.use('/group', routeGroup)

io.on('connection', async (socket) => {
	console.log(`User ${socket.id} connected!`);
	socket.on('sendMessage', async (data) => {
    // Thêm tin nhắn vào cơ sở dữ liệu
    const { senderId, receiverId, content, type } = data;

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      type,
    });

    console.log('Thêm tin nhắn thành công:', message);

		io.emit("message", message);
  });
	socket.on('disconnect', () => {
		console.log(`user ${socket.id} disconnected`);
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

