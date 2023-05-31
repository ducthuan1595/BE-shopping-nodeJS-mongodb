const express = require('express');
const userController = require('../controller/user');
const productController = require('../controller/product');
const cartController = require('../controller/cart');
const orderController = require('../controller/order');
const adminController = require('../controller/admin');
const auth = require('../support/jwt');

const router = express.Router();

const init = (app) => {
  router.post('/api/signup', userController.signup);
  router.post('/api/login', userController.login);
  router.post('/api/logout', userController.logout);
  router.get('/api/refresh-token', auth.refreshToken);

  router.get('/api/get-all-product', productController.getAllProduct);
  router.get('/api/get-edit-product/:productId', productController.getEditProduct);
  router.post('/api/add-product', auth.authToken, productController.addProduct);
  router.post('/api/update-product', auth.authToken, productController.updateProduct);
  router.delete('/api/delete-product/:productId', auth.authToken, productController.deleteProduct);

  router.get('/api/get-cart/:userId', auth.authToken, cartController.getCart)
  router.post('/api/add-cart', auth.authToken, cartController.addCart);
  router.delete('/api/delete-cart/:productId', auth.authToken, cartController.deleteCart);

  router.get('/api/get-all-order', orderController.getAllOrder);
  router.post('/api/post-order', auth.authToken, orderController.postOrder);
  router.get('/api/get-order/:userId', auth.authToken, orderController.getOrdersWithUser);
  router.get('/api/get-detail-order-by-user/:orderId', auth.authToken, orderController.getDetailOrderWithUser);

  // admin
  router.get('/api/get-all-user', userController.getAllUser);
  router.get('/api/get-detail-order/:orderId', orderController.getDetailOrder);
  router.post('/api/admin/login', adminController.login);

  return app.use('/', router);
};

module.exports = init;
