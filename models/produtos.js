// Importando o módulo mongoose configurado anteriormente
const mongoose = require('./database');

// Usando a função de desestruturação para extrair 'Schema' de mongoose
const { Schema } = mongoose;

// Definindo um novo esquema para 'Produtos' usando mongoose
const ProdutosSchema = new Schema({
    nome_produto: {
        type: String,      // Definindo o tipo de dado para o campo 'nome_produto' como String
        required: true     // Tornando o campo 'nome_produto' obrigatório
    },
    preco: {
        type: Number,      // Definindo o tipo de dado para o campo 'preco' como Number
        required: true     // Tornando o campo 'preco' obrigatório
    },
    quantidade: {
        type: Number,      // Definindo o tipo de dado para o campo 'quantidade' como Number
        required: true,    // Tornando o campo 'quantidade' obrigatório
        min: 0             // Definindo o valor mínimo para o campo 'quantidade'
    },
    categoria: { 
        type: String,      // Definindo o tipo de dado para o campo 'categoria' como String
        default: true      // Definindo um valor padrão para o campo 'categoria'
    },
    ativo: { 
        type: Boolean,     // Definindo o tipo de dado para o campo 'ativo' como Boolean
        default: true      // Definindo um valor padrão para o campo 'ativo'
    }
});

// Criando o modelo 'Produtos' baseado no esquema definido
const Produto = mongoose.model('Produtos', ProdutosSchema);

// Exportando o modelo 'Produto'
module.exports = Produto;