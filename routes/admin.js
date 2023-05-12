const express = require("express");
const router = express.Router();
const createConnection = require("../services/DBConnection");

router.get("/add", async (req, res) => {
  const con = createConnection();

  con.connect(async (err) => {
    if (err) throw err;

    const isTodos = req.query.userCode === "todos";
    const where = ` WHERE userCode = '${req.query.userCode}';`;
    const col = req.query.type;

    let query = `UPDATE users SET ${col} = ${col} + ${
      req.query.cantidad + (isTodos ? ";" : where)
    }`;

    con.query(query, function (err, result) {
      if (err) throw err;
    });

    const updateRanksQuery = await _updateRanks();

    if (req.query.type == "zkoins") {
      if (isTodos) {
        // Obtenemos los IDs de todos los usuarios
        con.query(`SELECT userCode FROM users`, function (err, results) {
          if (err) throw err;
          const values = results
            .map(
              (row) =>
                `('${row.userCode}', ${req.query.cantidad}, '${req.query.concepto}')`
            )
            .join(",");
          // Insertamos las relaciones en la tabla users_missions
          con.query(
            `INSERT INTO transactions (id, zkoins, concepto) VALUES ${values}`,
            function (err) {
              if (err) throw err;
            }
          );
        });
      } else {
        con.query(
          `INSERT INTO transactions (id, zkoins, concepto) VALUES ('${req.query.userCode}', ${req.query.cantidad}, '${req.query.concepto}')`,
          function (err) {
            if (err) throw err;
          }
        );
      }
  
      const webhookURL =
        "https://discord.com/api/webhooks/1105530142849253497/OPXvu4D4KbcYkMQ-KvydVbS1Qpnzkn6tAYkU_F0zIrWY0lSY-V_llzVzyX5mPYhkwhc4";
  
      const message = {
        content: req.query.adminApodo + "... No vas a escapar de mi control.",
        embeds: [
          {
            title: "Registro",
            description: req.query.adminApodo + " ha realizado una acción.",
            color: null,
            fields: [
              {
                name: "Moneda",
                value: "ZKoins",
                inline: true,
              },
              {
                name: "Cantidad",
                value: req.query.cantidad,
                inline: true,
              },
              {
                name: "Usuario",
                value: req.query.userApodo,
                inline: true,
              },
              {
                name: "Concepto",
                value: req.query.concepto,
              },
            ],
            author: {
              name: "ZK SAPO",
            },
            thumbnail: {
              url: "https://i1.sndcdn.com/avatars-9HdeTFNDdqT6kzbT-VezoGQ-t500x500.jpg",
            },
          },
        ],
        username: "Sapo",
        attachments: [],
      };
  
      fetch(webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  
    }

    con.query(updateRanksQuery, function (err, result) {
      if (err) throw err;
      return res.send({
        rows: result.affectedRows,
        user: req.query.userCode,
        type: req.query.type,
      });
    });
  });
});

router.get("/new-mision", (req, res) => {
  const con = createConnection();
  const { userCode, mision, type } = req.query;

  if (userCode === "todos") {
    // Insertamos la nueva misión
    con.query(
      `INSERT INTO misiones (mision, type) VALUES ('${mision}', '${type}')`,
      function (err, result) {
        if (err) throw err;
        const missionId = result.insertId;
        // Obtenemos los IDs de todos los usuarios
        con.query(`SELECT id FROM users`, function (err, results) {
          if (err) throw err;
          const values = results
            .map((row) => `(${row.id}, ${missionId})`)
            .join(",");
          // Insertamos las relaciones en la tabla users_missions
          con.query(
            `INSERT INTO user_mision (iduser, idmision) VALUES ${values}`,
            function (err, result) {
              if (err) throw err;
              return res.send(result);
            }
          );
        });
      }
    );
  } else {
    // Buscamos el usuario por su código
    con.query(
      `SELECT id FROM users WHERE userCode='${userCode}'`,
      function (err, result) {
        if (err) throw err;
        const userId = result[0].id;
        // Insertamos la nueva misión
        con.query(
          `INSERT INTO misiones (mision, type) VALUES ('${mision}', '${type}')`,
          function (err, result) {
            if (err) throw err;
            const missionId = result.insertId;
            // Creamos la relación en la tabla users-missions
            con.query(
              `INSERT INTO user_mision (iduser, idmision) VALUES (${userId}, ${missionId})`,
              function (err, result) {
                if (err) throw err;
                return res.send(result);
              }
            );
          }
        );
      }
    );
  }
});

const _updateRanks = async () => {
  const con = createConnection();

  const users = await new Promise((resolve, reject) => {
    con.query(
      `SELECT userCode, rango, (puntosGeneral + futbol + ajedrez + pong + panuelo + valorant + pokemon + billar + matar) AS total_points 
      FROM users 
      ORDER BY total_points DESC`,
      function (err, result) {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  const RANKS = [
    "radiant",
    "immortal",
    "immortal",
    "diamond",
    "diamond",
    "platinum",
    "platinum",
    "platinum",
    "gold",
    "gold",
    "gold",
    "silver",
    "silver",
    "silver",
    "silver",
    "bronze",
    "bronze",
    "bronze",
    "bronze",
    "iron",
    "iron",
    "iron",
    "iron",
    "iron",
    "iron",
  ];

  const orders = Array.from(users).map((user, i) => {
    return {
      ...user,
      rango: RANKS[i],
    };
  });

  const queries = orders.map((user) => {
    return ` UPDATE users SET rango = '${user.rango}' WHERE userCode = '${user.userCode}';`;
  });

  return queries.join("");
};

module.exports = router;
