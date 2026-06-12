import app from "./app.js";
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log("server on port", PORT);
  });
} catch {
  process.exit(1);
}
