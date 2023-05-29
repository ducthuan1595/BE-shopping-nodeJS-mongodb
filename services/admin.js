const User = require('../model/user');
const bcrypt = require('bcrypt');

exports.handleLogin = (email, password) => {
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
          }
          resolve({ statusCode: 200, message: 'ok', user: result})
        }else{
          resolve({ statusCode: 403, message: 'You are not authorized'})
        }
      }
    }catch(err) {
      reject(err);
    }
  })
}