
const userModel = require('../models/userModel')
const ownerModel = require('../models/ownerModel')
const productModel = require('../models/productModel')
const { generateToken } = require('../utils/generateToken')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports.registerUser = async (req, res) => {
    try {
        let { password, email, username, contact, image } = req.body
        let userCheck = await userModel.findOne({ email })
        if (userCheck) {
            req.flash("error", "You already have an account. Please login")
            return res.redirect('/')
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    password: hash,
                    email,
                    username,
                    contact,
                    image: typeof image != undefined && image ? image : 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png'
                })
                let token = generateToken(user)
                res.cookie('token', token)
                res.redirect('/shop')
            })
        })
    } catch (error) {
        console.log('err in user post req.');
    }
}
module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (!user) {
        req.flash("error", "You don't have an account. Please create first")
        return res.redirect('/')
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user)
            res.cookie('token', token)
            res.redirect('/shop')
        } else {
            req.flash("error", "Email or Password incorrect")
            return res.redirect('/')
        }
    })
}


module.exports.registerOwner = async (req, res) => {
    let ownerCheck = await ownerModel.find()
    if (ownerCheck.length > 0) {
        req.flash('error', 'you cannot create second owner. Please login with your owner account')
        return res.redirect('/owner')
    } else {
        let { password, email, username, gst } = req.body
        let ownerCheck = await ownerModel.findOne({ email })
        if (ownerCheck) {
            req.flash("error", "You already have an account. Please login")
            return res.redirect('/owner')
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let owner = await ownerModel.create({
                    password: hash,
                    email,
                    username,
                    gst
                })
                let token = generateToken(owner)
                res.cookie('token', token)
                res.redirect('/owner/admin')
            })
        })
    }

}
module.exports.loginOwner = async (req, res) => {
    let { email, password } = req.body
    let owner = await ownerModel.findOne({ email })
    if (!owner) {
        req.flash("error", "You are not Owner or Create owner Account")
        return res.redirect('/owner')
    }
    bcrypt.compare(password, owner.password, (err, result) => {
        if (result) {
            let token = generateToken(owner)
            res.cookie('token', token)
            res.redirect('/owner/admin')
        } else {
            req.flash("error", "Email or Password incorrect")
            return res.redirect('/owner')
        }
    })
}


module.exports.logOut = async (req, res) => {
    res.cookie('token', '')
    res.redirect('/')
}