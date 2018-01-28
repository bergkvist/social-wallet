import send from '../messenger-api-helpers/send';

const determineIntent = (nlpInfo,senderId) => {
    const intent = nlpInfo["intent"][0]["value"];
    switch (intent) {
    case 'send':
        if (nlpInfo["number"] && nlpInfo["contact"]){
            send.sendTransactionConfirmation(senderId, nlpInfo["number"][0]["value"], nlpInfo["contact"][0]["value"]);
        } else {
            //Send please include all information message.
            send.sendMoreInfoMessage(senderId);
        }

        break;

    case 'request':
        if (nlpInfo["number"] && nlpInfo["contact"]){

        } else {
            //Send please include all information message.
        }
        break;
        
    default:
    // HELP RESPONSE
        break;
    }
}

export default {
determineIntent,
};