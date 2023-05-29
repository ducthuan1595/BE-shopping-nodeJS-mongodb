const userService = require('../services/user');
const RefreshToken = require('../model/refreshToken');

exports.signup = async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;

  if(email && password && name && phone) {
    const data = await userService.handleSignup(email, password, name, phone);
    if(data) {
      res.status(data.statusCode).json({ message: data.message });
    }
  
  }else {
    res.status(404).json({ message: 'Not found', user: {} })
  }
};

exports.login = async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(req.cookies);
  if(email && password) {
    const data = await userService.handleLogin(email, password, res, req);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, user: data.user, token: data.token })
    }else {
      res.status(404).json({ message: 'Invalid', user: {} });
    }
  }
}

exports.logout = async(req, res) => {
  try{
    const token = req.cookies.refreshToken;
    const tokens = await RefreshToken.find();
    const filterToken = tokens.filter(t => t.refreshToken[0] === token);
    const remove = await RefreshToken.findOneAndRemove({ refreshToken: filterToken[0].refreshToken });
    if(remove) {
      res.clearCookie("refreshToken", { path: '/api' });
      res.status(200).json({ message: 'ok', errCode: 0 });
    }
  }catch(err) {
    res.status(404).json({ message: err })
  }
};

exports.getAllUser = async (req, res) => {
  const data = await userService.handleGetAllUser();
  if(data) {
    res.status(data.statusCode).json({ message: data.message, users: data.users });
  }
}