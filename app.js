// Module Requirement
const express = require('express')
const handlebars = require('express-handlebars')
const { join } = require('path')
const bodyParser = require('body-parser') //DEPRECATED; already included in express
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
// Server Info
const app = express()
const SERVER_PORT = 8081
const SERVER_HOST = 'localhost'

// Passport Requirement
require('./config/auth')(passport)

// Model Requirements
require('./models/Postagem')
const Postagem = mongoose.model("postagens")

require('./models/Categoria')
const Categoria = mongoose.model("categorias")

// Configs
    // Session
    app.use(session({ //use() cria e configura middlewares
        // secret: 'cursodenode-istoÉUmaChaveAleatóriaFeitaParaSegurança',
        secret: 'cursodenode',
        resave: true,
        saveUninitialized: true,
        // cookie: {
        //     maxAge: 60000
        // }
    }))

    // Passport
    app.use(passport.initialize())
    app.use(passport.session())

    // Flash
    app.use(flash())
    
    // Middleware
     app.use((req, res, next) => {
        //Cria variáveis GLOBAIS:: res.locals
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.auth_error = req.flash('error') //Verificar que o passport não está emitindo as mensagens de erro
        // res.locals.user = req.user || null
        // res.locals.teste_resposta = req.flash('teste_resposta') //TESTE
        next() //next() encerra a execução do Middleware
        // Caso a função next() não seja declarada, o middleware trava o progresso da execução
    })

    // Body Parser // Already native from express
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

    // Path :: To exact directory 'public'
    app.use(express.static(path.join(__dirname, 'public'))) // __dirname gets the exact path to a folder

// Routes
app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).lean().then((postagens) => {

        res.render('index', {postagens: postagens})

    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar postagens")
        res.redirect('/404')
    })
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem) {
            res.render("postagem/index", {
                postagem: postagem
            })
        }else {
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect('/')
        }
    }).catch(err => {
        req.flash("error_msg", "Houve um erro interno ao encontrar postagem")
        res.redirect('/')
    })
})

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then( (categorias) => {
        res.render("categoria/index", {categorias: categorias})
    }).catch(err => {
        req.flash("Houve um erro interno ao listar categorias")
        res.redirect('/')
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
        if(categoria){

            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                res.render("categoria/postagens", {
                    postagens: postagens,
                    categoria: categoria
                })
            }).catch(err => {
                req.flash("error_msg", "Nenhuma postagem encontrada para esta categoria")
                res.redirect("/")
            })

        }else{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }
    }).catch(err => {
        req.flash("error_msg", "Houve um erro interno ao carregar página desta categoria")
        res.redirect("/")
    })
})

// Rota de erro 404
app.get('/404', (req, res) => {
    res.send('Erro 404')
})


// External Routes
const admin = require('./routes/admin')
app.use('/admin', admin)

const teste = require('./routes/teste')
app.use('/teste', teste)

const usuarios = require('./routes/usuario')
app.use('/usuarios', usuarios)


// Server Opening
app.listen(SERVER_PORT, () => {
    console.log(`Servidor rodando na porta ${SERVER_PORT}`)
})