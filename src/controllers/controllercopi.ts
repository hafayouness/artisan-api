// import { Request, Response } from "express";
// import pool from "../config/database";
// import {
//   Artisan,
//   CreateArtisanDTO,
//   UpdateArtisanDTO,
//   ApiResponse,
//   StatsResponse,
// } from "../types/artisan.types";

// // ============================================
// // CONTRÔLEUR DES ARTISANS
// // ============================================

// // 1. Créer un artisan (CREATE)
// export const createArtisan = async (
//   req: Request<{}, {}, CreateArtisanDTO>,
//   res: Response<ApiResponse<Artisan>>
// ): Promise<void> => {
//   try {
//     const { nom, prenom, profession, telephone, email, ville, rating } =
//       req.body;

//     // Validation des champs obligatoires
//     if (!nom || !prenom || !profession || !telephone) {
//       res.status(400).json({
//         success: false,
//         error:
//           "Les champs nom, prenom, profession et telephone sont obligatoires",
//       });
//       return;
//     }

//     // Validation du numéro de téléphone (format marocain)
//     const phoneRegex = /^0[5-7][0-9]{8}$/;
//     if (!phoneRegex.test(telephone)) {
//       res.status(400).json({
//         success: false,
//         error:
//           "Le numéro de téléphone doit être au format marocain (06xxxxxxxx)",
//       });
//       return;
//     }

//     // Insertion dans la base de données
//     const query = `
//       INSERT INTO artisans (nom, prenom, profession, telephone, email, ville, rating)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *
//     `;

//     const values = [
//       nom,
//       prenom,
//       profession,
//       telephone,
//       email || null,
//       ville || "Tiznit",
//       rating || 0,
//     ];

//     const result = await pool.query<Artisan>(query, values);

//     res.status(201).json({
//       success: true,
//       message: "Artisan ajouté avec succès",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     console.error("Erreur createArtisan:", error.message);

//     // Gestion des erreurs de contrainte unique
//     if (error.code === "23505") {
//       res.status(409).json({
//         success: false,
//         error: "Ce numéro de téléphone ou email existe déjà",
//       });
//       return;
//     }

//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de l'ajout de l'artisan",
//     });
//   }
// };

// // 2. Récupérer tous les artisans (READ ALL)
// export const getAllArtisans = async (
//   req: Request,
//   res: Response<ApiResponse<Artisan[]>>
// ): Promise<void> => {
//   try {
//     const query = "SELECT * FROM artisans ORDER BY id ASC";
//     const result = await pool.query<Artisan>(query);

//     res.status(200).json({
//       success: true,
//       total: result.rows.length,
//       data: result.rows,
//     });
//   } catch (error: any) {
//     console.error("Erreur getAllArtisans:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de la récupération des artisans",
//     });
//   }
// };

// // 3. Récupérer un artisan par ID (READ ONE)
// export const getArtisanById = async (
//   req: Request<{ id: string }>,
//   res: Response<ApiResponse<Artisan>>
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const query = "SELECT * FROM artisans WHERE id = $1";
//     const result = await pool.query<Artisan>(query, [id]);

