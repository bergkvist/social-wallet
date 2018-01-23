// ===== MESSENGER =============================================================
import sendApi from './send';

// ===== STORES ================================================================
import UserStore from '../stores/user_store';
import messages from './messages';

function parseMessage(message, senderId){
    const intent = message.nlp.entities;

    switch (intent) {
        case 'request':
            sendApi.sendMessage(senderId,messages.requestMSG);
            break;
        default:
            sendApi.sendMessage(senderId, messages.couldNotParse);
            break;
    }
}

export default {
    parseMessage,
  };