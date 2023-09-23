const { request } = require('express')
const User = require('../../models/users')
const Verify = require('../../models/verifyaccount')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
let refreshTokens = [];
const userController = {
    registerUser: async (req, res) => {
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
        try {
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
            const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
            const hashed = await bcrypt.hash(req.body.password, salt)
            const info = await transporter.sendMail({
                from: process.env.SENDMAIL, // sender address
                to: req.body.email, // list of receivers
                subject: "Verify account ✔", // Subject line
                text: "Verify account", // plain text body
                html: `<b>Mã OTP tài khoản của bạn là</b> ${randomNumbers}`, // html body
            });
            if (!info) {
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
        } catch (e) {
            res.status(500).json(e)
        }
    },
    verifyOTP: async (req, res) => {
        const expirationTime = 10 * 60 * 1000; // 10 phút tính bằng mili giây
        try {
            const id = await Verify.findOne({
                userId: req.body.id
            })
            if (!id) {
                res.status(404).json("Fail")
            }
            const very = await Verify.findOne({
                otp: req.body.otp
            });
            if (!very) {
                res.status(404).json("Fail very otp")
            }
            const checkUser = await User.findOne({
                _id: req.body.id
            });
            if (Date.now() - checkUser.createdAt > expirationTime) {
                res.status(404).json("OTP invalid or expired");
            }
            checkUser.isVerified = true;
            checkUser.save();

            res.status(200).json("Verify success, pls login");
        } catch (e) {
            res.status(500).json(e)
        }
    },
    //Generate access token
    generateAccessToken: user => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.JWT_ACCESS_KEY, { expiresIn: "30s" })
    },
    //Generate refresh token
    generateRefreshToken: user => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.JWT_ACCESS_KEY, { expiresIn: "100d" })
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (!user) {
                res.status(404).json("email not found")
            }
            if (user.isVerified === false) {
                res.status(404).json("Account not verify, pls veryf.....")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) res.status(404).json("wrong password")
            if (user && validPassword) {
                const token = userController.generateAccessToken(user);
                const refreshToken = userController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const { password, ...others } = user._doc; //hidden password
                res.status(200).json({ others, token });
            }
        } catch (e) {
            res.status(500).json(e)
        }
    },
    getAllUser: async (req, res) => {
        try {
            const user = await User.find()
            if (!user) {
                res.status(404).json("Uer not found")
            }
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                res.status(404).json("Uer not found")
            }
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    },
    refreshNewToken: async (req, res) => {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                res.status(404).json("You are not authenticated")
            }
            if (!refreshTokens.includes(token)) {
                return res.status(403).json("Refresh token is not valid !!!")
            }
            jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(404).json(err);
                }
                refreshTokens = refreshTokens.filter(token => token !== token);
                const newToken = userController.generateAccessToken(user)
                const newRefreshToken = userController.generateRefreshToken(user)
                refreshTokens.push(newRefreshToken)
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                res.status(200).json({ token: newToken })
            })
        } catch (e) {
            res.status(500).json(e)
        }
    },
    Logout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logout Success !!!");
    }

}

module.exports = userController