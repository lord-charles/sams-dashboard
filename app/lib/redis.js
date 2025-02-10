import { createClient } from "redis";

const MAX_RETRY_ATTEMPTS = 3;

// const customRetryStrategy = (options) => {
//   if (options.error && options.error.code === "ECONNREFUSED") {
//     return new Error("The server refused the connection");
//   }
//   if (options.total_retry_time > 1000 * 60 * 60) {
//     return new Error("Retry time exhausted");
//   }
//   if (options.attempt > MAX_RETRY_ATTEMPTS) {
//     return undefined;
//   }
//   // Reconnect after
//   return Math.min(options.attempt * 500, 3000);
// };

const redis = createClient();

// redis.on("error", (err) => {
//   console.log("Redis Client Error", err);
//   redis.quit();
// });

// redis
//   .connect()
//   .then(() => {
//     console.log("Connected to Redis");
//   })
//   .catch((error) => {
//     console.error("Error connecting to Redis:", error);
//   });

export { redis };
