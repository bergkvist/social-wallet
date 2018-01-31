const { networkId, endpoint } = require('../config/nemconfig');
const nem = require('nem-sdk').default;

export default (sequelize, DataTypes) => {
    const Wallets = sequelize.define('Wallets', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        walletName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        brain: DataTypes.BOOLEAN,
        algo: DataTypes.STRING,
        encrypted: DataTypes.STRING,
        iv: DataTypes.STRING,
        address: DataTypes.STRING,
        label: DataTypes.STRING,
        network: DataTypes.INTEGER,

        publicKey: DataTypes.STRING
    });

    Wallets.associate = function(models) {
        Wallets.belongsTo(models.Users, { allowNull: false });
    }

    Wallets.prototype.nemAccount = function() {
        return { brain:     this.brain,
                 algo:      this.algo,
                 encrypted: this.encrypted,
                 iv:        this.iv,
                 address:   this.address,
                 label:     this.label,
                 network:   this.network };
    }

    Wallets.prototype.nemWallet = function() {
        const account = this.nemAccount();
        return { name: this.walletName, accounts: { '0': account } };
    }

    Wallets.prototype.decrypt = function(password) {
        const account = this.nemAccount();
        let common = nem.model.objects.create('common')(password);
        nem.crypto.helpers.passwordToPrivatekey(common, account, account.algo);
        return common;
    }

    Wallets.prototype.generatePublicKey = function(password) {
        const common = this.decrypt(password);
        const keyPair = nem.crypto.keyPair.create(common.privateKey);
        const publicKey = keyPair.publicKey.toString();
        return this.update({ publicKey });
    }

    Wallets.prototype.balance = async function() {
        const data = await nem.com.requests.account.data(endpoint, this.address);
        return data.account.balance / 1000000;
    }

    Wallets.prototype.sendXEM = async function(amount, recipient, password) {
        const common = this.decrypt(password);
        const transferTransaction = nem.model.objects.create('transferTransaction')(recipient, amount);
        const transactionEntity = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, networkId);
        const broadcastedTransactionPromise = nem.model.transactions.send(common, transactionEntity, endpoint);
        return broadcastedTransactionPromise;
    }

    return Wallets;
}