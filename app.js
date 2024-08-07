const express = require('express')
const app = express()
const path = require('path')
const db = require('./db/db')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressSession = require('express-session')
const flash = require('connect-flash')
const ejs = require('ejs')

require('dotenv').config()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SECRET
}))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

const userRouter = require('./routes/userRouter/userRouter')
const productRouter = require('./routes/productRouter/productRouter')
const ownerRouter = require('./routes/ownerRouter/ownerRouter')
const indexRouter = require('./routes/index')

app.use('/', indexRouter)
app.use('/product', productRouter)
app.use('/user', userRouter)
app.use('/owner', ownerRouter)
app.use('*', (req, res) => {
    res.render('error')
})

app.listen(3000, () => { console.log('server running on 3000...'); })