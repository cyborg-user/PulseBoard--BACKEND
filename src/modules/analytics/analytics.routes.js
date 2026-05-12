import express from "express"
import { getPollAnalytics, getPublicResults } from "./analytics.controller.js"
import { authenticate } from "../auth/auth.middleware.js"


const router = express.Router()

router.get("/:pollId",authenticate,getPollAnalytics)
router.get(
  "/public/:pollId",
  getPublicResults
);

export default router
