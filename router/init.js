const express = require('express');
const userController = require('../controller/user');
const productController = require('../controller/product');
const cartController = require('../controller/cart');
const auth = require('../support/jwt');

const router = express.Router();

const init = (app) => {
  router.post('/api/signup', userController.signup);
  router.post('/api/login', userController.login);
  router.post('/api/logout', userController.logout)

  router.get('/api/get-all-product', productController.getAllProduct);
  
  router.post('/api/add-cart', cartController.addCart);
  router.delete('/api/delete-cart/:productId', cartController.deleteCart);

  return app.use('/', router);
};

module.exports = init;
