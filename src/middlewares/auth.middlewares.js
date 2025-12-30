import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const auth = (req, res, next) => {
  const { access_token, refresh_token, authToken } = req.cookies;

  try {
    // 1️⃣ TRY GOOGLE AUTH FIRST (but don't fail hard)
    if (access_token && refresh_token) {
      try {
        const publicKey = fs.readFileSync(
          path.join(__dirname, "../public.key"),
          "utf-8"
        );

        const decoded = jwt.verify(access_token, publicKey, {
          algorithms: ["RS256"],
        });

        req.user = decoded.userId;
        return next();
      } catch (err) {
        // IMPORTANT: swallow Google failure and FALL THROUGH
        console.warn("Google token invalid, falling back");
      }
    }

    //  FALLBACK: normal email/password auth
    if (!authToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized: No valid token"));
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
    req.user = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json(new ApiError(401, "Invalid or expired token"));
  }
};

export default auth;

// only admin middleware
export const adminVerify = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized: No Token Provided"));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res
      .status(401)
      .json(new ApiError(401, "Invalid Token || OR || Token Expired"));
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .json(new ApiError(403, "Access denied: Admins only"));
  }

  req.user = user; // attach full user to request
  next();
});

// only counsellor middleware
export const counsellorVerify = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized: No token provided"));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return res.status(401).json(new ApiError(401, "Invalid or expired token"));
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.role !== "counsellor") {
    return res
      .status(403)
      .json(new ApiError(403, "Access Denied: Counsellors only"));
  }

  req.user = user;
  next();
});
