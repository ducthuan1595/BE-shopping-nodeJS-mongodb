const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");
const sendMailers = require("../support/nodemailer");

exports.handleOrder = (address, phone, userId, name, email, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        const listItem = await user.populate("cart.items");
        const numbers = listItem.cart.items
          .map((item) => item.quantity)
          .reduce((init, curr) => {
            return init + curr;
          }, 0);
        await User.findByIdAndUpdate(
          { _id: userId },
          { orders: user.cart.items }
        );
        const order = new Order({
          user: {
            address: address,
            phone: phone,
            name: name,
            email: email,
          },
          userId: userId,
          amount: amount,
          status: "delivering", //Delivering / Delivered / Returned
          items: user.cart.items,
          quantity: numbers,
        });
        await order.save();
        await User.updateOne({ _id: userId }, { cart: { items: [] } });
        if (order) {
          sendMailers(order, () => {
            console.log("Send email successfully");
            resolve({ message: "ok", statusCode: 200 });
          });
        }
      } else {
        resolve({ statusCode: 403, message: "Invalid user" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleGetOrderWithUser = (userId, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        const orders = await Order.find({ userId: userId });
        if (orders) {
          const totalPage = Math.ceil(orders.length / limit);
          const start = (page - 1) * limit;
          const end = page * limit;
          const result = orders.slice(start, end);
          const totalNumber = orders.length;
          resolve({
            statusCode: 200,
            message: "ok",
            result: {
              orders: result,
              totalPage: totalPage,
              totalNumber: totalNumber,
              currPage: page,
              lastPage: Math.ceil(totalNumber / limit) 
            }
          });
        }
      } else {
        resolve({ message: "Unauthorized", statusCode: 403 });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleGetOrderDetailWithUser = (userId, orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        const order = await Order.findById(orderId);
        const newOrder = await order.populate("items.productId");
        if (newOrder) {
          resolve({ statusCode: 200, message: "ok", order: newOrder });
        } else {
          resolve({ statusCode: 404, message: "Not found" });
        }
      } else {
        resolve({ statusCode: 403, message: "Unauthorized" });
      }
    } catch (err) {
      reject(err);
    }
  });
};
