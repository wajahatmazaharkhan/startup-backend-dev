import { User } from "../models/User.models.js";
import { Counsellor } from "../models/Counsellor.models.js";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../services/OtpEmailVerification.js";
import { SendOtpForPassword } from "../services/OtpPasswordReset.services.js";
import {
  SignupValidation,
  LoginValidation,
  AdminLoginValidation,
} from "../validator/User.validation.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// ==========================================
// 1. SIGN UP
// ==========================================
export const SignUp = asyncHandler(async (req, res) => {
  const data = SignupValidation.parse(req.body);

  const oldUser = await User.findOne({ email: data.email });
  if (oldUser) {
    return res.status(409).json(new ApiError(409, "User Already Exists"));
  }

  const newUser = await User.create({
    fullname: data.fullname,
    email: data.email,
    phone_number: data.phone_number,
    Password: data.Password,
    dob: data.dob,
    gender: data.gender,
    timezone: data.timezone,
    preferred_language: data.preferred_language,
  });

  if (!newUser) {
    return res.status(400).json(new ApiError(400, "User not created"));
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        fullname: newUser.fullname,
        email: newUser.email,
      },
      "User created successfully"
    )
  );
});

// ==========================================
// 2. LOGIN
// ==========================================
export const Login = asyncHandler(async (req, res) => {
  const data = LoginValidation.parse(req.body);

  const userExisted = await User.findOne({ email: data.email });

  if (!userExisted) {
    return res.status(401).json(new ApiError(401, "Invalid Email or Password"));
  }

  const isPasswordValid = await userExisted.comparePassword(data.Password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid Email or Password"));
  }

  await User.updateOne(
    { _id: userExisted._id },
    { $set: { last_login: new Date() } }
  );

  const token = userExisted.generateAuthToken();

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("authToken", token, option)
    .json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: userExisted._id,
            fullname: userExisted.fullname,
            email: userExisted.email,
            role: userExisted.role,
          },
        },
        "Login Successful"
      )
    );
});

// ==========================================
// 3. ADMIN LOGIN
// ==========================================
export const adminLogin = asyncHandler(async (req, res) => {
  const data = AdminLoginValidation.parse(req.body);

  const userExisted = await User.findOne({ email: data.email });

  if (!userExisted) {
    return res.status(404).json(new ApiError(404, "User Not Found"));
  }

  if (userExisted.role !== "admin") {
    return res.status(403).json(new ApiError(403, "Only Admins can Login"));
  }

  const isPasswordValid = await userExisted.comparePassword(data.Password);

  if (!isPasswordValid) {
    return res.status(400).json(new ApiError(400, "Invalid Email or Password"));
  }

  const token = userExisted.generateAuthToken();

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("authToken", token, option)
    .json(
      new ApiResponse(
        200,
        {
          token,
          user: {
            id: userExisted._id,
            fullname: userExisted.fullname,
            email: userExisted.email,
            role: userExisted.role,
          },
        },
        "Admin Login Successful"
      )
    );
});

// ==========================================
// 4. SEND EMAIL OTP
// ==========================================
export const sendEmailOtp = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json(new ApiError(400, "Email Address is Required"));
  }

  const userFound = await User.findOne({ email });

  if (!userFound) {
    return res.status(404).json(new ApiError(404, "User not Found"));
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  userFound.otp = hashedOtp;
  userFound.otpExpiry = otpExpiry;
  await userFound.save();

  try {
    await sendOtpEmail(userFound.fullname, userFound.email, otp);
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to send email"));
  }

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully!"));
});

// ==========================================
// 5. VERIFY OTP
// ==========================================
export const VerifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json(new ApiError(400, "OTP and Email are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  if (user.otpExpiry && user.otpExpiry < Date.now()) {
    return res.status(400).json(new ApiError(400, "OTP Expired. Request new!"));
  }

  const isMatch = await bcrypt.compare(otp, user.otp || "");

  if (!isMatch) {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  user.isVerified = true;

  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Email verified Successfully!"));
});

// ==========================================
// 6. PASSWORD RESET OTP REQUEST
// ==========================================
export const passwordOtp = asyncHandler(async (req, res) => {
  const { email } = req.params; // Changed to params to match your route

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = hashedOtp;
  user.otpExpiry = otpExpiry;
  await user.save();

  try {
    await SendOtpForPassword(user.fullname, user.email, otp);
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Failed to send email"));
  }

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully!"));
});

// ==========================================
// 7. VERIFY PASSWORD OTP
// ==========================================
export const VerifyPasswordResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json(new ApiError(400, "Email and OTP are required"));
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  if (user.otpExpiry && user.otpExpiry < Date.now()) {
    return res.status(400).json(new ApiError(400, "OTP has expired"));
  }

  const isMatch = await bcrypt.compare(otp, user.otp || "");

  if (!isMatch) {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  user.passwordOtpVerify = true;

  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Email Verified Successfully"));
});

// ==========================================
// 8. RESET PASSWORD
// ==========================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { Email, newPassword } = req.body;

  const user = await User.findOne({ email: Email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  if (user.passwordOtpVerify !== true) {
    return res.status(403).json(new ApiError(403, "OTP verification required"));
  }

  user.Password = newPassword;

  user.passwordOtpVerify = false;
  user.otpExpiry = undefined;

  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password has been Reset successfully!"));
});

// History Controller
export const getHistory = asyncHandler(async (req, res) => {
  const { counsellorId } = req.params;
  if (!counsellorId) return res.status(400).json(new ApiError(400, "Counsellor ID required"));

  const counsellor = await Counsellor.findById(counsellorId).populate("history.customerId", "fullname email phone_number");
  if (!counsellor) return res.status(404).json(new ApiError(404, "Counsellor not Found"));

  const sortedHistory = counsellor.history.sort((a, b) => b.visitDate - a.visitDate);

  return res.status(200).json(new ApiResponse(200, { history: sortedHistory }));
});