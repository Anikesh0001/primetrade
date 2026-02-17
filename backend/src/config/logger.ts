import winston from "winston";

const { combine, timestamp, printf, errors, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return stack ? `${ts} [${level}]: ${stack}` : `${ts} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [new winston.transports.Console({ format: combine(colorize(), timestamp(), logFormat) })]
});
