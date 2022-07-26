module.exports = {
    MONGO_URL: process.env.MONGO_URI,
    DB_NAME: 'auction-bot-handler',
    USER_COL_NAME: 'users',

    PORT: process.env.PORT,

    JWT_SECRET: process.env.JWT_SECRET

}
