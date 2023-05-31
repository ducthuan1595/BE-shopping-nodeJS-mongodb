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

exports.addProduct = async(req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const shortDesc = req.body.shortDesc;
  const longDesc = req.body.longDesc;
  const category = req.body.category;
  const count = req.body.count;
  let newArr = [];//handle when only 1 image
  const images = req.files.images;
  if(Array.isArray(images)) {
    newArr = images;
  }else {
    newArr.push(images);
  }
  const files = newArr?.map(file => file.data);

  if(name && price && shortDesc && longDesc && category && count && files) {
    const value = {
      name,
      price,
      shortDesc,
      longDesc,
      category,
      count,
      files
    };
    const data = await productService.handleAddProduct(value);
    if(data) {
      res.status(data.statusCode).json({ message: data.message });
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
};

exports.updateProduct = async(req, res) => {
  const productId = req.body.productId;
  const name = req.body.name;
  const price = req.body.price;
  const shortDesc = req.body.shortDesc;
  const longDesc = req.body.longDesc;
  const category = req.body.category;
  const count = req.body.count;
  const images = req.files.images;
  let newArr = [];//handle when only 1 image
  if(Array.isArray(images)) {
    newArr = images;
  }else {
    newArr.push(images);
  }
  const files = newArr?.map(file => file.data);

  if(productId && name && price && shortDesc && longDesc && category && count && files) {
    const value = {
      productId,
      name,
      price,
      shortDesc,
      longDesc,
      category,
      count,
      files
    };
    const data = await productService.handleUpdateProduct(value);
    if(data) {
      res.status(data.statusCode).json({ message: data.message });
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
};

exports.deleteProduct = async(req, res) => {
  const productId = req.params.productId;
  if(productId) {
    const data = await productService.handleDeleteProduct(productId);
    if(data) {
      res.status(data.statusCode).json({ message: data.message });
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
};

exports.getEditProduct = async(req, res) => {
  const productId = req.params.productId;
  if(productId) {
    const data = await productService.handleGetEditProduct(productId);
    if(data) {
      res.status(data.statusCode).json({ message: data.message, product: data.product });
    }
  }else {
    res.status(404).json({ message: 'Invalid value' });
  }
}

