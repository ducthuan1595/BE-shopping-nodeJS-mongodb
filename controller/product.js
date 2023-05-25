const productService = require('../services/product');

exports.getAllProduct = async(req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 8;
  const products = await productService.handleGetAllProduct(limit, page);
  if(products) {
    res.status(200).json({ message: 'ok', products: products })
  }else {
    res.status(404).json({ message: 'Not found', errCode: -1 })
  }
};




