import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import schoolRoutes from "./routes/schoolRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(helmet()); // for security http headers
app.use(cors()); // for cross origin requests
app.use(morgan("dev")); // for logging
app.use(express.json()); // for parsing json

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to school management api",
  });
});

app.use("/api/schools", schoolRoutes);

app.use(errorMiddleware);

export default app;
