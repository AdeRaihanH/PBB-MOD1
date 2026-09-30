import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import memberRoutes from "./routes/memberRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Library Loan API is running" });
});

app.use("/api/members", memberRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/loans", loanRoutes);

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
