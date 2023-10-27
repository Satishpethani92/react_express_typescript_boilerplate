import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";
import { prisma } from "..";
import { DecodedUserDto } from "../controllers/Dto/auth.dto";
import { errorHandler } from "../utils/ResHelper";

const secret = process.env.JWT_SECRET || "test secret";

const publicRoutes = ["/service/auth/signup", "/service/auth/login"];

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the Authorization header
  const { baseUrl } = req;

  // Check if the current route is in the array of public routes
  if (publicRoutes.includes(baseUrl)) {
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];

  // Check if the token exists
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = verify(token, secret);

    const userDecoded: DecodedUserDto = JSON.parse(
      (decoded.sub || "").toString()
    );

    // Attach the decoded token to the request object for further use
    req.body.decodedUser = userDecoded;

    const user = await prisma.user.findUnique({
      where: {
        id: userDecoded.id,
      },
    });
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid token" });
  }
};
