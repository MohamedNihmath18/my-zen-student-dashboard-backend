const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const Query = require("../Model/queryModel");


//getting token function
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
  

  //posting new query

const postQuery = async (req, res) => {
    try {
      //getting body content
      const { queryTitle, queryDesc } = req.body;
  
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
  
      //getting logged student to store query
      const student = await Student.findById(decodedToken.id);
  
      //prepare data to push into query collection
      const newQuery = new Query({
        queryTitle,
        queryDesc,
        student: student._id,
      });
  
      // saving new query in collection
      const savedQuery = await newQuery.save();
  
      //loading query id to student collection
      student.query = student.query.concat(savedQuery._id);
  
      await student.save();
  
      //sending response
      res.status(200).json({ message: "query applied sucessfully" });
  
      //
    } catch (error) {
      return res.status(400).json({ message: "Please fill all data" });
    }
  };
  
  //deleting query

  const deleteQuery = async (req, res) => {
    try {
      // Getting the query ID from the request parameters
      const id = req.params.id;
  
      // Getting the token from the request
      const token = getTokenFrom(req);
  
      // Check if a token is present
      if (!token) {
        return res.status(401).json({ message: "Session timeout. Please log in again" });
      }
  
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      // Check if the token is valid and associated with the user
      if (!decodedToken.id) {
        return res.status(401).json({ message: "Session timeout. Please log in again" });
      }
  
      // Check if the query exists
      const matchedQuery = await Query.findById(id);
  
      if (!matchedQuery) {
        return res.status(404).json({ message: "Query data not found" });
      }
  
      // Deleting the query from the collection
      await Query.findByIdAndDelete(id);
  
      // Removing the query ID from the student's "query" array
      await Student.findByIdAndUpdate(
        decodedToken.id,
        {
          $pull: { query: id },
        },
        { new: true }
      );
  
      // Sending a success response
      res.status(200).json({ message: "Query deleted successfully" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error while updating. Please try again later" });
    }
  };
  
  // fetch all query data
  const fetchQuery = async (req, res) => {
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
  
      const querys = await Student.findById(decodedToken.id).populate("query");
  
      res.status(200).json(querys.query);
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on fetching data please login & try again" });
    }
  };
  


  module.exports = {
    postQuery,deleteQuery,fetchQuery
  
  };