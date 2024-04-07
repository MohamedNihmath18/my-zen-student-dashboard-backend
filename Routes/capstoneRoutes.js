const capstoneRouter = require("express").Router();
const { fetchCapstone,postCapstone} = require("../controllers/capstone");

// fetching all capstone

capstoneRouter.get("/student/capstone",fetchCapstone);

//posting new capstone data

capstoneRouter.post("/student/capstone", postCapstone);


module.exports = capstoneRouter;