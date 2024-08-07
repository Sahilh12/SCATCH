const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/scatch").then((res) => console.log('database connected')).catch((err) => {
    console.log('database lost connection');
})

module.exports = mongoose.connection