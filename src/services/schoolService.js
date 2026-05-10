import pool from "../config/db.js";
import calculateDistance from "../utils/calculateDistance.js";
import AppError from "../utils/AppError.js";

const normalizeText = (value) => {
  return value.trim().replace(/\s+/g, " ");
};

const isValidCoordinates = (latitude, longitude) => {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export const addSchoolService = async (schoolData) => {
  const { name, address, latitude, longitude } = schoolData;
  const normalizedName = normalizeText(name);
  const normalizedAddress = normalizeText(address);
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!isValidCoordinates(parsedLatitude, parsedLongitude)) {
    throw new AppError("Invalid school coordinates", 400);
  }

  const duplicateQuery = `
        SELECT id FROM schools
        WHERE name = ? AND address = ? AND latitude = ? AND longitude = ?
        LIMIT 1
    `;

  const [existingSchools] = await pool.execute(duplicateQuery, [
    normalizedName,
    normalizedAddress,
    parsedLatitude,
    parsedLongitude,
  ]);

  if (existingSchools.length > 0) {
    throw new AppError(
      "School already exists with same name, address and coordinates",
      409,
    );
  }

  const query = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

  const [result] = await pool.execute(query, [
    normalizedName,
    normalizedAddress,
    parsedLatitude,
    parsedLongitude,
  ]);

  return {
    message: "School added successfully",
    schoolId: result.insertId,
  };
};

export const getSchoolsService = async (userLat, userLon) => {
  if (!isValidCoordinates(userLat, userLon)) {
    throw new AppError("Invalid user coordinates", 400);
  }

  const query = `
        SELECT * FROM schools
    `;

  const [schools] = await pool.execute(query);

  let invalidDbRowsFound = false;

  const schoolsWithDistance = schools
    .map((school) => {
      const schoolLatitude = Number(school.latitude);
      const schoolLongitude = Number(school.longitude);

      if (!isValidCoordinates(schoolLatitude, schoolLongitude)) {
        invalidDbRowsFound = true;
        return null;
      }

      const distance = calculateDistance(
        userLat,
        userLon,
        schoolLatitude,
        schoolLongitude,
      );

      return {
        ...school,
        latitude: schoolLatitude,
        longitude: schoolLongitude,
        distance: Number(distance.toFixed(2)),
      };
    })
    .filter(Boolean);

  if (invalidDbRowsFound) {
    if (schoolsWithDistance.length === 0 && schools.length > 0) {
      const dbDataError = new AppError("Invalid school data in database", 500);
      dbDataError.code = "INVALID_DB_DATA";

      throw dbDataError;
    }

    console.warn("Skipped schools with invalid coordinates from database");
  }

  schoolsWithDistance.sort((a, b) => a.distance - b.distance);

  return schoolsWithDistance;
};
