const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateToken = function (data) {
    return jwt.sign({ email: data.email, id: data._id }, process.env.JWT_KEY)
}


module.exports = { generateToken }
