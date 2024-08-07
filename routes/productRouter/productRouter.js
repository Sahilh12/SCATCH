const express = require('express')
const router = express.Router()
const upload = require('../../config/multer')
const productModel = require('../../models/productModel')
const { isOwnerLoggedIn, isUserLoggedIn } = require('../../middlewares/isLoggedin')


router.get('/', (req, res) => {
    res.render('index')
})
router.post('/create', isOwnerLoggedIn, upload.single('productImage'), async (req, res) => {
    let { productName, price, discount, bgcolor, panelColor, textColor } = req.body

    const product = await productModel.create({
        productImage: req.file.buffer,
        productName,
        price,
        discount,
        bgcolor,
        panelColor,
        textColor,
    })
    req.flash('success', 'Product created successfully.')
    res.redirect('/owner/admin')
})
router.get('/allproduct', isOwnerLoggedIn, async (req, res) => {
    let products = await productModel.find()
    let success = req.flash('success');
    let deleteproduct = req.flash('delete')
    let deleteAll = req.flash('deleteAll')
    res.render('admin', { products, success, deleteproduct, deleteAll })
})
router.get('/edit/:productid', isOwnerLoggedIn, async (req, res) => {
    let productId = req.params.productid
    let product = await productModel.findById(productId)
    res.render('edit', { productId, product })
})
router.post('/edit/:productid', isOwnerLoggedIn, upload.single('image'), async (req, res) => {
    let { productName, productPrice, productImage, productDiscount, panelColor, bgColor, textColor } = req.body
    let productId = req.params.productid
    const filter = { _id: productId }
    const update = {
        // productImage: req.file.buffer,
        productName,
        price: productPrice,
        productImage,
        discount: productDiscount,
        panelColor,
        bgcolor: bgColor,
        textColor
    }
    let product = await productModel.findOneAndUpdate(filter, update, { new: true })
    await product.save()
    res.redirect('/product/allproduct')
})





module.exports = router