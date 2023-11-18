const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jimp = require("jimp");
const path = require("path");
const gravatar = require("gravatar");
const userModel = require("../service/schemas/users");

const signUp = async (req, res, next) => {
  try {
    const { error } = userModel.validateAdd(req.body);
    const avatarURL = gravatar.url(req.body.email, {
      s: "250",
      r: "pg",
      d: "mm",
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await userModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL
      },
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res, next) => {
  try {
    const { error } = userModel.validateAdd(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await userModel.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: existingUser._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    existingUser.token = token;
    await existingUser.save();

    res.status(200).json({
      token,
      user: {
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signOut = async (req, res, next) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    console.error("Error in signOut:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const avatarPath = path.join(
      __dirname,
      `../public/avatars/${req.file.filename}`
    );

    const image = await jimp.read(avatarPath);
    await image.resize(250, 250);
    await image.write(avatarPath);

    req.user.avatarURL = `/avatars/${req.file.filename}`;
    await req.user.save();

    res.status(200).json({
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    console.error("Error in updateAvatar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  updateAvatar,
};
