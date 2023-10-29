const express = require("express");
const userRouter = require("./routers/user_router");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use("/api/v1/users", userRouter);
module.exports = app;
