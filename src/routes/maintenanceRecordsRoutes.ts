import { Router } from "express";
import * as maintenanceRecordsController from "../controllers/maintenanceRecordsController";

const router = Router();

router.get("/", maintenanceRecordsController.getAllMaintenanceRecords);
router.get("/:id", maintenanceRecordsController.getMaintenanceRecordById);
router.post("/", maintenanceRecordsController.createMaintenanceRecord);
router.patch("/:id", maintenanceRecordsController.updateMaintenanceRecord);
router.delete("/:id", maintenanceRecordsController.deleteMaintenanceRecord);

export default router;