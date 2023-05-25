const nodemailer = require("nodemailer");
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

const HTMLContent = `<div>
  <h2>Hey, you</h2>
  <div>You register successfully with our shop name/n</div>
  <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLhGZ3_RgpRLSMPNEsHtALC61ytQ9yZFnqKeGfvhjOMa-vjvdW1h8Sl7LGkOFpMUBIA6g&usqp=CAU' />
  <div><a href='http://localhost:3000'>Click</a><span>to show detail/n</span></div>
  <hr></hr>
  <div></div>
  <div>/n Good day!  </div>
  </div>`;

const sendMailers = async (email, cb) => {
  try {
    const options = {
      from: '"Shop Name", "Hi!"',
      to: email,
      subject: "Sign up info",
      text: "signup",
      html: HTMLContent,
    };
    const info = await transporter.sendMail(options);
    cb(info);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMailers;
