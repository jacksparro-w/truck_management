/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Trucks
 *     description: Truck management and driver assignment
 *   - name: Cargo
 *     description: Cargo type management
 *   - name: Destinations
 *     description: Destination and waypoint management
 *   - name: Trips
 *     description: Trip lifecycle management
 *   - name: Tracking
 *     description: GPS location tracking and history
 *   - name: Alerts
 *     description: Alert and notification management
 *   - name: Congestion
 *     description: Congestion event tracking
 *   - name: Dashboard
 *     description: Analytics and real-time monitoring
 *   - name: System
 *     description: System health and status endpoints
 */

// ============================================
// REUSABLE COMPONENTS AND SCHEMAS
// ============================================

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: User unique identifier
 *         name:
 *           type: string
 *           description: User full name
 *         mobile:
 *           type: string
 *           description: User mobile number (10 digits)
 *         role:
 *           type: string
 *           enum: [ADMIN, DRIVER, SUPERVISOR]
 *           description: User role
 *         isActive:
 *           type: boolean
 *           description: User account status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token (15 minutes expiry)
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token (7 days expiry)
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               $ref: '#/components/schemas/AuthTokens'
 *
 *     Truck:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         truckNumber:
 *           type: string
 *           description: Unique truck registration number
 *         truckType:
 *           type: string
 *           description: Type of truck (e.g., 'Tanker', 'Flatbed', 'Refrigerated')
 *         status:
 *           type: string
 *           enum: [AVAILABLE, IN_TRANSIT, MAINTENANCE, OFFLINE]
 *           description: Current truck status
 *         driverId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Assigned driver ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CargoType:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           description: Cargo type name (must be unique)
 *         isActive:
 *           type: boolean
 *           description: Cargo type status
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Destination:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           description: Destination name
 *         type:
 *           type: string
 *           enum: [BERTH, YARD, TRANSIT]
 *           description: Type of destination
 *         latitude:
 *           type: number
 *           format: double
 *           minimum: -90
 *           maximum: 90
 *           description: Latitude coordinate
 *         longitude:
 *           type: number
 *           format: double
 *           minimum: -180
 *           maximum: 180
 *           description: Longitude coordinate
 *         radius:
 *           type: integer
 *           minimum: 1
 *           description: Geofence radius in meters
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         truckId:
 *           type: string
 *           format: uuid
 *         driverId:
 *           type: string
 *           format: uuid
 *         cargoStatus:
 *           type: string
 *           enum: [LOADED, EMPTY]
 *           description: Whether cargo is loaded or empty
 *         cargoTypeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Type of cargo (required if cargoStatus is LOADED)
 *         destinationId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [CREATED, ACTIVE, COMPLETED, CANCELLED]
 *           description: Trip status
 *         startedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     GPSLocation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         tripId:
 *           type: string
 *           format: uuid
 *         latitude:
 *           type: number
 *           format: double
 *         longitude:
 *           type: number
 *           format: double
 *         speed:
 *           type: number
 *           format: float
 *           nullable: true
 *           description: Speed in km/h (optional)
 *         heading:
 *           type: number
 *           format: float
 *           nullable: true
 *           description: Heading direction in degrees (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         tripId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [WRONG_ROUTE, CONGESTION]
 *           description: Alert type
 *         severity:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *           description: Alert severity level
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         isResolved:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CongestionEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         latitude:
 *           type: number
 *           format: double
 *         longitude:
 *           type: number
 *           format: double
 *         radius:
 *           type: integer
 *           description: Affected area radius in meters
 *         truckCount:
 *           type: integer
 *           description: Number of trucks in congestion
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         totalTrucks:
 *           type: integer
 *         activeTrucks:
 *           type: integer
 *         maintenanceTrucks:
 *           type: integer
 *         offlineTrucks:
 *           type: integer
 *         activeTrips:
 *           type: integer
 *         completedTrips:
 *           type: integer
 *         totalAlerts:
 *           type: integer
 *         unresolvedAlerts:
 *           type: integer
 *
 *     LiveMapData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         truckNumber:
 *           type: string
 *         latitude:
 *           type: number
 *           format: double
 *         longitude:
 *           type: number
 *           format: double
 *         speed:
 *           type: number
 *           format: float
 *         heading:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *           enum: [AVAILABLE, IN_TRANSIT, MAINTENANCE, OFFLINE]
 *         driverName:
 *           type: string
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 *             pages:
 *               type: integer
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT authentication. Get token from login endpoint.
 */

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login
 *     description: Authenticate user with mobile number and password. Returns access and refresh tokens.
 *     operationId: loginUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - password
 *             properties:
 *               mobile:
 *                 type: string
 *                 minLength: 10
 *                 description: User mobile number (minimum 10 digits)
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password (minimum 6 characters)
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 user:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   mobile: "1234567890"
 *                   role: "DRIVER"
 *                   isActive: true
 *                   createdAt: "2026-06-05T10:00:00Z"
 *                   updatedAt: "2026-06-05T10:00:00Z"
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Validation failed - Mobile or password missing
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               errors:
 *                 - field: "mobile"
 *                   message: "Mobile is required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid mobile or password"
 *       403:
 *         description: User account is inactive
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "User account is inactive"
 */

/**
 * @swagger
 * /api/auth/create-user:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create New User
 *     description: Create a new user account with specified role. Admin only.
 *     operationId: createUserAccount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: User full name
 *                 example: "John Doe"
 *               mobile:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 description: User mobile number (exactly 10 digits)
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User password (minimum 6 characters)
 *                 example: "securePass123"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DRIVER, SUPERVISOR]
 *                 description: User role
 *                 example: "DRIVER"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "User created successfully"
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "John Doe"
 *                 mobile: "9876543210"
 *                 role: "DRIVER"
 *                 isActive: true
 *                 createdAt: "2026-06-12T10:00:00Z"
 *                 updatedAt: "2026-06-12T10:00:00Z"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               errors:
 *                 - field: "mobile"
 *                   message: "Mobile must be 10 digits"
 *       409:
 *         description: User with this mobile already exists
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "User with this mobile already exists"
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get Current User Profile
 *     description: Retrieve the profile of the currently authenticated user
 *     operationId: getCurrentUser
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - No valid token provided
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// TRUCK ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/trucks:
 *   get:
 *     tags:
 *       - Trucks
 *     summary: List All Trucks
 *     description: Retrieve all trucks in the system
 *     operationId: getTrucksList
 *     responses:
 *       200:
 *         description: Trucks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Truck'
 *             example:
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   truckNumber: "TRK001"
 *                   truckType: "Tanker"
 *                   status: "AVAILABLE"
 *                   driverId: null
 *                   createdAt: "2026-06-05T10:00:00Z"
 *                   updatedAt: "2026-06-05T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 *
 *   post:
 *     tags:
 *       - Trucks
 *     summary: Create New Truck
 *     description: Create a new truck record. Admin only.
 *     operationId: createNewTruck
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckNumber
 *               - truckType
 *             properties:
 *               truckNumber:
 *                 type: string
 *                 description: Unique truck registration number
 *                 example: "TRK001"
 *               truckType:
 *                 type: string
 *                 description: Type of truck
 *                 example: "Tanker"
 *     responses:
 *       201:
 *         description: Truck created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Truck'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Truck number already exists
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/trucks/{truckId}/assign-driver:
 *   post:
 *     tags:
 *       - Trucks
 *     summary: Assign Driver to Truck
 *     description: Assign a driver to a specific truck. Admin only.
 *     operationId: assignDriverToTruck
 *     parameters:
 *       - in: path
 *         name: truckId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Truck ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *                 format: uuid
 *                 description: Driver user ID
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Truck'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Truck not found
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// CARGO ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/cargo:
 *   get:
 *     tags:
 *       - Cargo
 *     summary: List Cargo Types
 *     description: Retrieve all active cargo types
 *     operationId: getCargoTypesList
 *     responses:
 *       200:
 *         description: Cargo types retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CargoType'
 *             example:
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440010"
 *                   name: "Petroleum"
 *                   isActive: true
 *                   createdAt: "2026-06-05T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 *
 *   post:
 *     tags:
 *       - Cargo
 *     summary: Create Cargo Type
 *     description: Create a new cargo type. Admin only.
 *     operationId: createCargoType
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Unique cargo type name
 *                 example: "Petroleum"
 *     responses:
 *       201:
 *         description: Cargo type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CargoType'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Cargo type name already exists
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/cargo/{id}:
 *   delete:
 *     tags:
 *       - Cargo
 *     summary: Deactivate Cargo Type
 *     description: Deactivate a cargo type by ID. Admin only.
 *     operationId: deleteCargoType
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cargo Type ID
 *     responses:
 *       200:
 *         description: Cargo type deactivated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cargo Type deactivated successfully"
 *       404:
 *         description: Cargo type not found
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// DESTINATION ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     tags:
 *       - Destinations
 *     summary: List Destinations
 *     description: Retrieve all destinations, optionally filtered by type
 *     operationId: getDestinationsList
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [BERTH, YARD, TRANSIT]
 *         description: Filter by destination type
 *     responses:
 *       200:
 *         description: Destinations retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Destination'
 *             example:
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440020"
 *                   name: "Port A"
 *                   type: "BERTH"
 *                   latitude: 40.7128
 *                   longitude: -74.0060
 *                   radius: 500
 *                   createdAt: "2026-06-05T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 *
 *   post:
 *     tags:
 *       - Destinations
 *     summary: Create Destination
 *     description: Create a new destination with geofence. Admin only.
 *     operationId: createDestination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - latitude
 *               - longitude
 *               - radius
 *             properties:
 *               name:
 *                 type: string
 *                 description: Destination name
 *                 example: "Port A"
 *               type:
 *                 type: string
 *                 enum: [BERTH, YARD, TRANSIT]
 *                 description: Type of destination
 *                 example: "BERTH"
 *               latitude:
 *                 type: number
 *                 format: double
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude coordinate
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 format: double
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude coordinate
 *                 example: -74.0060
 *               radius:
 *                 type: integer
 *                 minimum: 1
 *                 description: Geofence radius in meters
 *                 example: 500
 *     responses:
 *       201:
 *         description: Destination created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Validation failed
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     tags:
 *       - Destinations
 *     summary: Get Destination Details
 *     description: Retrieve details of a specific destination
 *     operationId: getDestinationById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Destination ID
 *     responses:
 *       200:
 *         description: Destination found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Destination not found
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// TRIP ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/trips/start:
 *   post:
 *     tags:
 *       - Trips
 *     summary: Start New Trip
 *     description: Initialize a new trip for a truck. Driver only.
 *     operationId: startNewTrip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - truckId
 *               - cargoStatus
 *               - destinationId
 *             properties:
 *               truckId:
 *                 type: string
 *                 format: uuid
 *                 description: Truck ID
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               cargoStatus:
 *                 type: string
 *                 enum: [LOADED, EMPTY]
 *                 description: Cargo status
 *                 example: "LOADED"
 *               cargoTypeId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Cargo type ID (required if cargoStatus is LOADED)
 *                 example: "550e8400-e29b-41d4-a716-446655440010"
 *               destinationId:
 *                 type: string
 *                 format: uuid
 *                 description: Destination ID
 *                 example: "550e8400-e29b-41d4-a716-446655440020"
 *     responses:
 *       201:
 *         description: Trip started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Validation failed - Cargo Type required when loaded
 *       401:
 *         description: Unauthorized - Driver role required
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/trips/{tripId}/end:
 *   post:
 *     tags:
 *       - Trips
 *     summary: End Trip
 *     description: Complete an active trip. Driver only.
 *     operationId: endTrip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/trips/active:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get Active Trip
 *     description: Retrieve the current active trip for the logged-in driver
 *     operationId: getActiveTrip
 *     responses:
 *       200:
 *         description: Active trip retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: No active trip found
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/trips/history:
 *   get:
 *     tags:
 *       - Trips
 *     summary: Get Trip History
 *     description: Retrieve paginated trip history. Admin and Supervisor only.
 *     operationId: getTripHistory
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Trip history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// TRACKING ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/tracking/location:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Update GPS Location
 *     description: Update current GPS location for an active trip. Driver only.
 *     operationId: updateGpsLocation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *               - latitude
 *               - longitude
 *             properties:
 *               tripId:
 *                 type: string
 *                 format: uuid
 *                 description: Trip ID
 *                 example: "550e8400-e29b-41d4-a716-446655440030"
 *               latitude:
 *                 type: number
 *                 format: double
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude coordinate
 *                 example: 40.7128
 *               longitude:
 *                 type: number
 *                 format: double
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude coordinate
 *                 example: -74.0060
 *               speed:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 minimum: 0
 *                 description: Current speed in km/h (optional)
 *                 example: 60.5
 *               heading:
 *                 type: number
 *                 format: float
 *                 nullable: true
 *                 minimum: 0
 *                 maximum: 360
 *                 description: Heading direction in degrees (optional)
 *                 example: 180
 *     responses:
 *       201:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GPSLocation'
 *       400:
 *         description: Validation failed - Invalid coordinates
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/tracking/history/{tripId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get GPS Location History
 *     description: Retrieve paginated GPS location history for a trip
 *     operationId: getLocationHistory
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Trip ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 500
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Location history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GPSLocation'
 *       404:
 *         description: Trip not found
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// ALERTS ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     tags:
 *       - Alerts
 *     summary: Get Alerts
 *     description: Retrieve all alerts. Admin and Supervisor only.
 *     operationId: getAlertsList
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WRONG_ROUTE, CONGESTION]
 *         description: Filter by alert type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *         description: Filter by severity
 *       - in: query
 *         name: resolved
 *         schema:
 *           type: boolean
 *         description: Filter by resolution status
 *     responses:
 *       200:
 *         description: Alerts retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alert'
 *             example:
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440040"
 *                   tripId: "550e8400-e29b-41d4-a716-446655440030"
 *                   type: "CONGESTION"
 *                   severity: "HIGH"
 *                   title: "Heavy Traffic Detected"
 *                   message: "Congestion detected on route near location X"
 *                   isResolved: false
 *                   createdAt: "2026-06-12T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// CONGESTION ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/congestion:
 *   get:
 *     tags:
 *       - Congestion
 *     summary: Get Congestion Events
 *     description: Retrieve all congestion events. Admin and Supervisor only.
 *     operationId: getCongestionEvents
 *     responses:
 *       200:
 *         description: Congestion events retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CongestionEvent'
 *             example:
 *               success: true
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440050"
 *                   latitude: 40.7128
 *                   longitude: -74.0060
 *                   radius: 1000
 *                   truckCount: 5
 *                   createdAt: "2026-06-12T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Dashboard Summary
 *     description: Retrieve dashboard statistics and overview. Admin and Supervisor only.
 *     operationId: getDashboardSummary
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DashboardSummary'
 *             example:
 *               success: true
 *               data:
 *                 totalTrucks: 50
 *                 activeTrucks: 25
 *                 maintenanceTrucks: 10
 *                 offlineTrucks: 15
 *                 activeTrips: 20
 *                 completedTrips: 150
 *                 totalAlerts: 45
 *                 unresolvedAlerts: 8
 *       401:
 *         description: Unauthorized
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/live-map:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Live Truck Locations
 *     description: Retrieve real-time locations of all active trucks. Admin and Supervisor only.
 *     operationId: getLiveMapData
 *     responses:
 *       200:
 *         description: Live truck locations retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LiveMapData'
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/truck-monitoring:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Truck Monitoring Status
 *     description: Retrieve detailed monitoring data for all trucks. Admin and Supervisor only.
 *     operationId: getTruckMonitoring
 *     responses:
 *       200:
 *         description: Truck monitoring data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/analytics/alerts:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Alert Analytics
 *     description: Retrieve alert statistics and trends. Admin and Supervisor only.
 *     operationId: getAlertAnalytics
 *     responses:
 *       200:
 *         description: Alert analytics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/analytics/cargo:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Cargo Distribution Analytics
 *     description: Retrieve cargo type distribution statistics. Admin and Supervisor only.
 *     operationId: getCargoDistribution
 *     responses:
 *       200:
 *         description: Cargo distribution retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/analytics/violations:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Route Violation Analytics
 *     description: Retrieve route violation statistics. Admin and Supervisor only.
 *     operationId: getRouteViolations
 *     responses:
 *       200:
 *         description: Route violations retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /api/dashboard/analytics/congestion:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Congestion Hotspots
 *     description: Retrieve congestion hotspot analysis. Admin and Supervisor only.
 *     operationId: getCongestionHotspots
 *     responses:
 *       200:
 *         description: Congestion hotspots retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *     security:
 *       - bearerAuth: []
 */

// ============================================
// SYSTEM ENDPOINTS
// ============================================

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     tags:
 *       - System
 *     summary: API Health Check
 *     description: Check if API is running and healthy
 *     operationId: healthCheck
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "System is healthy"
 *               timestamp: "2026-06-12T10:00:00Z"
 */

/**
 * @swagger
 * /api/system/db-health:
 *   get:
 *     tags:
 *       - System
 *     summary: Database Health Check
 *     description: Check if database connection is active
 *     operationId: databaseHealthCheck
 *     responses:
 *       200:
 *         description: Database is connected
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               database: "connected"
 *       500:
 *         description: Database is disconnected
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               database: "disconnected"
 */

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     tags:
 *       - Drivers
 *     summary: Get All Drivers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver List
 */

/**
 * @swagger
 * /api/drivers/{id}/status:
 *   put:
 *     tags:
 *       - Drivers
 *     summary: Activate or Deactivate Driver
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Driver Updated
 */