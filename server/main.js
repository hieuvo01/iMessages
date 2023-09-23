const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const connectDb = require('./src/config/connectdb')
const cookieParser = require('cookie-parser')
const routeUser = require('./src/routes/users/users')
dotenv.config()
const port = process.env.PORT
connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/user', routeUser)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})