const express = require("express");
const app = express();
const port = 3001;
const users = require("./routes/users");
const premios = require("./routes/premios");
const horarios = require("./routes/horarios");
const ranking = require("./routes/ranking");

require("dotenv").config();

app.use("/api/users/", users);
app.use("/api/premios/", premios);
app.use("/api/horarios/", horarios);
app.get("/", (_, res) => res.send("ZK Mansion API 1.0.0 Working!!"));

app.listen(port, () => console.log(`App listening on port ${port}`));
