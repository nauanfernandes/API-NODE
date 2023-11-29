// Importando o módulo mongoose configurado anteriormente
const mongoose = require('./database');

// Definindo um novo esquema para 'Venda' usando mongoose
const VendaSchema = new mongoose.Schema({
    pedido_id: {
        type: String,      // Definindo o tipo de dado para o campo 'pedido_id' como String
        required: true     // Tornando o campo 'pedido_id' obrigatório
    },
    email: {
        type: String,      // Definindo o tipo de dado para o campo 'email' como String
        required: true     // Tornando o campo 'email' obrigatório
    },
    itens: [{             // Definindo um array de itens para a venda
        produtoId: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar um produto
        quantidade: Number,     // Campo para armazenar a quantidade do item
        precoUnitario: Number,  // Campo para armazenar o preço unitário do item
        total: Number           // Campo para armazenar o total do item
    }],
});

// Criando o modelo 'Venda' baseado no esquema definido
const Venda = mongoose.model('Venda', VendaSchema);

// Exportando o modelo 'Venda'
module.exports = Venda;