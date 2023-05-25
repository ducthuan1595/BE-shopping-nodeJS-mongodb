const jwt = require('jsonwebtoken');
require('dotenv').config();

const RefreshToken = require('../model/refreshToken');

exports.authToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if(!token) {
    res.status(401).json({ message: 'You are not authentication', errCode: 1 })
  }else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (data, err) => {
      if(err) {
        res.status(403).json({ message: 'Token is invalid', errCode: 1 })
      }else {
        req.user = data.user;
        next();
      }
    })
  }
};

exports.createToken = (data) => {
  const token = jwt.sign(
    { user: data },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '20s'}
  );
  return token;
}  

exports.createRefreshToken = async(data) => {
  try{
    const refreshToken = jwt.sign(
      { user: data },
      process.env.ACCESS_TOKEN_REFRESH,
      { expiresIn: '30d'}
    );
    const saveToken = new RefreshToken({
      refreshToken: refreshToken
    });
    await saveToken.save();
    return refreshToken;
  }catch(err) {
    console.log(err);
  }
}
