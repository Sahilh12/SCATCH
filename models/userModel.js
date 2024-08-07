const mongoose = require('mongoose')
const { type } = require('os')
const bcrypt = require('bcrypt')


function getFormattedDate() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const [{ value: day }, , { value: month }, , { value: year }] = formatter.formatToParts(now);
    return `${day}/${month}/${year}`;
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png',
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: Number,
        required: true,
        trim: true
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ],
    orders: {
        type: Array,
        default: []
    },
    date: {
        type:String,
        default: getFormattedDate()
    }
})



module.exports = mongoose.model('user', userSchema)