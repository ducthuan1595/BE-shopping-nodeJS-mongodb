const userService = require('../services/user');

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

  if(email && password) {
    const data = await userService.handleLogin(email, password, res, req);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, user: data.user, token: data.token })
    }else {
      res.status(404).json({ message: 'Invalid', user: {} });
    }
  }
}

exports.logout = async (req, res) => {
  try{
    res.clearCookie("refreshToken");
    res.status(200).json({ message: 'ok', errCode: 0 })
  }catch(err) {
    res.status(404).json({ message: err })
  }
}