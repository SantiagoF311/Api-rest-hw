const jwt = require("jsonwebtoken");
const userModel = require("../service/schemas/users");

const checkToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, "your-secret-key");

    const user = await userModel.findOne({
      _id: decoded.userId,
      token: { $ne: null },
    });

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in checkToken:", error);
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = {
  checkToken,
};
