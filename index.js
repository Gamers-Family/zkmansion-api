const express = require("express");
const app = express();
const port = 3001;
const users = require("./routes/users");

app.use("/user/", users);

app.get("/", (_, res) => res.send("ZK Mansion API 1.0.0 Working!!"));

app.listen(port, () => console.log(`App listening on port ${port}`));
