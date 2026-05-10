import pool from "../config/db.js";
import calculateDistance from "../utils/calculateDistance.js";

export const addSchoolService = async (schoolData) => {
  const { name, address, latitude, longitude } = schoolData;

  const query = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

  const [result] = await pool.execute(query, [
    name,
    address,
    latitude,
    longitude,
  ]);

  return {
    message: "School added successfully",
    schoolId: result.insertId,
  };
};

export const getSchoolsService = async (userLat, userLon) => {
  const query = `
        SELECT * FROM schools
    `;

  const [schools] = await pool.execute(query);

  const schoolsWithDistance = schools.map((school) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      school.latitude,
      school.longitude,
    );

    return {
      ...school,
      distance: Number(distance.toFixed(2)),
    };
  });

  schoolsWithDistance.sort((a, b) => a.distance - b.distance);

  return schoolsWithDistance;
};
