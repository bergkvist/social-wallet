const index = require('./index');

const request = require('request-promise');

describe('facebook graph api', () => {

    it('fetches facebook data using messengerId', async () => {
        const messengerId = '1566874790074832';
        const facebookInfo = await index.fetchFacebookInfo(request, messengerId);
        expect(facebookInfo.first_name).toBe('Tobias');
        expect(facebookInfo.last_name).toBe('Bergkvist');
        expect(facebookInfo.profile_pic).toBe(
            'https://scontent.xx.fbcdn.net/v/t1.0-1/' +
            '17021380_1452260868137633_7213562738370500365_n.jpg' +
            '?oh=53b2a341c9dc92ba15cf1f58d2cc3c00&oe=5ADEB9E1'
        );
    });

    it('fetches facebookId using messengerId', async () => {
        const messengerId = '1566874790074832';
        const facebookId = await index.fetchFacebookId(request, messengerId);
        expect(facebookId).toBe('1804007462962970');
    });

    it('gets all required info to update a user', async () => {
        const messengerId = '1566874790074832';
        const userInfo = await index.getUserInformation(request, messengerId);
        expect(userInfo).toHaveProperty('profilePictureUrl');
        expect(userInfo).toHaveProperty('facebookId');
        expect(userInfo).toHaveProperty('firstname');
        expect(userInfo).toHaveProperty('lastname');
    });
});
