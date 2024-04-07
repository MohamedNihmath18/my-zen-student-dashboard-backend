const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const Task = require("../Model/taskModel");


const getTokenFrom = (req) => {
    const authorization = req.get("authorization");
    // Log the received authorization header for debugging
    if (authorization && authorization.startsWith("Bearer ")) {
      // Log the extracted token for debugging
      return authorization.replace("Bearer ", "");
    }
    // Return null if no valid token was found
    return null;
  };

// post new task
  const postTask = async (req, res) => {
    try {
      //getting body content
      const {
        frontEndCode,
        frontEndURL,
        backEndCode,
        backEndURL,
        task,
        title,
        check,
      } = req.body;
  
      //getting token
      const token = getTokenFrom(req);

      
      if (!token) {
        return res
          .status(401)
          .json({ message: "session timeout please login again" });
      }


      //verify the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      //if token is not valid, return error
      if (!decodedToken.id) {
        return res
          .status(401)
          .json({ message: "session timeout please login again" });
      }
  
      //getting logged student to store task
      const student = await Student.findById(decodedToken.id);
  
      //checking task already submitted or not
      const matchedtask = await Task.findOne({ check });
      if (matchedtask) {
        res.status(400).json({ message: "Task already submitted" });
        return;
      }
  
      //prepare data to push into task collection
      const newTask = new Task({
        frontEndCode,
        frontEndURL,
        backEndCode,
        backEndURL,
        task,
        title,
        check,
        student: student._id,
      });
  
      // saving new task in collection 
      const savedTask = await newTask.save();
  
      //loading task id to student collection
      student.task = student.task.concat(savedTask._id);
  
      await student.save();
  
      //sending response
      res.status(200).json({ message: "task submitted sucessfully" });
  
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on updating, please try again later" });
    }
  };
  
  // fetching for task student one student

const fetchTask = async (req, res) => {
    try {
      //getting token of authorised student
  
      const token = getTokenFrom(req);
      if (!token) {
        return res
          .status(401)
          .json({ message: "session timeout please login again" });
      }
      // verifying the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      if (!decodedToken.id) {
        return res.status(401).json({ message: "token invalid" });
      }
  
      //sending response data
  
      const tasks = await Student.findById(decodedToken.id).populate("task");
  
      res.status(200).json(tasks.task);
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on fetching data please login & try again" });
    }
  };
  
  module.exports = {postTask,fetchTask};