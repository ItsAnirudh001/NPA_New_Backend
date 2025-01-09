require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  getOracleDBConnection,
  closeOracleDBConnection,
} = require("../Config/OracleConnection");

const schema = process.env.ORACLE_DATABASE;

const oracleOptions = {
  autoCommit: true,
  resultSet: true,
};

async function getConfigData(req, res) {
  let oracledbconnection;
  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `SELECT * FROM ${schema}.CONFIG`,
      {},
      oracleOptions
    );
    console.log("Config Data Result", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("Config Data Not Fetched", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Fetching Config");
  }
}

async function UserAuthentication(req, res) {
  let oracledbconnection;
  const { mailid, password } = req.body.NPAuserAuth;
  const bindParams = { mailid, password };

  try {
    oracledbconnection = await getOracleDBConnection();
    const query = `SELECT * FROM ${schema}.USER_TABLE WHERE mailid = :mailid AND user_active = 1`;
    const result = await oracledbconnection.execute(
      query,
      bindParams,
      oracleOptions
    );

    const data = result.rows[0];

    if (password === data.password) {
      console.log("User Found ", result.rows);
      const userid = data.userid;
      const employeeid = data.employeeid;
      const loginid = data.loginid;
      const user_first_name = data.user_first_name;
      const user_middle_name = data.user_middle_name;
      const user_last_name = data.user_last_name;
      const createddate = data.createddate;
      const authToken = jwt.sign({ userid: userid }, "authToken", {
        expiresIn: "12h",
      });
      res.status(200).json({
        status: "Success",
        result: result,
        userid: userid,
        loginid: loginid,
        user_first_name: user_first_name,
        user_middle_name: user_middle_name,
        user_last_name: user_last_name,
        employeeid: employeeid,
        createddate: createddate,
        authToken: authToken,
      });
    }
  } catch (error) {
    console.log("User Not Found", error);
    res.status(401).json({ error: "Invalid User" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Login Auth");
  }
}

async function newSignUp(req, res) {
  let oracledbconnection;
  const {
    mailid,
    user_first_name,
    user_middle_name,
    user_last_name,
    employeeid,
    createddate,
    modifieddate,
    password,
  } = req.body.signUp;

  const bindParams = {
    mailid,
    user_first_name,
    user_middle_name,
    user_last_name,
    employeeid,
    createddate,
    modifieddate,
    password,
  };

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `INSERT into ${schema}.user_table (mailid, user_first_name, user_middle_name, user_last_name, employeeid, createddate, modifieddate, password, noofattempts, user_active, user_locked) VALUES (:mailid,:user_first_name,:user_middle_name,:user_last_name,:employeeid,:createddate,:modifieddate,:password, 2, 1, 0)`,
      bindParams,
      oracleOptions
    );

    console.log("User has been registered ", result.rows);
    const newUser = [];
    newUser.push(result.rows[0]);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.log("Error Signing Up User", error);
    res.status(401).json({ error: "Error Signing Up User" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Signing Up new user");
  }
}

async function getUserLogs(params) {
  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `SELECT * FROM ${schema}.user_activitylog ORDER BY activityid DESC`,
      {},
      oracleOptions
    );
    console.log("UserLogs Result", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("UserLogs Not Fetched", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Fetching UserLogs");
  }
}

async function insertUserLog(req, res) {
  let oracledbconnection;
  const { userid, createddate, logintime } = req.body.createUserLog;
  const bindParams = { userid, createddate, logintime };

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `INSERT into ${schema}.user_activitylog (userid , created_date_time , logintime , session_status) VALUES (:userid, :createddate,:logintime, 1)`,
      bindParams,
      oracleOptions
    );

    console.log("User Log has been Saved ", result.rows);
    const userLog = [];
    userLog.push(result.rows[0]);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.log("Error Saving User Log", error);
    res.status(401).json({ error: "Error Saving User Log" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Inserting User Log");
  }
}

async function updateUserLogout(req, res) {
  let oracledbconnection;
  const { userid, logout } = req.body.updateUserLogout;
  const bindParams = { userid, logout };

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `UPDATE ${schema}.user_activitylog SET logout = :logout, session_status = 0 WHERE userid = :userid AND session_status = 1`,
      bindParams,
      oracleOptions
    );

    console.log("Updated User Log ", result.rows);
    res.status(200).json("Updated User Log", result.rows);
  } catch (error) {
    console.log("Could Not Update User Log", error);
    res.status(401).json({ error: "Could Not Update User Log" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Updating User Log");
  }
}

module.exports = {
  getUserLogs,
  newSignUp,
  getConfigData,
  UserAuthentication,
  insertUserLog,
  updateUserLogout,
};
