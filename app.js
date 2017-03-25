var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

//
app.get('/politica-de-privacidade/', function(req, res) {
    res.send('politica-de-privacidade');
});

//verifica webhook
app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'bot-msg') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});
app.post('/webhook/', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});

//recebimento da mensagem
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case '1':
                var text = "💰 Empregos e Negócios\n 16 - Empregos\n 17 - Negócios";
                sendTextMessage(senderID, text);
                break;
            case '16':
                sendGenericMessage(senderID,"Empregos","Empregos para todas as areas","http://gcn.net.br/dir-arquivo-imagem/2016/02/20160222091544_58751392.png","http://google.com.br");
                break;
            case '2':
                var text = "⚠ Produtos na promoção\n Produtos em promoção...";
                sendTextMessage(senderID, text);
                break;
            case '3':
                var text = "🍽 Pizzarias e Restaurantes\n 18 - Pizzaria\n 19 - Restaurantes";
                sendTextMessage(senderID, text);
                break;
            case '4':
                var text = "🍹 Bares e Baladas\n 20 - Bares\n 21 - Baladas";
                sendTextMessage(senderID, text);
                break;
            case '5':
                var text = "🛍 Mercados e Padarias\n 22 - Mercados\n 23 - Padarias";
                sendTextMessage(senderID, text);
                break;
            case '6':
                var text = "🏨 Farmácias e Clinicas\n 24 - Farmácias\n 25 - Clinicas";
                sendTextMessage(senderID, text);
                break;
            case '7':
                var text = "🏪 Hotéis e Moteis\n 26 - Hoteis\n 27 - Moteis";
                sendTextMessage(senderID, text);
                break;
            case '8':
                var text = "📚 Escolas e Cursos\n 28 - Escolas\n 29 - Cursos";
                sendTextMessage(senderID, text);
                break;
            case '9':
                var text = "🏠 Serviços Imobiliário\n 30 - Imobiliarias da Região";
                sendTextMessage(senderID, text);
                break;
            case '10':
                var text = "🔐 Serviços Residencias\n 31 - Prestadores de Serviços residenciais!";
                sendTextMessage(senderID, text);
                break;
            case '11':
                var text = "⚙ Mecânica e Auto Peças\n 32 - Mecânica\n 35 - Auto Peças";
                sendTextMessage(senderID, text);
                break;
            case '12':
                var text = "🚉 Transporte Publico\n 33 Pontos do transporte publico!";
                sendTextMessage(senderID, text);
                break;
            case '13':
                var text = "🚖 Serviços de Taxis\n 34 - Serviços de Taxi na cidade...";
                sendTextMessage(senderID, text);
                break;
            case '14':
                var text = "💪 Academias e Suplementos\n 35 - Academias\n 36 - Suplementos";
                sendTextMessage(senderID, text);
                break;
            case '15':
                var text = "🏢 Shopping Center\n 37 - Shopping mais proximo da região...";
                sendTextMessage(senderID, text);
                break;
            default:
                sendTextMessage(senderID, "Olá seja bem vindo (a) ao *ZAP GUIA - Praia Grande-SP. Feito para você consumidor encontrar os melhores lugares e serviços da nossa cidade 24 horas. Nosso GUIA também está no WhatsApp participe (1399770-4980)\n \nO que Desejar Buscar 🎯\n 01 - 💰 Empregos e Negócios\n02 - ⚠ Produtos na promoção\n03 - 🍽 Pizzarias e Restaurantes\n04 - 🍹 Bares e Baladas\n05 - 🛍 Mercados e Padarias\n06 - 🏨 Farmácias e Clinicas\n07 - 🏪 Hotéis e Moteis\n08 - 📚 Escolas e Cursos\n09 - 🏠 Serviços Imobiliário\n10 - 🔐 Serviços Residencias\n11 - ⚙ Mecânica e Auto Peças\n12 - 🚉 Transporte Publico\n13 - 🚖 Serviços de Taxis\n14 - 💪 Academias e Suplementos\n15 - 🏢 Shopping Center");

        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

//Mensagem com estrutura de template generic
function sendGenericMessage(recipientId,titulo,sub,url,link) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: titulo,
                        subtitle: sub,
                        image_url: url,
                        buttons: [{
                            type: "web_url",
                            url: link,
                            title: "Acessar Site"
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

//Envio de mensagem de texto
function sendTextMessage(recipientId, messageText) {
    var messageData1 = {
        recipient: {
            id: recipientId
        },
        message: {
            text:messageText
        }
    };
    callSendAPI(messageData1);
}

function sendImageMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"image",
                payload:{
                    url:"https://mir-cdn.behance.net/v1/rendition/project_modules/max_1200/14f77c49206309.58addbf0e1562.jpeg"
                }
            }
        }
    };
    callSendAPI(messageData);
}

//função para envio da mensagem
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: "EAATN8ZBp6oHgBALIhL3pWbZANpSZAz0QiRFGYRTi5nbLhFx7WXrSZCk4Wbnq3ZAKELaOd0BxiMAFzwYGyoWfZB94Jv6DlMoq0Dmz9vHryZB7ULCap0Ipk23W7byj1pegPRL392ZCEGHwdemPUZAfpTTwmO7lt9aiA4DYl8sdiuEHfhAZDZD" },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

app.listen(process.env.PORT);
