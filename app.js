// Module Requirement
const express = require('express')
const handlebars = require('express-handlebars')
const { join } = require('path')
const bodyParser = require('body-parser') //DEPRECATED; already included in express
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const SERVER_PORT = 8081
const SERVER_HOST = 'localhost'

// Configs
    // Session
    app.use(session({ //use() cria e configura middlewares
        // secret: 'cursodenode-istoÉUmaChaveAleatóriaFeitaParaSegurança',
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000
        }
    })) 
    app.use(flash())
    
    // Middleware
     app.use((req, res, next) => {
        //Cria variáveis GLOBAIS:: res.locals
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        // res.locals.teste_resposta = req.flash('teste_resposta') //TESTE
        next() //next() encerra a execução do Middleware
        // Caso a função next() não seja declarada, o middleware trava o progresso da execução
    })

    // Body Parser
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    // Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose
    mongoose.connect(`mongodb://${SERVER_HOST}/blogapp`).then(() => {
        console.log("Conectado ao Mongo")
    }).catch((err) => {
        console.log(`Erro ao conectar ao  Mongo: ${err}`)
    })

    // Public
    app.use(express.static(path.join(__dirname, 'public'))) // __dirname gets the exact path to a folder

// Routes
    app.get('/', (req, res) => {
        res.send("Rota Principal")
    })

    const admin = require('./routes/admin')
    app.use('/admin', admin)

    const teste = require('./routes/teste')
    app.use('/teste', teste)

// Others
app.listen(SERVER_PORT, () => {
    console.log(`Servidor rodando na porta ${SERVER_PORT}`)
})