const express = require("express");
const userRouter = require("./routers/user_router");
const buzzRouter = require("./routers/buzz_router");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/buzzes", buzzRouter);
module.exports = app;
