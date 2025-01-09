const express = require("express");
const {
  getProcessList,
  getProcessInfo,
  getStoredProcedures,
  getCSVexportData,
  executeStoredProcedure,
  getUserLogs,
  getProcedureStatusText,
  updateExecutionTimeLog,
  updateExecutionStatusLog,
} = require("../Functions/postgresFunctions");
const server = express();

server.get("/getProcessList", getProcessList);
server.post("/getProcessInfo", getProcessInfo);
server.post("/CSVexport", getCSVexportData);
server.post("/ExecuteStoredProcedure", executeStoredProcedure);
server.get("/getUserLogs", getUserLogs);
server.post("/getProcedureStatusText",getProcedureStatusText)
server.post("/updateExecutionTimeLog",updateExecutionTimeLog);
server.post("/updateExecutionStatusLog",updateExecutionStatusLog);

module.exports = server;
