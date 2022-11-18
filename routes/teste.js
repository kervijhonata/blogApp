// Module Requirement
const express = require('express')
const router = express.Router()

// Rotas
router.get('/', (req, res) => {
    res.render("teste/index")
})

router.get('/flash', (req, res) => {
    req.flash('teste_resposta', 'Esta é uma resposta do Flash')
    res.render('teste/flash_test', {
        teste_resposta: req.flash('teste_resposta')
    })
})

router.get('/delete', (req, res) => {
    res.render('teste/delete_test')
})

router.get('/delete/:id', (req, res) => {
    res.send(`Deleting id ${req.params.id}`)
})

router.get("/form", (req, res) => {
    res.render("teste/form_contains")
})

router.post("/form", (req, res) => {
    
    let erros = []

    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
        erros.push({texto: "Nenhum valor para comparação foi recebido"})
    }

    if(!req.body.busca || typeof req.body.busca == undefined || req.body.busca == null) {
        erros.push({texto: "Nenhum valor de busca foi recebido"})
    }

    if(erros.length > 0) {
        res.render("teste/form_contains", {
            erros: erros,
            refill: {
                valor: req.body.valor,
                busca: req.body.buca
            }
        })
    }

    else {

        let valor = req.body.valor.toString();
        let busca = req.body.busca.toString();

        if(valor.includes(busca)){
            res.render("teste/form_contains", {resposta: `A Busca por "${req.body.busca}" em "${req.body.valor}" retornou como VERDADEIRO!`})
        }else{
            res.render("teste/form_contains", {resposta: `A Busca por "${req.body.busca}" em "${req.body.valor}" retornou como FALSO!`})
        }

    }
})

module.exports = router