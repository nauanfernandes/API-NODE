// Importando o módulo nodemailer para envio de emails
const nodemailer = require('nodemailer')

// Criando um transportador para enviar e-mails usando o serviço do Gmail
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nauancontatos@gmail.com", // Endereço de e-mail do remetente
        pass: "dgzu wdcr vlyj zlqk"        // Senha do e-mail do remetente
    }
});

// Função para enviar-email ao novo usuário
var RegistrarUsuario = async (email, chave) => {
    try {
        // Objeto de mensagem com as informações do e-mail
        let message = {
            from: 'SISTEMA AÇOGUE',  // Remetente do e-mail
            to: email,             // Destinatário do e-mail
            subject: 'AÇOGUE - Criação de usuário', // Assunto do e-mail
            // Corpo do e-mail em HTML
            html: `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bem-Vindo ao Nosso Site</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .button {
                        background-color: #4caf50;
                        color: white;
                        padding: 14px 20px;
                        margin: 20px 0;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Bem-Vindo ao Nosso Site!</h2>
                    <p>Um novo usuário foi criado para você.</p>
                    <p>Se você recebeu um código de verificação, insira o seguinte código durante o processo de criação de senha: <strong>${chave}</strong>.</p>
                    <p>Obrigado por se juntar a nós!</p>
                </div>
            </body>
            </html>
                        
            `
        };

        // Enviando o e-mail e aguardando a resposta
        let info = await transporter.sendMail(message);
        console.log('Message sent successfully as %s', info.messageId); // Log de sucesso
    }
    catch (error) {
        console.log(error) // Log de erro caso o envio falhe
    }
}

// Função para enviar e-mail de pedido de compra
var ConfirmaPedido = async (email, chave, nomeProduto, quantidadeProduto, categoriaProduto, total) => {
    try {
        // Objeto de mensagem com as informações do e-mail
        let message = {
            from: 'SISTEMA - AÇOGUE',  // Remetente do e-mail
            to: email,        // Destinatário do e-mail
            subject: 'AÇOGUE - PEDIDO DE COMPRA', // Assunto do e-mail
            // Corpo do e-mail em HTML
            html: `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PEDIDO DE COMPRA</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .button {
                        background-color: #4caf50;
                        color: white;
                        padding: 14px 20px;
                        margin: 20px 0;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Segue seu pedido de compra</h2>
                    <p>Produto: <strong>${nomeProduto}</strong>
                    <p>Quantidade: <strong>${quantidadeProduto}</strong>
                    <p>Categoria: <strong>${categoriaProduto}</strong>
                    <p>Total: <strong>${total}</strong>
                    <p>Insira o seguinte código durante o processo de formalização de venda: <strong>${chave}</strong>.</p>
                    <p>Obrigado por comprar conosco!</p>
                </div>
            </body>
            </html>
                        
            `
        };

       // Enviando o e-mail e aguardando a resposta
       let info = await transporter.sendMail(message);
       console.log('Message sent successfully as %s', info.messageId); // Log de sucesso
   }
   catch (error) {
       console.log(error) // Log de erro caso o envio falhe
   }
}

var FinalizaPedido = async (email, pedido) => {
    try {
        // Objeto de mensagem com as informações do e-mail
        let message = {
            from: 'SISTEMA - AÇOGUE',  // Remetente do e-mail
            to: email,        // Destinatário do e-mail
            subject: 'AÇOGUE - COMPRA CONFIRMADA', // Assunto do e-mail
            // Corpo do e-mail em HTML
            html: `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PEDIDO DE COMPRA</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .button {
                        background-color: #4caf50;
                        color: white;
                        padding: 14px 20px;
                        margin: 20px 0;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>PEDIDO DE COMPRA CONFIRMADO</h2>
                    <p>VENDA FORMALIZADA, DO PEDIDO Nº <strong>${pedido}</strong>
                    <p>Obrigado por comprar conosco!</p>
                </div>
            </body>
            </html>
                        
            `
        };

       // Enviando o e-mail e aguardando a resposta
       let info = await transporter.sendMail(message);
       console.log('Message sent successfully as %s', info.messageId); // Log de sucesso
   }
   catch (error) {
       console.log(error) // Log de erro caso o envio falhe
   }
}
// Exportando as funções
module.exports = { RegistrarUsuario, ConfirmaPedido, FinalizaPedido }