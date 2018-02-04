import send from '../messenger-api-helpers/send';
import isEmpty from 'lodash/isEmpty';
import db from '../models';

const determineNLP = (message, senderId) => {
    const nlp = message.nlp.entities;
    if ('intent' in nlp) {
        determineIntent(nlp, senderId);
    } else {
        send.sendHelpMessage(senderId);
    }
}

const determineIntent = async (nlpInfo, senderId) => {
    const user = await db.Users.getByMessengerId(senderId);
    const intent = nlpInfo["intent"][0]["value"];
    switch (intent) {
    case 'send':
        if (nlpInfo["number"] && nlpInfo["contact"]){
            const amount = nlpInfo["number"][0]["value"];
            const recipientName = nlpInfo["contact"][0]["value"];
            const recipientUser = await db.Users.findOne({where: { firstname: recipientName }});
            if (recipientUser !== null) send.sendTransactionConfirmation(recipientUser, amount, senderId);
            else send.unableToFindUser(senderId);
        } else {
            //Send please include all information message.
            send.sendMoreInfoMessage(senderId);
        }
        break;

    case 'request':
        if (nlpInfo["number"] && nlpInfo["contact"]){ // TODO: REQUEST PAYMENT
        } else {
            //Send please include all information message.
            send.sendMoreInfoMessage(senderId);
        }
        break;

    case 'address':
        const address = await user.address();
        send.sendUserAddress(senderId, address);
        break;
    
    case 'balance':
        const defaultWallet = await user.defaultWallet();
        const balance = await defaultWallet.balance();
        send.sendUserBalance(senderId, balance);
        break;

    case 'login':
        send.sendSignInPrompt(senderId);
        break;

    default:
    // HELP RESPONSE
        send.sendHelpMessage(senderId);
        break;
    }
}

export default {
determineNLP,
determineIntent,
};