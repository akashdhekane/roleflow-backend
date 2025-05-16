import { Router } from "express";
import * as licensesController from "../controllers/licensesController";

const router = Router();

router.get("/", licensesController.getAllLicenses);
router.get("/:id", licensesController.getLicenseById);
router.post("/", licensesController.createLicense);
router.patch("/:id", licensesController.updateLicense);
router.delete("/:id", licensesController.deleteLicense);
router.get("/:id/assignments", licensesController.getLicenseAssignments);
router.post("/:id/assign", licensesController.assignLicenseToUser);
router.delete("/:id/unassign/:userId", licensesController.unassignLicenseFromUser);

export default router;