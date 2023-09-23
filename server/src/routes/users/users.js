const middlewareController = require('../../components/middlewares/middleware')
const userController = require('../../components/user/userController')
const router = require('express').Router()

router.post("/refresh", userController.refreshNewToken)
router.post("/register", userController.registerUser)
router.post("/verify", userController.verifyOTP)
router.post("/login", userController.loginUser)
router.post("/logout", userController.Logout)
router.get("/get-all", middlewareController.verifyToken, userController.getAllUser)
router.get("/:id", middlewareController.verifyToken, userController.getUser)

module.exports = router