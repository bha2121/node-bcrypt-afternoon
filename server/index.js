require('dotenv').config()
const express = require('express')
const session = require("express-session")
const massive = require('massive') 

const AC = require('./controllers/authController')

const app = express()

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db is connected')
    console.log(db.listTables())
})

app.use(express.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    
}))


app.post('/auth/register', AC.register)
app.post('/auth/login', AC.login);
app.get('/auth/logout', AC.logout);



app.listen(SERVER_PORT, () =>{
    console.log('listening on port', SERVER_PORT)
})