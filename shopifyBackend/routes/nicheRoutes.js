import express from "express";
import {
    createNiche,
    getNiches,
    getNicheById,
    getNicheByName,
    updateNiche,
    deleteNiche,
    addProductToNiche,
    addBannerToNiche,
    addMultiRowImageToNiche,
    deleteProductFromNiche,
    deleteBannerFromNiche,
    deleteMultiRowImageFromNiche
} from "../controllers/nicheController.js";

const router = express.Router();

// CRUD operations
router.post("/", createNiche);
router.get("/", getNiches);
router.get("/:id", getNicheById);
router.put("/:id", updateNiche);
router.delete("/:id", deleteNiche);

// Get niche by name
router.get('/GetNiche/:niche', getNicheByName);

// Product operations
router.post("/:id/product", addProductToNiche);
router.delete('/:nicheId/product/:productId', deleteProductFromNiche);

// Banner operations
router.post("/:id/banner", addBannerToNiche);
router.delete('/:nicheId/banner/:bannerId', deleteBannerFromNiche);

// MultiRow image operations
router.post("/:id/multirow", addMultiRowImageToNiche);
router.delete('/:nicheId/multirow/:multiRowId', deleteMultiRowImageFromNiche);

export default router;
