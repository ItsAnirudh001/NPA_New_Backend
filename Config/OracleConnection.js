require("dotenv").config();
const oracledb = require("oracledb");

async function getOracleDBConnection() {
  try {
    const pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectionString: process.env.ORACLE_CONNECTIONSTRING,
      poolMin:0,
      poolMax:22
    });
    const connection = await pool.getConnection();
    return connection;
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
  getOracleDBConnection,
  closeOracleDBConnection,
};
