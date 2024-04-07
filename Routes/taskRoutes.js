const taskRouter = require("express").Router();
const {postTask,fetchTask} = require("../controllers/task");



//posting new task

taskRouter.post("/student/task", postTask);

//fetching All new task

taskRouter.get("/student/alltask", fetchTask);


module.exports = taskRouter;