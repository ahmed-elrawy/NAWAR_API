const express = require("express");

const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const phoneRoute = require("./routes/phone");
// const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");
// const stripeRoute = require("./routes/stripe");
app.use(cors());




dotenv.config();
app.use(express.static(__dirname+'/uploads'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false })) // for upload img


mongoose
// MONGO_URL=mongodb://localhost/imagesInMongoApp

  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/phone", phoneRoute);
// app.use("/api/products", productRoute);
// app.use("/api/carts", cartRoute);
// app.use("/api/orders", orderRoute);
// app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, () => {  
  console.log("Backend server is running!");
});