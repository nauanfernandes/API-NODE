// Importando o módulo mongoose configurado anteriormente
const mongoose = require('./database');

// Definindo um novo esquema para 'Pedido' usando mongoose
const PedidoSchema = new mongoose.Schema({
    email: {
        type: String,      // Definindo o tipo de dado para o campo 'email' como String
        required: true     // Tornando o campo 'email' obrigatório
    },
    itens: [{             // Definindo um array de itens para o pedido
        produtoId: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar um produto
        quantidade: Number,     // Campo para armazenar a quantidade do item
        precoUnitario: Number,  // Campo para armazenar o preço unitário do item
        total: Number           // Campo para armazenar o total do item
    }],
    chave: String          // Campo adicional 'chave', como uma String
});

// Criando o modelo 'Pedido' baseado no esquema definido
const Pedido = mongoose.model('Pedido', PedidoSchema);

// Exportando o modelo 'Pedido'
module.exports = Pedido;