
/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 * To run this code, you must do the following:
 *
 * 1. Deploy this code to a server running Node.js
 * 2. Run `npm install`
 * 3. Update the VERIFY_TOKEN
 * 4. Add your PAGE_ACCESS_TOKEN to your environment vars
 *
 */

'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 8080, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body,
  listen = false;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        let msg_nlp = webhook_event.message.nlp.entities;
        console.log('Sender ID: ' + sender_psid);
        console.log('Intent: ' + JSON.stringify(msg_nlp["intent"]));
        console.log('Amount XEM: ' + JSON.stringify(msg_nlp["number"]));
        console.log('Recipient: ' + JSON.stringify(msg_nlp["contact"]));
        console.log('Recipient: ' + JSON.stringify(msg_nlp["greetings"]));
        handleMessage(sender_psid, webhook_event.message, msg_nlp);  
            
      } else if (webhook_event.postback) {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        handlePostback(sender_psid, webhook_event.postback);

      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "<YOUR VERIFY TOKEN>";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message,msg_nlp) {
  let response;
  // Checks if the message contains text
  if (received_message.text && msg_nlp !== undefined) {    
  // Create the payload for a basic text message, which
  // will be added to the body of our request to the Send AP
    if (msg_nlp["intent"][0]["value"] == "send"){
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Confirm transaction:",
              "subtitle":`Send ${msg_nlp["number"][0]["value"]} XEM to ${msg_nlp["contact"][0]["value"]}`,
              "buttons":[
                {
                  "type":"postback",
                  "title":"Send XEM",
                  "payload":"send"
                },
                {
                  "type":"postback",
                  "title":"Cancel transaction",
                  "payload":"cancel"
                }
              ]
            }]
          }
        }
      };
    }
    else if (msg_nlp["intent"][0]["value"] == "request"){
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Confirm transaction:",
              "subtitle":`Request ${msg_nlp["number"][0]["value"]} XEM from ${msg_nlp["contact"][0]["value"]}`,
              "buttons":[
                {
                  "type":"postback",
                  "title":"Send XEM",
                  "payload":"send"
                },
                {
                  "type":"postback",
                  "title":"Cancel transaction",
                  "payload":"cancel"
                }
              ]
            }]
          }
        }
      };
    }
    else if(msg_nlp["greetings"][0]["value"] == "true"){
      response = {
        "message": {
          "text": 'Hi there!\nTry "send 100 XEM to John Doe", or "Request 100 XEM from Jane Doe". '
        }
      }
    }
  }else {
    response = {
      "message": {
        "text": 'Sorry, I do not understand what you wrote. Please try again!\nTry "send 100 XEM to John Doe", or "Request 100 XEM from Jane Doe". '
      }
    }
  }
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response, nextState;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'send') {
    response = { "text": "Payment sent" }; //TODO: CREATE PAYMENT JSON
    
  } else if (payload === 'cancel') {
    response = { "text": "Payment canceled" }; //TODO: CREATE PAYMENT JSON
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}