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

async function getProcessList(params) {
  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `SELECT DISTINCT process_name FROM ${schema}.process_list`,
      {},
      oracleOptions
    );
    console.log("Process List Result", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("Process List Not Fetched", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Fetching Process List");
  }
}

async function getProcessInfo(req, res) {
  const { process_name } = req.body;
  const bindParams = { process_name };

  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `SELECT processid,sp_name FROM ${schema}.process_list WHERE process_name=:process_name`,
      bindParams,
      oracleOptions
    );
    console.log("Process ID Result", result);
    res.status(200).send(result);
  } catch (error) {
    console.error("Process ID Not Fetched", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Fetching Process ID");
  }
}

async function executeStoredProcedure(req, res) {
  const { sp_name, scheduled_date } = req.body.executeProcedure;
  const bindParams = { sp_name, scheduled_date };
  console.log("Execute Procedure Body : ", req.body);

  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `BEGIN 
     ${schema}.:sp_name(:scheduled_date);
     END;`,
      bindParams,
      oracleOptions
    );

    console.log("Successfully Executed Stored Procedure : ", result.rows);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.log("Error fetching Stored Procedures : ", error);
    res.status(500).json({ status: "Error fetching Stored Procedures" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Executing Stored Procedure");
  }
}

async function updateExecutionTimeLog(req, res) {
  let oracledbconnection;
  const { execution_date, userid, processid } = req.body.updateExecutionTime;
  const bindParams = { execution_date, userid, processid };

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `UPDATE ${schema}.proccess_execution_log SET execution_date = :execution_date WHERE userid = :userid AND processid = :processid`,
      bindParams,
      oracleOptions
    );

    console.log("Updated User Log ", result.rows);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.log("Could Not Update Time Log", error);
    res.status(401).json({ error: "Could Not Update Time Log" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Updating Time Log");
  }
}

async function updateExecutionStatusLog(req, res) {
  let oracledbconnection;
  const { userid, processid, execution_date } = req.body.updateExecutionStatus;
  const bindParams = { userid, processid, execution_date };

  try {
    oracledbconnection = await getOracleDBConnection();
    const result = await oracledbconnection.execute(
      `UPDATE ${schema}.proccess_execution_log SET execution_status = 1 WHERE userid = :userid AND processid=:processid AND execution_date = :execution_date`,
      bindParams,
      oracleOptions
    );

    console.log("Updated User Log ", result.rows);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.log("Could Not Update Status Log", error);
    res.status(401).json({ error: "Could Not Update Status Log" });
  } finally {
    closeOracleDBConnection(oracledbconnection, "Updating Status Log");
  }
}

async function getCSVexportData(req, res) {
  const { report, table, columns } = req.body.csvExport;
  const bindParams = { report, table, columns };
  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();
    const baseQuery = `SELECT :columns FROM ${schema}.:table`;

    const query =
      report === "Term Loan OD"
        ? baseQuery +
          `WHERE cod_acct_no NOT IN(select loan_account_no FROM ${schema}.npa_auto_securatization_risk) AND cod_acct_no NOT IN (SELECT ACCOUNT_NUMBER FROM ${schema}.npa_auto_tech_write_off)`
        : report === "ARC OD"
        ? baseQuery +
          `WHERE cod_acct_no NOT IN(select loan_account_no FROM ${schema}.npa_auto_securatization_risk)`
        : report === "COVID Reversal"
        ? baseQuery +
          `WHERE restructured_status = "Restructured" AND restructure_category = "COVID-19"`
        : baseQuery;

    console.log("Query", query);

    const result = await oracledbconnection.execute(
      query,
      bindParams,
      oracleOptions
    );
    console.log("CSVexportData Result", result);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.error("CSVexportData Not Fetched", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Fetching CSVexportData");
  }
}

async function getProcedureStatusText(req, res) {
  const { sp_name, created_date } = req.body.statusText;
  const bindParams = { sp_name, created_date };
  console.log("Procedure Text Body : ", req.body);

  let oracledbconnection;

  try {
    oracledbconnection = await getOracleDBConnection();

    const query = `SELECT operation FROM ${schema}.npalog WHERE sp_name=:sp_name AND created_date = :created_date ORDER BY NPA_log_id DESC FETCH FIRST 1 ROW ONLY`;
    console.log("Query", query);

    const result = await oracledbconnection.execute(
      query,
      bindParams,
      oracleOptions
    );
    console.log("Received Procedure Text Result", result);
    res.status(200).json({
      status: "Success",
      result: result,
    });
  } catch (error) {
    console.error("Error Receiving Procedure Text", error);
    res.status(401).send(error);
  } finally {
    closeOracleDBConnection(oracledbconnection, "Receiving Procedure Text");
  }
}

module.exports = {
  getProcessList,
  getProcessInfo,
  updateExecutionStatusLog,
  updateExecutionTimeLog,
  executeStoredProcedure,
  getCSVexportData,
  getProcedureStatusText,
};
