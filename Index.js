require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

//Activate OracleSQL APIs


// server.listen(process.env.SERVER_PORT, () => {
//   console.log(`Oracle Server port ${process.env.SERVER_PORT}`);
// });

// const npaAPIs = require('./APIs/npaAPIs');

// server.use('/NPA',npaAPIs);




//Activate PostGRES APIs


server.listen(process.env.POSTGRES_USER_PORT, () => {
  console.log(
    `PG Server at ${process.env.POSTGRES_USER_PORT}`
  );
});

const postgresAPIs = require("./PostgresSQL/APIs/postgresAPIs")

server.use(postgresAPIs);




