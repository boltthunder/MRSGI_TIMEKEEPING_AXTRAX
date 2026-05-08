import * as signalR from "@microsoft/signalr";
import PlsConnect from "./connection";

let connection = null;

export const startSignalR = async () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${PlsConnect()}/attendanceHub`, {
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