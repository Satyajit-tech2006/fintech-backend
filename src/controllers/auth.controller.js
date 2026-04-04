import * as authService from '../services/auth.service.js';
import jwt from 'jsonwebtoken';

const isProd = process.env.NODE_ENV === "production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
    
    return res.status(201)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json({ message: "User registered successfully", user, accessToken });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    
    return res.status(200)
      .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
      .json({ message: "User logged in successfully", user, accessToken });
  } 
  catch(error) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.updateUserProfile(req.user.id, { refreshToken: null });

    return res.status(200)
      .clearCookie("refreshToken", COOKIE_OPTIONS)
      .json({ message: "User logged out successfully" });
  } 
  catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) throw new Error("Unauthorized request: No token");

    const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = await authService.generateAccessAndRefreshTokens(decoded.id);

    const loggedInUser = await authService.updateUserProfile(decoded.id, {}); // Fetch fresh user data

    return res.status(200)
      .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
      .json({ message: "Token refreshed successfully", accessToken, user: loggedInUser });
  } 
  catch(error) {
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.status(401).json({ error: error?.message || "Invalid refresh token" });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) throw new Error("Required fields missing");

    await authService.changeUserPassword(req.user.id, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await authService.updateUserProfile(req.user.id, { name, email });
    
    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("Email is required");

    const { resetToken } = await authService.generatePasswordReset(email);
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // In production, you'd use a service like SendGrid or Nodemailer here.
    // await sendEmail({ to: email, subject: "Password Reset", html: `...` });
    console.log(`[SIMULATED EMAIL TO ${email}] Reset Link: ${resetUrl}`);

    res.status(200).json({ message: "Password reset email sent" });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    await authService.resetUserPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } 
  catch(error) {
    res.status(400).json({ error: error.message });
  }
};