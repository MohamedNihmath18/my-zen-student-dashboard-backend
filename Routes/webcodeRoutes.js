const webcodeRouter = require("express").Router();
const { postWebcode,fetchWebcode} = require("../controllers/webcode");


//new post for webcode project
webcodeRouter.post("/student/webcode",postWebcode);

//fetch webcode data
webcodeRouter.get("/student/getwebcode",fetchWebcode);



module.exports = webcodeRouter;