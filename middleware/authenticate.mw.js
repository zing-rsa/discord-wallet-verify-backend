const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(403).json({ message: 'Token not included' });
    }
  
    try {
      const data = jwt.verify(token, JWT_SECRET)

      req.userId = data.u;
      req.guildId = data.g;
      req.configId = data.cid;
      
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  };
  
  module.exports = {
    authenticate
};