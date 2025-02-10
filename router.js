const express = require('express')
const foodcontroller = require("./controllers/foodcontroller")
const userController = require("./controllers/userController")
const dailyfoodController = require("./controllers/dailyfoodController")
const jwtMiddleware = require('./middlewares/jwtmiddleware')
const multerConfig = require('./middlewares/multermiddleware')

const router = new express.Router()

router.post('/register',userController.register)

router.post('/login',userController.login)

router.get('/user-recipes',jwtMiddleware,foodcontroller.getfooddata)

router.put('/goals',jwtMiddleware,userController.editgoals)

router.get('/all-foods',foodcontroller.addfoodgetfooddata)

router.post('/add-new-recipe',jwtMiddleware,multerConfig.single('foodimg'),foodcontroller.newuserfood)

router.put('/edit-user-recipe/:foodId',jwtMiddleware,multerConfig.single('foodimg'),foodcontroller.editUserfood)

router.delete('/delete-user-recipe/:foodId',jwtMiddleware,foodcontroller.deleteUserfood)

router.post('/add-search-foods',jwtMiddleware,userController.addUserSearchfoods)

router.post('/edit-user-meal/:reQ',jwtMiddleware,multerConfig.single('foodimg'),dailyfoodController.eachdayfoods)

router.post('/add-usda-edit-images',jwtMiddleware,multerConfig.single('foodimg'),userController.editUSDAImages)

router.get('/get-user-meals/:date',jwtMiddleware,dailyfoodController.getusermeals)

router.post('/change-quantity-of-meals',jwtMiddleware,dailyfoodController.changeAfterQuantityUpdate)

router.post('/payment',jwtMiddleware,userController.paymentFunc)

router.post('/retrieve-session',jwtMiddleware,userController.verifypayment)

router.post('/expire-session',userController.cancelSession)

module.exports = router