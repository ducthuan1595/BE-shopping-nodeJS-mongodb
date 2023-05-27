const Product = require('../model/product');
const User = require('../model/user');

exports.handleAddCart = (userId, productId, quantity) => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await User.findById(userId)
      const cart = await user?.populate('cart.items');
      if(user) {
        const existItemIndex = user.cart.items.findIndex(item => item.productId.toString() === productId.toString());
        let updateItem = [...user.cart.items];
        if(existItemIndex >= 0) {
          const newQuantity = +user.cart.items[existItemIndex].quantity + +quantity;
          updateItem[existItemIndex].quantity = newQuantity;
        }else {
          updateItem.push({
            productId: productId,
            quantity: quantity
          })
        };
        const updateCart = {
          items: updateItem,
        }
        await User.findOneAndUpdate({ _id: userId }, { cart: updateCart });
        
        if(updateCart) {
          cart.password = undefined;
          cart.phone = undefined;
          resolve({ message: 'ok', statusCode: 200, user: cart })
        }
      }else {
        resolve({ message: 'Product or user does not exist!', statusCode: 404 })
      }
    }catch(err) {
      reject(err);
    }
  })
};

exports.handleDeleteCart = (productId, userId) => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await User.findById(userId);
      if(user) {
        const updateItems = user.cart.items.filter(item => item.productId.toString() !== productId.toString());
        user.cart.items = updateItems;
        await user.save();
        if(updateItems) {
          resolve({ message: 'ok', statusCode: 200 })
        }
      }
    }catch(err) {
      reject(err);
    }
  })
};

exports.handleGetCart = (userId) => {
  return new Promise(async(resolve, reject) => {
    try{
      const user = await User.findById(userId);
      if(user) {
        const cart = await user.populate('cart.items.productId');
        resolve({ statusCode: 200, message: 'ok', cart: cart.cart.items })
      }else {
        resolve({ statusCode: 403, message: 'You is unauthorized'})
      }
    }catch(err) {
      reject(err);
    }
  })
}

