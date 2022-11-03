// Module Requirement
const express = require('express')
const handlebars = require('express-handlebars')
const { join } = require('path')
// const bodyParser = require('body-parser') //DEPRECATED; already included in express
// const mongoose = require('mongoose')
const path = require('path')

const app = express()
const SERVER_PORT = 8081


// Configs
    // Body Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    // Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose
        // Em breve

    // Public
    app.use(express.static(path.join(__dirname, 'public'))) // __dirname gets the exact path to a folder


// Routes
    app.get('/', (req, res) => {
        res.send("Rota Principal")
    })

    const admin = require('./routes/admin')
    app.use('/admin', admin)

// Others
app.listen(SERVER_PORT, () => {
    console.log(`Servidor rodando na porta ${SERVER_PORT}`)
})