const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now() // Passa um valor caso o usuário não insira
    }
})

mongoose.model('categorias', Categoria) //Cria um ponto de referência a 'categorias'