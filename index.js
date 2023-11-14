const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const redis = require("redis");
app.use(bodyParser.json());

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  port: REDIS_PORT,
  host: REDIS_HOST,
});

client.on("connect", function () {
  console.log("redis connected");
  console.log(`connected ${client.connected}`);
});

client.on("error", (err) => {
  console.log(err);
});
app.get("/redis-set", function (req, res) {
  client.set("key", "value", (err, reply) => {
    if (err) {
      console.error("Error setting key:", err);
    } else {
      console.log("Key set successfully");
    }

    client.quit();
  });
  res.send("redis key set");
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.listen(8000, function () {
  console.log("App listening on port 8000!");
});
