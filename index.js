// Modulos
const express = require("express");
const cors = require("cors");
const spdy = require("spdy");
const fs = require("fs");
const morgan = require("morgan");
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

// Lanzamos el servicio con https (http2) con spdy en el puerto 443
// No usamos el paquete https porque usa http 1.1 (mas lento)
// Si no se encuentran certificados se lanza el servidor http en el puerto 80
// Si el entorno no es prod se lanza en el puerto 3001 para development
if (process.env.NODE_ENV == "prod") {
  if (httpsOptions.key && httpsOptions.cert) {
    server = spdy.createServer(httpsOptions, app);
    port = 443;
    service = "HTTPS";
  } else {
    server = app;
    port = 80;
    service = "HTTP";
  }
} else {
  server = app;
  port = 3001;
  service = "HTTP";
}

// Levantamos el servicio según los criterios previos
server.listen(port);
console.log(`App listening on ${service} at port ${port}`);

// app.listen(port, () => console.log(`App listening on port ${port}`));
