/**
 * Copyright 2017-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable camelcase */
/* eslint-disable max-len */

const SERVER_URL = process.env.SERVER_URL; // eslint-disable-line

/**
 * Account Link Button
 */
const signInButton = {
  type: 'account_link',
  url: `${SERVER_URL}/users/login`,
};

/**
 * Account Unlink Button
 */
const signOutButton = {type: 'account_unlink'};

/**
 * Message that informs the user the must sign in and prompts
 * them to set link their account.
 */
const createAccountMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Log into your SocialWallet to start sending your friends XEM.',
      buttons: [signInButton],
    },
  },
};

/**
 * Fun message for saying hello to a signed in user.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const signInGreetingMessage = (username) => {
  return {
    text: `Welcome back, ${username}!`,
  };
};

/**
 * Message that informs the user they've been succesfully logged in.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const signInSuccessMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Happy transacting!',
      buttons: [signOutButton],
    },
  },
};

/**
 * Message that informs the user they've been succesfully logged out.
 */
const signOutSuccessMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'You’ve been logged out of your SocialWallet account.',
      buttons: [signInButton],
    },
  },
};

/**
 * Message that informs the user they are currently logged in.
 *
 * @param {String} username System username of the currently logged in user
 * @returns {Object} Message payload
 */
const loggedInMessage = (username) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: `You’re still logged in as ${username}.`,
        buttons: [signOutButton],
      },
    },
  };
};

/**
 * Fun message for saying hello to a signed in user.
 */
const napMessage = {
  text: 'Oh hey there! I was just napping while you were gone 😴. But I’m awake now!',
};

/**
 * The Get Started button.
 */
const getStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread',
  call_to_actions: [
    {
      payload: JSON.stringify({
        type: 'GET_STARTED',
      }),
    },
  ],
};
/**
 * Send button
 */
const sendXEM = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: {
        title: "Confirm transaction:",
        subtitle: `Send XXX XEM to XXX`,
        buttons: [{
          type: "postback",
          title: "Send XEM",
          payload: "send"
        },{
          type: "postback",
          title: "Cancel transaction",
          payload: "cancel"
        }
      ]
      }
    }
  }
};

const requestXEM = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: {
        title: "Confirm transaction:",
        subtitle: `Request XXX XEM from XXX`,
        buttons: [{
          type: "postback",
          title: "Request XEM",
          payload: "request"
        },{
          type: "postback",
          title: "Cancel transaction",
          payload: "cancel"
        }
      ]
      }
    }
  }
};

const help = {
  text: 'Try writing like this: "send 100 XEM to John Doe", or "Request 100 XEM from Jane Doe". ',
};

const greeting = {
  text: 'Hi there!\nTry "send 100 XEM to John Doe", or "Request 100 XEM from Jane Doe". ',
};

const couldNotParse = {
  text: 'Sorry, I do not understand what you wrote. Please try again!\nTry "send 100 XEM to John Doe", or "Request 100 XEM from Jane Doe". ',
};

const sentMSG = {
  text: 'Payment sent',
};

const requestMSG = {
  text: 'Request sent',
};

const cancelTransaction = {
  text: 'Payment canceled',
};

export default {
  createAccountMessage,
  signInGreetingMessage,
  signInSuccessMessage,
  signOutSuccessMessage,
  loggedInMessage,
  napMessage,
  getStarted,
  sendXEM,
  requestXEM,
  help,
  greeting,
  couldNotParse,
  sentMSG,
  requestMSG,
  cancelTransaction,
};
