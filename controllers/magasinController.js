const Magasin = require("../models/Magasin");
const User = require("../models/User");
exports.createMagasin = async (req, res) => {
  // when we create a magasin it should be added on the user modal too
  const { userId } = req.params;
  const { name } = req.body;
  try {
    const user = await User.findById(userId);
    const magasin = await Magasin.create({ name, owner: userId });
    user.magasins.push(magasin._id);
    await user.save();
    res.status(201).json(magasin);
  } catch (err) {
    console.log(err);
  }
};
