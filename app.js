// Modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
const app = express()
const serverPort = 8081

// Configs
    // Body Parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose
        // Em breve

// Routes


// Others
app.listen(() => {
    console.log(`Servidor rodando na porta ${serverPort}`)
})