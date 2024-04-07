// const jwt = require("jsonwebtoken");
// const Student = require("../Model/StudentModel");
// const Leave = require("../Model/leaveModel");


// //getting token function
// const getTokenFrom = (req) => {
//     const authorization = req.get("authorization");
  
//     if (authorization && authorization.startsWith("bearer ")) {
//       return authorization.replace("bearer ", "");
//     }
//   };

//   const postLeave = async (req, res) => {
//     try {
//       //getting body content
//       const { reason, } = req.body;
  
//       //getting token
//       const token = getTokenFrom(req);
  
//       //verify the token
//       const decodedToken = jwt.verify(token, process.env.SECRET);
  
//       //if token is not valid, return error
//       if (!decodedToken.id) {
//         return res
//           .status(401)
//           .json({ message: "session timeout please login again" });
//       }
  
//       //getting logged student to store leave
//       const student = await Student.findById(decodedToken.id);
  
//       //prepare data to push into leave collection
//       const newLeave = new Leave({
//         reason,
//         student: student._id,
//       });
  
//       // saving new leave in collection
//       const savedLeave = await newLeave.save();
  
//       //loading leave id to student collection
//       student.leave = student.leave.concat(savedLeave._id);
  
//       await student.save();
  
//       //sending response
//       res.status(200).json({ message: "leave submitted sucessfully" });
  
//       //
//     } catch (error) {
//       return res.status(400).json({ message: "Please fill all data" });
//     }
//   };





const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const Leave = require("../Model/leaveModel");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
};

const postLeave = async (req, res) => {
  try {
    // Getting request body content
    const { reason } = req.body;

    // Getting token
    const token = getTokenFrom(req);

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // If the token is not valid, return an error
    if (!decodedToken.id) {
      return res.status(401).json({ message: "Session timeout. Please login again" });
    }

    // Getting the logged student to store leave
    const student = await Student.findById(decodedToken.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prepare data to push into the Leave collection
    const newLeave = new Leave({
      reason,
      student: student._id,
    });

    // Saving the new leave in the collection
    const savedLeave = await newLeave.save();

    // Loading the leave id to the student collection
    student.leave = student.leave.concat(savedLeave._id);

    await student.save();

    // Sending a success response
    res.status(200).json({ message: "Leave submitted successfully" });

  } catch (error) {
    // Proper error handling and meaningful error response
    console.error(error);
    return res.status(500).json({ message: "An error occurred while processing your request." });
  }
};


// fetching all leave

const fetchLeave = async (req, res) => {
    try {
      // Getting the token of the authorized student
      const token = getTokenFrom(req);
  
      if (!token) {
        return res.status(401).json({ message: "Session timeout. Please log in again" });
      }
  
      // Verifying the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      if (!decodedToken.id) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      // Fetching leave data and sending the response
      const student = await Student.findById(decodedToken.id).populate("leave");
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.status(200).json(student.leave);
  
    } catch (error) {
      // Proper error handling and meaningful error response
      console.error(error);
      return res.status(500).json({ message: "Error while fetching data. Please log in and try again" });
    }
  };
  

  const deleteLeave = async (req, res) => {
    try {
      //getting body content
      const id = req.params.id;
  
      //getting token
      const token = getTokenFrom(req);
  
      //verify the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      //if token is not valid, return error
      if (!decodedToken.id) {
        return res
          .status(401)
          .json({ message: "session timeout please login again" });
      }
  
      // if leave not found throw error(id: ref to mongodb _id)
  
      const matchedLeave = await Leave.findById(id);

      if (!matchedLeave) {
        return res.status(401).json({ message: "Leave data not found" });
      }
  
      // deleting leave from collection
  
      await Leave.findByIdAndDelete(id);
  
      //removing from student db
  
      await Student.findByIdAndUpdate(
        decodedToken.id,
        {
          $pull: { leave: id },
        },
        { new: true }
      );
  
      //sending response
      res.status(200).json({ message: "leave deleted sucessfully" });
  
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on updating, please try again later" });
    }
  };


  module.exports = {
    postLeave,
    fetchLeave,
    deleteLeave
  
  };