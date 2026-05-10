import pool from "./db.js";

const testDBConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL Database Connected Successfully");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `;

    await connection.execute(createTableQuery);

    console.log("schools table is ready");

    const checkUniqueConstraintQuery = `
      SELECT COUNT(1) AS count
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'schools'
        AND INDEX_NAME = 'unique_school_identity'
    `;

    const [constraintRows] = await connection.execute(checkUniqueConstraintQuery);
    const constraintCount = Number(constraintRows[0]?.count || 0);

    if (constraintCount === 0) {
      const addUniqueConstraintQuery = `
        ALTER TABLE schools
        ADD CONSTRAINT unique_school_identity
        UNIQUE (name, address, latitude, longitude)
      `;

      await connection.execute(addUniqueConstraintQuery);

      console.log("unique school identity constraint is ready");
    } else {
      console.log("unique school identity constraint already exists");
    }

    connection.release();
  } catch (error) {
    console.error("Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

export default testDBConnection;
