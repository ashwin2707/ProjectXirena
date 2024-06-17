import { Router } from "express";
import { scrapeAllPerks } from "../controllers/perkController";

const router = Router()

// Get
router.put('/', scrapeAllPerks)

export default router