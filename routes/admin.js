// Module Requirement
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose') //Importa o Mongoose
require('../models/Categoria') //Chama o Model
const Categoria = mongoose.model('categorias') //Atribui a referência da model à uma variável

// Routes
router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de Posts")
})

router.get('/categorias', (req, res, next) => {
    // Método find() busca todos os dados da collection
    // Método sort() organiza os dados em ordem, a partir de alguma coluna da collection
    // Método lean() converte Mongoose Document em Dados JSON

    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        console.log(categorias)
        res.render('admin/categorias', {categorias: categorias})
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({
            texto: "ERRO: Nome Inválido"
        })
    }

    if(req.body.nome.length < 2){
        erros.push({
            texto: "ERRO: Nome da categoria muito pequeno"
        })
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({
            texto: "ERRO: Slug Inválido"
        })
    }

    if(req.body.slug.length < 2){
        erros.push({
            texto: "ERRO: Slug para categoria muito pequeno"
        })
    }

    if(erros.length > 0){
        res.render("admin/addcategorias", {
            erros: erros
        })
    }else{
        //Recebe os dados do Post, da view 'addcategorias.handlebars'
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        // Instância da Model
        new Categoria({
            nome: novaCategoria.nome,
            slug: novaCategoria.slug
        }).save().then(() => {
            req.flash('success_msg', 'Categoria criada com Sucesso!') //Mensagem de Sucesso
            res.redirect('/admin/categorias') //Redireciona o usuário se o cadastro for efetuado
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao registrar categoria, tente novamente!') //Mensagem de Erro
            res.redirect('/admin')
        })  
    }
})

// Export
module.exports = router