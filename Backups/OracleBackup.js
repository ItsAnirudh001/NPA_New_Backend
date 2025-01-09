// async function getConfigData(req, res) {
//     let oracledbconnection;
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `SELECT * from ${schema}.CONFIG`
//       );
//       console.log("Config Data Result", result);
//       res.status(200).send(result);
//     } catch (error) {
//       console.error("Config Data Not Fetched", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Fetching Config");
//     }
//   }
  
//   async function UserAuthentication(req, res) {
//     let oracledbconnection;
//     const { mailid, password } = req.body.NPAuserAuth;
//     const bindParams = { mailid, password };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const query = `SELECT * from ${schema}.USER_TABLE where mailid = ':mailid' AND user_active = 1`;
//       const result = await oracledbconnection.execute(
//         query,
//         bindParams,
//         oracleOptions
//       );
  
//       if (password === result.rows[0].password) {
//         console.log("User Found ", result.rows);
//         const userid = result.rows[0].userid;
//         const employeeid = result.rows[0].employeeid;
//         const user_first_name = result.rows[0].user_first_name;
//         const authToken = jwt.sign({ userid: userid }, "authToken", {
//           expiresIn: "1h",
//         });
//         res.status(200).json({
//           status: "Success",
//           result: result,
//           userid: userid,
//           user_first_name: user_first_name,
//           employeeid: employeeid,
//           authToken: authToken,
//         });
//       }
//     } catch (error) {
//       console.log("User Not Found", error);
//       res.status(401).json({ error: "Invalid User" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Login Auth");
//     }
//   }
  
//   async function newSignUp(req, res) {
//     let oracledbconnection;
//     const {
//       mailid,
//       user_first_name,
//       user_middle_name,
//       user_last_name,
//       employeeid,
//       createddate,
//       modifieddate,
//       password,
//     } = req.body.signUp;
  
//     const bindParams = {
//       mailid,
//       user_first_name,
//       user_middle_name,
//       user_last_name,
//       employeeid,
//       createddate,
//       modifieddate,
//       password,
//     };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `INSERT into ${schema}.user_table (mailid, user_first_name, user_middle_name, user_last_name, employeeid, createddate, modifieddate, password, noofattempts, user_active, user_locked) VALUES (':mailid',':user_first_name',':user_middle_name',':user_last_name',':employeeid',':createddate',':modifieddate',':password', 2, 1, 0)`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("User has been registered ", result.rows);
//       const newUser = [];
//       newUser.push(result.rows[0]);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.log("Error Signing Up User", error);
//       res.status(401).json({ error: "Error Signing Up User" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Signing Up new user");
//     }
//   }
  
//   async function getUserLogs(params) {
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `SELECT * from ${schema}.user_activitylog ORDER BY activityid DESC`
//       );
//       console.log("UserLogs Result", result);
//       res.status(200).send(result);
//     } catch (error) {
//       console.error("UserLogs Not Fetched", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Fetching UserLogs");
//     }
//   }
  
//   async function insertUserLog(req, res) {
//     let oracledbconnection;
//     const { userid, createddate, logintime } = req.body.createUserLog;
//     const bindParams = { userid, createddate, logintime };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `INSERT into ${schema}.user_activitylog (userid , created_date_time , logintime , session_status) VALUES (:userid, ':createddate',':logintime', 1)`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("User Log has been Saved ", result.rows);
//       const userLog = [];
//       userLog.push(result.rows[0]);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.log("Error Saving User Log", error);
//       res.status(401).json({ error: "Error Saving User Log" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Inserting User Log");
//     }
//   }
  
//   async function updateUserLogout(req, res) {
//     let oracledbconnection;
//     const { userid, logout } = req.body.updateUserLogout;
//     const bindParams = { userid, logout };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `UPDATE ${schema}.user_activitylog SET logout = ':logout', session_status = 0 WHERE userid = :userid AND session_status = 1`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("Updated User Log ", result.rows);
//       res.status(200).json("Updated User Log", result.rows);
//     } catch (error) {
//       console.log("Could Not Update User Log", error);
//       res.status(401).json({ error: "Could Not Update User Log" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Updating User Log");
//     }
//   }




















