import express from "express";
import { addSchool, listSchools } from "../controllers/schoolController.js";
import validate from "../middlewares/validateMiddleware.js";
import {
  addSchoolSchema,
  listSchoolsSchema,
} from "../validators/schoolValidator.js";

const router = express.Router();

router.post("/addSchool", validate(addSchoolSchema), addSchool);

router.get("/listSchools", validate(listSchoolsSchema, "query"), listSchools);

export default router;
