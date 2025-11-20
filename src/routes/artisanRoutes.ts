import express from "express";
const router = express.Router();

import {
  createArtisan,
  getAllArtisns,
  getArtisanById,
  updateArtisan,
  deleteArtisan,
  patchArtisan,
  SearchByProfession,
  filterByRating,
} from "../controllers/artisanControllers";

router.post("/", createArtisan);
router.get("/", getAllArtisns);
router.get("/:id", getArtisanById);
router.get("/:id", updateArtisan);
router.get("/:id", patchArtisan);
router.get("/:id", deleteArtisan);
router.get("/search/profession", SearchByProfession);

router.get("/filter/rating", filterByRating);
export default router;
