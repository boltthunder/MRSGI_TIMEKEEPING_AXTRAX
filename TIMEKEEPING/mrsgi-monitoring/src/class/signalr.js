import * as signalR from "@microsoft/signalr";
import Plsconnection from "./connection";

let connection = null;

export const startSignalR = async () => {
  const url = await Plsconnection();
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${url}/attendanceHub`, {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR Connected");
  } catch (err) {
    console.error("❌ SignalR Connection Error:", err);
  }

  return connection;
};
