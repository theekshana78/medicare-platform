import { Router } from "express";
import { getPublicPlatformSummary } from "../controllers/publicController.js";

const router = Router();

router.get("/summary", getPublicPlatformSummary);

export default router;
