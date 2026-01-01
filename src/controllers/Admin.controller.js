import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users)
    return res
      .status(404)
      .json(new ApiError(404, "No users found", null, null));
  return res.status(200).json(new ApiResponse(200, users));
});
