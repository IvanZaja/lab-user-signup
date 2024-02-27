// Load env vars
require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const mongoose = require('mongoose');
const createError = require("http-errors");


// Middlewares

const authMiddleware = require('./middlewares/auth.middleware')

// Init configurations
require("./configs/hbs.config");
require("./configs/db.config");

const app = express();

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Application middlewares
app.use(logger("dev"));
app.use(express.urlencoded());
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(authMiddleware.loadUser);

// Application routes
const routes = require("./configs/routes.config");
app.use("/", routes);

app.use((req, res, next) => next(createError(404, "Route not found")));

app.use((error, req, res, next) => {
  if(
    error instanceof mongoose.Error.CastError &&
    error.message.includes('_id')
  ){
    error = createError(404, 'Resource not found');
  } else if (!error.status) {
    error = createError(500, error)
  }
})

const port = 3000;
app.listen(port, () => console.info(`Application running at port ${port}`));
