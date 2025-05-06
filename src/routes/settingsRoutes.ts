import { Router } from "express";
import * as settingsController from "../controllers/settingsController";

const router = Router();

router.get("/", settingsController.getAllSettings);
router.get("/:key", settingsController.getSettingByKey);
router.post("/", settingsController.updateMultipleSettings);
router.put("/:key", settingsController.updateSettingByKey);
router.delete("/:key", settingsController.deleteSettingByKey);

export default router;