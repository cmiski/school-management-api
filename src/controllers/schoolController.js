import {
  addSchoolService,
  getSchoolsService,
} from "../services/schoolService.js";

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

export const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const schools = await getSchoolsService(
      Number(latitude),
      Number(longitude),
    );

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
