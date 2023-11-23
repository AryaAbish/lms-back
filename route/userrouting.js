const express=require('express')
const { register, login, addbooks, viewusers, allbooks, singlebook, addcart, viewcart, removecart, clearcart, filterbook, placeorder, changepsw, myorder, allorders, deleteuser, addwhishlist, viewwhishlist, removewhishlist } = require('../controller/logic')

const router=new express.Router()

//register
router.post('/user-register',register)

//login
router.post('/user-login',login)

//add books
router.post('/admin/addbooks',addbooks)

//view users
router.get('/admin/viewusers',viewusers)

//all books
router.get('/getallbooks',allbooks)

//single book
router.get('/getbook/:id',singlebook)

//add to cart
router.post('/user/addtocart/:id',addcart)

//view cart
router.get('/user/viewcart/:id',viewcart)

//remove cart
router.put('/user/removecart',removecart)

//clear cart
router.put('/user/clearcart/:id',clearcart)

//place order
router.post('/user/placeorder/:id',placeorder)

//filter books
router.get('/allbooks/filter',filterbook)

//chang psw
router.put('/user/changepsw',changepsw)

//my orders
router.get('/user/myorders/:id',myorder)

//all orders
router.get('/admin/allorders',allorders)

//delete user
router.delete('/userdelete/:id',deleteuser)

//add whishlist
router.post('/user/addtowhishlist/:id',addwhishlist)

//view whishlist
router.get('/user/viewwhishlist/:id',viewwhishlist)

//remove whishlist
router.put('/user/removewhishlist',removewhishlist)

module.exports=router