import send from '../messenger-api-helpers/send';

const determineIntent = (nlpInfo,senderId) => {
    const intent = JSON.stringify(nlpInfo["intent"]);
    console.log("hei: " + intent);
    switch (intent) {
    case 'send':
        if (nlpInfo["number"] && nlpInfo["contact"]){
            console.log("hoe");
            send.sendTransactionConfirmation(senderId, nlpInfo["number"], nlpInfo["contact"]);
        } else {
            //Send please include all information message.
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