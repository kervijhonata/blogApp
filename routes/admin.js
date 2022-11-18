// Module Requirement
const express = require('express')
const router = express.Router()

const mongoose = require('mongoose') //Importa o Mongoose
require('../models/Categoria') //Chama o Model
require('../models/Postagem')
const Categoria = mongoose.model('categorias') //Atribui a referência da model à uma variável
const Postagem = mongoose.model('postagens')

// Routes
router.get('/', (req, res) => {
    res.render("admin/index")
})

// Rota: Exibir categorias
router.get('/categorias', (req, res, next) => {
    // Método find() busca todos os dados da collection
    // Método sort() organiza os dados em ordem, a partir de alguma coluna da collection
    // Método lean() converte Mongoose Document em Dados JSON

    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        // console.log(categorias)
        res.render('admin/categorias', {categorias: categorias})
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch(err => {
        req.flash("error_msg", "Categoria selecionada não existe")
        res.redirect('/admin/categorias')
    })
})

// Rota: Editar categorias (Validação)
router.post('/categorias/edit', (req, res) => {
    
    let erros = [];

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
        Categoria.find().lean().then( (categorias) => {
            res.render('admin/categorias', {
                categorias: categorias,
                erros: erros
            })
        }).catch( err => {
            req.flash("error_msg", "Erro interno, por favor, atualize a página")
            res.redirect("/admin/categorias")
        })

    }else{
        Categoria.findOne({_id: req.body.id}).then( (categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save()
            .then(() => {
                req.flash('success_msg', 'Categoria editada com Sucesso!') //Mensagem de Sucesso
                res.redirect('/admin/categorias') //Redireciona o usuário se o cadastro for efetuado
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao editar categoria.') //Mensagem de Erro
                res.redirect("/admin/categorias")
            })
        })
    }
})

// Rota: Cadastrar categoria
router.post('/categorias/nova', (req, res) => {

    let erros = [];

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
            res.redirect('/admin/categorias')
        })  
    }
})

// Rota: Deletar Categorias
router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com Sucesso")
        res.redirect("/admin/categorias")
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

    // Rotas de Postagens
// Rota: Exibir postagens
router.get('/postagens', (req, res) => {
    Postagem.find().lean().populate({path: 'categoria', strictPopulate: false}).sort({data: 'desc'}).then( (postagens) => {
        // console.log(postagens)
        res.render("admin/postagens", {
            postagens: postagens
        })

    }).catch( err => {
        console.log(err)
        req.flash("error_msg", "Não foi possível listar Postagens")
        res.redirect('/admin')
    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then( (categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch(err => {
        req.flash("error_msg", "Não foi possível listar categorias")
        res.redirect('/admin')
    })
})

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then( (postagem) => {

        Categoria.find().lean().then( (categorias) => {

            res.render("admin/editpostagem", {
                postagem: postagem,
                categorias: categorias
            })

        }).catch(err => {
            req.flash("error_msg", "Não foi possível listar categorias")
            res.redirect('/admin')
        })
        
    }).catch(err => {
        req.flash("error_msg", "Postagem não existente")
        res.redirect('/admin')
    })
})

router.post('/postagens/edit', (req, res) => {
    Postagem.findOne({_id: req.body.id}).then( (postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash('success_msg', 'Postagem editada com Sucesso!') //Mensagem de Sucesso
            res.redirect('/admin/postagens') //Redireciona o usuário se o cadastro for efetuado
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao editar postagens.') //Mensagem de Erro
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash('error_msg', 'Nenhuma postagem relacionada foi encontrada para ser editada.') //Mensagem de Erro
        res.redirect("/admin/postagens")
    })

})

// Deletar postagem
router.post("/postagens/deletar", (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((resultado)=>{

        Postagem.deleteOne(resultado).then(()=>{
            // console.log(req.body.id)
            req.flash("success_msg", "Postagem deletada com Sucesso")
            res.redirect("/admin/postagens")
        }).catch( err => {
            req.flash("error_msg", "Nenhuma postagem relacionada foi encontrada para ser excluida.")
            res.redirect("/admin/postagens")
        })

    }).catch(err => console.log(err))

})

router.post('/postagens/nova', (req, res) => {

    //Validação
    let erros = [];
    // titulo
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){erros.push({texto: "ERRO: Título inválido ou vazio"})}
    if(req.body.titulo.length < 2){ erros.push({texto: "Titulo da postagem muito pequeno"})}
    // slug 
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){erros.push({texto: "ERRO: Slug inválida ou vazia"})}
    if(req.body.slug.length < 2){ erros.push({texto: "Slug da postagem muito pequeno"})}
    // descricao
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){erros.push({texto: "ERRO: Descrição inválida ou vazia"})}
    if(req.body.descricao.length < 2){ erros.push({texto: "Slug da postagem muito pequeno"})}
    // conteudo
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){erros.push({texto: "ERRO: Conteúdo inválida ou vazio"})}
    if(req.body.conteudo.length < 2){ erros.push({texto: "Conteúdo da postagem muito pequeno"})}
    // categoria
    if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null){erros.push({texto: "ERRO: Categoria inválida ou vazio"})}
    if(req.body.categoria == "0"){ erros.push({texto: "Categoria inválida, registe uma categoria"})}

    // array possui registro
    if(erros.length > 0){
        res.render('/admin', {
            erros: erros
        })
    }else{
    //Criação da postagem
    let novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    }
    console.log(novaPostagem)

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com Sucesso!")
            res.redirect("/admin/postagens")
        }).catch(err => {
            req.flash("error_msg", "Erro durante o salvamento da postagem")
            console.log(err)
            res.redirect("/admin/postagens")
        })
    }
})


// Export
module.exports = router