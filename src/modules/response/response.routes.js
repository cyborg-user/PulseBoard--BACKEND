import express from "express";

import {
  submitResponse
} from "./response.controller.js";


const router = express.Router();

router.post(
  "/:pollId",
  submitResponse
);

export default router;