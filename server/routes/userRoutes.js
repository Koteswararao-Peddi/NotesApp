
const express = require('express')
const userController = require('../controllers/userController')
const verifyToken = require('../middlewares/verifyToken')

const router = express.Router()

// // EDIT || POST
router.get('/get-user', verifyToken, userController.getUser)

module.exports = router