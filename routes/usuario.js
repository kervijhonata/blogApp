// Modules
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Models
require('../models/Usuario') // Carrega a model
const Usuario = mongoose.model('usuarios')

router.get("/", (req, res) => {
    res.render("usuarios/index")
})

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro/novo", (req, res) => {

    let erros = []

    // Validação dos Dados do formulário
    // Nome
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Campo "nome" está vazio'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome muito pequeno'})
    }
    if(req.body.nome.length > 60){
        erros.push({texto: 'Nome muito grande'})
    }
    //Email 
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'Campo "email" está vazio'})
    }
    if(!req.body.email.includes('@')){
        erros.push({texto: 'Campo "email" não recebeu @'})
    }
    if(req.body.email.length < 5){
        erros.push({texto: 'Email muito pequeno'})
    }
    if(req.body.email.length> 128){
        erros.push({texto: 'Email muito grande'})
    }
    // Senha
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: 'Campo "senha" está vazio'})
    }
    if(req.body.senha.length < 8){
        erros.push({texto: 'Senha muito pequena'})
    }
    if(req.body.senha.length > 30){
        erros.push({texto: 'Senha muito grande'})
    }
    if(req.body.senha != req.body.senha_comparativa) {
        erros.push({texto: 'As senhas são diferentes, tente novamente!'})
    }

    // Verifica se existem erros
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{

        // Verifica se o email já existe
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {

            if(usuario) {

                req.flash("error_msg", "Este email já está em uso")
                res.redirect("/usuarios/registro")

            }else{

                // Schema de novo usuário
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    data_nascimento: req.body.data_nascimento,
                    genero: req.body.genero
                })

                // Geração de Hash
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => { //Valor que vai ser usado de base para o hash, Salt:sal, callback(erro, hash)
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }else{
                            novoUsuario.senha = hash
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário criado com sucesso!")
                                res.redirect("/")
                            }).catch(err => {
                                console.log(err)
                                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente")
                                res.redirect("/usuarios/registro")
                            })
                        }
                    })
                })

            }

        }).catch(err => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/usuarios")
        })

    
    }
})

router.get("/listagem", (req, res) => {
    Usuario.find().lean().then((usuarios) => {
        console.log(usuarios)
        res.render("usuarios/listagem", {usuarios:usuarios})
    }).catch(err => {
        console.log(err)
        req.flash("error_msg", "Nenhum usuário registrado")
        res.redirect("/usuarios")
    })
})

// Teste
router.post("/registro/teste", (req, res) => {
    let novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        data_nascimento: req.body.data_nascimento,
        genero: req.body.genero
    }

    console.log(novoUsuario)
    res.render("usuarios/teste", {usuario: novoUsuario})
})


// Rotas de Login
router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        successFlash: true,
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})


// Exportação
module.exports = router