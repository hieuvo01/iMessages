const { request } = require('express')
const User = require('../../models/users')
const Verify = require('../../models/verifyaccount')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const userController = {
    registerUser: async(req, res) => {
        const transporter = nodemailer.createTransport({
            // host: "smtp.example.com",
            // port: 578,
            // secure: true,
            service: "gmail", 
            auth: {
              user: process.env.SENDMAIL,
              pass: process.env.PASSMAIL,
            },
          });
        try{
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const randomNumbers = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join('');
            const hashed = await bcrypt.hash(req.body.password, salt)
            const info = await transporter.sendMail({
                from: process.env.SENDMAIL, // sender address
                to: req.body.email, // list of receivers
                subject: "Verify account ✔", // Subject line
                text: "Verify account", // plain text body
                html: `<b>Mã OTP tài khoản của bạn là</b> ${randomNumbers}`, // html body
              });
            if(!info){
                res.status(404).json("wrong email")
            }
            const newUser = await new User({
                email: req.body.email,
                password: hashed,
                fullname: req.body.fullname,
                gender: req.body.gender,
                dob: req.body.dob
            })
            const user = await newUser.save()            
            
            const verify = await new Verify({
                userId: user._id,
                otp: randomNumbers
            })
            const veri = await verify.save();
            res.status(200).json(user)
        }catch(e){
            res.status(500).json(e)
        }
    },
    verifyOTP: async(req, res) => {
        try{
            const id = await Verify.findOne({
                userId: req.body.id
            })
            if(!id){
                res.status(404).json("Fail")
            }
            const very = await Verify.findOne({
                otp: req.body.otp
            });
            if(!very){
                res.status(404).json("Fail very otp")
            }
            const checkUser = await User.findOne({
                _id: req.body.id
            });
            checkUser.isVerified = true;
            checkUser.save();

            res.status(200).json("Verify success, pls login");
        }catch(e){
            res.status(500).json(e)
        }
    },
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({
                email: req.body.email
            })
            if(!user){
                res.status(404).json("email not found")
            }
            if(user.isVerified === false){
                res.status(404).json("Account not verify, pls veryf.....")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword)  res.status(404).json("wrong password")

            res.status(200).json("success")
        }catch(e){
            res.status(500).json(e)
        }
    }

}

module.exports = userController