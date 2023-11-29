// Importando os módulos necessários
const express = require("express");
const route = express.Router();

// Importando o modelo de produto
const Produtos = require("../models/produtos");

// Rota para inclusão de produtos
route.post("/", async (req, res) => {
    var recebido = req.body; // Recebendo os dados do corpo da requisição
    console.log(recebido);   // Logando os dados recebidos
    var db = await Produtos.create(recebido); // Criando um novo produto no banco de dados

    console.log(db); // Logando a resposta do banco de dados
});

// Rota para selecionar todos os produtos
route.get("/", async (req, res) => {
    var data = await Produtos.find(); // Buscando todos os produtos no banco de dados
    return res.send(data); // Enviando os dados como resposta
});

// Rota para alterar um produto
route.put("/", async (req, res) => {
    // Desestruturando o corpo da requisição
    var { id, nome_produto, preco, quantidade, categoria, ativo } = req.body;

    // Verificando se o ID foi fornecido
    if (id == undefined)
        return res.send({ error: "Id não pode ser nulo" });

    try {
        var data = await Produtos.findById(id); // Buscando o produto pelo ID

        var dados = {
            nome_produto,
            preco,
            quantidade,
            categoria,
            ativo
        };

        await Produtos.findByIdAndUpdate(id, dados); // Atualizando o produto no banco de dados

        return res.send({ mensagem: "Produto alterado com sucesso." });
    }
    catch (err) {
        console.log(err); // Logando qualquer erro
        return res.send({ error: "Id não encontrado" });
    }
});

// Rota para deletar um produto
route.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id; // Recebendo o ID do produto
        const produto = await Produtos.findById(id); // Buscando o produto pelo ID

        // Verificando se o produto existe
        if (!produto) {
            return res.status(404).send({ error: "Produto não encontrado" });
        }

        await Produtos.findByIdAndRemove(id); // Removendo o produto do banco de dados
        return res.send({ message: "Produto removido com sucesso" });
    } catch (err) {
        console.log(err); // Logando qualquer erro
        return res.status(500).send({ error: "Erro ao deletar produto" });
    }
});

// Rota para registrar uma venda
route.post("/venda", async (req, res) => {
    const { id, quantidadeVendida } = req.body; // Recebendo o ID do produto e a quantidade vendida

    // Verificando se os dados necessários foram fornecidos
    if (!id || quantidadeVendida == undefined) {
        return res.status(400).send({ error: "ID do produto e quantidade são obrigatórios" });
    }

    try {
        const produto = await Produtos.findById(id); // Buscando o produto pelo ID

        // Verificando se o produto existe
        if (!produto) {
            return res.status(404).send({ error: "Produto não encontrado" });
        }

        // Verificando se a quantidade vendida é maior que a quantidade em estoque
        if (quantidadeVendida > produto.quantidade) {
            return res.status(400).send({ error: "Quantidade vendida excede o estoque" });
        }

        produto.quantidade -= quantidadeVendida; // Atualizando a quantidade do produto

        await produto.save(); // Salvando as alterações no banco de dados

        return res.send({ message: "Venda registrada com sucesso", produto });
    } catch (err) {
        console.log(err); // Logando qualquer erro
        return res.status(500).send({ error: "Erro ao registrar venda" });
    }
});

// Rota para buscar produtos por categoria
route.get("/categoria/:categoria", async (req, res) => {
    try {
        const produtos = await Produtos.find({ categoria: req.params.categoria }); // Buscando produtos pela categoria
        res.send(produtos); // Enviando os produtos como resposta
    } catch (err) {
        console.log(err); // Logando qualquer erro
        res.status(500).send({ error: "Erro ao buscar produtos por categoria" });
    }
});

// Exportando as rotas para serem utilizadas no aplicativo principal
module.exports = app => app.use("/produtos", route);