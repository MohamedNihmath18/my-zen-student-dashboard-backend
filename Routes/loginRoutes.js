const loginRouter = require("express").Router();
const { login } = require("../controllers/login");

loginRouter.post("/student/login", login);

module.exports = loginRouter;