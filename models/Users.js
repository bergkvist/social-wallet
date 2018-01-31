const nem = require('nem-sdk').default;
const { networkId, endpoint } = require('../config/nemconfig');
const { getUserInformation } = require('../graph-api');
const request = require('request-promise');
let db;

async function afterCreate(user) {
    const messengerId = user.messengerId;
    const userInfo = await getUserInformation(request, messengerId);
    await user.update(userInfo);

    const wallet = await user.createWallet('default', messengerId);
    await user.setDefaultWallet(wallet);
}

/**
 * Users - Referring to facebook users that have signed up/accepted use of the application
 */
export default (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        messengerId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        facebookId: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        profilePictureUrl: {
            type: DataTypes.STRING
        }
    }, {
        hooks: { afterCreate }
    });

    /**
     * Create associations between models in the database. 
     * Automatically run upon connecting to the database
     * @param {Object} models - Contains all other database models (ex: Wallets)
     */
    Users.associate = function(models) {
        Users.belongsTo(models.Wallets, { as: 'DefaultWallet', constraints: false });
        db = models;  // Make the db-models accessible to instance functions after association.
    }

    // 
    /**
     * Get user by messenger id of a user.
     * @param {String} messengerId - The messengerId (PSID) of the user. 
     * @return {Object} - The user
     */
    Users.getByMessengerId = function(messengerId) {
        return db.Users.findOne({ where: { messengerId }});
    }

    Users.getByFacebookId = function(facebookId) {
        return db.Users.findOne({ where: { facebookId }});
    }

    Users.prototype.updateDataUsingFacebookApi = function() {

    }

    /**
     * Create a new NEM-wallet, with a random private key, and store it in the database.
     * The private key that was generated will be encrypted with password.
     * @param {String} walletName - The name of the wallet. Used for organization.
     * @param {String} password - The password that encrypts the wallet.
     * @return {Object} - The wallet that was created (encrypted)
     */
    Users.prototype.createWallet = async function(walletName, password) {
        const nemWallet = await nem.model.wallet.createPRNG(walletName, password, networkId);
        const UserMessengerId = this.messengerId;
        const dbWallet = await db.Wallets.create({ walletName, UserMessengerId });
        await dbWallet.update(nemWallet.accounts[0]);
        await dbWallet.generatePublicKey(password);
        
        return dbWallet;
    }

    /**
     * Lists all wallets owned by the User.
     * @return {Array <Object>} - A list of the wallets.
     */
    Users.prototype.wallets = async function() {
        return db.Wallets.findAll({ where: { UserMessengerId: this.messengerId }});
    }

    /**
     * Set the default wallet of the user.
     * @param {Object} dbWallet - Database object of the wallet.
     * @return {Object} - This user
     */
    Users.prototype.setDefaultWallet = function(dbWallet) {
        return this.update({ DefaultWalletId: dbWallet.id });
    }

    /** 
     * Check if the user has a default wallet.
     * @return {Boolean} - True if the user has a default wallet, otherwise false.
     */
    Users.prototype.hasDefaultWallet = function() {
        return (this.DefaultWalletId !== null);
    }

    /**
     * Get the default wallet of the user.
     * @return {Object} - Database object of the default wallet.
     */
    Users.prototype.defaultWallet = function() {
        return db.Wallets.findById(this.DefaultWalletId);
    }

    /**
     * Get the public key from the default wallet of the user.
     * @return {String} - The public key of the default wallet.
     */
    Users.prototype.publicKey = async function() {
        const dbWallet = await this.defaultWallet();
        return dbWallet.publicKey;
    }

    /**
     * Get the address from the default wallet of the user.
     * @return {String} - The address of the default wallet.
     */
    Users.prototype.address = async function() {
        const dbWallet = await this.defaultWallet();
        return dbWallet.address;
    }

    /**
     * Send a XEM-transaction from the user to another user, using default wallets.
     * @param {Number} amount - The amount of XEM to send.
     * @param {Object} recipientUser - The user that will receive the XEM.
     * @param {String} password - The password to decrypt the default wallet of the (sending) user.
     * @return {Object} - The response from the NEM-node the transaction was broadcasted to.
     */
    Users.prototype.sendXEM = async function (amount, recipientUser, password) {
        const dbWallet = await this.defaultWallet();
        const recipient = await recipientUser.address();
        return dbWallet.sendXEM(amount, recipient, password);
    }

    return Users;
}