import pool from "../config/database";
import express, { type Request, type Response } from "express";
import type {
  Artisan,
  CreateArtisanDTO,
  UpdateArtisanDTO,
  ApiResponse,
} from "../types/artisan.types";

export const createArtisan = async (
  req: Request<{}, {}, CreateArtisanDTO>,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  try {
    const { nom, prenom, profession, telephone, email, ville, rating } =
      req.body;
    if (!nom || !prenom || !profession || !telephone) {
      res.status(400).json({
        success: false,
        error: "les champs sont obligatoire ,Svp repmlir les champs",
      });
      return;
    }

    const phoneRegex = /^0[5-7][0-9]{8}$/;
    if (!phoneRegex.test(telephone)) {
      res.status(400).json({
        success: false,
        error:
          "Le numéro de téléphone doit être au format marocain (06xxxxxxxx)",
      });
      return;
    }

    const query = `INSERT INTO artisans (nom, prenom, profession,telephone, email,ville,rating) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [
      nom,
      prenom,
      profession,
      telephone,
      email || null,
      ville || "tiznit",
      rating || 0,
    ];

    const result = await pool.query<Artisan>(query, values);
    res.status(201).json({
      success: true,
      message: "Artisan ajouter avec success",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log("erreur createArtisan", error.message);
    if (error.code === "23505") {
      res.status(409).json({
        success: false,
        error: "Ce numéro de téléphone ou email existe déjà",
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'ajout de l'artisan",
    });
  }
};

export const getAllArtisns = async (
  req: Request,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  try {
  } catch (error: any) {
    console.log("erreur");
  }
};
