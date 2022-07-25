const { ValidationError, SigVerificationError } = require('../../errors');
const { authenticate } = require('../../middleware/authenticate.mw');
const UserService = require('../../services/users.service');
const router = require('express').Router();
const Joi = require('joi');

router.post('/walletregister', [authenticate], walletRegister)

async function walletRegister (req, res) {

    const schema = Joi.object().keys({
        addr: Joi.string().alphanum().required(),
        key: Joi.string().alphanum().required(),
        sig: Joi.string().alphanum().required()
    });

    try {

        const userid = req.userid;

        const { error, value } = schema.validate(req.body, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        UserService.upsertUser(value, userid);
        return res.status(200).json({ message: 'Wallet registered' });
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof SigVerificationError) {
            return res.status(401).json({ message: 'Failed to verify ownership of provided wallet' });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }

};

module.exports = router


