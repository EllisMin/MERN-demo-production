const User = require("../models/user");
const io = require("../socket");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Fetched users",
      users: users
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    // Clear documents
    const totalUsers = await User.find().countDocuments();
    if (totalUsers !== -1 && totalUsers >= 25) {
      User.deleteMany({}, () => {
        console.log("Documents limit exceeded; cleared docs");
      });
    }

    let occupation = req.body.occupation;
    if (!occupation) occupation = "unemployed";
    const user = new User({
      name: req.body.name,
      age: req.body.age,
      occupation: occupation
    });
    await user.save(); // Save in db

    // Sends message to all connected users
    io.getIO().emit("user event", {
      action: "add",
      user: { ...user._doc }
    });

    res.status(201).json({
      message: "User created",
      user: user
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Couldn't find the user");
      error.statusCode = 404;
      throw error;
    }
    await User.findByIdAndRemove(userId);

    // Sends message to all connected users
    io.getIO().emit("user event", {
      action: "delete",
      userId: userId
    });

    res.status(200).json({ message: "User removed" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
