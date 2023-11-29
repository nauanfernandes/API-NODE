// Importando a função hashSync do módulo bcrypt para criptografia de senhas
const { hashSync } = require('bcrypt');

// Importando o módulo mongoose configurado anteriormente
const mongoose = require('./database');

// Usando a função de desestruturação para extrair 'Schema' de mongoose
const { Schema } = mongoose;

// Definindo um novo esquema para 'Usuarios' usando mongoose
const UsuariosSchema = new Schema({
    email: {
        type: String,      // Definindo o tipo de dado para o campo 'email' como String
        required: true     // Tornando o campo 'email' obrigatório
    },
    senha: String,        // Definindo um campo 'senha' como String
    chave: String,         // Definindo um campo 'chave' como String
    nome: String,         // Definindo um campo 'nome' como String
    endereco: String,         // Definindo um campo 'endereco' como String
    cidade: String,         // Definindo um campo 'cidade' como String
    estado: String         // Definindo um campo 'estado' como String
});

// Criando o modelo 'Usuario' baseado no esquema definido
const Usuario = mongoose.model('Usuario', UsuariosSchema);

// Exportando o modelo 'Usuario'
module.exports = Usuario;