const http = require('http')

const express = require('express')                                                                                         


const app = express();

app.set('view engine','ejs')

app.use('/assets',express.static('./assets'))

app.use(express.json());

const ticket = require('./controllers/tickets')

const user = require('./controllers/users');

app.use('/api/',ticket)

app.use('/user',user)

app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/admin',(req,res)=>{
    res.send('Not Authorized')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.listen(3000);