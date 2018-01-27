import send from '../messenger-api-helpers/send';

const determineIntent = (intent,senderId) => {
    console.log("hei: " + intent);
    switch (intent) {
    case 'send':
        if (intent["number"] && intent["contact"]){
            console.log("hoe");
            send.sendTransactionConfirmation(senderId, intent["number"], intent["contact"]);
        } else {
            //Send please include all information message.
        }

        break;

    case 'request':
        if (intent["number"] && intent["contact"]){

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