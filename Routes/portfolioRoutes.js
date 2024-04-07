const portfolioRouter = require("express").Router();
const { postPortfolio,  fetchPortfolio,} = require("../controllers/portfolio");





//posting new portfolio data

portfolioRouter.post("/student/portfolio", postPortfolio);
//fetch data for portfolio
portfolioRouter.get("/student/portfolio", fetchPortfolio);


module.exports = portfolioRouter;