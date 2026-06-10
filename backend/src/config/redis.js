const { createClient } =
require("redis");

const redis =
createClient({
  url:
    process.env.REDIS_URL,
});

redis.on(
  "error",
  console.error
);

redis.connect();

module.exports = redis;