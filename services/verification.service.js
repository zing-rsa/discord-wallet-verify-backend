const Serialization = require('@emurgo/cardano-serialization-lib-nodejs');
const MessageSigning = require('../extra_modules/cardano_message_signing/cardano_message_signing.js');

const verifyPayload = (payload, payloadCose) => {
    let test = Buffer.from(payloadCose).compare(Buffer.from(payload, 'hex')) === 0;
    return test;
};

const verifyAddress = (address, addressCose, publicKeyCose) => {
    const checkAddress = Serialization.Address.from_bytes(Buffer.from(address, 'hex'));
    if (addressCose.to_bech32() !== checkAddress.to_bech32()) return false;
    try {
        const stakeKeyHash = publicKeyCose.hash();
        const reconstructedAddress = Serialization.RewardAddress.new(
            checkAddress.network_id(),
            Serialization.StakeCredential.from_keyhash(stakeKeyHash)
        );
        if (checkAddress.to_bech32() !== reconstructedAddress.to_address().to_bech32())
            return false;

        return true;
    } catch (error) {
        console.error('Caught error verifying address', error)
    }
    return false;
};

const verifySignedMessage = (address, payload, key, coseSign1Hex) => {
    const coseSign1 = MessageSigning.COSESign1.from_bytes(Buffer.from(coseSign1Hex, 'hex'));
    const payloadCose = coseSign1.payload();
    const coseKey = MessageSigning.COSEKey.from_bytes(Buffer.from(key, 'hex'));

    if (!payloadCose || !verifyPayload(payload, payloadCose)) {
        throw new Error('Payload does not match');
    }

    const protectedHeaders = coseSign1
        .headers()
        .protected()
        .deserialized_headers();

    const headerCBORBytes = protectedHeaders.header(MessageSigning.Label.new_text('address'))?.as_bytes();

    if (!headerCBORBytes) {
        throw new Error('Failed to convert header to bytes');
    }

    const keyHeaderBytes = coseKey.header(MessageSigning.Label.new_int(MessageSigning.Int.new_i32(-2))).as_bytes();

    if (!keyHeaderBytes) {
        throw new Error('Failed to convert key headers to bytes');
    }

    const publicKeyCose = Serialization.PublicKey.from_bytes(keyHeaderBytes);
    const addressCose = Serialization.Address.from_bytes(headerCBORBytes);

    if (!verifyAddress(address, addressCose, publicKeyCose))
        throw new Error('Address mismatch');

    const signature = Serialization.Ed25519Signature.from_bytes(coseSign1.signature());
    const data = coseSign1.signed_data().to_bytes();

    return { 
        valid: publicKeyCose.verify(data, signature),
        stake_key: addressCose.to_bech32()
    }
};

module.exports = {
    verifySignedMessage
}