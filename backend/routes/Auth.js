const express = require("express")
const { CreateAuth, Login, me, logout } = require("../controller/Auth")
const { authLimiter, loginLimiter, generalAuthLimiter } = require("../middlewares/rateLimiter")

const router = express.Router()

router.post("/register", authLimiter, CreateAuth)
router.post("/login", loginLimiter, Login)
router.get("/me", generalAuthLimiter, me)
router.get("/logout", generalAuthLimiter, logout)

module.exports = router