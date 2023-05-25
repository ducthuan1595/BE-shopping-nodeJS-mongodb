const Product = require('../model/product');
const User = require('../model/user');

exports.handleGetAllProduct = (limit, page) => {
  return new Promise(async(resolve, reject) => {
    try{
      const products = await Product.find();
      if(products) {
        const totalPage = Math.ceil(products.length / limit);
        const start = (page - 1) * limit;
        const end = page * limit;
        const result = products.slice(start, end);
        const totalNumber = products.length;
        resolve({
          message: 'Get all product',
          errCode: 0,
          products: result,
          totalPage: totalPage,
          totalNumber: totalNumber,
          currPage: page,
          lastPage: Math.ceil(totalNumber / limit),
          hasNextPage: limit * page < totalNumber,
          hasPrevPage: page > 1
        })
      }
    }catch(err) {
      reject(err);
    }
  })
};


