// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {Image} = require('dialogflow-fulfillment');

const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
admin.initializeApp();
const db = admin.firestore();

//Funzione utile a salvare i file all'interno del database.
//Salva ID utente, nome utente, messaggio e orario in cui ha inviato il messaggio.
function saveToDatabase(collection, ID, name, message, time){
  db.collection(collection).add({
    ID: ID,
    name: name,
    message: message,
    time: time
  });
}

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  var bodyReq = request.body;
  
  //Stampa il messaggio di benvenuto, ricavando il nome da Telegram.
  function welcome(agent) {
    const imageUrl = 'https://i.imgur.com/9yiHOKz.jpg';
    let image = new Image(imageUrl);
    const anotherImage = new Image({
    	imageUrl: imageUrl,
    platform: 'TELEGRAM'
    });
	agent.add(new Image(image));
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    agent.add(`Ciao ${name}, sono Relaxy, il tuo amico che ti aiuta ad alleviare la sensazione di ansia in pochi minuti.😎\nP.S. Sono ancora in fase di sviluppo, quindi potrei non essere perfetto durante la nostra conversazione, ma farò del mio meglio. 💪\n`);
  	agent.add(`Posso chiederti come stai? Spero tutto bene!😊`);
  }
  
  //Funzione che salva i messaggi dell'utente dove elenca
  //le 5 cose che percepisce con la vista.
  function saveMessageVista(agent) {
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    const time = new Date();
    saveToDatabase("vista", bodyReq.originalDetectIntentRequest.payload.data.from.id, name, bodyReq.queryResult.queryText, time);
  }
  
  //Funzione che salva i messaggi dell'utente dove elenca
  //le 4 cose che percepisce con il tatto.
  function saveMessageTatto(agent) {
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    const time = new Date();
    saveToDatabase("tatto", bodyReq.originalDetectIntentRequest.payload.data.from.id, name, bodyReq.queryResult.queryText, time);
  }
  
  //Funzione che salva i messaggi dell'utente dove elenca
  //le 3 cose che percepisce con l'udito.
  function saveMessageUdito(agent) {
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    const time = new Date();
    saveToDatabase("udito", bodyReq.originalDetectIntentRequest.payload.data.from.id, name, bodyReq.queryResult.queryText, time);
  }
  
  //Funzione che salva i messaggi dell'utente dove elenca
  //le 2 cose che percepisce con l'olfatto.
  function saveMessageOlfatto(agent) {
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    const time = new Date();
    saveToDatabase("olfatto", bodyReq.originalDetectIntentRequest.payload.data.from.id, name, bodyReq.queryResult.queryText, time);
  }
  
  //Funzione che salva i messaggi dell'utente dove elenca
  //le cosa che percepisce con il gusto.
  function saveMessageGusto(agent) {
    const name = bodyReq.originalDetectIntentRequest.payload.data.from.first_name;
    const time = new Date();
    saveToDatabase("gusto", bodyReq.originalDetectIntentRequest.payload.data.from.id, name, bodyReq.queryResult.queryText, time);
  }
  
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  //Associamo le funzioni scritte precedentemente
  //agli intent.
  intentMap.set('Welcome_Intent', welcome);
  intentMap.set('Vista4', saveMessageVista);
  intentMap.set('Vista3', saveMessageVista);  
  intentMap.set('Vista2', saveMessageVista);
  intentMap.set('Vista1', saveMessageVista);
  intentMap.set('VistaFinished', saveMessageVista);  
  intentMap.set('Tatto3', saveMessageTatto);  
  intentMap.set('Tatto2', saveMessageTatto);
  intentMap.set('Tatto1', saveMessageTatto);
  intentMap.set('TattoFinished', saveMessageTatto);
  intentMap.set('Udito2', saveMessageUdito);
  intentMap.set('Udito1', saveMessageUdito);
  intentMap.set('UditoFinished', saveMessageUdito);
  intentMap.set('Olfatto1', saveMessageOlfatto);
  intentMap.set('OlfattoFinished', saveMessageOlfatto);
  intentMap.set('GustoFinished', saveMessageGusto);

  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
