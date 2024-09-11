const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const {
  register,
  login,
  getallusers,
} = require("./controllers/userController");
const { authCheck } = require("./middleware/checkAuth");
dotenv.config();
app.use(express.json());

app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/users", authCheck, getallusers);

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
