import express from "express";
const router = express.Router();

import { createArtisan } from "../controllers/artisanControllers";

router.post("/", createArtisan);

export default router;
