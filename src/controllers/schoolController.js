import { addSchoolService } from "../services/schoolService.js";

export const addSchool = async (req, res) => {
  try {
    const result = await addSchoolService(req.body);

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
