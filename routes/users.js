// ===== MODULES ===============================================================
import express from 'express';
import uuid from 'uuid';
import path from 'path';


const router = express.Router();



/**
 * GET Create user account view
 */
router.get('/create', function(req, res) {
  const accountLinkingToken = req.query.account_linking_token;
  const redirectURI = req.query.redirect_uri;

  res.render('create-account', {accountLinkingToken, redirectURI});
});

/**
 * Create user account and link to messenger
 */

/*
 * This path is used for account linking. The account linking call-to-action
 * (sendAccountLinking) is pointed to this URL.
 *
 */
router.get('/login', function(req, res) {
  /*
    Account Linking Token is never used in this demo, however it is
    useful to know about this token in the context of account linking.
    It can be used in a query to the Graph API to get Facebook details
    for a user. Read More at:
    https://developers.facebook.com/docs/messenger-platform/account-linking
  */
  //const accountLinkingToken = req.query.account_linking_token;

  const redirectURI = req.query.redirect_uri;
  const authCode = uuid();
  //const accountLinkingToken = req.query.account_linking_token;
  //const redirectURI = req.query.redirect_uri;
  
  
  const redirectURISuccess = `${redirectURI}&authorization_code=${authCode}`;
  res.render('test');
  //res.redirect(redirectURISuccess);
});

router.get('/privacy', function(req, res) {
  res.render('privacy');
});

router.get('/test', function(req, res) {
  res.render('test');
});

router.get('/tos', function(req, res) {
  res.render('tos');
});
export default router;