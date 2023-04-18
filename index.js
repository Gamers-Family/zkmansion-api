const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const port = 3001;

const users = require("./routes/users");
const premios = require("./routes/premios");
const horarios = require("./routes/horarios");
const admin = require("./routes/admin");

require("dotenv").config();

app.use(cors());
app.use(morgan("tiny"));

app.use("/api/users/", users);
app.use("/api/premios/", premios);
app.use("/api/horarios/", horarios);
app.use("/api/admin/", admin);

app.get("/api", (_, res) => res.send("ZK Mansion API 1.0.0 Working!!"));

app.listen(port, () => console.log(`App listening on port ${port}`));
