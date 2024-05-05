const express = require("express");
require("express-async-errors");
const { connectDB } = require("./config/dbconnect");
const fs = require("fs");

// Ensure the "uploads/" directory exists
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

var cors = require("cors");
//external midddleware
const morgan = require("morgan");

const { routeNotFound } = require("./middleware/NotFoundMiddleware");
const { errorHandler } = require("./middleware/errorhandler");

//routers import
const homeRoute = require("./routes/homeRoute");
const authRoutes = require("./routes/userRoutes");
const categoriesRouter = require("./routes/categories");
const postRouter = require("./routes/postRoutes");
const { connectToCloudinary } = require("./config/cloudinaryConnect");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth/home", homeRoute);

 app.use(routeNotFound);
app.use(errorHandler);

const startApp = async () => {
  try {
    await connectDB();
    connectToCloudinary();
    app.listen(PORT, () => console.log(`server starting at ${PORT}`));
  } catch (error) {
    console.error("Error starting the app:", error);
  }
};

startApp();
