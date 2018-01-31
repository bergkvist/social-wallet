const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const API_VERSION = 'v2.12';
const API_URI = `https://graph.facebook.com/${API_VERSION}`;


async function fetchGraphAPI(request, queryParams, uriExtension) {
    queryParams = queryParams || {};
    queryParams['access_token'] = PAGE_ACCESS_TOKEN;
    
    const options = {
        uri: `${API_URI}/${uriExtension}`,
        qs: queryParams,
        json: true
    };

    return request(options);
}


/**
 * Fetch information about a single user using messengerId
 * @param {String} messengerId - The messengerId of the user
 * @param {Function} request - An asynchronous request function
 * @return {Object} - The returned user data
 */
async function fetchFacebookInfo(request, messengerId) {
    const uriExtension = `${messengerId}`;
    const queryParams = {};
    return fetchGraphAPI(request, queryParams, uriExtension);
}


async function fetchFacebookId(request, messengerId) {
    const uriExtension = `${messengerId}`;
    const queryParams = { fields: 'ids_for_apps' };
    const data = await fetchGraphAPI(request, queryParams, uriExtension);
    return data['ids_for_apps']['data'][0]['id'];
}


async function getUserInformation(request, messengerId) {
    const facebookId = await fetchFacebookId(request, messengerId);
    const facebookData = await fetchFacebookInfo(request, messengerId);
    
    const firstname = facebookData['first_name'];
    const lastname = facebookData['last_name'];
    const profilePictureUrl = facebookData['profile_pic'];
    
    return { profilePictureUrl, facebookId, firstname, lastname };
}


module.exports = {
    fetchFacebookInfo,
    fetchFacebookId,
    fetchGraphAPI,
    getUserInformation
}