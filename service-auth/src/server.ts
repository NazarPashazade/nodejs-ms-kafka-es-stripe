import { PORT } from "./config";
import expressApp from "./express-app";

export const startServer = async () => {
  expressApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on("uncaughtException", (error) => {
    console.error(error);
    process.exit(1); // Exit the process with a failure code
  });
};

startServer().then(() => console.log("Server started successfully"));
