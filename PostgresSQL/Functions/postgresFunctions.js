const jsonweb = require("jsonwebtoken");
const jfsDB = require("../Config/PostgresConnection");

async function getProcessList(req, res) {
  try {
    const result = await jfsDB.query(
      `SELECT DISTINCT processid, process_name, sp_name FROM process_list`
    );

    // console.log("List of Processes : ",result.rows);
    return res.status(200).json({
      status: "List of Processes has been Successfully fetched",
      result: result,
    });
  } catch (error) {
    console.log("Error fetching List of Processes : ", error);
    res.status(401).json({ status: "Error fetching List of Processes" });
  }
}

async function getProcessInfo(req, res) {
  const { process_name } = req.body;
  // console.log("Process Name",req.body);

  const query = `SELECT processid,sp_name FROM process_list WHERE process_name='${process_name}'`;
  // console.log("Query",query)
  try {
    const result = await jfsDB.query(query);

    // console.log("Process ID result : ",result.rows);
    return res.status(200).json({
      status: "Process ID Fetched",
      result: result,
    });
  } catch (error) {
    // console.log("Error getting Process ID : ",error);
    res.status(401).json({ status: "Error getting Process ID" });
  }
}

async function getStoredProcedures(req, res) {
  const { processid, date } = req.body.StoredProcedures;
  console.log("Stored Procedure Body : ", req.body);

  // const query = `SELECT process_id, to_char(execution_date,'dd-mm-yy hh:mm:ss') AS execution_date FROM proccess_execution_log WHERE process_name = '${process_name}' AND to_char(execution_date,'dd-mm-yy') = '${from}'`;

  // const query = `SELECT processid , execution_date AS execution_date FROM proccess_execution_log WHERE processid = '${processid}' AND execution_date BETWEEN '${from}' AND '${to}' ORDER BY execution_logid`;

  const query = `SELECT processid , to_char(execution_date,'dd-mm-yy hh:mm:ss') AS execution_date FROM proccess_execution_log WHERE processid = '${processid}' AND to_char(execution_date,'dd-mm-yy') = '${date}' ORDER BY execution_logid`;

  // console.log(query);

  try {
    const result = await jfsDB.query(query);

    console.log("Stored Procedures : ", result.rows);
    return res.status(200).json({
      status: "Stored Procedures have been Successfully fetched",
      result: result,
    });
  } catch (error) {
    console.log("Error fetching Stored Procedures : ", error);
    res.status(401).json({ status: "Error fetching Stored Procedures" });
  }
}

async function getCSVexportData(req, res) {
  const { columns } = req.body.NPAcolumns;
  console.log("CSV Export Body : ", columns);

  const query = `SELECT ${columns} FROM proccess_execution_log ORDER BY to_char(execution_date,'dd-mm-yy') DESC`;
  console.log("Query", query);

  try {
    const result = await jfsDB.query(query);

    console.log("CSV export data : ", result.rows);
    return res.status(200).json({
      status: "CSV export data has been Successfully fetched",
      result: result,
    });
  } catch (error) {
    console.log("Error fetching CSV export data : ", error);
    res.status(401).json({ status: "Error fetching CSV export data" });
  }
}

async function executeStoredProcedure(req, res) {
  const { sp_name, scheduled_date } = req.body.ExecuteProcedure;
  console.log("Execute Procedure Body : ", req.body);

  try {
    const result = await jfsDB.query(`
       BEGIN
       jfsDB.${sp_name}('${scheduled_date}');
       END
     `);

    //console.log("Successfully Executed Stored Procedure : ",result.rows);
    return res.status(200).json({
      status: "Successfully Executed Stored Procedure",
      result: result,
    });
  } catch (error) {
    //console.log("Error fetching Stored Procedures : ",error);
    res.status(401).json({ status: "Error fetching Stored Procedures" });
  }
}

async function getUserLogs(req, res) {
  try {
    const result = await jfsDB.query(
      `SELECT * FROM user_activitylog ORDER BY activityid DESC`
    );
    return res.status(200).json({
      status: "Successfully Fetched user activity log",
      result: result,
    });
  } catch (error) {
    res.status(401).json({ status: "Error fetching Stored Procedures" });
  }
}

async function getProcedureStatusText(req, res) {
  const { sp_name, execution_date } = req.body.StatusText;
  console.log("Procedure Text Body : ", req.body);

  try {
    const result = await jfsDB.query(`
      SELECT * from npalog WHERE sp_name='${sp_name}' ORDER BY NPA_log_id DESC
     `);

    //console.log("Successfully Executed Stored Procedure : ",result.rows);
    return res.status(200).json({
      status: "Received Procedure Text",
      result: result,
    });
  } catch (error) {
    //console.log("Error fetching Stored Procedures : ",error);
    res.status(401).json({ status: "Error Receiving Procedure Text" });
  }
}

async function updateExecutionTimeLog(req, res) {
  const { execution_date } = req.body.updateUserLogout;

  try {
    const result = await jfsDB.query(`
      UPDATE proccess_execution_log SET execution_status = 1 WHERE execution_logid '${execution_date}'
     `);

    //console.log("Successfully Executed Stored Procedure : ",result.rows);
    return res.status(200).json({
      status: "Updated User Log",
      result: result,
    });
  } catch (error) {
    //console.log("Error fetching Stored Procedures : ",error);
    res.status(401).json({ status: "Could Not Update Status Log" });
  }
};

async function updateExecutionStatusLog(req, res) {
  const { executionlogid, execution_date } = req.body.updateUserLogout;

  try {
    const result = await jfsDB.query( `UPDATE proccess_execution_log SET execution_date = '${execution_date}' WHERE execution_logid = ${executionlogid}`);

    //console.log("Successfully Executed Stored Procedure : ",result.rows);
    return res.status(200).json({
      status: "Updated Time Log",
      result: result,
    });
  } catch (error) {
    //console.log("Error fetching Stored Procedures : ",error);
    res.status(401).json({ status: "Could Not Update Time Log" });
  }
};

module.exports = {
  getProcessList,
  getProcessInfo,
  getStoredProcedures,
  executeStoredProcedure,
  getCSVexportData,
  getUserLogs,
  getProcedureStatusText,
  updateExecutionTimeLog,
  updateExecutionStatusLog
};
