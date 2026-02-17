import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { swaggerSpec } from "./config/swagger";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { rateLimiter } from "./middlewares/rateLimiter";
import { sanitizeInput } from "./middlewares/sanitize";
import { requestIdMiddleware } from "./middlewares/requestId";

const app = express();

app.use(helmet());
app.use(hpp());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (env.nodeEnv !== "production") {
        return callback(null, true);
      }
      if (env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(rateLimiter);
app.use(sanitizeInput);

morgan.token("request-id", (req) => req.requestId ?? "-");

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms - :request-id", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" }, message: "Healthy" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`API running on port ${env.port}`);
});
