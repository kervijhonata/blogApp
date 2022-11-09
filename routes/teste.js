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

module.exports = router