const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down server");
  process.exit(1);
});

//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on ${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
  console.log("shutting down server");

  server.close(() => {
    process.exit(1);
  });
});
