const { request } = require('express')
const User = require('../../models/users')
const Verify = require('../../models/verifyaccount')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken")
const winston = require('winston');
let refreshTokens = [];
const userController = {
    registerUser: async (req, res) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDMAIL,
                pass: process.env.PASSMAIL,
            },
        });
        try {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const randomNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
            const hashed = await bcrypt.hash(req.body.password, salt);
            const info = await transporter.sendMail({
                from: process.env.SENDMAIL,
                to: req.body.email,
                subject: "Xác minh tài khoản ✔",
                text: "Xác minh tài khoản của bạn",
                html: `<b>Xin chào! Mã OTP tài khoản của bạn là</b> ${randomNumbers}, vui lòng xác minh trong vòng 10 phút.`,
            });
            if (!info) {
                return res.status(404).json("Sai địa chỉ email");
            }
            const checkEmail = await User.findOne({ email: req.body.email });
            if (checkEmail) {
                return res.status(409).json("Email đã tồn tại");
            }
            const newUser = new User({
                email: req.body.email,
                password: hashed,
                fullname: req.body.fullname,
                gender: req.body.gender,
                dob: req.body.dob
            });
            const user = await newUser.save();

            const verify = new Verify({
                userId: user._id,
                otp: randomNumbers
            });
            await verify.save();

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    verifyOTP: async (req, res) => {
        const expirationTime = 10 * 60 * 1000; // 10 phút tính bằng mili giây
        try {
            const email = await User.findOne({
                email: req.body.email
            });
            if (!email) {
                return res.status(404).json("Fail")
            }
            const very = await Verify.findOne({
                userId: email._id,
                otp: req.body.otp
            });
            if (!very) {
                return res.status(404).json("Xác thực mã thất bại")
            }
            const checkUser = await User.findOne({
                _id: email._id
            });
            if (Date.now() - checkUser.createdAt > expirationTime) {
                return res.status(404).json("OTP không đúng hoặc đã hết hạn");
            }
            checkUser.isVerified = true;
            checkUser.save();

            res.status(200).json("Xác minh thành công!");
        } catch (e) {
            res.status(500).json(e)
        }
    },
    //Generate access token
    generateAccessToken: user => {
        return jwt.sign({ id: user.id, admin: user.admin, fullname: user.fullname }, process.env.JWT_ACCESS_KEY, { expiresIn: "7d" })
    },
    //Generate refresh token
    generateRefreshToken: user => {
        return jwt.sign({ id: user.id, admin: user.admin, fullname: user.fullname }, process.env.JWT_ACCESS_KEY, { expiresIn: "100d" })
    },
    loginUser: async (req, res) => {
        // Tạo logger
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'server.log' })
            ]
        });
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            if (!user) {
                return res.status(404).json("Email không tồn tại!")
            }
            if (user.isVerified === false) {
                return res.status(404).json("Tài khoản chưa được xác minh, vui lòng xác minh")
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) res.status(404).json("Sai mật khẩu!")
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
                const currentTime = new Date();
                logger.info(`${user.fullname} logged in ${currentTime}`);
            }
        } catch (e) {
            res.status(500).json(e)
        }
    },
    getAllUser: async (req, res) => {
        try {
            const user = await User.find()
            if (!user) {
                return res.status(404).json("Người dùng không tồn tại!")
            }
            res.status(200).json(user)
        } catch (e) {
            return res.status(500).json(e)
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                return res.status(404).json("Người dùng không tồn tại!")
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
                return res.status(404).json("You are not authenticated")
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
        res.status(200).json("Đăng xuất thành công!");
    }

}

module.exports = userController