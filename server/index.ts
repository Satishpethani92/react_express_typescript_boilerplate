import express from "express";
import cors from "cors";
import path from "path";

import { ErrorConstructor } from "./utils/ResHelper";
import { errorMiddleware } from "./middleware/error.middleware";
import { authenticateMiddleware } from "./middleware/jwtAuth.middleware";
import authRoutes from "./routes/auth.route";

import { PrismaClient } from "@prisma/client";
import morgan from "morgan";
import "./utils/Logger";
import { NetLogger } from "./utils/NetLogger";
import logger from "./utils/Logger";

const baseFEApi = "/service/";
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://truly-guided-redfish.ngrok-free.app",
  process.env.LIVE_URL,
];

export const prisma = new PrismaClient();

app.use(
  // @ts-ignore comment
  morgan(":method :url :status :remote-addr", {
    stream: NetLogger.stream,
  })
);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../", "build")));
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(errorMiddleware);

// auth token validation
app.use("/service/*", authenticateMiddleware);
app.use(baseFEApi, authRoutes);

// fallback routes for api
app.use("/service/*", (req, res, next) => {
  const response = new ErrorConstructor(
    `Can't find ${req.method.toUpperCase()} ${req.originalUrl} on this server!`,
    false,
    404
  );
  res.status(response.statusCode).send(response);
});

// serving front-end on other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

app.listen(3001, () => {
  logger.info("Server is running on http://localhost:3001");
});
