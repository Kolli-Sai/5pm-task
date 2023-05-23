//! import express
const express = require("express");
const app = express();
//! import dotenv variables
require("dotenv/config");
//! import mongoose
const mongoose = require("mongoose");
//! import routers
const authRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const auth = require("./middlewares/authentication");

//! middlewares
app.use(express.json());

//! route middlewares
app.use("/api/auth", authRouter);
app.use("/api/auth", auth, taskRouter);

//! start server
const port = process.env.PORT || 8190;
const startServer = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to MongoDB.`);
    app.listen(port, () => {
      console.log(`server listening on port 8190`);
    });
  } catch (error) {
    console.log(`error connecting to server-> ${error}`);
  }
};

startServer();
