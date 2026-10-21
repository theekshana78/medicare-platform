import app from "./app.js";
import { ENV } from "./config/env.js";
import { seedDatabase } from "./utils/seedData.js";

const startServer = async () => {
  try {
    // Seed default doctors and demo accounts if initial setup
    await seedDatabase();

    app.listen(ENV.PORT, () => {
      console.log(`=======================================================`);
      console.log(` MediCore Healthcare Management Platform API`);
      console.log(` Status: Server running on http://localhost:${ENV.PORT}`);
      console.log(` Health: http://localhost:${ENV.PORT}/api/health`);
      console.log(` Client: ${ENV.CLIENT_URL}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error("Critical server launch failure:", err);
    process.exit(1);
  }
};

startServer();
