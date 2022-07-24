const db = require('../mongo').db();

let users = db.collection('users');

const upsertUser = async (details) => {

    let writeResult = await users.updateOne(
        { userid: details.userid },
        {
            '$set': {
                userid: details.userid,
                addr: details.addr
            }
        },
        { upsert: true }
    );
}

module.exports = {
    upsertUser
}