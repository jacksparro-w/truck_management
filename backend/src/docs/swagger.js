/**
 * @swagger
 * tags:
 *   - name: Authentication
 *   - name: Trucks
 *   - name: Cargo
 *   - name: Destinations
 *   - name: Trips
 *   - name: Tracking
 *   - name: Alerts
 *   - name: Congestion
 *   - name: Dashboard
 *   - name: System
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful
 */

/**
 * @swagger
 * /api/auth/create-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create User
 *     responses:
 *       201:
 *         description: User Created
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh Access Token
 *     responses:
 *       200:
 *         description: New Access Token
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout User
 *     responses:
 *       200:
 *         description: Logout Successful
 */

/**
 * @swagger
 * /api/trucks:
 *   get:
 *     tags:
 *       - Trucks
 *     summary: Get All Trucks
 *     responses:
 *       200:
 *         description: List Trucks
 *
 *   post:
 *     tags:
 *       - Trucks
 *     summary: Create Truck
 *     responses:
 *       201:
 *         description: Truck Created
 */

/**
 * @swagger
 * /api/trucks/{truckId}/assign-driver:
 *   post:
 *     tags:
 *       - Trucks
 *     summary: Assign Driver To Truck
 *     parameters:
 *       - in: path
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver Assigned
 */

/**
 * @swagger
 * /api/cargo:
 *   get:
 *     tags:
 *       - Cargo
 *     summary: Get Cargo Types
 *     responses:
 *       200:
 *         description: Cargo List
 *
 *   post:
 *     tags:
 *       - Cargo
 *     summary: Create Cargo Type
 *     responses:
 *       201:
 *         description: Cargo Created
 */

/**
 * @swagger
 * /api/cargo/{id}:
 *   delete:
 *     tags:
 *       - Cargo
 *     summary: Deactivate Cargo Type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cargo Deactivated
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     tags:
 *       - Destinations
 *     summary: Get Destinations
 *     responses:
 *       200:
 *         description: Destination List
 *
 *   post:
 *     tags:
 *       - Destinations
 *     summary: Create Destination
 *     responses:
 *       201:
 *         description: Destination Created
 */

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     tags:
 *       - Destinations
 *     summary: Get Destination By Id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination Found
 */

/**
 * @swagger
 * /api/trips/start:
 *   post:
 *     tags:
 *       - Trips
 *     summary: Start Trip
 *     responses:
 *       201:
 *         description: Trip Started
 */

/**
 * @swagger
 * /api/trips/{tripId}/end:
 *   post:
 *     tags:
 *       - Trips
 *     summary: End Trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip Completed
 */

/**
 * @swagger
 * /api/trips/active:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get Active Trip
 *     responses:
 *       200:
 *         description: Active Trip
 */

/**
 * @swagger
 * /api/trips/history:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Trip History
 *     responses:
 *       200:
 *         description: Trip History
 */

/**
 * @swagger
 * /api/tracking/location:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Update GPS Location
 *     responses:
 *       201:
 *         description: Location Stored
 */

/**
 * @swagger
 * /api/tracking/history/{tripId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: GPS History
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: GPS History
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     tags:
 *       - Alerts
 *     summary: Get Alerts
 *     responses:
 *       200:
 *         description: Alert List
 */

/**
 * @swagger
 * /api/congestion:
 *   get:
 *     tags:
 *       - Congestion
 *     summary: Get Congestion Events
 *     responses:
 *       200:
 *         description: Congestion Events
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Dashboard Summary
 *     responses:
 *       200:
 *         description: Dashboard Statistics
 */

/**
 * @swagger
 * /api/dashboard/live-map:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Live Truck Map
 *     responses:
 *       200:
 *         description: Live Locations
 */

/**
 * @swagger
 * /api/dashboard/truck-monitoring:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Active Truck Monitoring
 *     responses:
 *       200:
 *         description: Active Trucks
 */

/**
 * @swagger
 * /api/dashboard/analytics/alerts:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Alert Analytics
 *     responses:
 *       200:
 *         description: Alert Analytics
 */

/**
 * @swagger
 * /api/dashboard/analytics/cargo:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Cargo Analytics
 *     responses:
 *       200:
 *         description: Cargo Distribution
 */

/**
 * @swagger
 * /api/dashboard/analytics/violations:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Route Violation Analytics
 *     responses:
 *       200:
 *         description: Violation Statistics
 */

/**
 * @swagger
 * /api/dashboard/analytics/congestion:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Congestion Analytics
 *     responses:
 *       200:
 *         description: Congestion Hotspots
 */

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health Check
 *     responses:
 *       200:
 *         description: API Healthy
 */