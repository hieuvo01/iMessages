const userController = require('../../components/user/userController')
const router = require('express').Router()

router.post("/register", userController.registerUser)
router.post("/verify", userController.verifyOTP)
router.post("/login", userController.loginUser)

module.exports = router