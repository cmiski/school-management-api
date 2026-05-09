import "dotenv/config";

import app from "./src/app.js";
import testDBConnection from "./src/config/testDb.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testDBConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
