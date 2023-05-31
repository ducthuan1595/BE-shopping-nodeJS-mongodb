const jwt = require('jsonwebtoken');
const RefreshToken = require('../model/refreshToken');

exports.createToken = (data) => {
  const token = jwt.sign(
    {...data},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 30}
  );
  return token;
};

exports.createRefreshToken = async(data) => {
  try{
    const refreshToken = jwt.sign(
      {...data},
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