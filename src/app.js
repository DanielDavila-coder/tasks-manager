import express from "express";
import morgan from "morgan";
import cors from "cors";
import { CLIENT_URL } from "./config.js";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: CLIENT_URL,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

app.use(errorHandler);

export default app;