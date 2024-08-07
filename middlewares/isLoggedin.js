const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const ownerModel = require('../models/ownerModel')


const isUserLoggedIn = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash('error', 'you need to login first')
        return res.redirect('/')
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
        let user = await userModel.findOne({ email: decoded.email }).select('-password')
        if (user) {
            req.user = user
            next()
        } else {
            res.cookie('token', '')
            req.flash('error', 'you need to login first')
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Something went wrong')
        return res.redirect('/')
    }
}
const isOwnerLoggedIn = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash('error', 'you need to login first')
        return res.redirect('/')
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
        let owner = await ownerModel.findOne({ email: decoded.email }).select('-password')
        if (owner) {
            req.owner = owner
            return next()
        } else {
            res.cookie('token', '')
            return res.redirect('/')
        }
    } catch (error) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
}

module.exports = { isUserLoggedIn, isOwnerLoggedIn }