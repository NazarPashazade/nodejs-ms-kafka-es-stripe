import { PORT } from "./config";
import expressApp from "./express-app";
import { logger } from "./utils";

export const startServer = async () => {
  expressApp.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });

  process.on("uncaughtException", (error) => {
    logger.error("uncaughtException:", { error });
    process.exit(1);
  });
};

startServer().then(() => logger.info("Server started successfully"));
