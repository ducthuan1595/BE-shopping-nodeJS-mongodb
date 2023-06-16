const User = require('../model/user');
const bcrypt = require('bcrypt');
const createTokens = require('../support/createToken');

exports.handleLogin = (email, password, res, req) => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await User.findOne({email: email});
      if(user) {
        const isAdmin = user.role;
        const validPw = await bcrypt.compare(password, user.password);
        if(validPw && (isAdmin === 2 || isAdmin === 1)) {
          const result = {
            email: user.email,
            userId: user._id,
            name: user.name,
          };
          const accessToken = await createTokens.createToken(result);
          const refreshToken = await createTokens.createRefreshToken(result);
          console.log(req.secure);
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/api',
            sameSite: req.secure ? 'none' : 'lax'
          })
          resolve({ statusCode: 200, message: 'ok', user: result, accessToken })
        }else{
          resolve({ statusCode: 403, message: 'You are not authorized'})
        }
      }
    }catch(err) {
      reject(err);
    }
  })
}