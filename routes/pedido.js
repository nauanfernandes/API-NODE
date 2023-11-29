// Importando os módulos necessários
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const Email = require("../components/email");
const bcrypt = require('bcrypt');

// Carregando variáveis de ambiente
require('dotenv/config');

// Importando os modelos de usuário, produto, venda e pedido
const Usuario = require('../models/usuario');
const Produto = require('../models/produtos');
const Venda = require('../models/venda');
const Pedido = require('../models/pedido');

// Rota para enviar um pedido
route.post("/enviapedido", async (req, res) => {
    // Desestruturando o corpo da requisição
    const { email, senha, id_produto, quantidade } = req.body;

    // Verificando se o e-mail foi fornecido
    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"});

    // Verificando se a senha foi fornecida
    if (!senha)
        return res.send({ msg: "Campo senha é obrigatório"});

    // Buscando usuário no banco de dados
    var usuario = await Usuario.findOne({ email });

    // Verificando se o usuário existe
    if (!usuario)
        return res.send({ msg: "Usuário ou senha inválido"});

    // Comparando a senha fornecida com a senha armazenada
    var valida_senha = await bcrypt.compare(senha, usuario.senha);

    if (!valida_senha)
        return res.send({ msg: "Usuário ou senha inválido"});

    // Gerando token JWT
    var dados = { id: usuario.id, email: usuario.email };
    var chave = process.env.TOKEN_KEY;
    var tempo = { expiresIn: 60 * 1000 }; // 1 minuto
    var token = await jwt.sign(dados, chave, tempo);

    // Gerando chave aleatória para o pedido
    var numero = [
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9)
    ];
    numero = numero.join('');

    // Verificando se o produto existe
    const produto = await Produto.findById(id_produto);
    if (!produto) {
        return res.status(404).send({ msg: "Produto não encontrado" });
    }

    // Calculando o total do pedido
    const precoTotal = produto.preco * quantidade;

    // Criando um novo pedido
    const novoPedido = await Pedido.create({
        email: email,
        itens: [{ produtoId: produto._id, quantidade, precoUnitario: produto.preco, total: precoTotal }],
        chave: numero
    });

    // Detalhes do pedido para enviar por e-mail
    const detalhesPedido = {
        nomeProduto: produto.nome_produto,
        quantidade: quantidade,
        precoUnitario: produto.preco,
        categoria: produto.categoria,
        total: precoTotal
    };

    // Enviando e-mail de confirmação do pedido
    Email.ConfirmaPedido(email, numero, detalhesPedido.nomeProduto, detalhesPedido.quantidade, detalhesPedido.categoria, detalhesPedido.total);

    return res.send({ token, novoPedido });
});

// Rota para formalizar uma venda
route.post("/formalizaVenda", async (req, res) => {
    // Desestruturando o corpo da requisição
    const { email, senha, id_pedido, chave_compra } = req.body;

    // Verificações de email e senha
    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"});
    if (!senha)
        return res.send({ msg: "Campo senha é obrigatório"});

    // Buscando usuário e validando senha
    var usuario = await Usuario.findOne({ email });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha)))
        return res.send({ msg: "Usuário ou senha inválido"});

    // Gerando token JWT
    var dados = { id: usuario.id, email: usuario.email };
    var chave = process.env.TOKEN_KEY;
    var tempo = { expiresIn: 60 * 1000 }; // 1 minuto
    var token = await jwt.sign(dados, chave, tempo);

    // Verificando se o pedido existe e se a chave é válida
    const pedidoToVenda = await Pedido.findById(id_pedido);
    if (!pedidoToVenda || chave_compra != pedidoToVenda.chave || email != pedidoToVenda.email) {
        return res.status(404).send({ msg: "Chave ou login inválido" });
    } else {
        // Criando uma nova venda
        const novaVenda = await Venda.create({
            pedido_id: id_pedido,
            email: email,
            itens: pedidoToVenda.itens
        });
    }
    Email.FinalizaPedido(email,id_pedido);
    return res.send({ token, pedidoToVenda });
});

// Rota para obter itens comprados, ordenados por cliente
route.get("/ComprasItensCliente", async (req, res) => {
    try {
        // Agregando dados para criar um resumo de compras
        const resumoCompras = await Venda.aggregate([
            { $unwind: '$itens' }, // Desestrutura o array de itens
            { $group: { 
                _id: { email: '$email', produtoId: '$itens.produtoId' }, // Agrupa por e-mail e ID do produto
                quantidadeTotal: { $sum: '$itens.quantidade' } // Soma a quantidade total de cada produto para cada cliente
            }},
            { $lookup: {
                from: 'produtos', // Nome da coleção de produtos
                localField: '_id.produtoId',
                foreignField: '_id',
                as: 'produtoInfo'
            }},
            { $unwind: '$produtoInfo' }, // Desestrutura o resultado do lookup
            { $project: { 
                _id: 0,
                produto: '$produtoInfo.nome_produto',
                email: '$_id.email',
                quantidadeTotal: 1
            }} // Seleciona apenas os campos desejados
        ]);

        res.send(resumoCompras);
    } catch (error) {
        res.status(500).send({ msg: "Erro ao buscar resumo de compras", error: error.message });
    }
});

// Rota para obter o histórico de compras de um cliente
route.post("/historicoComprasCliente", async (req, res) => {
    const { email } = req.body; // Recebe o e-mail do cliente

    if (!email) {
        return res.status(400).send({ msg: "E-mail do cliente é obrigatório" });
    }

    try {
        // Buscando o histórico de compras
        const historicoCompras = await Venda.find({ email: email }).populate({
            path: 'pedido_id',
            populate: {
                path: 'itens.produtoId',
                model: 'Produtos' // Nome do modelo de produtos
            }
        });

        res.send(historicoCompras);
    } catch (error) {
        res.status(500).send({ msg: "Erro ao buscar histórico de compras", error: error.message });
    }
});

// Exportando as rotas para serem utilizadas no aplicativo principal
module.exports = app => app.use("/pedido", route);