// Mongo DB connection
import { initMongoDB } from "./db/initMongoDB.js";
// Server initialization
import { startServer } from "./server.js";

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
