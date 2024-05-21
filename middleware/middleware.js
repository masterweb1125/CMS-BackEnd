import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../handleErrors";
dotenv.config();

const JWT = process.env.JWT_KEY;
// verifying token
export const verifyToken = (
  req,
  res,
  next
) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(createError(401, "You are not authenticated!"));

  try {
    const payload = jwt.verify(token, JWT);
    req.user = payload;
    next();
  } catch (err) {
    next(createError(403, "Token is not valid!"));
  }
};

// ----- verifyUser before making any request --------
export const verifyUser = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        return res
          .status(403)
          .json({ status: 403, message: "You are not authorized!" });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res
          .status(403)
          .json({ status: 403, message: "Sorry, You are not authorized" });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifySupplier = (req, res, next) => {
  try {
    verifyToken(req, res, () => {
      if (req.user.isSupplier || req.user.isAdmin) {
        next();
      } else {
        return res
          .status(403)
          .json({ status: 403, message: "Sorry, You are not authorized" });
      }
    });
  } catch (error) {
    next(error);
  }
};
