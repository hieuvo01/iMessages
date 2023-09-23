const mongoose = require('mongoose')
function connectDb(){
    mongoose.connect(process.env.MONGODB).then(() => console.log('connected!')).catch((e) => e);
}
module.exports = connectDb;


