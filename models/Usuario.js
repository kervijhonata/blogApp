const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    data_nascimento: {
        type: Date,
        required: true
    },
    genero: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        default: 0
    }
})

mongoose.model('usuarios', Usuario)