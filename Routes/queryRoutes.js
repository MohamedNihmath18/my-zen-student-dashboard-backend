const queryRouter = require("express").Router();
const {postQuery,deleteQuery,fetchQuery} = require("../controllers/query");

//posting new query 

queryRouter.post("/student/query", postQuery);

//deleting query

queryRouter.delete("/student/query/:id", deleteQuery);

// fetching all query

queryRouter.get("/student/query", fetchQuery);


module.exports = queryRouter;