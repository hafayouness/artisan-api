import express from "express";
import dotenv from "dotenv";
import pool from "./config/database.js";
import artisanRoutes from "../src/routes/artisanRoutes.js";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000");

app.use(express.json());
app.use("/api/artisans", artisanRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Sertiznit fonctionne !" });
});
app.get("/artisans", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM artisans ORDER BY rating DESC"
    );
    res.json({
      total: result.rows.length,
      artisans: result.rows,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré !`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/tables`);
});
