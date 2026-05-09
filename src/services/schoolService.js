import pool from "../config/db.js";

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
