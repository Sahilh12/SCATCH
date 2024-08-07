const express = require('express')
const router = express.Router()
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const { isUserLoggedIn, isOwnerLoggedIn } = require('../middlewares/isLoggedin')


router.get('/', (req, res) => {
    let error = req.flash("error")
    res.render('index', { error })
})

router.get('/shop', isUserLoggedIn, async (req, res) => {
    let products = await productModel.find()
    let success = req.flash('success')
    let edit = req.flash('edit')
    res.render('shop', { products, success, edit })
})

router.get('/cart', isUserLoggedIn, async (req, res) => {
    try {
        let products = await productModel.find()
        let user = await userModel.findOne({ email: req.user.email }).populate('cart')
        console.log(user);
        let finalAmount;
        if (user.cart.length) {
            for (let i = 0; i < user.cart.length; i++) {
                finalAmount = user.cart[i].price - user.cart[i].discount + 20
            }
        }
        res.render('cart', { user, finalAmount, products })
    } catch (error) {
        console.log('error in cart route , ', error.message);
    }

})

router.get("/remove/:id", isUserLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        let user = await userModel.findById(userId);

        if (!user || !user.cart) {
            return res.status(404).send('User or cart not found');
        }

        user.cart = user.cart.filter((item) => {
            return item.toString() !== productId
        });

        console.log(user.cart);

        await user.save();
        res.redirect('/cart');

    } catch (error) {
        console.log('Error in remove route:', error.message);
        res.status(500).send('Error removing item from cart');
    }
});

router.get('/cart/:productid', isUserLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    user.cart.push(req.params.productid)
    await user.save()
    req.flash('success', 'Added to cart')
    res.redirect('/shop')
})

router.get('/delete/:productid', isOwnerLoggedIn, async (req, res) => {
    try {
        let product = await productModel.findOneAndDelete({ _id: req.params.productid })
        req.flash('delete', `"${product.productName}" deleted successfully...`)
        res.redirect('/product/allproduct')
    } catch (error) {
        res.redirect('/owner/admin')
    }
})

router.get('/deleteAll', isUserLoggedIn, async (req, res) => {
    try {
        let products = await productModel.find()
        if (products) {
            products.forEach(async (product) => {
                let deletedproduct = await productModel.findOneAndDelete({ _id: product.id })
            });
            req.flash('deleteAll', `All product deleted successfully...`)
            res.redirect('/product/allproduct')
        }
    } catch (error) {
        res.redirect('/owner/admin')
    }
})

router.get('/profile', isUserLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    console.log(user);
    res.render('profile', { user })
})




module.exports = router