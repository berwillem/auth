const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const {
  register,
  login,
  getallusers,
  changePassword,
} = require("./controllers/userController");
const { authCheck } = require("./middleware/checkAuth");
const { createMagasin } = require("./controllers/magasinController");
const cors = require("cors");
dotenv.config();
app.use(express.json());

// cors policy
app.use(cors());
app.post("/auth/register", register);
app.post("/auth/login", login);
app.put("/auth/changepassword/:userId", changePassword);
app.get("/auth/users", authCheck, getallusers);
app.post("/magasins/:userId", createMagasin);

// access log
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("dev", { stream: logStream }));
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
