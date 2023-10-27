import express from "express";
import { login, signup } from "../controllers/auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { LoginDto, SignUpDto } from "../controllers/Dto/auth.dto";

const router = express.Router();

router.post("/auth/signup", validationMiddleware(SignUpDto), signup);
router.post("/auth/login", validationMiddleware(LoginDto), login);

export default router;
