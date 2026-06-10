const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const systemRoutes =
require("./modules/system/system.routes");
const errorHandler = require("./middleware/error.middleware");
const truckRoutes = require("./modules/trucks/truck.routes");
const cargoRoutes = require("./modules/cargo/cargo.routes");
const destinationRoutes =
require("./modules/destinations/destination.routes");
const tripRoutes =
require("./modules/trips/trip.routes");
const trackingRoutes =
require("./modules/tracking/tracking.routes");
const app = express();
const alertRoutes =
require("./modules/alerts/alert.routes");

app.use(
  "/api/alerts",
  alertRoutes
);
app.use(cors());

const congestionRoutes =
require(
"./modules/congestion/congestion.routes"
);

app.use(
"/api/congestion",
congestionRoutes
);
const rateLimiter =
require(
"./middleware/rateLimit.middleware"
);

app.use(rateLimiter);

const {
  swaggerUi,
  specs,
} = require(
"./config/swagger"
);

app.use(
"/api/docs",
swaggerUi.serve,
swaggerUi.setup(specs)
);

const dashboardRoutes =
require(
"./modules/dashboard/dashboard.routes"
);

app.use(
"/api/dashboard",
dashboardRoutes
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Truck Movement API Running",
    timestamp: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/trucks", truckRoutes);

app.use("/api/cargo", cargoRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("/api/trips", tripRoutes);

app.use(
  "/api/tracking",
  trackingRoutes
);
app.use(errorHandler);

module.exports = app;
