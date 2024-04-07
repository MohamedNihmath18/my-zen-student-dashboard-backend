const jwt = require("jsonwebtoken");
const Student = require("../Model/StudentModel");
const bcrypt = require("bcrypt");


const login = async (req, res) => {
  try {
    //getting email and password from student
    const { email, password } = req.body;

    // search and find the document of the student with email
    const student = await Student.findOne({ email });

    // if student not found send error
    if (!student) {
      return res
        .status(401)
        .json({ message: "invalid username/Please Sign-up" });
    }

    // if student not verified send error
    if (!student.verified) {
      return res
        .status(401)
        .json({ message: "Account not verfied, kindly check your Email" });
    }

    const passwordCheck = await bcrypt.compare(password, student.password);

    // if student password does not match send error
    if (!passwordCheck) {
      return res.status(401).json({ message: "password incorrect" });
    }

    // generate JWT token
    const studentToken = {
      name: student.firstname,
      id: student._id,
    };

    const token = jwt.sign(studentToken, process.env.SECRET, { expiresIn: 60 * 60 });

    //if everything is ok send response
    res.status(200).send({ message:"successfully login ",token, student  });

    //
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error on sign up please try again" });
  }
};




module.exports = {login};