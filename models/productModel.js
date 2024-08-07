const mongoose = require('mongoose')
const { type } = require('os')

const productSchema = mongoose.Schema({
    productName: {
        type: String,
    },
    price: {
        type: Number,
    },
    discount: {
        type: Number,
        default: 0
    },
    bgcolor: {
        type: String,
    },
    panelColor: {
        type: String,
    },
    textColor: {
        type: String,
    },
    productImage: Buffer

})

module.exports = mongoose.model('product', productSchema)