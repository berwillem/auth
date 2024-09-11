const User = require("../models/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// register function :
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  // validation :
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // checking if the user exsiste in the database :
  const user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  try {
    // hashing password :
    const hashedPassword = await bcrypt.hash(password, 8);
    // creating the user with hashed password :
    // new user is a const that will be used to return the user created
    // User is the model
    const newuser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    // returning the user and status code :
    res.status(201).json(newuser);
  } catch (err) {
    // returning a status code and error message :
    res.status(500).json({ message: err.message });
  }
};

// login function :
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // checking if the user exsiste in the database :
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "User does not exist please register" });
  }

  // checking if the password is correct :
  const correctPassword = await bcrypt.compare(password, user.password);
  // we have a choice between ux and security depending on the project we are working on
  if (!correctPassword) {
    return res.status(400).json({ message: "Wrong password" });
  }
  try {
    // generate the token for the succefuly loged user and send it back with a status and the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // dont send the user password back
    res.status(200).json({ user: user.username, token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getallusers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
