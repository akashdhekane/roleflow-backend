import { Router } from "express";
import * as assetsController from "../controllers/assetsController";

const router = Router();

router.get("/", assetsController.getAllAssets);
router.get("/:id", assetsController.getAssetById);
router.post("/", assetsController.createAsset);
router.put("/:id", assetsController.updateAsset);
router.delete("/:id", assetsController.deleteAsset);
router.get("/:id/maintenance-records", assetsController.getAssetMaintenanceRecords);

export default router;