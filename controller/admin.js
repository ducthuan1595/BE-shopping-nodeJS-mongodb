const adminService = require('../services/admin');

exports.login = async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if(email && password) {
    const data = await adminService.handleLogin(email, password, res, req);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, user: data.user, token : data.accessToken })
    }
  }else {
    res.status(404).json({ message: 'Invalid value' })
  }
}