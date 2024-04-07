const studentRouter = require("express").Router();

const { signupStudent,updateStudent,confirmStudent,forgotPassword,resetPassword } = require("../controllers/student")
//new user signup api
studentRouter.post("/student/signup", signupStudent)

/***************updating student profile*************/

studentRouter.put("/student/update", updateStudent);


/**********confirming/authenticate student account*************/

studentRouter.patch("/student/confirm/:id", confirmStudent);

/***************Creating link for reseting password*************/

studentRouter.put("/student/forgot", forgotPassword);

/*******************reseting password**************************/

studentRouter.patch("/student/reset/:id", resetPassword);


module.exports = studentRouter