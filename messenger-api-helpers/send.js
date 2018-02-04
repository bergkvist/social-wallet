/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ===== LODASH ================================================================
import castArray from 'lodash/castArray';

// ===== MESSENGER =============================================================
import api from './api';
import messages from './messages';

// ===== STORES ================================================================
import db from '../models';
import graphApi from '../graph-api';
import request from 'request-promise';




// Turns typing indicator on.
const typingOn = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_on', // eslint-disable-line camelcase
  };
};

// Turns typing indicator off.
const typingOff = (recipientId) => {
  return {
    recipient: {
      id: recipientId,
    },
    sender_action: 'typing_off', // eslint-disable-line camelcase
  };
};

// Wraps a message json object with recipient information.
const messageToJSON = (recipientId, messagePayload) => {
  return {
    recipient: {
      id: recipientId,
    },
    message: messagePayload,
  };
};

// Send one or more messages using the Send API.
const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI(
    [
      typingOn(recipientId),
      ...messagePayloadArray,
      typingOff(recipientId),
    ]);
};

const sendUserAddress = (recipientId, address) => {
  sendMessage(
    recipientId, [{
      text: `Your NEM address is ${address}`
    }]
  )
}

const sendUserBalance = (recipientId, balance) => {
  sendMessage(
    recipientId, [{
      text: `Your balance is ${balance} XEM`
    }]
  )
}

const unableToFindUser = recipientId => {
  sendMessage(recipientId, [{ text: 'Could not find any users with the specified name' }]);
}

// Send a welcome message for a non signed-in user.
const sendLoggedOutWelcomeMessage = (recipientId) => {
  sendMessage(
    recipientId, [
      {
        text: 'Welcome to the NEM SocialWallet!'
          + ' (NEM Global Hackathon project 2018)\rSend XEM using natural language! Type "Help" for instructions.',
      },
    ]
  );
};

// Send a welcome message for a signed in user.
const sendLoggedInWelcomeMessage = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.napMessage,
    ]);
};

// Send a different Welcome message based on if the user is logged in.
const sendWelcomeMessage = async (recipientId) => {
  const user = await db.Users.getByMessengerId(recipientId);
  if (user) {
    sendLoggedInWelcomeMessage(recipientId);
  } else {
    sendLoggedOutWelcomeMessage(recipientId);
  }
};

// Send a successfully signed in message.
const sendSignOutSuccessMessage = (recipientId) =>
  sendMessage(recipientId, messages.signOutSuccessMessage);

// Send a successfully signed out message.
const sendSignInSuccessMessage = (recipientId, username) => {
  sendMessage(
    recipientId,
    [
      messages.signInGreetingMessage(username),
      messages.signInSuccessMessage,
    ]);
};

// Send a read receipt to indicate the message has been read
const sendReadReceipt = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    sender_action: 'mark_seen', // eslint-disable-line camelcase
  };

  api.callMessagesAPI(messageData);
};

const sendPaymentSentMessage = (recipientId, result) => {
  sendMessage(
    recipientId, [{ 
      text: ''
      + `message: ${result.message}\u000A\u000A`
      + `transactionHash: ${result.transactionHash.data}`
    }]
  );
};

const sendCancelPaymentMessage = (recipientId) => {
  sendMessage(
    recipientId, [
      {
        text: 'Payment canceled.'
      },
    ]
  );
};

// Send a transaction confirmation.
const sendTransactionConfirmation = async (recipientUser, amount, senderId) => {
  const message = await messages.sendXEM(recipientUser, amount);
  sendMessage(senderId, message);
};

//Request more information from user
const sendMoreInfoMessage = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.moreInfoMessage,
    ]
  );
};

//Send logout button
const sendSignOutPrompt = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.signOutPrompt,
    ]
  );
};

//Send login button
const sendSignInPrompt = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.createAccountMessage,
    ]
  );
};

//Request more information from user
const sendHelpMessage = (recipientId) => {
  sendMessage(
    recipientId,
    [
      messages.helpMessage,
    ]
  );
};

export default {
  sendMessage,
  sendWelcomeMessage,
  sendSignOutSuccessMessage,
  sendSignInSuccessMessage,
  sendReadReceipt,
  sendPaymentSentMessage,
  sendCancelPaymentMessage,
  sendTransactionConfirmation,
  sendMoreInfoMessage,
  sendSignOutPrompt,
  sendHelpMessage,
  sendUserAddress,
  sendUserBalance,
  unableToFindUser,
  sendSignInPrompt,
};
