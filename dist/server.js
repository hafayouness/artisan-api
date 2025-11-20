import express from "express";
import dotenv from "dotenv";
import pool from "../src/config/database.js";
dotenv.config;
const app = express();
const PORT = parseInt(process.env.PORT || "3000");
app.use(express.json());
app.listen(PORT, () => {
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🗄️  Base: ${process.env.DB_NAME}`);
});
//# sourceMappingURL=server.js.map
