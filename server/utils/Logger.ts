import winston, { format } from "winston";
import "winston-daily-rotate-file";
import * as path from "path";
import * as fs from "fs";
import _ from "lodash";
import { argv } from "yargs";
import stack from "callsite";

const { combine, timestamp, printf } = format;

const logPath = path.join(__dirname, "../logs");
const appPath = path.join(logPath, "info");
const debugPath = path.join(logPath, "debug");
const errorPath = path.join(logPath, "error");
const networkPath = path.join(logPath, "network");

const defaultLogLevel = "info";
type LogLevel = "info" | "debug" | "error" | "silly";
const validLogLevels: LogLevel[] = ["info", "debug", "error", "silly"];
let logLevel: LogLevel = defaultLogLevel;

if (argv["log-level"]) {
  if (validLogLevels.includes(argv["log-level"] as LogLevel)) {
    console.warn(`[*] log level: ${argv["log-level"]}`);
    logLevel = argv["log-level"] as LogLevel;
  } else {
    console.warn("[*] invalid log level");
  }
}

if (!fs.existsSync(logPath)) {
  console.log("[*] creating log folders");
  fs.mkdirSync(logPath);
  fs.mkdirSync(appPath);
  fs.mkdirSync(debugPath);
  fs.mkdirSync(errorPath);
  fs.mkdirSync(networkPath);
} else {
  if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);
  if (!fs.existsSync(debugPath)) fs.mkdirSync(debugPath);
  if (!fs.existsSync(errorPath)) fs.mkdirSync(errorPath);
  if (!fs.existsSync(networkPath)) fs.mkdirSync(networkPath);
}

const levels = {
  error: 0,
  info: 1,
  debug: 2,
  silly: 3,
};

const formatter = winston.format.combine(winston.format.colorize());

const logger = winston.createLogger({
  levels,
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp, error, ...rest }) => {
      if (_.isObject(message)) message = JSON.stringify(message);

      let allRest = "";
      rest = rest[Symbol.for("splat")] || [];

      if (rest.length > 0) {
        allRest = rest
          .map((e: any) => {
            if (_.isObject(e) as any) {
              if (e.stack) {
                return e.stack;
              }
              delete e.apiKey;
              delete e.apiSecret;
              delete e.token;
              delete e.tokenId;
              delete e.tokenSecret;
              delete e.walletAddress;
              delete e.privateKey;
              delete e.passPhrase;
              return JSON.stringify(e);
            }
            return e;
          })
          .join(" ");
      }

      let infoStack = "\nStackTrace::: ";

      stack().forEach(function (site) {
        infoStack += `File: ${site.getFileName()}:${site.getLineNumber()} Function: ${
          site.getFunctionName() || "anonymous"
        } \n`;
      });

      if (error) {
        if (error.stack) return `${timestamp} ${level}: ${message} Error:${error.stack} ${allRest}`;
        else {
          return `${timestamp} ${level}: ${infoStack}: ${message} Error: ${JSON.stringify(error)} ${allRest}`;
        }
      }

      if (level === "error") {
        return `${timestamp} ${level}: ${infoStack} ${message} ${allRest}`;
      }

      return `${timestamp} ${level}: ${message} ${allRest}`;
    }),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${errorPath}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "10m",
    }),
    new winston.transports.DailyRotateFile({
      filename: `${appPath}/info-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "info",
      maxSize: "10m",
    }),
    new winston.transports.DailyRotateFile({
      filename: `${debugPath}/debug-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "debug",
      maxSize: "10m",
    }),

    new winston.transports.Console({
      format: formatter,
      level: logLevel,
    }),
  ],
});

export default logger;
(global as any).logger = logger;
