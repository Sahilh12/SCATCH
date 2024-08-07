const express = require('express')
const router = express.Router()
const { isOwnerLoggedIn, isUserLoggedIn } = require('../../middlewares/isLoggedin')

const { registerOwner, loginOwner, createProduct } = require('../../controllers/authController')
const productModel = require('../../models/productModel')
const userModel = require('../../models/userModel')

router.get('/', (req, res) => {
    let error = req.flash('error')
    res.render('owner', { error })
})
router.get('/admin', isOwnerLoggedIn, async (req, res) => {
    let success = req.flash('success')
    res.render('createproducts', { success })
})
router.get('/alluser', isOwnerLoggedIn, async (req, res) => {
    let users = await userModel.find()
    console.log(users);
    
    let success = req.flash('deleted')
    res.render('alluser', { users, success })
})
router.get('/user/delete/:userid', async (req, res) => {
    let showname = await userModel.findById(req.params.userid)
    let user = await userModel.findOneAndDelete({ _id: showname._id })
    req.flash('deleted', `${showname.username} deleted successfully`)
    res.redirect('/owner/alluser')
})


router.post('/register', registerOwner)
router.post('/login', loginOwner)

module.exports = router