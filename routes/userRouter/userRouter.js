const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { registerUser, loginUser, logOut } = require('../../controllers/authController')
const userModel = require('../../models/userModel')
const { isUserLoggedIn } = require('../../middlewares/isLoggedin')

router.get('/', (req, res) => {
    res.send('this is user router')
})
router.get('/profile/edit/:userid', async (req, res) => {
    let userId = req.params.userid
    let user = await userModel.findOne({ _id: userId })
    res.render('editprofile', { user })
})
router.post('/profile/edit/:userid', isUserLoggedIn, async (req, res) => {
    try {
        // let { username, password, contact } = req.body;
        const password = req.body.password
        const user = await userModel.findOne({ _id: req.params.userid });
        console.log(password);
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log(user.password);

        const isMatch = await bcrypt.compare(password, user.password.toString());

        // if (!isMatch) {
        //     return res.status(401).send('Password incorrect');
        // }

        // user.username = username;
        // user.contact = contact;
        // await user.save();

        // res.redirect('/profile');

    } catch (error) {
        res.send(error)
    }
});


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/logout', logOut)





module.exports = router
