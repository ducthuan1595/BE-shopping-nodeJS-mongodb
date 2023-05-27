const express = require('express');
const userController = require('../controller/user');
const productController = require('../controller/product');
const cartController = require('../controller/cart');
const orderController = require('../controller/order');
const auth = require('../support/jwt');

const router = express.Router();

const init = (app) => {
  router.post('/api/signup', userController.signup);
  router.post('/api/login', userController.login);
  router.post('/api/logout', userController.logout);
  router.get('/api/refresh-token', auth.refreshToken);

  router.get('/api/get-all-product', productController.getAllProduct);
  
  router.get('/api/get-cart/:userId', cartController.getCart)
  router.post('/api/add-cart', cartController.addCart);
  router.delete('/api/delete-cart/:productId', cartController.deleteCart);

  router.post('/api/post-order', orderController.postOrder);
  router.get('/api/get-order/:userId', orderController.getOrdersWithUser);
  router.get('/api/get-detail-order-by-user/:orderId', orderController.getDetailOrderWithUser);

  return app.use('/', router);
};

module.exports = init;
