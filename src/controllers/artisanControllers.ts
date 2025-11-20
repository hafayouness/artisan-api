import pool from "../config/database";
import express, { type Request, type Response } from "express";
import type {
  Artisan,
  CreateArtisanDTO,
  UpdateArtisanDTO,
  ApiResponse,
  StatsResponse,
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
  res: Response<ApiResponse<Artisan[]>>
): Promise<void> => {
  try {
    const query = `SELECT * FROM artisans ORDER BY  id ASC`;
    const result = await pool.query<Artisan>(query);
    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.log("erreur getAllArtisans", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération des données.",
    });
  }
};

export const getArtisanById = async (
  req: Request,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM artisans WHERE id =$1`;
    const result = await pool.query<Artisan>(query, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: `aucun artisan trouve avec l'id ${id}`,
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log("Erreur getArtisanById:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};
export const patchArtisan = async (
  req: Request<{ id: string }, {}, Partial<UpdateArtisanDTO>>,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  const { id } = req.params;
  const { nom, prenom, profession, telephone, email, ville, rating } = req.body;

  try {
    const checkQuery = `SELECT * FROM artisans WHERE id = $1`;
    const checkResult = await pool.query<Artisan>(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: `Aucun artisan trouvé avec l'ID ${id}`,
      });
      return;
    }

    const artisan = checkResult.rows[0];

    if (!artisan) {
      res.status(404).json({
        success: false,
        error: `Aucun artisan trouvé avec l'ID ${id}`,
      });
      return;
    }

    const updateQuery = `
      UPDATE artisans
      SET nom = $1,
          prenom = $2,
          profession = $3,
          telephone = $4,
          email = $5,
          ville = $6,
          rating = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      nom || artisan.nom,
      prenom || artisan.prenom,
      profession || artisan.profession,
      telephone || artisan.telephone,
      email !== undefined ? email : artisan.email,
      ville || artisan.ville,
      rating !== undefined ? rating : artisan.rating,
      id,
    ];

    const result = await pool.query<Artisan>(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Artisan modifié avec succès",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log("Erreur patchArtisan", error.message);

    if (error.code === "23505") {
      res.status(409).json({
        success: false,
        error: "Ce numéro de téléphone ou email existe déjà",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la modification",
    });
  }
};
export const updateArtisan = async (
  req: Request<{ id: string }, {}, UpdateArtisanDTO>,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  const { id } = req.params;
  const { nom, prenom, profession, telephone, email, ville, rating } = req.body;

  try {
    const checkQuery = `SELECT * FROM artisans WHERE id = $1`;
    const checkResult = await pool.query<Artisan>(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: `Aucun artisan trouvé avec l'ID ${id}`,
      });
      return;
    }

    if (!nom || !prenom || !profession || !telephone || !ville) {
      res.status(400).json({
        success: false,
        error:
          "Tous les champs obligatoires doivent être fournis (nom, prenom, profession, telephone, ville)",
      });
      return;
    }

    const updateQuery = `
      UPDATE artisans
      SET nom = $1,
          prenom = $2,
          profession = $3,
          telephone = $4,
          email = $5,
          ville = $6,
          rating = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      nom,
      prenom,
      profession,
      telephone,
      email || null,
      ville,
      rating !== undefined ? rating : null,
      id,
    ];

    const result = await pool.query<Artisan>(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Artisan remplacé avec succès",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log("Erreur putArtisan", error.message);

    if (error.code === "23505") {
      res.status(409).json({
        success: false,
        error: "Ce numéro de téléphone ou email existe déjà",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Erreur serveur lors du remplacement",
    });
  }
};

export const deleteArtisan = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Artisan>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const query = `DELETE FROM artisans WHERE id=$1 RETURNING *`;
    const result = await pool.query<Artisan>(query, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: `aucun artisan trouve avec l'id ${id}`,
      });
      res.status(200).json({
        success: true,
        message: "artisan supprimer avec succes",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Erreur deleteArtisan:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la suppression",
    });
  }
};

export const SearchByProfession = async (
  req: Request<{}, {}, {}, { profession: string }>,
  res: Response<ApiResponse<Artisan[]>>
): Promise<void> => {
  try {
    const { profession } = req.query;
    if (!profession) {
      res.status(400).json({
        success: false,
        error: "Le paramètre profession est requis",
      });
      return;
    }
    const query = `Select *FROM artisans WHERE LOWER(profession) = LOWER($1)`;
    const result = await pool.query<Artisan>(query, [profession]);
    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.log("erreur SerachByProfession", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};
export const getStats = async (
  req: Request,
  res: Response<ApiResponse<StatsResponse>>
): Promise<void> => {
  try {
    const totalQuery = "SELECT COUNT(*) as total FROM artisans";
    const totalResult = await pool.query<{ total: string }>(totalQuery);

    const professionQuery = `
      SELECT profession, COUNT(*) as count
      FROM artisans
      GROUP BY profession
      ORDER BY count DESC
    `;
    const professionResult = await pool.query<{
      profession: string;
      count: string;
    }>(professionQuery);

    const avgRatingQuery =
      "SELECT ROUND(AVG(rating), 2) as moyenne FROM artisans";
    const avgRatingResult = await pool.query<{ moyenne: string }>(
      avgRatingQuery
    );

    const villeQuery = `
      SELECT ville, COUNT(*) as count
      FROM artisans
      GROUP BY ville
      ORDER BY count DESC
    `;
    const villeResult = await pool.query<{ ville: string; count: string }>(
      villeQuery
    );

    res.status(200).json({
      success: true,
      data: {
        total_artisans: parseInt(totalResult.rows[0]?.total || "0"),
        note_moyenne: parseFloat(avgRatingResult.rows[0]?.moyenne || "0"),
        par_profession: professionResult.rows,
        par_ville: villeResult.rows,
      },
    });
  } catch (error: any) {
    console.error("Erreur getStats:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};

export const filterByRating = async (
  req: Request<{}, {}, {}, { min: string }>,
  res: Response<ApiResponse<Artisan[]>>
): Promise<void> => {
  try {
    const { min } = req.query;

    if (!min) {
      res.status(400).json({
        success: false,
        error: "Le paramètre min est requis",
      });
      return;
    }

    const query =
      "SELECT * FROM artisans WHERE rating >= $1 ORDER BY rating DESC";
    const result = await pool.query<Artisan>(query, [min]);

    res.status(200).json({
      success: true,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Erreur filterByRating:", error.message);
    res.status(500).json({
      success: false,
      error: "Erreur serveur",
    });
  }
};
