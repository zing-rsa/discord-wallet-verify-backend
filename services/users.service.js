const verification = require('./verification.service');
const { SigVerificationError } = require('../errors');

const db = require('../mongo').db();

let users = db.collection('users');

const upsertUser = async (details, userid) => {

    const nonce = (await users.findOne({ userid: userid })).nonce;
    const signature = details.sig
    const addr = details.addr
    const key = details.key

    try {

        const { valid, stake_key } = verification.verifySignedMessage(addr, nonce, key, signature);

        if (!valid)
            throw new Error('Invalid signature');

        let writeResult = await users.updateOne(
            { userid: userid },
            {
                '$set': {
                    stake_key: stake_key
                }
            }
        );

    } catch (e) {
        throw new SigVerificationError('Failed to verify signature');
    }
}

module.exports = {
    upsertUser
}