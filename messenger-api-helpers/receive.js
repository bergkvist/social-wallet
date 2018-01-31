/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== MESSENGER =============================================================
import sendApi from './send';

// ===== STORES ================================================================
import db from '../models';

// ===== NLP ================================================================
import parseMessage from '../nlp/parse';

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = async (event) => {
  /**
   * The 'payload' param is a developer-defined field which is
   * set in a postbackbutton for Structured Messages.
   *
   * In this case we've defined our payload in our postback
   * actions to be a string that represents a JSON object
   * containing `type` and `data` properties. EG:
   */
  const payload = await JSON.parse(event.postback.payload);
  const { type } = payload;
  const senderId = event.sender.id;

  // Perform an action based on the type of payload received.
  switch (type) {
  case 'GET_STARTED':
    sendApi.sendWelcomeMessage(senderId);
    break;
  case 'send':
  console.log('"""""""""""""""""""""""""""""""""""""');
  console.log(payload);
    const { receiverId, amount } = payload;
    const fromUser = await db.Users.getByMessengerId(senderId);
    const toUser = await db.Users.getByMessengerId(receiverId);
    const result = await fromUser.sendXEM(amount, toUser, senderId);
    sendApi.sendPaymentSentMessage(senderId, result);
    break;
  case 'cancel':
    sendApi.sendCancelPaymentMessage(senderId);
    break;
  default:
    console.error(`Unknown Postback called: ${type}`);
    break;
  }
};

/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);

  parseMessage.determineNLP(message, senderId);
};

export default {
  handleReceiveMessage,
  handleReceivePostback,
};
