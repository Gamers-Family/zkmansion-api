// Modulos
const express = require("express");
const cors = require("cors");
const spdy = require("spdy");
const fs = require("fs");
const morgan = require("morgan");
const port = 3001;
const users = require("./routes/users");
const premios = require("./routes/premios");
const horarios = require("./routes/horarios");
const admin = require("./routes/admin");

// .env
require("dotenv").config();

// Crear instancia de Express
const app = express();

// Configuración de middleware
app.use(cors());
app.use(morgan("tiny"));


// Rutas app
app.use("/api/users/", users);
app.use("/api/premios/", premios);
app.use("/api/horarios/", horarios);
app.use("/api/admin/", admin);

// Ruta de verificación
app.get("/api", (_, res) => res.send("ZK Mansion API 1.0.0 Working!!"));

const httpsOptions = {
  key: fs.existsSync('./certs/domain.pem') ? fs.readFileSync('./certs/domain.pem') : null,
  cert: fs.existsSync('./certs/domain.pem') ? fs.readFileSync('./certs/domain.pem') : null
}

// Lanzamos el servicio con https (http2) con spdy en el puerto 3001
// No usamos el paquete https porque usa http 1.1 (mas lento)
// Si no se encuentran certificados se lanza el servidor http para trabajar en local
if (httpsOptions.key && httpsOptions.cert) {
  server = spdy.createServer(httpsOptions, app);
  console.log(`App listening on HTTPS at port ${port}`);
} else {
  server = app;
  console.log(`App listening on HTTP at port ${port}`);
}

// Levantamos el servicio según los criterios previos
server.listen(port);

// app.listen(port, () => console.log(`App listening on port ${port}`));
