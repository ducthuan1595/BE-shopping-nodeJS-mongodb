const nodemailer = require("nodemailer");
const Product = require('../model/product');
const Buffer = require("node:buffer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADDRESS_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const HTMLContent = (order, items) => `<html>
<head>
<style>

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
table {
  border-collapse: collapse;
  width: 100%;
}

.bold {
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
}
.info {
  margin: 5px 0;
}
</style>
</head>
<body>
  <h2>Hi, ${order.user.name}</h2>
  <div className='info'>Phone: ${order.user.phone}</div>
  <div className='info'>Address: ${order.user.address}</div>
  <table>
  <tr>
    <th>Product's Name</th>
    <th>Image</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
  </tr>
    ${items.map(p => {
      const item = p._doc
      const price = item?.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const amount = (item?.price * p.quantity)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const base64 = Buffer.Buffer.from(item.images[0]).toString('base64');
      return `
        <tr>
          <td>${item.name}</td>
          <td><img style="height:100px;" src=${'data:image/jpeg;base64,' + base64} alt=${item.name} /></td>
          <td>${price}</td>
          <td>${p.quantity}</td>
          <td>${amount}</td>
        </tr>
      `
    }).join('')}
</table>
  <div className='bold'>TOTAL: ${order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}VND</div>
  <div>Thank you very much for companion with us.</div>
  <div> Good day!  </div>
</body>
</html>`;

const sendMailers = async (order, cb) => {
  try {
    // const order = await Order.findOne({email: email});
    // const overOrder = await order.populate('items');
    const product = await Product.find();
    const arrItem = order.items;
    let newArr = [];
    for(let i = 0; i < arrItem.length; i++) {
      for(let j = 0; j < product.length; j++) {
        if (arrItem[i].productId.toString() === product[j]._id.toString()) {
          const newProduct = {...product[j]};
          newProduct.quantity = arrItem[i].quantity;
          newArr.push(newProduct);
        }
      }
    }

    const options = {
      from: '"BOUTIQUE", "Hi!"',
      to: order.user.email,
      subject: `YOUR ORDER INFORMATION `,
      text: "signup",
      html: HTMLContent(order, newArr),
      attachDataUrls: true
    };
    const info = await transporter.sendMail(options);
    cb(info);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMailers;
