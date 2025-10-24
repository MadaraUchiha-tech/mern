import { tokenGeneration } from "../lib/token.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password atleast 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exist." });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });
    await newUser.save();
    if (newUser) {
      tokenGeneration(newUser._id, res);
      const safeUser = newUser.toObject();
      delete safeUser.password;
      // Include token in response for localStorage storage
      return res.json({ ...safeUser, token: res.locals.token });
    }
  } catch (error) {
    console.log("error in signup", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.status(400).json({ message: "incorrect password" });
    }
    tokenGeneration(user._id, res);
    const safeUser = user.toObject();
    delete safeUser.password;
    // Include token in response for localStorage storage
    return res.status(200).json({ ...safeUser, token: res.locals.token });
  } catch (error) {
    console.log("error in login", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout", error.message);
    res.status(500).json({ message: "Internal Server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;

    if (!profilepic) {
      return res.status(400).json({ message: "profilepic is required." });
    }

    const uploadImage = await cloudinary.uploader.upload(profilepic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilepic: uploadImage.secure_url },
      { new: true }
    );
    const safeUser = updateUser?.toObject?.() ? updateUser.toObject() : updateUser;
    if (safeUser && safeUser.password) delete safeUser.password;
    res.status(200).json(safeUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in Updating Profile", error: error.message });
  }
};
