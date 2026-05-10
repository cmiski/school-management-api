import asyncHandler from "../middlewares/asyncHandler.js";

import {
  addSchoolService,
  getSchoolsService,
} from "../services/schoolService.js";

export const addSchool = asyncHandler(async (req, res) => {
  const result = await addSchoolService(req.body);

  res.status(201).json({
    success: true,
    ...result,
  });
});

export const listSchools = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;

  const schools = await getSchoolsService(Number(latitude), Number(longitude));

  res.status(200).json({
    success: true,
    count: schools.length,
    data: schools,
  });
});
