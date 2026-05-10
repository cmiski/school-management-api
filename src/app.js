import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import schoolRoutes from "./routes/schoolRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import apiLimiter from "./middlewares/rateLimiter.js";
import AppError from "./utils/AppError.js";

const app = express();

app.use(helmet()); // for security http headers
app.use(cors()); // for cross origin requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} // for logging
app.use(
  express.json({
    limit: "20kb",
  }),
); // for parsing json

app.use(apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to school management api",
  });
});

app.use("/", schoolRoutes);
app.use("/api/v1/schools", schoolRoutes);

// 404 handler
app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);

export default app;
