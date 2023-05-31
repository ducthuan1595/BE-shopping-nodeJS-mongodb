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
      console.log(token);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err) {
          res.status(403).json({ message: 'Token is invalid', errCode: 1 })
        }else {
          // req.user = data.user;
          next();
        }
      })
    }
  },

  refreshToken: async(req, res, next) => {
    const token = req.cookies.refreshToken;
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
        // console.log(data);
        const user = {
          email: data.email,
          name: data.name,
          userId: data.userId
        };
        // remove refresh token in database
        await RefreshToken.findOneAndRemove({
          refreshToken: isToken[0]?.refreshToken[0]
        });
        res.clearCookie("refreshToken", { path: '/api' });
        const newToken = createTokens.createToken(user);
        const newRefreshToken = await createTokens.createRefreshToken(user);
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict'
        });
        res.status(200).json({ message: 'ok', token: newToken, user: user })
      })
    }else {
      res.status(403).json({ message: 'Invalid refresh token' })
    }
  },

};

module.exports = auth;

