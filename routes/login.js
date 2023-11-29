// Importando os módulos necessários
const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const Email = require("../components/email");
const bcrypt = require('bcrypt');

// Carregando variáveis de ambiente
require('dotenv/config');

// Importando o modelo de usuário
const Usuario = require('../models/usuario');

// Rota para login
route.post("/login", async (req, res) => {
    const { email, senha } = req.body;

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

    // Criando o payload do token
    var dados = {
        id: usuario.id,
        email: usuario.email
    };

    // Chave secreta para o token
    var chave = process.env.TOKEN_KEY;

    // Configuração de tempo de expiração do token
    var tempo = { expiresIn: 60 * 1000 }; // 1 minuto
    
    // Gerando o token
    var token = await jwt.sign(dados, chave, tempo);

    return res.send({ token });
});

// Rota para registro de usuário
route.post("/register", async (req, res) => {
    const { email, nome, endereco, cidade, estado } = req.body;

    // Verificando se o e-mail foi fornecido
    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"});

    // Verificando se o e-mail já existe no banco de dados
    const emailExistente = await Usuario.findOne({ email });
    if (emailExistente) {
        return res.status(400).send({ msg: "E-mail já cadastrado" });
    }

    // Gerando uma chave aleatória
    var numero = [
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9)
    ];
    numero = numero.join('');

    // Enviando e-mail de registro
    Email.RegistrarUsuario(email, numero, nome, endereco, cidade, estado);
    
    // Criando um novo usuário no banco de dados
    var usuario = await Usuario.create({ email, chave: numero, nome, endereco, cidade, estado });
    return res.send(usuario);
});


// Rota para alteração de senha
route.post("/alterarsenha", async (req, res) => {
    const { email, senha, confirma, chave } = req.body;

    // Verifica se o email foi fornecido
    if (email == undefined) {
        return res.send({ msg: "Email não pode ser nulo"});
    }
    // Outras condições...
    
    // Confirma se a senha e a confirmação são iguais
    if (senha != confirma) {
        return res.send({ msg: "Senha e confirma senha não são iguais"});
    }

    // Busca o usuário pelo e-mail
    var dados = await Usuario.find({ email });

    // Verifica se a chave é válida
    if (chave != dados[0].chave) {
        return res.send({ msg: "A chave informada não é válida."});
    }

    // Criptografa a nova senha
    var hash = await bcrypt.hash(senha, 10);

    // Atualiza a senha do usuário
    dados[0].chave = null;
    dados[0].senha = hash;

    try {
        // Salva o usuário com a nova senha
        await dados[0].save();
        return res.send({ msg: "Senha alterada com sucesso."});
    } catch (err) {
        console.log(err);
        return res.send({ msg: "Ops! Ocorreu algum erro"});
    }
});

// Exporta a rota para ser usada no aplicativo principal
module.exports = app => app.use("/api", route);