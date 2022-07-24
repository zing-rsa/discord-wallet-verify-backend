const { ValidationError } = require('../../errors');
const UserService = require('../../services/users.service');
const router = require('express').Router();
const Joi = require('joi');

router.post('/walletregister', walletRegister)

async function walletRegister (req, res) {

    const schema = Joi.object().keys({
        addr: Joi.string().alphanum().length(59).required(),
        key: Joi.string().alphanum().required(),
        sig: Joi.string().alphanum().required()
    });

    try {

        const { error, value } = schema.validate(req.body, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        UserService.upsertUser(value);
        return res.status(200).json({ message: 'Wallet registered' });
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }

};

module.exports = router


