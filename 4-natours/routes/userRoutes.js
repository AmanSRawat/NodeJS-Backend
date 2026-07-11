const express = require('express');
const UserController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)

router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,UserController.updateMe);
router.delete('/deletMe',authController.protect,UserController.deleteMe);

router
    .route('/')
    .get(UserController.getAllUsers)
    .post(UserController.createUser)

router
    .route('/:id')
    .get(UserController.getUser)
    .patch(UserController.updateUser)
    .delete(UserController.deleteUser)

module.exports = router;