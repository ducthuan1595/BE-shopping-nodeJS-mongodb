const Product = require("../model/product");
const User = require("../model/user");

exports.handleGetAllProduct = async(limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Product.find();
      if (products) {
        const totalPage = Math.ceil(products.length / limit);
        const start = (page - 1) * limit;
        const end = page * limit;
        const result = products.slice(start, end);
        const totalNumber = products.length;
        resolve({
          message: "Get all product",
          errCode: 0,
          products: result,
          totalPage: totalPage,
          totalNumber: totalNumber,
          currPage: page,
          lastPage: Math.ceil(totalNumber / limit),
          hasNextPage: limit * page < totalNumber,
          hasPrevPage: page > 1,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleAddProduct = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = new Product({
        name: value.name,
        price: value.price,
        short_desc: value.shortDesc,
        long_desc: value.longDesc,
        category: value.category,
        count: value.count,
        images: value.files,
      });
      const newProduct = await product.save();
      if (newProduct) {
        resolve({ statusCode: 200, message: "ok" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleUpdateProduct = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(value.productId);
      if (product) {
        product.name = value.name;
        product.price = value.price;
        product.short_desc = value.shortDesc;
        product.long_desc = value.longDesc;
        product.category = value.category;
        product.count = value.count;
        product.images = value.files;
        const newProduct = await product.save();
        if (newProduct) {
          resolve({ statusCode: 200, message: "ok" });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.handleDeleteProduct = (productId) => {
  return new Promise(async(resolve, reject) => {
    try{
      const product = await Product.findByIdAndDelete(productId);
      if(product) {
        resolve({ message: 'ok', statusCode: 200 });
      }
    }catch(err) {
      reject(err);
    }
  })
};

exports.handleGetEditProduct = (productId) => {
  return new Promise(async(resolve, reject) => {
    try{
      const product = await Product.findById(productId);
      if(product) {
        resolve({ message: 'ok', statusCode: 200, product: product });
      }
    }catch(err) {
      reject(err);
    }
  })
}
