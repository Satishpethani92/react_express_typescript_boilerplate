import { NextFunction, Request, Response } from "express";
import CatchAsync from "../utils/CatchAsync";
import { LoginDto, SignUpDto, UserStatusEnum } from "./Dto/auth.dto";
import { Prisma } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { errorHandler, responseHandler } from "../utils/ResHelper";

import { prisma } from "..";
import { passwordCrypt } from "../utils/CommonUtils";
import { pbkdf2Sync } from "crypto";

const secret = process.env.JWT_SECRET || "test secret";

const signup = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phoneNumber, userName, email, password }: SignUpDto = req.body;

    console.log(req.body);
    const { hash, salt } = passwordCrypt(password);

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExist) {
      return errorHandler(res, "This email is already registered!", false, 409);
    }

    const signUpPayload: Prisma.userUncheckedCreateInput = {
      phoneNumber,
      email,
      status: UserStatusEnum.PENDING,
      role: "user",
      userName,
      hash,
      salt,
    };

    const userData = await prisma.user.create({
      data: {
        ...signUpPayload,
      },
    });

    return responseHandler(res, "signed up successfully", true, 201, userData);
  }
);
const login = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginDto = req.body;
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

    if (!emailRegex.test(email)) {
      return errorHandler(res, "Not a valid email address", false, 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user?.status === UserStatusEnum.BLOCKED) {
      return errorHandler(
        res,
        "Your account is blocked, please contact support!",
        false,
        403
      );
    }

    if (user) {
      const generatedHash = pbkdf2Sync(
        password,
        user?.salt,
        1000,
        64,
        "sha512"
      ).toString("hex");
      if (generatedHash === user.hash) {
        const token = sign(
          {
            sub: JSON.stringify({
              id: user.id,
            }),
          },
          secret,
          {
            expiresIn: "7d",
          }
        );
        const responsePayload = {
          id: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userName: user.userName,
          role: user.role,
          token,
        };

        return responseHandler(
          res,
          "logged in successfully",
          true,
          200,
          responsePayload
        );
      } else {
        return errorHandler(res, "Password Incorrect", false, 404);
      }
    } else {
      return errorHandler(res, "User not found", false, 404);
    }
  }
);

export { signup, login };
