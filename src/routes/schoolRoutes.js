import express from "express";

import { addSchool } from "../controllers/schoolController.js";

import validate from "../middlewares/validateMiddleware.js";

import { addSchoolSchema } from "../validators/schoolValidator.js";

const router = express.Router();

router.post("/addSchool", validate(addSchoolSchema), addSchool);

export default router;
