const User = require("../models/user.js");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Register a new user
exports.register = async (request, reply) => {
  try {
    // validate body
    const { name, email, password, country } = request.body || {};
    if (!request.body) {
      return reply.status(400).send({ error: "Request body is missing" });
    }
    // validate fields
    if (!name || !email || !password || !country) {
      return reply.status(400).send({
        error: "All fields (name, email, password, country) are required",
      });
    }
    // ...existing code...

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, country });
    await user.save();

    reply.code(201).send({ message: "user registed successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.login = async (request, reply) => {
  try {
    const { email, password } = request.body || {};

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(404).send({ message: "Invalid email or password" });
    }

    //validate the password

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.code(400).send({ messagge: "Invalid email or password" });
    }

    const token = request.server.jwt.sign({ id: user._id });
    reply.send({ token });
  } catch (error) {
    reply.send(error);
  }
};

exports.forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return reply.notFound("User not found");
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPassowordExpiry = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetPassowordExpiry;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:${process.env.PORT}/api/auth/reset-password?token=${resetToken}`;

    reply.send({ resetUrl });
  } catch (error) {
    reply.send(error);
  }
};

exports.resetPassword = async (request, reply) => {
  try {
    const resetToken = request.params.token;
    const { newPassword } = request.body;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return reply.badRequest("Invalid or expired password reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    reply.send({ message: "password reset successfully" });
  } catch (error) {
    reply.send(error);
  }
};

exports.logout = async(request,reply)=>{
  //JWT are stateless , use starategy like referesh token or blacklist token for more
  reply.send({message:"User logged out"})
}