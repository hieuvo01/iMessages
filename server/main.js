const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const connectDb = require('./src/config/connectdb')
const cookieParser = require('cookie-parser')
const routeUser = require('./src/routes/users/users')
const routeGroup = require('./src/routes/group/group')
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
dotenv.config()
const port = process.env.PORT
connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/user', routeUser)
app.use('/group', routeGroup)

io.on('connection', (socket) => {
	socket.on('connect', () => {
		socket.emit(`User ${socket.id} connected!`);
	})
	console.log('a user connected!');
	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
	  });
  });

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

