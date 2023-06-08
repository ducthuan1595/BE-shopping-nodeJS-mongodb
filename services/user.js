const User = require('../model/user');
const RefreshToken = require('../model/refreshToken');
const createTokens = require('../support/createToken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// const sendMailers = require('../support/nodemailer');


exports.handleSignup = (email, password, name, phone) => {
  return new Promise(async(resolve, reject) => {
    try{
      // check email
      const users = await User.find();
      const filterUser = users.some(user => user.email === email);
      if(filterUser) {
        return  resolve({
          message: 'Your Email be used',
          statusCode: 404,
        })
      };
      const pw = await bcrypt.hash(password, 12);

      const user = new User({
        email: email,
        password: pw,
        phone: phone,
        name: name,

      });
      const newUser = await user.save();
      if(newUser) {
        // sendMailers(email, () => {
        //   console.log('Send email successfully');
        // });
        resolve({
          message: 'ok',
          statusCode: 200
        })
      }
    }catch(err) {
      reject(err);
    }
  })
};

exports.handleLogin = (email, password, res, req) => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await User.findOne({email: email});
      if(user) {
        const validPw = await bcrypt.compare(password, user.password);
        if(validPw) {
          const data = {
            email: user.email,
            name: user.name,
            userId: user._id
          };
          ;
          const token = await createTokens.createToken(data);
          const refreshToken = await createTokens.createRefreshToken(data);
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/api',
            sameSite: 'strict'
          })
          // res.removeCookie("refreshToken");
          // console.log(data,);
          resolve({ message: 'ok', statusCode: 200, user: data, token })
        }else {
          resolve({ message: 'Password incorrect', statusCode: 404 })
        }
      }else {
        resolve({ message: 'Invalid email', statusCode: 404 })
      }
      
    }catch(err) {
      reject(err);
    }
  })
};

exports.handleGetAllUser = () => {
  return new Promise(async(resolve, reject) => {
    try{
      const users = await User.find().select('-password');
      if(users) {
        resolve({ statusCode: 200, message: 'ok', users: users })
      }else {
        resolve({ statusCode: 404, message: 'Not found', users: [] })
      }
    }catch(err) {
      reject(err)
    }
  })
}


