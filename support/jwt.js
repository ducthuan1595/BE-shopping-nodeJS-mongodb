const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/refreshToken');
const createTokens = require('./createToken');
require('dotenv').config();

const auth = {
  authToken: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
      res.status(401).json({ message: 'You are not authentication', errCode: 1 })
    }else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) {
          res.status(403).json({ message: 'Token is invalid', errCode: 1 })
        }else {
          req.user = data.user;
          next();
        }
      })
    }
  },

  refreshToken: async(req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
      return res.status(401).json({ message: 'You are not authentication'})
    }
    const refreshTokens = await RefreshToken.find();
    const isToken = refreshTokens.filter(item => item.refreshToken[0] === token);
    if(isToken) {
      jwt.verify(token, process.env.ACCESS_TOKEN_REFRESH, async(err, data) => {
        if(err) {
          console.log(err);
          return res.status(403).json({ message: 'Token is invalid'})
        }
        // remove refresh token in database
        await RefreshToken.findOneAndRemove({
          refreshToken: isToken[0].refreshToken[0]
        });
        const newToken = await createTokens.createToken(data);
        const newRefreshToken = await createTokens.createRefreshToken(data);
        const createRefreshToken = new RefreshToken({
          refreshToken: newRefreshToken
        });
        await createRefreshToken.save();
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict'
        });
        res.status(200).json({ message: 'ok', token: newToken, user: data.user })
      })
    }else {
      res.status(403).json({ message: 'Invalid refresh token' })
    }
  },

};

module.exports = auth;

