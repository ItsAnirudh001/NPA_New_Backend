const express = require("express");
const server = express();

const {
  getUserLogs,
  newSignUp,
  getConfigData,
  UserAuthentication,
  insertUserLog,
  updateUserLogout,
} = require("../Functions/npaUserFunctions");

const {
  getProcessList,
  getProcessInfo,
  updateExecutionStatusLog,
  updateExecutionTimeLog,
  executeStoredProcedure,
  getCSVexportData,
  getProcedureStatusText,
} = require("../Functions/npaProcessFunctions");

////// User APIs

server.get("/getConfigData", getConfigData); //done
server.post("/newSignUp", newSignUp);  //done 
server.post("/UserAuthentication", UserAuthentication); //done
server.get("/getUserLogs", getUserLogs); //done
server.post("/insertUserLog", insertUserLog); //done
server.put("/updateUserLogout", updateUserLogout); //done

////// Process APIs

server.get("/getProcessList", getProcessList); //done
server.post("/getProcessInfo", getProcessInfo); //done
server.post("/executeStoredProcedure", executeStoredProcedure); //done
server.post("/getProcedureStatusText", getProcedureStatusText); //done
server.get("/getCSVexportData", getCSVexportData); //done
server.put("/updateExecutionTimeLog", updateExecutionTimeLog);  //done
server.put("/updateExecutionStatusLog", updateExecutionStatusLog);  //done

module.exports = server;
