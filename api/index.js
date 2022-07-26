const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(express.json());
router.use(cors({
    exposedHeaders: ['authorization']
}));

router.use('/users', require('./controllers/users.controller'));

module.exports = router