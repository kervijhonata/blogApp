// Sistema de Autenticação

// Modules Requirement
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Models
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {

            // Nenhuma conta encontrada
            if(!usuario) {
                return done(null, false, {message: "Esta conta não existe!"}) 
                /**
                 * Done retorna 3 parâmetros:
                 *  1 - Dados após autenticação :: null para nenhuma conta autenticada
                 *  2 - Autenticação teve sucesso :: true || false
                 *  3 - Mensagem de aviso da autenticação
                 */
            }

            bcrypt.compare(senha, usuario.senha, (erro, senhasCoincidem) => { // Comapra dois valores encriptados :: value && hash 
                
                // return senhasCoincidem ? done(null, usuario) : done(null, false, {message: "Senha incorreta"})
                if(erro){
                    return done(erro)
                }
                if(senhasCoincidem) {
                    return done(null, usuario, {message: `Bem vindo(a), ${usuario.nome}!`})
                }
                else{
                    return done(null, false, {message: "Senha incorreta, tente novamente"})
                }
            }) 
            
        }).catch(err => {
            console.log(err)
        })
    }))

    //Salva os dados do usuário na sessão
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    //remove os dados do usuário na sessão
    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    }) 
}