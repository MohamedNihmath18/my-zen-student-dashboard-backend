const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const Portfolio = require("../Model/portfolioModel");


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
  


  //posting new portfolio data

  const postPortfolio = async (req, res) => {
    try {
      // Getting body content
      const { portfolioURL, githubURL, resumeURL } = req.body;
  
      // Getting token
      const token = getTokenFrom(req);
      console.log("🚀 ~ file: portfolio.js:26 ~ postPortfolio ~ token:", token);
  
      if (!token) {
        return res
          .status(401)
          .json({ message: "session timeout please login again" });
      }
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
  
      // If the token is not valid, return an error
      if (!decodedToken.id) {
        return res.status(401).json({ message: "Session timeout. Please log in again" });
      }
  
      // Check if the student has already submitted a portfolio
      const student = await Student.findById(decodedToken.id).populate('portfolio');
  
      if (student.portfolio.length > 0) {
        return res.status(401).json({ message: "Portfolio already submitted" });
      }
  
      // Get the logged student to store the portfolio
      const newPortfolio = new Portfolio({
        portfolioURL,
        githubURL,
        resumeURL,
        student: student._id,
      });
  
      // Save the new portfolio in the collection
      const savedPortfolio = await newPortfolio.save();
  
      // Load the portfolio ID into the student collection
      student.portfolio = [savedPortfolio._id];
  
      await student.save();
  
      // Sending a success response
      res.status(200).json({ message: "Portfolio submitted successfully" });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error while updating. Please try again later" });
    }
  };
  

  // fetching all portfolio

const fetchPortfolio = async (req, res) => {
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

    const portfolios = await Student.findById(decodedToken.id).populate(
      "portfolio"
    );

    res.status(200).json(portfolios.portfolio);
    //
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error on fetching data please login & try again" });
  }
};

  module.exports = {
    postPortfolio,
    fetchPortfolio
  };