require("dotenv").config();

const http = require("http");

const app = require("../src/app");
const connectDatabase = require("../src/config/database");
const prisma = require("../src/config/prisma");
const {
  initializeSocket,
} = require("../src/config/socket");

const run = async () => {
  await connectDatabase();

  initializeSocket({
    emit() {},
  });

  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const suffix = Date.now().toString().slice(-8);
  const createdIds = {
    users: [],
    cargoTypes: [],
    destinations: [],
    trucks: [],
    trips: [],
  };

  const makeMobile = (offset) =>
    String(9000000000 + Number(suffix) + offset).slice(0, 10);

  const users = {
    admin: {
      name: `API Admin ${suffix}`,
      mobile: makeMobile(1),
      password: "Admin@123",
      role: "ADMIN",
    },
    driver: {
      name: `API Driver ${suffix}`,
      mobile: makeMobile(2),
      password: "Driver@123",
      role: "DRIVER",
    },
    supervisor: {
      name: `API Supervisor ${suffix}`,
      mobile: makeMobile(3),
      password: "Supervisor@123",
      role: "SUPERVISOR",
    },
  };

  const tokens = {};

  const parseBody = async (response) => {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return {
        raw: text,
      };
    }
  };

  const request = async (
    path,
    options = {}
  ) => {
    const response = await fetch(
      `${baseUrl}${path}`,
      {
        ...options,
        headers: {
          "Content-Type":
            "application/json",
          ...(options.headers || {}),
        },
      }
    );

    return {
      status: response.status,
      body: await parseBody(response),
    };
  };

  const assertStatus = (
    response,
    expected,
    label
  ) => {
    if (response.status !== expected) {
      throw new Error(
        `${label} failed with status ${response.status}: ${JSON.stringify(response.body)}`
      );
    }
  };

  const expectSuccess = (
    response,
    label,
    expectedStatus = 200
  ) => {
    assertStatus(
      response,
      expectedStatus,
      label
    );

    if (response.body?.success !== true) {
      throw new Error(
        `${label} returned unexpected body: ${JSON.stringify(response.body)}`
      );
    }
  };

  const authedRequest = (
    role,
    path,
    options = {}
  ) =>
    request(path, {
      ...options,
      headers: {
        Authorization: `Bearer ${tokens[role]}`,
        ...(options.headers || {}),
      },
    });

  try {
    const health = await request(
      "/health"
    );
    expectSuccess(
      health,
      "GET /health"
    );

    const dbHealth = await request(
      "/api/system/db-health"
    );
    expectSuccess(
      dbHealth,
      "GET /api/system/db-health"
    );

    for (const key of [
      "admin",
      "driver",
      "supervisor",
    ]) {
      const createUser =
        await request(
          "/api/auth/create-user",
          {
            method: "POST",
            body: JSON.stringify(
              users[key]
            ),
          }
        );

      expectSuccess(
        createUser,
        `POST /api/auth/create-user (${key})`,
        201
      );

      createdIds.users.push(
        createUser.body.data.id
      );
    }

    const unauthorizedMe =
      await request("/api/auth/me");
    assertStatus(
      unauthorizedMe,
      401,
      "GET /api/auth/me without token"
    );

    for (const key of [
      "admin",
      "driver",
      "supervisor",
    ]) {
      const login =
        await request(
          "/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              mobile:
                users[key].mobile,
              password:
                users[key].password,
            }),
          }
        );

      expectSuccess(
        login,
        `POST /api/auth/login (${key})`
      );

      tokens[key] =
        login.body.data.tokens.accessToken;
    }

    const me =
      await authedRequest(
        "admin",
        "/api/auth/me"
      );
    expectSuccess(
      me,
      "GET /api/auth/me"
    );

    const cargo =
      await authedRequest(
        "admin",
        "/api/cargo",
        {
          method: "POST",
          body: JSON.stringify({
            name: `Iron Ore ${suffix}`,
          }),
        }
      );
    expectSuccess(
      cargo,
      "POST /api/cargo",
      201
    );
    createdIds.cargoTypes.push(
      cargo.body.data.id
    );

    const cargoList =
      await authedRequest(
        "admin",
        "/api/cargo"
      );
    expectSuccess(
      cargoList,
      "GET /api/cargo"
    );

    const primaryDestination =
      await authedRequest(
        "admin",
        "/api/destinations",
        {
          method: "POST",
          body: JSON.stringify({
            name: `Primary Yard ${suffix}`,
            type: "YARD",
            latitude: 13.0827,
            longitude: 80.2707,
            radius: 300,
          }),
        }
      );
    expectSuccess(
      primaryDestination,
      "POST /api/destinations (primary)",
      201
    );
    createdIds.destinations.push(
      primaryDestination.body.data.id
    );

    const alternateDestination =
      await authedRequest(
        "admin",
        "/api/destinations",
        {
          method: "POST",
          body: JSON.stringify({
            name: `Alternate Berth ${suffix}`,
            type: "BERTH",
            latitude: 13.0878,
            longitude: 80.2785,
            radius: 300,
          }),
        }
      );
    expectSuccess(
      alternateDestination,
      "POST /api/destinations (alternate)",
      201
    );
    createdIds.destinations.push(
      alternateDestination.body.data.id
    );

    const destinationList =
      await authedRequest(
        "admin",
        "/api/destinations"
      );
    expectSuccess(
      destinationList,
      "GET /api/destinations"
    );

    const destinationById =
      await authedRequest(
        "admin",
        `/api/destinations/${primaryDestination.body.data.id}`
      );
    expectSuccess(
      destinationById,
      "GET /api/destinations/:id"
    );

    const truck =
      await authedRequest(
        "admin",
        "/api/trucks",
        {
          method: "POST",
          body: JSON.stringify({
            truckNumber:
              `TN-${suffix}`,
            truckType:
              "TIPPER",
          }),
        }
      );
    expectSuccess(
      truck,
      "POST /api/trucks",
      201
    );
    createdIds.trucks.push(
      truck.body.data.id
    );

    const truckList =
      await authedRequest(
        "admin",
        "/api/trucks"
      );
    expectSuccess(
      truckList,
      "GET /api/trucks"
    );

    const assignDriver =
      await authedRequest(
        "admin",
        `/api/trucks/${truck.body.data.id}/assign-driver`,
        {
          method: "POST",
          body: JSON.stringify({
            driverId:
              createdIds.users[1],
          }),
        }
      );
    expectSuccess(
      assignDriver,
      "POST /api/trucks/:truckId/assign-driver"
    );

    const startTrip =
      await authedRequest(
        "driver",
        "/api/trips/start",
        {
          method: "POST",
          body: JSON.stringify({
            truckId:
              truck.body.data.id,
            cargoStatus:
              "LOADED",
            cargoTypeId:
              cargo.body.data.id,
            destinationId:
              primaryDestination.body.data.id,
          }),
        }
      );
    expectSuccess(
      startTrip,
      "POST /api/trips/start",
      201
    );
    createdIds.trips.push(
      startTrip.body.data.id
    );

    const activeTrip =
      await authedRequest(
        "driver",
        "/api/trips/active"
      );
    expectSuccess(
      activeTrip,
      "GET /api/trips/active"
    );

    const tripHistory =
      await authedRequest(
        "supervisor",
        "/api/trips/history?page=1&limit=10"
      );
    expectSuccess(
      tripHistory,
      "GET /api/trips/history"
    );

    const updateLocation =
      await authedRequest(
        "driver",
        "/api/tracking/location",
        {
          method: "POST",
          body: JSON.stringify({
            tripId:
              startTrip.body.data.id,
            latitude: 13.0878,
            longitude: 80.2785,
            speed: 28.5,
            heading: 92,
          }),
        }
      );
    expectSuccess(
      updateLocation,
      "POST /api/tracking/location",
      201
    );

    const locationHistory =
      await authedRequest(
        "driver",
        `/api/tracking/history/${startTrip.body.data.id}?page=1&limit=10`
      );
    expectSuccess(
      locationHistory,
      "GET /api/tracking/history/:tripId"
    );

    const alerts =
      await authedRequest(
        "supervisor",
        "/api/alerts"
      );
    expectSuccess(
      alerts,
      "GET /api/alerts"
    );

    const congestion =
      await authedRequest(
        "supervisor",
        "/api/congestion"
      );
    expectSuccess(
      congestion,
      "GET /api/congestion"
    );

    const endTrip =
      await authedRequest(
        "driver",
        `/api/trips/${startTrip.body.data.id}/end`,
        {
          method: "POST",
        }
      );
    expectSuccess(
      endTrip,
      "POST /api/trips/:tripId/end"
    );

    const deleteCargo =
      await authedRequest(
        "admin",
        `/api/cargo/${cargo.body.data.id}`,
        {
          method: "DELETE",
        }
      );
    expectSuccess(
      deleteCargo,
      "DELETE /api/cargo/:id"
    );

    console.log(
      "Full API smoke test passed"
    );
  } finally {
    for (const id of createdIds.trips) {
      await prisma.alert.deleteMany({
        where: {
          tripId: id,
        },
      });
    }

    for (const id of createdIds.trips) {
      await prisma.gPSLocation.deleteMany({
        where: {
          tripId: id,
        },
      });
    }

    for (const id of createdIds.trips) {
      await prisma.trip.delete({
        where: {
          id,
        },
      });
    }

    for (const id of createdIds.trucks) {
      await prisma.truck.delete({
        where: {
          id,
        },
      });
    }

    for (const id of createdIds.destinations) {
      await prisma.destination.delete({
        where: {
          id,
        },
      });
    }

    for (const id of createdIds.cargoTypes) {
      await prisma.cargoType.delete({
        where: {
          id,
        },
      });
    }

    for (const id of createdIds.users) {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    }

    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await prisma.$disconnect();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
