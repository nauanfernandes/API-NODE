// Importando o módulo Express
const express = require('express');
// Criando uma instância do Express
const app = express();
// Importando o middleware personalizado
const middleware = require("./middleware");

// Configurando o Express para interpretar JSON no corpo das requisições
app.use(express.json());

// Importando e configurando as rotas de login
require("./routes/login")(app);
// Importando e configurando as rotas de pedido
require("./routes/pedido")(app);

// Aplicando o middleware personalizado às rotas subsequentes
app.use(middleware);

// Importando e configurando as rotas de produtos
require("./routes/produtos")(app);

app.use((err, req, res, next) => {
    console.error(err); // Log do erro
    res.status(500).send('Ocorreu um erro interno do servidor');
});

// Inicializando o servidor na porta 3001
app.listen(3001, function() {
    console.log("Servidor ligado"); // Logando a inicialização do servidor
});