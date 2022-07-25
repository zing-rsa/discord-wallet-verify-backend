const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(403).json({ message: 'Token not included' });
    }
  
    try {
      const userid = (jwt.verify(token, JWT_SECRET)).userid;
  
      req.userid = userid;
      
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid Token' });
    }
  };
  
  module.exports = {
    authenticate
};