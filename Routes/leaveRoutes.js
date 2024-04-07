const leaveRouter = require("express").Router();
const { postLeave,fetchLeave,deleteLeave} = require("../controllers/leave");

//posting new leave

leaveRouter.post("/student/leave", postLeave);

//posting leave  fetch all data

leaveRouter.get("/student/leave",fetchLeave);

//posting leave delete 
leaveRouter.delete("/student/leave/:id",deleteLeave);




module.exports = leaveRouter;