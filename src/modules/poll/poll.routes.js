import { Router } from "express";
import validate from "../../common/middleware/validate.middleware.js";

import { authenticate } from "../auth/auth.middleware.js"
import { createPoll,getMyPolls, getPublicPoll,publishPoll } from "./poll.controller.js";


const router = Router()

router.post("/",authenticate,createPoll)
router.post("/my",getMyPolls)
router.post("/:id",getPublicPoll)
router.patch(
  "/:pollId/publish",
  authenticate,
  publishPoll
);







export default router