//     if (result.rows.length === 0) {
//       res.status(404).json({
//         success: false,
//         error: `Aucun artisan trouvé avec l'ID ${id}`,
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     console.error("Erreur getArtisanById:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // 4. Mettre à jour un artisan (UPDATE)
// export const updateArtisan = async (
//   req: Request<{ id: string }, {}, UpdateArtisanDTO>,
//   res: Response<ApiResponse<Artisan>>
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { nom, prenom, profession, telephone, email, ville, rating } =
//       req.body;

//     // Vérifier si l'artisan existe
//     const checkQuery = "SELECT * FROM artisans WHERE id = $1";
//     const checkResult = await pool.query<Artisan>(checkQuery, [id]);

//     if (checkResult.rows.length === 0) {
//       res.status(404).json({
//         success: false,
//         error: `Aucun artisan trouvé avec l'ID ${id}`,
//       });
//       return;
//     }

//     const artisan = checkResult.rows[0];

//     // Mise à jour
//     const updateQuery = `
//       UPDATE artisans
//       SET nom = $1,
//           prenom = $2,
//           profession = $3,
//           telephone = $4,
//           email = $5,
//           ville = $6,
//           rating = $7,
//           updated_at = CURRENT_TIMESTAMP
//       WHERE id = $8
//       RETURNING *
//     `;

//     const values = [
//       nom || artisan.nom,
//       prenom || artisan.prenom,
//       profession || artisan.profession,
//       telephone || artisan.telephone,
//       email !== undefined ? email : artisan.email,
//       ville || artisan.ville,
//       rating !== undefined ? rating : artisan.rating,
//       id,
//     ];

//     const result = await pool.query<Artisan>(updateQuery, values);

//     res.status(200).json({
//       success: true,
//       message: "Artisan modifié avec succès",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     console.error("Erreur updateArtisan:", error.message);

//     if (error.code === "23505") {
//       res.status(409).json({
//         success: false,
//         error: "Ce numéro de téléphone ou email existe déjà",
//       });
//       return;
//     }

//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de la modification",
//     });
//   }
// };

// // 5. Supprimer un artisan (DELETE)
// export const deleteArtisan = async (
//   req: Request<{ id: string }>,
//   res: Response<ApiResponse<Artisan>>
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const query = "DELETE FROM artisans WHERE id = $1 RETURNING *";
//     const result = await pool.query<Artisan>(query, [id]);

//     if (result.rows.length === 0) {
//       res.status(404).json({
//         success: false,
//         error: `Aucun artisan trouvé avec l'ID ${id}`,
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       message: "Artisan supprimé avec succès",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     console.error("Erreur deleteArtisan:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur lors de la suppression",
//     });
//   }
// };

// // ============================================
// // FONCTIONNALITÉS BONUS
// // ============================================

// // 6. Rechercher par profession
// export const searchByProfession = async (
//   req: Request<{}, {}, {}, { profession: string }>,
//   res: Response<ApiResponse<Artisan[]>>
// ): Promise<void> => {
//   try {
//     const { profession } = req.query;

//     if (!profession) {
//       res.status(400).json({
//         success: false,
//         error: "Le paramètre profession est requis",
//       });
//       return;
//     }

//     const query = "SELECT * FROM artisans WHERE LOWER(profession) = LOWER($1)";
//     const result = await pool.query<Artisan>(query, [profession]);

//     res.status(200).json({
//       success: true,
//       total: result.rows.length,
//       data: result.rows,
//     });
//   } catch (error: any) {
//     console.error("Erreur searchByProfession:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // 7. Statistiques globales
// export const getStats = async (
//   req: Request,
//   res: Response<ApiResponse<StatsResponse>>
// ): Promise<void> => {
//   try {
//     const totalQuery = "SELECT COUNT(*) as total FROM artisans";
//     const totalResult = await pool.query<{ total: string }>(totalQuery);

//     const professionQuery = `
//       SELECT profession, COUNT(*) as count
//       FROM artisans
//       GROUP BY profession
//       ORDER BY count DESC
//     `;
//     const professionResult = await pool.query<{
//       profession: string;
//       count: string;
//     }>(professionQuery);

//     const avgRatingQuery =
//       "SELECT ROUND(AVG(rating), 2) as moyenne FROM artisans";
//     const avgRatingResult = await pool.query<{ moyenne: string }>(
//       avgRatingQuery
//     );

//     const villeQuery = `
//       SELECT ville, COUNT(*) as count
//       FROM artisans
//       GROUP BY ville
//       ORDER BY count DESC
//     `;
//     const villeResult = await pool.query<{ ville: string; count: string }>(
//       villeQuery
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         total_artisans: parseInt(totalResult.rows[0].total),
//         note_moyenne: parseFloat(avgRatingResult.rows[0].moyenne) || 0,
//         par_profession: professionResult.rows,
//         par_ville: villeResult.rows,
//       },
//     });
//   } catch (error: any) {
//     console.error("Erreur getStats:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };

// // 8. Filtrer par note
// export const filterByRating = async (
//   req: Request<{}, {}, {}, { min: string }>,
//   res: Response<ApiResponse<Artisan[]>>
// ): Promise<void> => {
//   try {
//     const { min } = req.query;

//     if (!min) {
//       res.status(400).json({
//         success: false,
//         error: "Le paramètre min est requis",
//       });
//       return;
//     }

//     const query =
//       "SELECT * FROM artisans WHERE rating >= $1 ORDER BY rating DESC";
//     const result = await pool.query<Artisan>(query, [min]);

//     res.status(200).json({
//       success: true,
//       total: result.rows.length,
//       data: result.rows,
//     });
//   } catch (error: any) {
//     console.error("Erreur filterByRating:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//     });
//   }
// };
