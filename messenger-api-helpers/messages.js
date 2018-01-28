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

const sendPaymentButton = {
  type: 'postback',
  title: 'Send XEM',
  payload: JSON.stringify(
    {type: "send"}
  )
};

const requestPaymentButton = {
  type: 'postback',
  title: 'Request XEM',
  payload: JSON.stringify(
    {type: "request"}
  )
};

const cancelTransactionButton = {
  type: 'postback',
  title: 'Cancel',
  payload: JSON.stringify(
    {type: 'cancel'}
  )
};


/**
 * Message that informs the user the must sign in and prompts
 * them to set link their account.
 */
const createAccountMessage = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Please sign in to start sending and recieving XEM.',
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
      text: 'Now you’re ready to start transacting! Log out at any time using the button below.',
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
      text: 'You’ve been logged out of your SoW account.',
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
 * Saying hello to a signed in user.
 */
const napMessage = {
  text: 'Welcome back!',
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
 * Send buttons for transacting   TODO: IMPLEMENT ADRESS BOOK CHECK
 */
const sendXEM = (username, amount, target) => {
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [{
          title: 'Confirm Transaction:',
          subtitle: `Send ${amount} XEM to ${target}`,
          buttons: [sendPaymentButton, cancelTransactionButton],
        }],
      },
    },
  };
};

/**
 * Error reply for when a user did not specify all required
 * fields for a transaction
 */
const moreInfoMessage = {
  text: 'Make sure you include action to do, amount of XEM, and recipient in your message.\n\r For example "Send 100 XEM to John Doe".',
};


/**
 * Message with Signout Button
 */
const signOutPrompt = {
  attachment: {
    type: 'template',
    payload: {
      template_type: 'button',
      text: 'Log out using the button below.',
      buttons: [signOutButton],
    },
  },
};

/**
 * Help reply
 */
const helpMessage = {
  text: 'To Send: Make sure you include action to do, amount of XEM, and recipient in your message.\n\rFor example "Send 100 XEM to John Doe".\n\rTo log in our out, simply type "Log in" or "Log Out".',
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
  moreInfoMessage,
  signOutPrompt,
  helpMessage,
};
