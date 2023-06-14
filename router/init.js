const express = require('express');
const userController = require('../controller/user');
const productController = require('../controller/product');
const cartController = require('../controller/cart');
const orderController = require('../controller/order');
const adminController = require('../controller/admin');
const chatController = require('../controller/chat');

const helpFile = require('../support/file');
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

  router.post('/api/create-room', chatController.createRoom);
  router.get('/api/get-room', chatController.getRooms);
  router.post('/api/send-message', chatController.sendMessage);
  router.get('/api/get-message/:roomId', chatController.getMessages);
  router.delete('/api/delete-room/:roomId', chatController.deleteRoom);

  router.get('/api/image/:imageUrl', helpFile.sendFile);

  return app.use('/', router);
};

module.exports = init;
