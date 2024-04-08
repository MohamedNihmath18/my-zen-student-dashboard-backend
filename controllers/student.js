
const Student = require("../Model/StudentModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


/*****************sign up new student*********************/


const signupStudent = async (req, res) => {
    //preparing object to store in collection
  
    try {
      const {
        email,
        firstname,
        lastname,
        contactNo,
        experience,
        qualification,
        password,
      } = req.body;
      //incase of any data missing throw error
      if (!firstname || !email || !password) {
        res.status(400).json({ message: "all fields are mandotary" });
        return;
      }
  
      const matchedStudent = await Student.findOne({ email });
      if (matchedStudent) {
        res.status(400).json({ message: "Student already exists" });
        return;
      }
  
      //generating random string
  
      const randomString =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const link = `https://nihmath-zen-dashboard.netlify.app/confirm/${randomString}`;
   
  
      // hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      
       //creating new student
      const student = await Student.create({
        email,
        firstname,
        lastname,
        contactNo,
        experience,
        qualification,
        password: hashedPassword,
        resetToken: randomString,
      });
     
   await student.save()
   
    //   sending email for Confirm account
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const sendMail = async () => {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: student.email,
            subject: "Confirm account",
            text: link,
     
        });
      };
      // sendMail();
      res.status(201).json({
        message: "User registered successfully",
        data:student
       
      });
     
    } catch (error) {
        return res
        .status(400)
        .json({ message: "Error on sign up please try again" });
    }
    }


    /***************updating student profile*************/

const updateStudent = async (req, res) => {
    try {
      const {
        email,
        firstname,
        lastname,
        contactNo,
        qualification,
        experience,
        password,
      } = req.body;
  
      const matchedStudent = await Student.findOne({ email });
  
      // if student not exist throw error
      if (!matchedStudent) {
        res.status(400).json({
          message: "please enter valid email / Entered mail not registered",
        });
        return;
      }
      // hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // adding body content
      matchedStudent.firstname = firstname;
      matchedStudent.lastname = lastname;
      matchedStudent.contactNo = contactNo;
      matchedStudent.qualification = qualification;
      matchedStudent.experience = experience;
      matchedStudent.password = hashedPassword;
  
      await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);
  
      //sending response
      res
        .status(201)
        .json({ message: `account updated successfully`, matchedStudent });
  
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on updating please try again later" });
    }
  };

/**********confirming/authenticate student account*************/

const confirmStudent = async (req, res) => {
    try {
      const resetToken = req.params.id;
      const matchedStudent = await Student.findOne({ resetToken });
  
      //if student not found throw error
      if (matchedStudent === null || matchedStudent.resetToken === "") {
        return res
          .status(400)
          .json({ message: "student not exists or link expired" });
      }
  
      //confirming and updating account
      matchedStudent.verified = true;
  
      matchedStudent.resetToken = "";
  
      await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);
  
      res.status(201).json({
        message: `${matchedStudent.firstname} account has been verified successfully`,
      });
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "student not exists or link expired" });
    }
  };
  
 /***************Creating link for reseting password*************/

const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const matchedStudent = await Student.findOne({ email });
  
      // if student not exist throw error
      if (!matchedStudent) {
        res.status(400).json({
          message: "please enter valid email / Entered mail not registered",
        });
        return;
      }
  
      //generating randow string
      const randomString =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const link = `https://nihmath-zen-dashboard.netlify.app/reset/${randomString}`;
  
      // adding reset token to student db
      matchedStudent.resetToken = randomString;
  
      await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);
  
      //sending email for resetting
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const sendMail = async () => {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_ADDRESS,
          to: matchedStudent.email,
          subject: "Reset Password",
          text: link,
        });
      };
  
      sendMail()
        .then(() => {
          return res
            .status(201)
            .json({ message: `Mail has been send to ${matchedStudent.email}` });
        })
        .catch((err) => res.status(500).json(err));
  
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error on updating please try again later" });
    }
  };

/*******************reseting password**************************/

const resetPassword = async (req, res) => {
    try {
      const { password } = req.body;
      const resetToken = req.params.id;
  
      // finding matched student
      const matchedStudent = await Student.findOne({ resetToken });
  
      //if student not found throw error
      if (matchedStudent === "null" || matchedStudent.resetToken === "") {
        return res
          .status(400)
          .json({ message: "student not exists or reset link expired" });
      }
  
      // hasing the new password and update
      const hashedPassword = await bcrypt.hash(password, 10);
  
      matchedStudent.password = hashedPassword;
      matchedStudent.resetToken = "";
  
      await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);
  
      //sending response
  
      res.status(201).json({
        message: `${matchedStudent.firstname} password has been updated successfully`,
      });
  
      //
    } catch (error) {
      return res
        .status(400)
        .json({ message: "student not exists or reset link expired" });
    }
  };
  module.exports = {signupStudent,
    updateStudent,
    confirmStudent,
    forgotPassword,
    resetPassword
};
