const Joi = require("joi");
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerUser = async (req, res) => {
  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      return res.json({
        success: false,
        data: error.details[0].message,
      });
    }

    let emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
      return res.json({
        success: false,
        data: "email already in use!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };

    const newUser = await User.create(user);
    res.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.json({
      success: false,
      data: error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) {
      return res.json({
        success: false,
        data: error.details[0].message,
      });
    }
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        success: false,
        data: "invalid login credentials!",
      });
    }

    let checkPassword = await bcrypt.compare(req.body.password, user.password);

    if (!checkPassword) {
      return res.json({
        success: false,
        data: "invalid login credentials!",
      });
    }
    let token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    // let userData = user.select("-password");

    res.json({
      success: true,
      data: user,
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      data: error,
    });
  }
};

module.exports = { registerUser, loginUser };
