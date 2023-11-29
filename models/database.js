// Importando o módulo mongoose para interagir com o MongoDB
const mongoose = require("mongoose");

try {
    // Definindo a URI de conexão com o banco de dados MongoDB
    const uri = "mongodb+srv://dbnauan:dbnauan1@nauan.sojtcsm.mongodb.net/ACOGUE"

    // Conectando ao MongoDB usando a URI definida
    mongoose.connect(uri, {
        useNewUrlParser: true,          // Usar o novo analisador de URL do MongoDB
        useUnifiedTopology: true        // Usar a nova descoberta e monitoramento de servidor
    });    
}
catch (err) {
    console.log(err); // Captura e loga qualquer erro durante a tentativa de conexão
}

// Configurando mongoose para usar Promises globais do Node.js
mongoose.Promise = global.Promise;

// Exportando o mongoose
module.exports = mongoose;