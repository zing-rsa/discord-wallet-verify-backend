module.exports = {
    MONGO_URL: process.env.MONGO_URI,
    DB_NAME: 'auction-bot-handler',
    USER_COL_NAME: 'users',

    PORT: process.env.PORT,
    BLOCKFROST_PROJECTID: process.env.BLOCKFROST_PROJECTID,
    
    BLOCKFROST_HOST: 'https://cardano-mainnet.blockfrost.io/api/v0/'

}
