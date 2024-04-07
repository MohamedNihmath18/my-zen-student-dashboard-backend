const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const Webcode = require("../Model/webcodeModel");

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

 //posting new webcode project
  const postWebcode = async (req, res) => {
    try {
        //getting body content
        const { frontEndUrl, frontEndCode } = req.body;
    
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
    
        //checking if already submitted
        const webcodes = await Student.findById(decodedToken.id).populate(
          "webcode"
        );
    
        if (webcodes.webcode.length) {
          return res.status(401).json({ message: "Already Submitted" });
        }
    
        //getting logged student to store webcode
        const student = await Student.findById(decodedToken.id);
    
        //prepare data to push into webcode collection
        const newWebcode = new Webcode({
          frontEndUrl,
          frontEndCode,
          student: student._id,
        });
    
        // saving new webcode in collection
        const savedWebcode = await newWebcode.save();
    
        //loading webcode id to student collection
        student.webcode = student.webcode.concat(savedWebcode._id);
    
        await student.save();
    
        //sending response
        res.status(200).json({ message: "webcode submitted sucessfully" });
    
        //
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Error on updating, please try again later" });
      }
};

const fetchWebcode = async (req, res) => {
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
  
      const webcodes = await Student.findById(decodedToken.id).populate(
        "webcode"
      );
  
      res.status(200).json(webcodes.webcode);
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on fetching data please login & try again" });
    }
  };


module.exports = {
    postWebcode,fetchWebcode
  };