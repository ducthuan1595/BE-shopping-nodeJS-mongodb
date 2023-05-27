const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/refreshToken');

exports.createToken = (data) => {
  const token = jwt.sign(
    { user: data },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '20s'}
  );
  return token;
};

exports.createRefreshToken = async(data) => {
  try{
    const refreshToken = jwt.sign(
      { user: data },
      process.env.ACCESS_TOKEN_REFRESH,
      { expiresIn: '5000s'}
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