//   async function getProcessList(params) {
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `SELECT DISTINCT process_name from ${schema}.process_list`
//       );
//       console.log("Process List Result", result);
//       res.status(200).send(result);
//     } catch (error) {
//       console.error("Process List Not Fetched", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Fetching Process List");
//     }
//   }
  
//   async function getProcessInfo(req, res) {
//     const { process_name } = req.body;
//     const bindParams = { process_name };
  
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `SELECT processid,sp_name from ${schema}.process_list WHERE process_name=':process_name'`,
//         bindParams,
//         oracleOptions
//       );
//       console.log("Process ID Result", result);
//       res.status(200).send(result);
//     } catch (error) {
//       console.error("Process ID Not Fetched", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Fetching Process ID");
//     }
//   }
  
//   async function executeStoredProcedure(req, res) {
//     const { sp_name, scheduled_date } = req.body.executeProcedure;
//     const bindParams = { sp_name, scheduled_date };
//     console.log("Execute Procedure Body : ", req.body);
  
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `BEGIN 
//        ${schema}.':sp_name'(':scheduled_date');
//        END;`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("Successfully Executed Stored Procedure : ", result.rows);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.log("Error fetching Stored Procedures : ", error);
//       res.status(500).json({ status: "Error fetching Stored Procedures" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Executing Stored Procedure");
//     }
//   }
  
//   async function updateExecutionTimeLog(req, res) {
//     let oracledbconnection;
//     const { execution_date, userid, processid } = req.body.updateExecutionTime;
//     const bindParams = { execution_date, userid, processid };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `UPDATE ${schema}.proccess_execution_log SET execution_date = ':execution_date' WHERE userid = :userid AND processid = :processid`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("Updated User Log ", result.rows);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.log("Could Not Update Time Log", error);
//       res.status(401).json({ error: "Could Not Update Time Log" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Updating Time Log");
//     }
//   }
  
//   async function updateExecutionStatusLog(req, res) {
//     let oracledbconnection;
//     const { userid, processid, execution_date } = req.body.updateExecutionStatus;
//     const bindParams = { userid, processid, execution_date };
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
//       const result = await oracledbconnection.execute(
//         `UPDATE ${schema}.proccess_execution_log SET execution_status = 1 WHERE userid = :userid AND processid=:processid AND execution_date = ':execution_date'`,
//         bindParams,
//         oracleOptions
//       );
  
//       console.log("Updated User Log ", result.rows);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.log("Could Not Update Status Log", error);
//       res.status(401).json({ error: "Could Not Update Status Log" });
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Updating Status Log");
//     }
//   }
  
//   async function getCSVexportData(req, res) {
//     const { columns } = req.body.csvColumns;
//     const bindParams = { columns };
  
//     let table;
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
  
//       const query = `SELECT :columns from ${schema}.${table}`;
//       console.log("Query", query);
  
//       const result = await oracledbconnection.execute(
//         query,
//         bindParams,
//         oracleOptions
//       );
//       console.log("CSVexportData Result", result);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.error("CSVexportData Not Fetched", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Fetching CSVexportData");
//     }
//   }
  
//   async function getProcedureStatusText(req, res) {
//     const { sp_name, created_date } = req.body.statusText;
//     const bindParams = { sp_name, created_date };
//     console.log("Procedure Text Body : ", req.body);
  
//     let oracledbconnection;
  
//     try {
//       oracledbconnection = await getOracleDBConnection();
  
//       const query = `SELECT operation from ${schema}.npalog WHERE sp_name=':sp_name' AND created_date = ':created_date' ORDER BY NPA_log_id DESC FETCH FIRST 1 ROW ONLY`;
//       console.log("Query", query);
  
//       const result = await oracledbconnection.execute(
//         query,
//         bindParams,
//         oracleOptions
//       );
//       console.log("Received Procedure Text Result", result);
//       res.status(200).json({
//         status: "Success",
//         result: result,
//       });
//     } catch (error) {
//       console.error("Error Receiving Procedure Text", error);
//       res.status(401).send(error);
//     } finally {
//       closeOracleDBConnection(oracledbconnection, "Receiving Procedure Text");
//     }
//   }
  

  