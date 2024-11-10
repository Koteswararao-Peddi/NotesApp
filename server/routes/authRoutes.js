
const authController = require('../controllers/authController')
const express = require('express');


const router = express.Router();

// REGISTER || POST 
router.post('/register', authController.userRegister)

// LOGIN || POST
router.post('/login', authController.userLogin)

// LOGOUT || POST
router.post('/logout', authController.userLogout)


module.exports = router 