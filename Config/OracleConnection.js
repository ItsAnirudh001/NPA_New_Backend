require("dotenv").config();
const oracledb = require("oracledb");

const connectionToOracleDB = oracledb.createPool({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectionString: process.env.ORACLE_CONNECTIONSTRING,
});

async function getOracleDBConnection() {
  try {
    return await connectionToOracleDB;
  } catch (error) {
    console.error(
      `Error Establishing Oracle Database ${process.env.ORACLE_NAME} connection`
    );
  }
}

async function closeOracleDBConnection(oracledbconnection, activity) {
  if (oracledbconnection) {
    await oracledbconnection.close();
    console.log(`Connection closed after ${activity}`);
  } else {
    console.log(`Error Closing Connection after ${activity}`);
  }
}

module.exports = {
  connectionToOracleDB,
  getOracleDBConnection,
  closeOracleDBConnection,
};
