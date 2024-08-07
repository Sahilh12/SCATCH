const mongoose = require('mongoose')
const { type } = require('os')

const ownerSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        unique: true,
        trim: true
    },
    products: {
        type: Array,
        default: []
    },
    picture: {
        type: String,
        default: '',
        trim: true
    },
    gst: {
        type: String,
        unique: true
    }

})

module.exports = mongoose.model('owner', ownerSchema)