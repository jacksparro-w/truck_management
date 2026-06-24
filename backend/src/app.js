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

const congestionRoutes =
require(
"./modules/congestion/congestion.routes"
);
const driverRoutes =
  require("./modules/drivers/driver.routes");
const rateLimiter =
require(
"./middleware/rateLimit.middleware"
);

const {
  swaggerUi,
  specs,
} = require(
"./config/swagger"
);

const dashboardRoutes =
require(
"./modules/dashboard/dashboard.routes"
);

// CORS configuration - MUST be before other middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Security and compression
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

// Body parsers
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Logging
app.use(morgan("dev"));

// Rate limiting
app.use(rateLimiter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Truck Movement API Running",
    timestamp: new Date(),
  });
});

// API Documentation
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/cargo", cargoRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/congestion", congestionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/drivers", driverRoutes);

// Error handling
app.use(errorHandler);

module.exports = app;
