const orderService = require('../services/order');

exports.postOrder = async(req, res) => {
  const address = req.body.address;
  const phone = req.body.phone;
  const userId = req.body.userId;
  const name = req.body.name;
  const email = req.body.email;
  const amount = req.body.amount;

  if(address && phone && userId) {
    const data = await orderService.handleOrder(address, phone, userId, name, email, amount);
    if(data) {
      res.status(data.statusCode).json({ message: data.message });
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
};

exports.getOrdersWithUser = async(req, res) => {
  const userId = req.params.userId;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  if(userId) {
    const data = await orderService.handleGetOrderWithUser(userId, limit, page);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, result: data.result })
    }
  }else {
    res.status(404).json({ message: 'Invalid value' })
  }
};

exports.getDetailOrderWithUser = async(req, res) => {
  const userId = req.query.userId;
  const orderId = req.params.orderId;
  if(userId && orderId) {
    const data = await orderService.handleGetOrderDetailWithUser(userId, orderId);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, order: data.order })
    }
  }else {
    res.status(404).json({ message: 'Invalid value' })
  }
};

exports.getAllOrder = async(req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  if(page && limit) {
    const data = await orderService.handleGetAllOrder(page, limit);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, orders: data.result })
    }else {
      res.status(500).json({ message: 'Error server'})
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
};

exports.getDetailOrder = async(req, res) => {
  const orderId = req.params.orderId;
  if(orderId) {
    const data = await orderService.handleGetDetailOrder(orderId);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, order: data.order});
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
}